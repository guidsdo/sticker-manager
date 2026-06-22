import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectionChannel } from "@ima-stickermanage/messagebus";
import { CollectionService, resolveCollectionDbFile } from "@ima-stickermanage/server/service";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientPublicDir = path.resolve(__dirname, "..", "..", "client", "dist", "public");

let mainWindow: BrowserWindow | null = null;
const service = new CollectionService({ dbFile: resolveCollectionDbFile("desktop") });

function registerHandlers() {
    ipcMain.handle(collectionChannel.catalog, () => service.getCatalog());
    ipcMain.handle(collectionChannel.ownership, () => service.getOwnership());
    ipcMain.handle(collectionChannel.setCount, (_event, code: string, count: number) => {
        service.setCount(code, count);
    });
    ipcMain.handle(collectionChannel.importCollection, (_event, payload) => service.importPayload(payload));
    ipcMain.handle(collectionChannel.reset, () => service.reset());
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1700,
        height: 1000,
        minWidth: 1700,
        minHeight: 1000,
        backgroundColor: "#07131a",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    void mainWindow.loadFile(path.join(clientPublicDir, "index.html"));

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    registerHandlers();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    app.quit();
});

app.on("before-quit", () => {
    service.close();
});
