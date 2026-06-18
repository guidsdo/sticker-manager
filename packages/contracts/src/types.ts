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
