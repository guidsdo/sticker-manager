import { desktopBridgeKey, type Catalog, type ImportPayload, type Ownership } from "@ima-stickermanage/contracts/types";

export { desktopBridgeKey };

export const collectionChannel = {
    catalog: "collection:catalog",
    ownership: "collection:ownership",
    setCount: "collection:set-count",
    importCollection: "collection:import",
    reset: "collection:reset"
} as const;

export type CollectionChannel = (typeof collectionChannel)[keyof typeof collectionChannel];

export type CollectionInvokeMap = {
    [collectionChannel.catalog]: {
        args: [];
        result: Catalog;
    };
    [collectionChannel.ownership]: {
        args: [];
        result: Ownership;
    };
    [collectionChannel.setCount]: {
        args: [code: string, count: number];
        result: void;
    };
    [collectionChannel.importCollection]: {
        args: [payload: ImportPayload];
        result: Ownership;
    };
    [collectionChannel.reset]: {
        args: [];
        result: Ownership;
    };
};
