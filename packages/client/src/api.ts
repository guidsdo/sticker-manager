import type { Catalog, ImportPayload, Ownership } from "@ima-stickermanage/contracts/types";

async function json<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const fallback = { error: response.statusText };
        const body = await response.json().catch(() => fallback);
        throw new Error(body.error || response.statusText);
    }
    return response.json() as Promise<T>;
}

export const api = {
    catalog: () => fetch("/api/catalog").then(r => json<Catalog>(r)),
    ownership: () => fetch("/api/ownership").then(r => json<Ownership>(r)),
    setCount: (code: string, count: number) =>
        fetch(`/api/ownership/${encodeURIComponent(code)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ count })
        }).then(r => json<{ code: string; count: number }>(r)),
    export: () => fetch("/api/export").then(r => json<ImportPayload>(r)),
    import: (payload: ImportPayload) =>
        fetch("/api/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(r => json<Ownership>(r)),
    reset: () => fetch("/api/reset", { method: "POST" }).then(r => json<Ownership>(r))
};
