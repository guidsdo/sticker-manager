import { observer } from "mobx-react-lite";
import { collectionStore as store } from "../stores/CollectionStore";
import * as U from "../ui";

function countOwnedStickers(owned: Record<string, number>): number {
    return Object.keys(owned).filter(code => owned[code] > 0).length;
}

function countTotalCount(owned: Record<string, number>): number {
    return Object.values(owned).reduce((sum, count) => sum + count, 0);
}

export const DataMergeModal = observer(function DataMergeModal() {
    if (!store.showDataMergeModal || !store.pendingServerData || !store.pendingClientData) {
        return null;
    }

    const serverOwned = countOwnedStickers(store.pendingServerData);
    const serverTotal = countTotalCount(store.pendingServerData);
    const clientOwned = countOwnedStickers(store.pendingClientData);
    const clientTotal = countTotalCount(store.pendingClientData);

    return (
        <U.Overlay>
            <U.Modal onClick={e => e.stopPropagation()}>
                <U.ModalHead>
                    <span>Data Conflict: Choose or Merge</span>
                </U.ModalHead>
                <U.ModalBody>
                    <U.Hint>You have data both on the server and locally. Here's what we found:</U.Hint>

                    <U.ComparisonContainer>
                        <U.ComparisonBox>
                            <U.ComparisonTitle>Server Data</U.ComparisonTitle>
                            <U.ComparisonStat>{serverOwned} stickers</U.ComparisonStat>
                            <U.ComparisonDetail>{serverTotal} total copies</U.ComparisonDetail>
                        </U.ComparisonBox>

                        <U.ComparisonBox>
                            <U.ComparisonTitle>Local Data</U.ComparisonTitle>
                            <U.ComparisonStat>{clientOwned} stickers</U.ComparisonStat>
                            <U.ComparisonDetail>{clientTotal} total copies</U.ComparisonDetail>
                        </U.ComparisonBox>
                    </U.ComparisonContainer>

                    <U.Hint style={{ marginTop: "16px" }}>What would you like to do?</U.Hint>
                </U.ModalBody>
                <U.ModalFoot>
                    <U.Button onClick={() => store.chooseServerData()}>Keep Server Data</U.Button>
                    <U.Button onClick={() => store.chooseClientData()}>Keep Local Data</U.Button>
                    <U.Button onClick={() => store.mergeDataServerPriority()}>Merge (Server Priority)</U.Button>
                    <U.Button $variant="primary" onClick={() => store.mergeDataClientPriority()}>
                        Merge (Local Priority)
                    </U.Button>
                </U.ModalFoot>
            </U.Modal>
        </U.Overlay>
    );
});
