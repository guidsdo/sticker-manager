import { observer } from "mobx-react-lite";
import { collectionStore as store } from "../stores/CollectionStore";
import * as U from "../ui";

export const CollectionStats = observer(function CollectionStats() {
    return (
        <U.StatRow>
            <U.StatCard>
                <U.StatValue>{store.totals.have}</U.StatValue>
                <U.StatLabel>Owned</U.StatLabel>
            </U.StatCard>
            <U.StatCard>
                <U.StatValue>{store.totals.total - store.totals.have}</U.StatValue>
                <U.StatLabel>Missing</U.StatLabel>
            </U.StatCard>
            <U.StatCard>
                <U.StatValue>{store.totals.doubles}</U.StatValue>
                <U.StatLabel>Doubles</U.StatLabel>
            </U.StatCard>
            <U.StatCard>
                <U.StatValue>{store.completionPct}%</U.StatValue>
                <U.StatLabel>Complete</U.StatLabel>
            </U.StatCard>
        </U.StatRow>
    );
});
