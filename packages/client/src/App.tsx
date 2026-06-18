import { observer } from "mobx-react-lite";
import { CollectionHeader } from "./components/CollectionHeader";
import { CollectionSidebar } from "./components/CollectionSidebar";
import { CollectionStats } from "./components/CollectionStats";
import { ImportExportModal } from "./modals/ImportExportModal";
import { DataMergeModal } from "./modals/DataMergeModal";
import { ServerLostModal } from "./modals/ServerLostModal";
import { StickerGrid } from "./components/StickerGrid";
import { collectionStore as store } from "./stores/CollectionStore";
import * as U from "./ui";

export const App = observer(function App() {
    // Show data merge modal if both client and server data exist
    if (store.showDataMergeModal) {
        return <DataMergeModal />;
    }

    // Show server lost modal if connection drops during session
    if (store.showServerLostModal) {
        return <ServerLostModal />;
    }

    if (!store.loaded || !store.catalog || !store.section) return <U.Main>Loading...</U.Main>;

    return (
        <U.Shell>
            <CollectionSidebar />

            <U.Main>
                <CollectionHeader />
                <CollectionStats />
                <StickerGrid />
            </U.Main>

            {store.importExportOpen && <ImportExportModal />}
        </U.Shell>
    );
});
