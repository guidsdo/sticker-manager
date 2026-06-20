import { contextBridge, ipcRenderer } from "electron";
import { desktopBridgeKey, type ImportPayload } from "@ima-stickermanage/contracts/types";
import { collectionChannel, type CollectionInvokeMap } from "@ima-stickermanage/messagebus";

function invoke<TChannel extends keyof CollectionInvokeMap>(
    channel: TChannel,
    ...args: CollectionInvokeMap[TChannel]["args"]
): Promise<CollectionInvokeMap[TChannel]["result"]> {
    return ipcRenderer.invoke(channel, ...args) as Promise<CollectionInvokeMap[TChannel]["result"]>;
}

contextBridge.exposeInMainWorld(desktopBridgeKey, {
    platform: "electron",
    collection: {
        catalog: () => invoke(collectionChannel.catalog),
        ownership: () => invoke(collectionChannel.ownership),
        setCount: (code: string, count: number) => invoke(collectionChannel.setCount, code, count),
        importCollection: (payload: ImportPayload) => invoke(collectionChannel.importCollection, payload),
        reset: () => invoke(collectionChannel.reset)
    }
});
