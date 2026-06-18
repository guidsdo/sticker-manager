import type { Catalog, ImportPayload, Ownership } from "@ima-stickermanage/contracts/types";
import { api as serverApi } from "./api";

const STORAGE_KEY = "panini-collection";
const MODE_KEY = "panini-mode";

async function isServerHealthy(): Promise<boolean> {
    try {
        await serverApi.catalog();
        return true;
    } catch {
        return false;
    }
}

function getMode(): "client" | "server" {
    if (typeof window === "undefined") return "server";

    // Return stored mode if it exists
    const stored = sessionStorage.getItem(MODE_KEY);
    if (stored === "client" || stored === "server") return stored;

    // Default to server (initial check happens in store startup)
    return "server";
}

function setMode(mode: "client" | "server") {
    if (typeof window !== "undefined") {
        sessionStorage.setItem(MODE_KEY, mode);
    }
}

export function getStorageMode(): "client" | "server" {
    return getMode();
}

export function setStorageMode(mode: "client" | "server") {
    setMode(mode);
}

export function hasLocalClientData(): boolean {
    if (typeof window === "undefined") return false;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return !!stored;
}

export function getLocalClientData(): Ownership {
    if (typeof window === "undefined") return {};
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

// Client-side storage implementation
const clientStorage = {
    catalog: null as Catalog | null,

    async loadCatalog(): Promise<Catalog> {
        if (this.catalog) return this.catalog;
        // Fallback: fetch from server but store locally
        this.catalog = await serverApi.catalog();
        return this.catalog;
    },

    getOwnership(): Ownership {
        if (typeof window === "undefined") return {};
        const stored = sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    },

    setOwnership(owned: Ownership) {
        if (typeof window === "undefined") return;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(owned));
    },

    async setCount(code: string, count: number): Promise<void> {
        const owned = this.getOwnership();
        const nextCount = Math.max(0, Math.floor(count));
        if (nextCount === 0) delete owned[code];
        else owned[code] = nextCount;
        this.setOwnership(owned);
    },

    async import(payload: ImportPayload): Promise<Ownership> {
        if (!this.catalog) throw new Error("Catalog not loaded");

        const owned: Ownership = {};
        const missing = new Set((payload?.missing ?? []).map(String));
        const doubles = payload?.doubles ?? {};

        for (const section of this.catalog.sections) {
            for (const sticker of section.stickers) {
                if (missing.has(sticker.code)) continue;
                const spare = Math.max(0, Math.floor(Number(doubles[sticker.code] ?? 0)));
                owned[sticker.code] = 1 + spare;
            }
        }

        this.setOwnership(owned);
        return owned;
    },

    reset(): Ownership {
        this.setOwnership({});
        return {};
    }
};

// Unified storage interface
export const storage = {
    isClientMode(): boolean {
        return getMode() === "client";
    },

    async catalog(): Promise<Catalog> {
        if (getMode() === "client") {
            return clientStorage.loadCatalog();
        }
        return serverApi.catalog();
    },

    async ownership(): Promise<Ownership> {
        if (getMode() === "client") {
            return clientStorage.getOwnership();
        }
        return serverApi.ownership();
    },

    async setCount(code: string, count: number): Promise<void> {
        if (getMode() === "client") {
            await clientStorage.setCount(code, count);
        } else {
            await serverApi.setCount(code, count);
        }
    },

    async import(payload: ImportPayload): Promise<Ownership> {
        if (getMode() === "client") {
            return clientStorage.import(payload);
        }
        return serverApi.import(payload);
    },

    async reset(): Promise<Ownership> {
        if (getMode() === "client") {
            return clientStorage.reset();
        }
        return serverApi.reset();
    }
};

export async function checkServerAvailable(): Promise<boolean> {
    return isServerHealthy();
}
