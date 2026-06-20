import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createCollectionHttpApp } from "./http";
import { CollectionService, resolveCollectionDbFile } from "./service";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const service = new CollectionService({ dbFile: resolveCollectionDbFile("server") });
const app = createCollectionHttpApp(service);

const publicDir = path.join(root, "..", "client", "dist", "public");
app.use(express.static(publicDir));
app.get(/^\/(?!api(?:\/|$)).*/, (req, res, next) => {
    if (path.extname(req.path)) return next();
    return res.sendFile(path.join(publicDir, "index.html"));
});

const port = Number(process.env.PORT || 4173);
app.listen(port, () => {
    console.log(`Panini WC2026 server running at http://localhost:${port}`);
    console.log(`SQLite database: ${service.dbFile}`);
});
