import { observer } from "mobx-react-lite";
import { collectionStore as store } from "../stores/CollectionStore";
import { StickerCard } from "./StickerCard";
import * as U from "../ui";

type Slot = {
    index: number;
    row: number;
    col: number;
    span?: number;
    orientation?: "portrait" | "landscape";
};

const PAGE_1_SLOTS: Slot[] = [
    { index: 1, row: 1, col: 3 },
    { index: 2, row: 1, col: 4 },
    { index: 3, row: 2, col: 1 },
    { index: 4, row: 2, col: 2 },
    { index: 5, row: 2, col: 3 },
    { index: 6, row: 2, col: 4 },
    { index: 7, row: 3, col: 1 },
    { index: 8, row: 3, col: 2 },
    { index: 9, row: 3, col: 3 },
    { index: 10, row: 3, col: 4 }
];

const PAGE_2_SLOTS: Slot[] = [
    { index: 11, row: 1, col: 1 },
    { index: 12, row: 1, col: 2 },
    { index: 13, row: 1, col: 3, span: 2, orientation: "landscape" },
    { index: 14, row: 2, col: 1 },
    { index: 15, row: 2, col: 2 },
    { index: 16, row: 2, col: 3 },
    { index: 17, row: 2, col: 4 },
    { index: 18, row: 3, col: 2 },
    { index: 19, row: 3, col: 3 },
    { index: 20, row: 3, col: 4 }
];

export const StickerGrid = observer(function StickerGrid() {
    const section = store.section;
    if (!section) return null;

    if (section.name === "FWC" || section.name === "MISC") {
        return (
            <U.Grid>
                {section.stickers.map(sticker => (
                    <StickerCard key={sticker.code} sticker={sticker} />
                ))}
            </U.Grid>
        );
    }

    const renderPage = (label: string, slots: Slot[]) => (
        <U.AlbumPage>
            <U.AlbumPageTitle>{label}</U.AlbumPageTitle>
            <U.AlbumGrid>
                {slots.map(slot => {
                    const sticker = section.stickers[slot.index - 1];
                    if (!sticker) return null;

                    return (
                        <U.AlbumCell key={sticker.code} $col={slot.col} $row={slot.row} $span={slot.span}>
                            <StickerCard sticker={sticker} orientation={slot.orientation} />
                        </U.AlbumCell>
                    );
                })}
            </U.AlbumGrid>
        </U.AlbumPage>
    );

    const slotted = new Set([...PAGE_1_SLOTS, ...PAGE_2_SLOTS].map(slot => slot.index));
    const overflow = section.stickers.filter((_, index) => !slotted.has(index + 1));

    return (
        <>
            <U.Album>
                {renderPage("Page 1", PAGE_1_SLOTS)}
                {renderPage("Page 2", PAGE_2_SLOTS)}
            </U.Album>
            {overflow.length > 0 && (
                <U.Grid style={{ marginTop: 16 }}>
                    {overflow.map(sticker => (
                        <StickerCard key={sticker.code} sticker={sticker} />
                    ))}
                </U.Grid>
            )}
        </>
    );
});
