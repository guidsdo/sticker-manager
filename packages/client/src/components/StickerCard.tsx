import { observer } from "mobx-react-lite";
import type { KeyboardEvent } from "react";
import type { Sticker } from "@ima-stickermanage/contracts/types";
import { collectionStore as store } from "../stores/CollectionStore";
import * as U from "../ui";

type StickerCardProps = {
    sticker: Sticker;
    orientation?: "portrait" | "landscape";
};

export const StickerCard = observer(function StickerCard({ sticker, orientation = "portrait" }: StickerCardProps) {
    const count = store.countFor(sticker.code);
    const owned = count > 0;

    const toggleCard = () => {
        void store.setCount(sticker.code, owned ? 0 : 1);
    };

    const onCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggleCard();
    };

    return (
        <U.Card
            $selected={owned}
            $foil={sticker.foil}
            $orientation={orientation}
            onClick={toggleCard}
            onKeyDown={onCardKeyDown}
            role="button"
            tabIndex={0}
        >
            <U.CardTop>
                <U.Code $foil={sticker.foil}>{sticker.code}</U.Code>
                {sticker.foil ? <U.Tag>foil</U.Tag> : null}
            </U.CardTop>
            <U.CardName>{sticker.name}</U.CardName>
            <U.CardActions>
                <U.Check
                    $on={owned}
                    onClick={event => {
                        event.stopPropagation();
                        toggleCard();
                    }}
                    title={owned ? "Mark as missing" : "Mark as owned"}
                    aria-pressed={owned}
                >
                    {owned ? "✓" : ""}
                </U.Check>
                {owned && (
                    <U.Stepper>
                        <U.StepBtn
                            onClick={event => {
                                event.stopPropagation();
                                void store.setCount(sticker.code, count - 1);
                            }}
                            disabled={count <= 0}
                            aria-label="decrease"
                        >
                            -
                        </U.StepBtn>
                        <U.Qty $double={count > 1}>{count}</U.Qty>
                        <U.StepBtn
                            onClick={event => {
                                event.stopPropagation();
                                void store.setCount(sticker.code, count + 1);
                            }}
                            aria-label="increase"
                        >
                            +
                        </U.StepBtn>
                    </U.Stepper>
                )}
            </U.CardActions>
        </U.Card>
    );
});
