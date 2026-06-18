import express from "express";
import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import type { Catalog, ImportPayload } from "@ima-stickermanage/contracts/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const catalog: Catalog = JSON.parse(fs.readFileSync(path.join(root, "..", "contracts", "src", "dataset.json"), "utf-8"));

const validCodes = new Set<string>();
for (const section of catalog.sections) {
    for (const sticker of section.stickers) {
        validCodes.add(sticker.code);
    }
}

const dbFile = process.env.PANINI_DB || path.join(root, "panini.db");
const db = new Database(dbFile);
db.pragma("journal_mode = WAL");
db.exec(`CREATE TABLE IF NOT EXISTS ownership (
  code TEXT PRIMARY KEY,
  count INTEGER NOT NULL CHECK (count >= 0)
);`);

const getAllStmt = db.prepare("SELECT code, count FROM ownership");
const upsertStmt = db.prepare("INSERT INTO ownership (code, count) VALUES (?, ?) ON CONFLICT(code) DO UPDATE SET count = excluded.count");
const deleteStmt = db.prepare("DELETE FROM ownership WHERE code = ?");
const clearStmt = db.prepare("DELETE FROM ownership");

function ownershipMap(): Record<string, number> {
    const rows = getAllStmt.all() as { code: string; count: number }[];
    const out: Record<string, number> = {};
    for (const row of rows) out[row.code] = row.count;
    return out;
}

function setCount(code: string, count: number) {
    if (!validCodes.has(code)) throw new Error(`Unknown sticker code: ${code}`);
    const nextCount = Math.max(0, Math.floor(count));
    if (nextCount === 0) deleteStmt.run(code);
    else upsertStmt.run(code, nextCount);
}

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/api/catalog", (_req, res) => res.json(catalog));
app.get("/api/ownership", (_req, res) => res.json(ownershipMap()));

app.put("/api/ownership/:code", (req, res) => {
    const code = req.params.code;
    if (!validCodes.has(code)) return res.status(404).json({ error: "Unknown code" });

    const count = Number(req.body?.count);
    if (!Number.isFinite(count) || count < 0) return res.status(400).json({ error: "Invalid count" });

    setCount(code, count);
    return res.json({ code, count: Math.max(0, Math.floor(count)) });
});

app.get("/api/export", (_req, res) => {
    const owned = ownershipMap();
    const missing: string[] = [];
    const doubles: Record<string, number> = {};

    for (const section of catalog.sections) {
        for (const sticker of section.stickers) {
            const count = owned[sticker.code] ?? 0;
            if (count <= 0) missing.push(sticker.code);
            else if (count > 1) doubles[sticker.code] = count - 1;
        }
    }

    return res.json({ missing, doubles } satisfies ImportPayload);
});

app.post("/api/import", (req, res) => {
    const payload = req.body as ImportPayload;
    const missing = new Set((payload?.missing ?? []).map(String));
    const doubles = payload?.doubles ?? {};

    const unknown: string[] = [];
    for (const code of missing) if (!validCodes.has(code)) unknown.push(code);
    for (const code of Object.keys(doubles)) if (!validCodes.has(code)) unknown.push(code);
    if (unknown.length) return res.status(400).json({ error: "Unknown codes", codes: unknown });

    const tx = db.transaction(() => {
        clearStmt.run();
        for (const section of catalog.sections) {
            for (const sticker of section.stickers) {
                if (missing.has(sticker.code)) continue;
                const spare = Math.max(0, Math.floor(Number(doubles[sticker.code] ?? 0)));
                upsertStmt.run(sticker.code, 1 + spare);
            }
        }
    });

    tx();
    return res.json(ownershipMap());
});

app.post("/api/reset", (_req, res) => {
    clearStmt.run();
    return res.json(ownershipMap());
});

const publicDir = path.join(root, "..", "client", "dist", "public");
app.use(express.static(publicDir));
app.get(/^\/(?!api(?:\/|$)).*/, (req, res, next) => {
    if (path.extname(req.path)) return next();
    return res.sendFile(path.join(publicDir, "index.html"));
});

const port = Number(process.env.PORT || 4173);
app.listen(port, () => {
    console.log(`Panini WC2026 server running at http://localhost:${port}`);
    console.log(`SQLite database: ${dbFile}`);
});
