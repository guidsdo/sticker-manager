import { observer } from "mobx-react-lite";
import { collectionStore as store } from "../stores/CollectionStore";
import * as U from "../ui";

export const ServerLostModal = observer(function ServerLostModal() {
    if (!store.showServerLostModal) return null;

    return (
        <U.Overlay>
            <U.Modal onClick={e => e.stopPropagation()}>
                <U.ModalHead>
                    <span>Server Connection Lost</span>
                </U.ModalHead>
                <U.ModalBody>
                    <U.Hint>
                        The collection server has become unavailable. Your current collection data is safe. You can continue working in
                        offline mode, but make sure to export your collection regularly for backup.
                    </U.Hint>
                </U.ModalBody>
                <U.ModalFoot>
                    <U.Button $variant="primary" onClick={() => store.switchToClientModeServerLost()}>
                        Switch to Offline Mode
                    </U.Button>
                </U.ModalFoot>
            </U.Modal>
        </U.Overlay>
    );
});
