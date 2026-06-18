import type { ImportPayload } from "@ima-stickermanage/contracts/types";

export function serialize(payload: ImportPayload): string {
    const missingLine = serializeMissingCodes(payload.missing);
    const doublesLine = serializeDoublesEntries(payload.doubles);
    const lines: string[] = ["[MISSING]"];

    if (missingLine) lines.push(missingLine);
    lines.push("", "[DOUBLES]");
    if (doublesLine) lines.push(doublesLine);

    return `${lines.join("\n")}\n`;
}

export function serializeMissingCodes(codes: string[]): string {
    return [...codes].sort(byCode).join(", ");
}

export function serializeDoublesEntries(doubles: Record<string, number>): string {
    return Object.keys(doubles)
        .sort(byCode)
        .map(code => `${code} ${doubles[code]}`)
        .join(", ");
}

export function parse(text: string): ImportPayload {
    const missing: string[] = [];
    const doubles: Record<string, number> = {};
    let section: "missing" | "doubles" | null = null;

    for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;

        const lower = line.toLowerCase();
        if (lower === "[missing]" || lower === "missing:") {
            section = "missing";
            continue;
        }
        if (lower === "[doubles]" || lower === "doubles:") {
            section = "doubles";
            continue;
        }

        if (section === "missing") {
            for (const entry of splitLineEntries(line)) {
                const code = parseMissingEntry(entry);
                if (code) missing.push(code);
            }
        } else if (section === "doubles") {
            for (const entry of splitLineEntries(line)) {
                const parsed = parseDoubleEntry(entry);
                if (parsed) doubles[parsed.code] = parsed.spares;
            }
        }
    }

    return { missing, doubles };
}

export function parseMissingCodes(text: string): string[] {
    const missing: string[] = [];

    for (const line of text.split(/\r?\n/)) {
        for (const entry of splitLineEntries(line)) {
            const code = parseMissingEntry(entry);
            if (code) missing.push(code);
        }
    }

    return missing;
}

export function parseDoublesEntries(text: string): Record<string, number> {
    const doubles: Record<string, number> = {};

    for (const line of text.split(/\r?\n/)) {
        for (const entry of splitLineEntries(line)) {
            const parsed = parseDoubleEntry(entry);
            if (parsed) doubles[parsed.code] = parsed.spares;
        }
    }

    return doubles;
}

function splitLineEntries(line: string): string[] {
    return line
        .split(/,\s*/)
        .map(part => part.trim())
        .filter(Boolean);
}

function parseMissingEntry(entry: string): string | null {
    const code = entry.split(/\s+/)[0]?.trim();
    if (!code) return null;
    return code.toUpperCase();
}

function parseDoubleEntry(entry: string): { code: string; spares: number } | null {
    const [rawCode, rawCount] = entry.split(/\s+/);
    const code = rawCode?.trim();
    if (!code) return null;

    const spares = Math.max(1, Math.floor(Number(rawCount) || 1));
    return { code: code.toUpperCase(), spares };
}

export function serializeOwnedCodes(owned: Record<string, number>): string {
    return Object.keys(owned)
        .filter(code => owned[code] > 0)
        .sort(byCode)
        .join(", ");
}

export function parseOwnedCodes(text: string): string[] {
    const codes: string[] = [];

    for (const line of text.split(/\r?\n/)) {
        for (const entry of splitLineEntries(line)) {
            const code = entry.split(/\s+/)[0]?.trim();
            if (code) codes.push(code.toUpperCase());
        }
    }

    return codes;
}

export function ownedCodesAndDoublesToOwned(codes: string[], doubles: Record<string, number>): Record<string, number> {
    const owned: Record<string, number> = {};

    for (const code of codes) {
        owned[code] = 1 + (doubles[code] ?? 0);
    }

    return owned;
}

export function ownedToPayload(owned: Record<string, number>, allCodes: string[]): ImportPayload {
    const missing: string[] = [];
    const doubles: Record<string, number> = {};

    for (const code of allCodes) {
        const count = owned[code] ?? 0;
        if (count <= 0) missing.push(code);
        else if (count > 1) doubles[code] = count - 1;
    }

    return { missing, doubles };
}

function byCode(a: string, b: string): number {
    return a.localeCompare(b, undefined, { numeric: true });
}
