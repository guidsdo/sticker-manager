import { action, computed, observable, runInAction } from "mobx";
import type { Catalog, ImportPayload, Ownership, Section } from "@ima-stickermanage/contracts/types";
import { storage, checkServerAvailable, setStorageMode, hasLocalClientData, getLocalClientData } from "../storage";
import {
    ownedCodesAndDoublesToOwned,
    ownedToPayload,
    parseDoublesEntries,
    parseOwnedCodes,
    parseMissingCodes,
    serialize,
    serializeDoublesEntries,
    serializeMissingCodes,
    serializeOwnedCodes
} from "../format";

export type ImportExportMode = "missing-doubles" | "owned";

export type ImportExportDraft = {
    missingText: string;
    doublesText: string;
    ownedCodesText: string;
    ownedDoublesText: string;
};

export type ImportExportInput = ImportExportDraft & {
    mode: ImportExportMode;
};

export class CollectionStore {
    @observable accessor catalog: Catalog | null = null;
    @observable accessor owned: Ownership = {};
    @observable accessor activeSection = "FWC";
    @observable accessor sortAlphabetical = false;
    @observable accessor ignoreBonusStickers = false;
    @observable accessor importExportOpen = false;
    @observable accessor importExportMode: ImportExportMode = "missing-doubles";
    @observable accessor loading = true;
    @observable accessor isClientMode = false;
    @observable accessor showDataMergeModal = false;
    @observable accessor showServerLostModal = false;
    @observable accessor serverAvailable = true;
    @observable accessor pendingServerData: Ownership | null = null;
    @observable accessor pendingClientData: Ownership | null = null;
    private serverHealthCheckInterval: ReturnType<typeof setInterval> | null = null;

    private readonly handlePopState = () => {
        const sectionFromPath = this.readSectionFromPath();
        if (!sectionFromPath) return;
        if (this.catalog && !this.catalog.sections.some(section => section.name === sectionFromPath)) return;

        runInAction(() => {
            this.activeSection = sectionFromPath;
        });
    };

    constructor() {
        const initialSection = this.readSectionFromPath();
        if (initialSection) this.activeSection = initialSection;

        if (typeof window !== "undefined") {
            window.addEventListener("popstate", this.handlePopState);
        }

        void this.startupSequence();
    }

    private readSectionFromPath(): string | null {
        if (typeof window === "undefined") return null;

        const hashRoute = window.location.hash
            .replace(/^#\/?/, "")
            .replace(/^\/+|\/+$/g, "")
            .trim();
        const pathRoute = window.location.pathname.replace(/^\/+|\/+$/g, "").trim();
        const raw = hashRoute || pathRoute;
        if (!raw) return null;

        const segments = raw.split("/").filter(Boolean);
        const section = segments[segments.length - 1];
        if (!section) return null;

        return decodeURIComponent(section).toUpperCase();
    }

    private writeSectionToPath(sectionName: string, mode: "push" | "replace" = "push") {
        if (typeof window === "undefined") return;

        const nextHash = `#/${encodeURIComponent(sectionName)}`;
        if (window.location.hash === nextHash) return;

        const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
        if (mode === "replace") window.history.replaceState(null, "", nextUrl);
        else window.history.pushState(null, "", nextUrl);
    }

    @computed
    get loaded() {
        return !this.loading && this.catalog !== null;
    }

    @computed
    get section(): Section | null {
        if (!this.catalog) return null;
        return this.catalog.sections.find(section => section.name === this.activeSection) ?? this.catalog.sections[0] ?? null;
    }

    @computed
    get navigatorSections(): Section[] {
        if (!this.catalog) return [];
        if (!this.sortAlphabetical) return this.catalog.sections;

        return [...this.catalog.sections].sort((a, b) => a.title.localeCompare(b.title));
    }

    @computed
    get totals() {
        if (!this.catalog) return { have: 0, total: 0, doubles: 0 };
        let have = 0;
        let total = 0;
        let doubles = 0;

        for (const section of this.catalog.sections) {
            if (this.shouldIgnoreSection(section.name)) continue;
            for (const sticker of section.stickers) {
                total += 1;
                const count = this.owned[sticker.code] ?? 0;
                if (count > 0) have += 1;
                if (count > 1) doubles += count - 1;
            }
        }

        return { have, total, doubles };
    }

    @computed
    get completionPct() {
        if (this.totals.total === 0) return 0;
        return Math.round((this.totals.have / this.totals.total) * 100);
    }

    @computed
    get currentPayload(): ImportPayload {
        const missing: string[] = [];
        const doubles: Record<string, number> = {};

        if (!this.catalog) return { missing, doubles };

        for (const section of this.catalog.sections) {
            if (this.shouldIgnoreSection(section.name)) continue;
            for (const sticker of section.stickers) {
                const count = this.owned[sticker.code] ?? 0;
                if (count <= 0) missing.push(sticker.code);
                else if (count > 1) doubles[sticker.code] = count - 1;
            }
        }

        return { missing, doubles };
    }

    sectionStats(section: Section) {
        let have = 0;
        for (const sticker of section.stickers) {
            if ((this.owned[sticker.code] ?? 0) > 0) have += 1;
        }
        return { have, total: section.stickers.length };
    }

    countFor(code: string) {
        return this.owned[code] ?? 0;
    }

    @action.bound
    setActiveSection(name: string) {
        this.activeSection = name;
        this.writeSectionToPath(name, "push");
    }

    @action.bound
    toggleSortAlphabetical() {
        this.sortAlphabetical = !this.sortAlphabetical;
    }

    @action.bound
    toggleIgnoreBonusStickers() {
        this.ignoreBonusStickers = !this.ignoreBonusStickers;
    }

    private shouldIgnoreSection(sectionName: string) {
        return this.ignoreBonusStickers && sectionName === "MISC";
    }

    @action.bound
    async markActiveSectionOwned() {
        const section = this.section;
        if (!section) return;

        const missingCodes = section.stickers.map(sticker => sticker.code).filter(code => (this.owned[code] ?? 0) <= 0);
        if (missingCodes.length === 0) return;

        const prevOwned = this.owned;

        runInAction(() => {
            const next = { ...this.owned };
            for (const code of missingCodes) {
                next[code] = 1;
            }
            this.owned = next;
        });

        try {
            await Promise.all(missingCodes.map(code => storage.setCount(code, 1)));
        } catch {
            const fresh = await storage.ownership().catch(() => prevOwned);
            runInAction(() => {
                this.owned = fresh;
            });
        }
    }

    @action.bound
    openImportExport() {
        this.importExportMode = "missing-doubles";
        this.importExportOpen = true;
    }

    @action.bound
    closeImportExport() {
        this.importExportOpen = false;
    }

    @action.bound
    setImportExportMode(mode: ImportExportMode) {
        this.importExportMode = mode;
    }

    getImportExportDraft(): ImportExportDraft {
        return {
            missingText: serializeMissingCodes(this.currentPayload.missing),
            doublesText: serializeDoublesEntries(this.currentPayload.doubles),
            ownedCodesText: serializeOwnedCodes(this.owned),
            ownedDoublesText: serializeDoublesEntries(this.currentPayload.doubles)
        };
    }

    private getImportExportPayload(draft: ImportExportDraft): ImportPayload {
        return {
            missing: parseMissingCodes(draft.missingText),
            doubles: parseDoublesEntries(draft.doublesText)
        };
    }

    private withIgnoredSectionsPreserved(payload: ImportPayload): ImportPayload {
        if (!this.ignoreBonusStickers || !this.catalog) return payload;

        const missing = new Set(payload.missing);
        const doubles = { ...payload.doubles };

        for (const section of this.catalog.sections) {
            if (!this.shouldIgnoreSection(section.name)) continue;

            for (const sticker of section.stickers) {
                const code = sticker.code;
                missing.delete(code);
                delete doubles[code];

                const count = this.owned[code] ?? 0;
                if (count <= 0) missing.add(code);
                else if (count > 1) doubles[code] = count - 1;
            }
        }

        return { missing: [...missing], doubles };
    }

    getImportExportText(input: ImportExportInput): string {
        if (input.mode === "owned") {
            const codesLine = input.ownedCodesText;
            const doublesLine = input.ownedDoublesText;
            const lines: string[] = ["[OWNED]"];
            if (codesLine) lines.push(codesLine);
            lines.push("", "[DOUBLES]");
            if (doublesLine) lines.push(doublesLine);
            return `${lines.join("\n")}\n`;
        }
        return serialize(this.getImportExportPayload(input));
    }

    @action.bound
    async submitImportExport(input: ImportExportInput) {
        let payload: ImportPayload;

        if (input.mode === "owned") {
            if (!this.catalog) throw new Error("Catalog not loaded");
            const allCodes = this.catalog.sections.flatMap(s => s.stickers.map(st => st.code));
            const codes = parseOwnedCodes(input.ownedCodesText);
            const doubles = parseDoublesEntries(input.ownedDoublesText);
            const owned = ownedCodesAndDoublesToOwned(codes, doubles);
            payload = ownedToPayload(owned, allCodes);
        } else {
            payload = this.getImportExportPayload(input);
        }

        payload = this.withIgnoredSectionsPreserved(payload);
        const next = await storage.import(payload);
        runInAction(() => {
            this.owned = next;
            this.importExportOpen = false;
        });
    }

    @action.bound
    async copyImportExportText(text: string) {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Ignore clipboard failures.
        }
    }

    @action.bound
    downloadImportExportText(text: string) {
        const blob = new Blob([text], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "panini-wc2026-collection.txt";
        link.click();
        URL.revokeObjectURL(link.href);
    }

    @action.bound
    async startupSequence() {
        // Check if server is available
        const serverHealthy = await checkServerAvailable();
        const hasClientData = hasLocalClientData();

        runInAction(() => {
            this.serverAvailable = serverHealthy;
        });

        if (serverHealthy && hasClientData) {
            // Both server and client data exist - need to merge
            try {
                const serverData = await storage.ownership();
                const clientData = getLocalClientData();
                runInAction(() => {
                    this.pendingServerData = serverData;
                    this.pendingClientData = clientData;
                    this.showDataMergeModal = true;
                    this.loading = false;
                });
            } catch {
                // Server failed to load, go client mode
                setStorageMode("client");
                runInAction(() => {
                    this.isClientMode = true;
                });
                await this.load();
            }
        } else if (serverHealthy) {
            // Server available, no client data - use server mode
            setStorageMode("server");
            runInAction(() => {
                this.isClientMode = false;
            });
            await this.load();
            this.startServerMonitoring();
        } else {
            // Server not available - use client mode
            setStorageMode("client");
            runInAction(() => {
                this.isClientMode = true;
            });
            await this.load();
        }
    }

    @action.bound
    startServerMonitoring() {
        if (this.serverHealthCheckInterval) clearInterval(this.serverHealthCheckInterval);

        this.serverHealthCheckInterval = setInterval(async () => {
            const serverHealthy = await checkServerAvailable();
            runInAction(() => {
                const wasAvailable = this.serverAvailable;
                this.serverAvailable = serverHealthy;

                // If server was available but is now down, show modal
                if (wasAvailable && !serverHealthy && !this.isClientMode) {
                    this.showServerLostModal = true;
                }
            });
        }, 5000); // Check every 5 seconds
    }

    @action.bound
    chooseServerData() {
        // Keep server data, discard client data
        this.pendingServerData = null;
        this.pendingClientData = null;
        runInAction(() => {
            this.showDataMergeModal = false;
        });
        setStorageMode("server");
        runInAction(() => {
            this.isClientMode = false;
        });
        void this.load();
        this.startServerMonitoring();
    }

    @action.bound
    chooseClientData() {
        // Keep client data, switch to client mode
        this.pendingServerData = null;
        this.pendingClientData = null;
        runInAction(() => {
            this.showDataMergeModal = false;
        });
        setStorageMode("client");
        runInAction(() => {
            this.isClientMode = true;
        });
        void this.load();
    }

    @action.bound
    mergeDataServerPriority() {
        // Merge with server data taking priority
        if (!this.pendingServerData) {
            this.chooseServerData();
            return;
        }

        const merged = { ...this.pendingClientData, ...this.pendingServerData };
        this.pendingServerData = null;
        this.pendingClientData = null;
        runInAction(() => {
            this.showDataMergeModal = false;
            this.owned = merged;
        });
        setStorageMode("server");
        runInAction(() => {
            this.isClientMode = false;
        });

        // Push merged data to server
        void this.submitImportForMerge(merged);
        this.startServerMonitoring();
    }

    @action.bound
    mergeDataClientPriority() {
        // Merge with client data taking priority
        if (!this.pendingClientData) {
            this.chooseClientData();
            return;
        }

        const merged = { ...this.pendingServerData, ...this.pendingClientData };
        this.pendingServerData = null;
        this.pendingClientData = null;
        runInAction(() => {
            this.showDataMergeModal = false;
            this.owned = merged;
        });
        setStorageMode("server");
        runInAction(() => {
            this.isClientMode = false;
        });

        // Push merged data to server
        void this.submitImportForMerge(merged);
        this.startServerMonitoring();
    }

    @action.bound
    private async submitImportForMerge(merged: Ownership) {
        try {
            if (!this.catalog) return;
            const allCodes = this.catalog.sections.flatMap(s => s.stickers.map(st => st.code));
            const payload = ownedToPayload(merged, allCodes);
            await storage.import(payload);
        } catch (error) {
            console.error("Failed to push merged data to server", error);
        }
    }

    @action.bound
    switchToClientModeServerLost() {
        setStorageMode("client");
        runInAction(() => {
            this.isClientMode = true;
            this.showServerLostModal = false;
        });
        if (this.serverHealthCheckInterval) {
            clearInterval(this.serverHealthCheckInterval);
            this.serverHealthCheckInterval = null;
        }
    }

    @action.bound
    async load() {
        try {
            const [catalog, owned] = await Promise.all([storage.catalog(), storage.ownership()]);

            const pathSection = this.readSectionFromPath();
            const nextActiveSection =
                pathSection && catalog.sections.some(section => section.name === pathSection)
                    ? pathSection
                    : catalog.sections.some(section => section.name === this.activeSection)
                      ? this.activeSection
                      : (catalog.sections[0]?.name ?? this.activeSection);

            runInAction(() => {
                this.catalog = catalog;
                this.owned = owned;
                this.activeSection = nextActiveSection;
                this.loading = false;
            });

            this.writeSectionToPath(nextActiveSection, "replace");
        } catch {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action.bound
    async setCount(code: string, count: number) {
        const nextCount = Math.max(0, count);
        const prevOwned = this.owned;

        runInAction(() => {
            const next = { ...this.owned };
            if (nextCount === 0) delete next[code];
            else next[code] = nextCount;
            this.owned = next;
        });

        try {
            await storage.setCount(code, nextCount);
        } catch {
            const fresh = await storage.ownership().catch(() => prevOwned);
            runInAction(() => {
                this.owned = fresh;
            });
        }
    }

    @action.bound
    async reset() {
        const next = await storage.reset();
        runInAction(() => {
            this.owned = next;
        });
    }

    @action.bound
    async confirmAndReset() {
        if (!confirm("Reset the whole collection to unowned?")) return;
        await this.reset();
    }
}

export const collectionStore = new CollectionStore();
