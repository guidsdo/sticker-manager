import { observer } from "mobx-react-lite";
import { flag } from "../flags";
import { collectionStore as store } from "../stores/CollectionStore";
import * as U from "../ui";

export const CollectionSidebar = observer(function CollectionSidebar() {
    if (!store.catalog) return null;

    return (
        <U.Sidebar>
            <U.SidebarHeader>
                <U.Brand>🌍 WC 2026 Collector</U.Brand>
                <U.BrandSub>Panini sticker album</U.BrandSub>
                {store.isClientMode && (
                    <U.WarningBanner>
                        <U.WarningText>⚠ Client-Side Mode</U.WarningText>
                        <U.WarningDetail>
                            Your data is stored locally and will be lost when you close the browser. Please back up your collection
                            regularly using Export.
                        </U.WarningDetail>
                    </U.WarningBanner>
                )}
                <U.ProgressTrack>
                    <U.ProgressFill $pct={store.completionPct} />
                </U.ProgressTrack>
                <U.BrandSub style={{ marginTop: 6 }}>
                    {store.totals.have} / {store.totals.total} stickers · {store.completionPct}%
                </U.BrandSub>
                <U.SidebarHeaderRow>
                    <U.SortToggle $on={store.sortAlphabetical} onClick={store.toggleSortAlphabetical}>
                        {store.sortAlphabetical ? "Original order" : "Sort A-Z"}
                    </U.SortToggle>
                </U.SidebarHeaderRow>
            </U.SidebarHeader>
            <U.TeamList>
                {store.navigatorSections.map(section => {
                    const stats = store.sectionStats(section);
                    return (
                        <U.TeamButton
                            key={section.name}
                            $active={section.name === store.activeSection}
                            onClick={() => store.setActiveSection(section.name)}
                        >
                            <U.TeamFlag>{flag(section.name)}</U.TeamFlag>
                            <U.TeamName>{section.title}</U.TeamName>
                            <U.Pill $complete={stats.have === stats.total}>
                                {stats.have}/{stats.total}
                            </U.Pill>
                        </U.TeamButton>
                    );
                })}
            </U.TeamList>
        </U.Sidebar>
    );
});
