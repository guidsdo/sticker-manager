import Database from "better-sqlite3";
import catalogData from "@ima-stickermanage/contracts/dataset";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Catalog, ImportPayload, Ownership } from "@ima-stickermanage/contracts/types";

const bundledCatalog = catalogData as Catalog;
const defaultDataDir = path.join(os.homedir(), ".ima-stickermanage");
const defaultDesktopDbPath = path.join(defaultDataDir, "collection.db");
const defaultServerDbPath = path.join(process.cwd(), "panini.db");

type OwnershipRow = {
    code: string;
    count: number;
};

export type CollectionServiceOptions = {
    dbFile?: string;
    catalog?: Catalog;
};

export type CollectionDbTarget = "server" | "desktop";

export function resolveCollectionDbFile(target: CollectionDbTarget = "desktop") {
    if (process.env.PANINI_DB) {
        return process.env.PANINI_DB;
    }
    return target === "server" ? defaultServerDbPath : defaultDesktopDbPath;
}

function validCodesFor(catalog: Catalog) {
    const validCodes = new Set<string>();
    for (const section of catalog.sections) {
        for (const sticker of section.stickers) {
            validCodes.add(sticker.code);
        }
    }
    return validCodes;
}

export class CollectionService {
    readonly catalog: Catalog;
    readonly dbFile: string;

    private readonly db: Database.Database;
    private readonly validCodes: Set<string>;
    private readonly getAllStmt: Database.Statement;
    private readonly upsertStmt: Database.Statement;
    private readonly deleteStmt: Database.Statement;
    private readonly clearStmt: Database.Statement;

    constructor({ dbFile = resolveCollectionDbFile(), catalog = bundledCatalog }: CollectionServiceOptions = {}) {
        this.catalog = catalog;
        this.dbFile = dbFile;
        this.validCodes = validCodesFor(catalog);

        fs.mkdirSync(path.dirname(dbFile), { recursive: true });

        this.db = new Database(dbFile);
        this.db.pragma("journal_mode = WAL");
        this.db.exec(`CREATE TABLE IF NOT EXISTS ownership (
  code TEXT PRIMARY KEY,
  count INTEGER NOT NULL CHECK (count >= 0)
);`);

        this.getAllStmt = this.db.prepare("SELECT code, count FROM ownership");
        this.upsertStmt = this.db.prepare(
            "INSERT INTO ownership (code, count) VALUES (?, ?) ON CONFLICT(code) DO UPDATE SET count = excluded.count"
        );
        this.deleteStmt = this.db.prepare("DELETE FROM ownership WHERE code = ?");
        this.clearStmt = this.db.prepare("DELETE FROM ownership");
    }

    getCatalog() {
        return this.catalog;
    }

    getOwnership(): Ownership {
        const rows = this.getAllStmt.all() as OwnershipRow[];
        const owned: Ownership = {};
        for (const row of rows) {
            owned[row.code] = row.count;
        }
        return owned;
    }

    setCount(code: string, count: number) {
        if (!this.validCodes.has(code)) {
            throw new Error(`Unknown sticker code: ${code}`);
        }

        const nextCount = Math.max(0, Math.floor(count));
        if (nextCount === 0) {
            this.deleteStmt.run(code);
            return;
        }

        this.upsertStmt.run(code, nextCount);
    }

    exportPayload(): ImportPayload {
        const owned = this.getOwnership();
        const missing: string[] = [];
        const doubles: Record<string, number> = {};

        for (const section of this.catalog.sections) {
            for (const sticker of section.stickers) {
                const count = owned[sticker.code] ?? 0;
                if (count <= 0) {
                    missing.push(sticker.code);
                } else if (count > 1) {
                    doubles[sticker.code] = count - 1;
                }
            }
        }

        return { missing, doubles };
    }

    importPayload(payload: ImportPayload): Ownership {
        const missing = new Set((payload?.missing ?? []).map(String));
        const doubles = payload?.doubles ?? {};

        const unknown = new Set<string>();
        for (const code of missing) {
            if (!this.validCodes.has(code)) {
                unknown.add(code);
            }
        }
        for (const code of Object.keys(doubles)) {
            if (!this.validCodes.has(code)) {
                unknown.add(code);
            }
        }

        if (unknown.size > 0) {
            const error = new Error("Unknown codes");
            Object.assign(error, { codes: [...unknown] });
            throw error;
        }

        const tx = this.db.transaction(() => {
            this.clearStmt.run();
            for (const section of this.catalog.sections) {
                for (const sticker of section.stickers) {
                    if (missing.has(sticker.code)) {
                        continue;
                    }

                    const spare = Math.max(0, Math.floor(Number(doubles[sticker.code] ?? 0)));
                    this.upsertStmt.run(sticker.code, 1 + spare);
                }
            }
        });

        tx();
        return this.getOwnership();
    }

    reset(): Ownership {
        this.clearStmt.run();
        return this.getOwnership();
    }

    close() {
        this.db.close();
    }
}
