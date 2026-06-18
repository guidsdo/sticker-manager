import { observer } from "mobx-react-lite";
import { flag } from "../flags";
import { collectionStore as store } from "../stores/CollectionStore";
import * as U from "../ui";

export const CollectionHeader = observer(function CollectionHeader() {
    const section = store.section;
    if (!section) return null;
    const stats = store.sectionStats(section);
    const allOwned = stats.have === stats.total;

    return (
        <U.TopBar>
            <U.PageTitle>
                <span>{flag(section.name)}</span> {section.title}
            </U.PageTitle>
            <U.Toolbar>
                <U.Button $variant="primary" onClick={() => void store.markActiveSectionOwned()} disabled={allOwned}>
                    Mark Group Owned
                </U.Button>
                <U.Button onClick={store.toggleIgnoreBonusStickers}>
                    {store.ignoreBonusStickers ? "Include Bonus" : "Ignore Bonus"}
                </U.Button>
                <U.Button onClick={store.openImportExport}>Import / Export</U.Button>
                <U.Button $variant="danger" onClick={store.confirmAndReset}>
                    Reset
                </U.Button>
            </U.Toolbar>
        </U.TopBar>
    );
});
