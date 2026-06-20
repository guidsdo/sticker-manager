import type { Catalog, DesktopBridge, ImportPayload, Ownership } from "@ima-stickermanage/contracts/types";

async function json<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const fallback = { error: response.statusText };
        const body = await response.json().catch(() => fallback);
        throw new Error(body.error || response.statusText);
    }
    return response.json() as Promise<T>;
}

function desktopBridge(): DesktopBridge | null {
    if (typeof window === "undefined") return null;

    return window.imaStickermanageDesktop ?? null;
}

export const api = {
    catalog: () => {
        const bridge = desktopBridge();
        if (bridge) return bridge.collection.catalog();
        return fetch("/api/catalog").then(r => json<Catalog>(r));
    },
    ownership: () => {
        const bridge = desktopBridge();
        if (bridge) return bridge.collection.ownership();
        return fetch("/api/ownership").then(r => json<Ownership>(r));
    },
    setCount: (code: string, count: number) => {
        const bridge = desktopBridge();
        if (bridge) {
            return bridge.collection.setCount(code, count).then(() => ({ code, count: Math.max(0, Math.floor(count)) }));
        }

        return fetch(`/api/ownership/${encodeURIComponent(code)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ count })
        }).then(r => json<{ code: string; count: number }>(r));
    },
    export: () => {
        const bridge = desktopBridge();
        if (bridge) {
            return bridge.collection.ownership().then(owned => {
                const missing: string[] = [];
                const doubles: Record<string, number> = {};

                return bridge.collection.catalog().then(catalog => {
                    for (const section of catalog.sections) {
                        for (const sticker of section.stickers) {
                            const count = owned[sticker.code] ?? 0;
                            if (count <= 0) missing.push(sticker.code);
                            else if (count > 1) doubles[sticker.code] = count - 1;
                        }
                    }

                    return { missing, doubles };
                });
            });
        }

        return fetch("/api/export").then(r => json<ImportPayload>(r));
    },
    import: (payload: ImportPayload) => {
        const bridge = desktopBridge();
        if (bridge) return bridge.collection.importCollection(payload);

        return fetch("/api/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(r => json<Ownership>(r));
    },
    reset: () => {
        const bridge = desktopBridge();
        if (bridge) return bridge.collection.reset();
        return fetch("/api/reset", { method: "POST" }).then(r => json<Ownership>(r));
    }
};
