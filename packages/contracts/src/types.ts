export type Sticker = {
    code: string;
    name: string;
    foil: boolean;
};

export type Section = {
    name: string;
    title: string;
    stickers: Sticker[];
};

export type Catalog = {
    collection: string;
    sections: Section[];
};

export type Ownership = Record<string, number>;

export type ImportPayload = {
    missing: string[];
    doubles: Record<string, number>;
};

export const desktopBridgeKey = "imaStickermanageDesktop";

export type CollectionTransport = {
    catalog(): Promise<Catalog>;
    ownership(): Promise<Ownership>;
    setCount(code: string, count: number): Promise<void>;
    importCollection(payload: ImportPayload): Promise<Ownership>;
    reset(): Promise<Ownership>;
};

export type DesktopBridge = {
    platform: "electron";
    collection: CollectionTransport;
};
