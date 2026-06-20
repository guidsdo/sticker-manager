import express from "express";
import type { CollectionService } from "./service";
import type { ImportPayload } from "@ima-stickermanage/contracts/types";

type UnknownCodesError = Error & {
    codes?: string[];
};

export function createCollectionHttpApp(service: CollectionService): express.Express {
    const app = express();
    app.use(express.json({ limit: "1mb" }));

    app.get("/api/catalog", (_req, res) => res.json(service.getCatalog()));
    app.get("/api/ownership", (_req, res) => res.json(service.getOwnership()));

    app.put("/api/ownership/:code", (req, res) => {
        const code = req.params.code;
        const count = Number(req.body?.count);

        if (!Number.isFinite(count) || count < 0) {
            return res.status(400).json({ error: "Invalid count" });
        }

        try {
            service.setCount(code, count);
            return res.json({ code, count: Math.max(0, Math.floor(count)) });
        } catch (error) {
            if (error instanceof Error && error.message.startsWith("Unknown sticker code:")) {
                return res.status(404).json({ error: "Unknown code" });
            }
            throw error;
        }
    });

    app.get("/api/export", (_req, res) => res.json(service.exportPayload()));

    app.post("/api/import", (req, res) => {
        try {
            const ownership = service.importPayload(req.body as ImportPayload);
            return res.json(ownership);
        } catch (error) {
            const unknownCodesError = error as UnknownCodesError;
            if (unknownCodesError.message === "Unknown codes") {
                return res.status(400).json({ error: unknownCodesError.message, codes: unknownCodesError.codes ?? [] });
            }
            throw error;
        }
    });

    app.post("/api/reset", (_req, res) => res.json(service.reset()));

    return app;
}
