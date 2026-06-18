import { observer } from "mobx-react-lite";
import { useState } from "react";
import { collectionStore as store } from "../stores/CollectionStore";
import * as U from "../ui";

export const ImportExportModal = observer(function ImportExportModal() {
    const draft = store.getImportExportDraft();
    const [missingText, setMissingText] = useState(draft.missingText);
    const [doublesText, setDoublesText] = useState(draft.doublesText);
    const [ownedCodesText, setOwnedCodesText] = useState(draft.ownedCodesText);
    const [ownedDoublesText, setOwnedDoublesText] = useState(draft.ownedDoublesText);
    const [error, setError] = useState<string | null>(null);
    const isMissingDoublesMode = store.importExportMode === "missing-doubles";
    const isOwnedMode = store.importExportMode === "owned";

    const input = {
        mode: store.importExportMode,
        missingText,
        doublesText,
        ownedCodesText,
        ownedDoublesText
    } as const;

    const onCopy = () => void store.copyImportExportText(store.getImportExportText(input));

    const onDownload = () => store.downloadImportExportText(store.getImportExportText(input));

    const onImport = async () => {
        try {
            await store.submitImportExport(input);
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    return (
        <U.Overlay onClick={store.closeImportExport}>
            <U.Modal onClick={e => e.stopPropagation()}>
                <U.ModalHead>
                    <span>Import / Export collection</span>
                    <U.Button $variant="ghost" onClick={store.closeImportExport}>
                        x
                    </U.Button>
                </U.ModalHead>
                <U.ModalBody>
                    <U.Tabs>
                        <U.TabButton $active={isMissingDoublesMode} onClick={() => store.setImportExportMode("missing-doubles")}>
                            Missing / Doubles
                        </U.TabButton>
                        <U.TabButton $active={isOwnedMode} onClick={() => store.setImportExportMode("owned")}>
                            Owned
                        </U.TabButton>
                    </U.Tabs>

                    {isMissingDoublesMode && (
                        <>
                            <U.Hint>
                                Export uses comma-separated values. When importing, you can separate entries with either ", " or new lines.
                                Doubles use CODE with an optional spare-count ID in parentheses (example: USA2 (2)). If there is only one,
                                omit the parentheses. If Ignore Bonus is enabled, MISC stickers are excluded.
                            </U.Hint>
                            <U.Hint>Missing</U.Hint>
                            <U.TextArea value={missingText} onChange={e => setMissingText(e.target.value)} rows={6} spellCheck={false} />
                            <U.Hint style={{ marginTop: "12px" }}>Doubles</U.Hint>
                            <U.TextArea value={doublesText} onChange={e => setDoublesText(e.target.value)} rows={6} spellCheck={false} />
                        </>
                    )}

                    {isOwnedMode && (
                        <>
                            <U.Hint>
                                List owned stickers and their doubles separately. Owned stickers are listed without counts. Doubles use CODE
                                with an optional spare-count ID in parentheses (example: USA2 (2)); omit parentheses when it is one. If
                                Ignore Bonus is enabled, MISC stickers are preserved separately.
                            </U.Hint>
                            <U.Hint>Owned</U.Hint>
                            <U.TextArea
                                value={ownedCodesText}
                                onChange={e => setOwnedCodesText(e.target.value)}
                                rows={6}
                                spellCheck={false}
                            />
                            <U.Hint style={{ marginTop: "12px" }}>Doubles</U.Hint>
                            <U.TextArea
                                value={ownedDoublesText}
                                onChange={e => setOwnedDoublesText(e.target.value)}
                                rows={6}
                                spellCheck={false}
                            />
                        </>
                    )}

                    {error && <U.ErrorText>! {error}</U.ErrorText>}
                </U.ModalBody>
                <U.ModalFoot>
                    <U.Button $variant="ghost" onClick={onCopy}>
                        Copy
                    </U.Button>
                    <U.Button $variant="ghost" onClick={onDownload}>
                        Download
                    </U.Button>
                    <U.Button $variant="primary" onClick={() => void onImport()}>
                        Import
                    </U.Button>
                </U.ModalFoot>
            </U.Modal>
        </U.Overlay>
    );
});
