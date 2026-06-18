import styled from "styled-components";
import { theme as t } from "./theme";

export const Shell = styled.div`
    display: grid;
    grid-template-columns: 290px 1fr;
    height: 100vh;
    overflow: hidden;
`;

export const Sidebar = styled.aside`
    background: ${t.bgPanel};
    border-right: 1px solid ${t.border};
    display: flex;
    flex-direction: column;
    min-height: 0;
`;

export const SidebarHeader = styled.div`
    padding: 18px 18px 12px;
    border-bottom: 1px solid ${t.border};
`;

export const SidebarHeaderRow = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
`;

export const SortToggle = styled.button<{ $on: boolean }>`
    border-radius: 999px;
    border: 1px solid ${p => (p.$on ? t.accent : t.border)};
    background: ${p => (p.$on ? t.accentDim : t.bgPanel2)};
    color: ${t.text};
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    cursor: pointer;
`;

export const Brand = styled.div`
    font-family: "Sora", "Manrope", sans-serif;
    font-weight: 800;
    font-size: 17px;
    letter-spacing: 0.2px;
`;

export const BrandSub = styled.div`
    color: ${t.textDim};
    font-size: 12px;
    margin-top: 2px;
`;

export const TeamList = styled.nav`
    overflow-y: auto;
    padding: 8px;
    flex: 1;
    min-height: 0;
`;

export const TeamButton = styled.button<{ $active: boolean }>`
    width: 100%;
    text-align: left;
    background: ${p => (p.$active ? t.bgPanel2 : "transparent")};
    color: ${t.text};
    border: 1px solid ${p => (p.$active ? t.border : "transparent")};
    border-radius: 10px;
    padding: 9px 11px;
    margin-bottom: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
`;

export const TeamFlag = styled.span`
    font-size: 18px;
    width: 22px;
    text-align: center;
`;

export const TeamName = styled.span`
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const Pill = styled.span<{ $complete?: boolean }>`
    font-size: 11px;
    color: ${p => (p.$complete ? t.bg : t.textDim)};
    background: ${p => (p.$complete ? t.accent : "transparent")};
    border: 1px solid ${p => (p.$complete ? t.accent : t.border)};
    padding: 2px 7px;
    border-radius: 999px;
    font-weight: 700;
`;

export const Main = styled.main`
    overflow-y: auto;
    min-height: 0;
    padding: 22px 28px 60px;
`;

export const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
    flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
    font-size: 26px;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const Toolbar = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

export const Button = styled.button<{ $variant?: "primary" | "ghost" | "danger" }>`
    border-radius: 9px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid ${t.border};
    color: ${t.text};
    background: ${p => (p.$variant === "primary" ? t.accent : p.$variant === "danger" ? "transparent" : t.bgPanel2)};
    ${p => p.$variant === "primary" && `color:${t.bg}; border-color:${t.accent};`}
    ${p => p.$variant === "danger" && `color:${t.danger}; border-color:${t.danger};`}
`;

export const StatRow = styled.div`
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

export const StatCard = styled.div`
    background: ${t.bgPanel};
    border: 1px solid ${t.border};
    border-radius: 12px;
    padding: 12px 16px;
    min-width: 120px;
`;

export const StatValue = styled.div`
    font-size: 22px;
    font-weight: 800;
`;

export const StatLabel = styled.div`
    font-size: 12px;
    color: ${t.textDim};
    margin-top: 2px;
`;

export const ProgressTrack = styled.div`
    height: 8px;
    background: ${t.bgPanel2};
    border-radius: 999px;
    overflow: hidden;
    margin-top: 10px;
`;

export const ProgressFill = styled.div<{ $pct: number }>`
    height: 100%;
    width: ${p => p.$pct}%;
    background: linear-gradient(90deg, ${t.accent}, ${t.blue});
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
    gap: 12px;
`;

export const Album = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(320px, 1fr));
    gap: 16px;

    @media (max-width: 1080px) {
        grid-template-columns: 1fr;
    }
`;

export const AlbumPage = styled.section`
    background: ${t.bgPanel};
    border: 1px solid ${t.border};
    border-radius: 14px;
    padding: 14px;
`;

export const AlbumPageTitle = styled.div`
    font-size: 12px;
    color: ${t.textDim};
    font-weight: 700;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
`;

export const AlbumGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 150px);
    gap: 10px;
`;

export const AlbumCell = styled.div<{ $col: number; $row: number; $span?: number }>`
    grid-column: ${p => p.$col} / span ${p => p.$span ?? 1};
    grid-row: ${p => p.$row};
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
`;

export const Card = styled.div<{ $selected: boolean; $foil: boolean; $orientation?: "portrait" | "landscape" }>`
    background: ${p => (p.$selected ? t.bgPanel2 : t.bgPanel)};
    border: 1px solid ${p => (p.$selected ? t.accentDim : "rgba(255, 107, 107, 0.55)")};
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: ${p => (p.$orientation === "landscape" ? "200px" : "150px")};
    height: ${p => (p.$orientation === "landscape" ? "150px" : "200px")};
    text-align: center;
    opacity: ${p => (p.$selected ? 1 : 0.78)};
    cursor: pointer;
    transition:
        border-color 120ms ease,
        box-shadow 120ms ease,
        transform 120ms ease;
    &:hover {
        border-color: ${p => (p.$selected ? t.accent : t.danger)};
        transform: translateY(-1px);
    }
    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px ${t.blue};
    }
    ${p => p.$foil && `background-image: linear-gradient(135deg, rgba(255,207,92,0.10), rgba(91,140,255,0.10));`}
`;

export const CardTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    gap: 8px;
`;

export const Code = styled.span<{ $foil?: boolean }>`
    font-weight: 800;
    font-size: 14px;
    letter-spacing: 0.3px;
    color: ${p => (p.$foil ? t.gold : t.text)};
`;

export const Tag = styled.span`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    color: ${t.textDim};
    border: 1px solid ${t.border};
    border-radius: 6px;
    padding: 1px 5px;
`;

export const CardName = styled.div`
    font-size: 12.5px;
    color: ${t.textDim};
    line-height: 1.3;
    min-height: 32px;
`;

export const CardActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
`;

export const Check = styled.button<{ $on: boolean }>`
    width: 26px;
    height: 26px;
    border-radius: 7px;
    border: 1px solid ${p => (p.$on ? t.accent : t.border)};
    background: ${p => (p.$on ? t.accent : "transparent")};
    color: ${t.bg};
    font-size: 15px;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

export const Stepper = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
`;

export const StepBtn = styled.button`
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 1px solid ${t.border};
    background: ${t.bgPanel};
    color: ${t.text};
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
`;

export const Qty = styled.span<{ $double: boolean }>`
    min-width: 26px;
    text-align: center;
    font-weight: 800;
    color: ${p => (p.$double ? t.gold : t.text)};
`;

export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(5, 6, 16, 0.72);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 50;
`;

export const Modal = styled.div`
    background: ${t.bgPanel};
    border: 1px solid ${t.border};
    border-radius: 16px;
    width: min(720px, 100%);
    max-height: 86vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const ModalHead = styled.div`
    padding: 16px 20px;
    border-bottom: 1px solid ${t.border};
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
`;

export const ModalBody = styled.div`
    padding: 18px 20px;
    overflow-y: auto;
`;

export const ModalFoot = styled.div`
    padding: 14px 20px;
    border-top: 1px solid ${t.border};
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 240px;
    background: ${t.bg};
    color: ${t.text};
    border: 1px solid ${t.border};
    border-radius: 10px;
    padding: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    resize: vertical;
`;

export const Hint = styled.p`
    color: ${t.textDim};
    font-size: 12.5px;
    line-height: 1.5;
    margin: 0 0 12px;
`;

export const ErrorText = styled.div`
    color: ${t.danger};
    font-size: 13px;
    margin-top: 8px;
`;

export const Tabs = styled.div`
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    border-bottom: 1px solid ${t.border};
`;

export const TabButton = styled.button<{ $active: boolean }>`
    background: transparent;
    border: none;
    border-bottom: 2px solid ${p => (p.$active ? t.accent : "transparent")};
    color: ${p => (p.$active ? t.text : t.textDim)};
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 120ms ease;

    &:hover {
        color: ${t.text};
    }
`;

export const WarningBanner = styled.div`
    background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 193, 7, 0.1));
    border: 1px solid rgba(255, 152, 0, 0.3);
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 12px;
    font-size: 12px;
    line-height: 1.5;
`;

export const WarningText = styled.div`
    color: ${t.text};
    font-weight: 600;
    margin-bottom: 6px;
`;

export const WarningDetail = styled.div`
    color: ${t.textDim};
    font-size: 11px;
`;

export const ComparisonContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 12px 0;
`;

export const ComparisonBox = styled.div`
    background: ${t.bgPanel2};
    border: 1px solid ${t.border};
    border-radius: 10px;
    padding: 14px;
    text-align: center;
`;

export const ComparisonTitle = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: ${t.textDim};
    margin-bottom: 8px;
`;

export const ComparisonStat = styled.div`
    font-size: 20px;
    font-weight: 800;
    color: ${t.text};
`;

export const ComparisonDetail = styled.div`
    font-size: 11px;
    color: ${t.textDim};
    margin-top: 4px;
`;
