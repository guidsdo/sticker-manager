import styled from "styled-components";
import { theme as t } from "./theme";

export const Shell = styled.div`
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: 290px 1fr;
    height: 100vh;
    overflow: hidden;
    background:
        radial-gradient(circle at 14% 8%, rgba(0, 201, 120, 0.32), transparent 36%),
        radial-gradient(circle at 82% 14%, rgba(255, 47, 69, 0.34), transparent 40%),
        conic-gradient(from 230deg at 72% 12%, rgba(10, 132, 255, 0.24), transparent 42%, rgba(255, 47, 69, 0.26) 72%, transparent 100%),
        linear-gradient(140deg, #050a1d 0%, #091431 45%, #0f2050 100%);

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: ${t.patternMark};
        background-size: 320px 320px;
        opacity: 0.34;
        pointer-events: none;
        z-index: 0;
    }

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
            linear-gradient(115deg, rgba(10, 132, 255, 0.18), transparent 45%),
            linear-gradient(295deg, rgba(0, 201, 120, 0.16), transparent 48%), ${t.patternBurst};
        background-size:
            auto,
            auto,
            180px 180px;
        pointer-events: none;
        z-index: 0;
    }

    > * {
        position: relative;
        z-index: 1;
    }
`;

export const Sidebar = styled.aside`
    background: linear-gradient(180deg, rgba(16, 31, 74, 0.97), rgba(8, 18, 44, 0.97)), ${t.patternWave}, ${t.patternBurst};
    background-size:
        auto,
        220px 220px,
        180px 180px;
    border-right: 1px solid ${t.border};
    display: flex;
    flex-direction: column;
    min-height: 0;
    box-shadow:
        inset -1px 0 0 rgba(255, 255, 255, 0.08),
        14px 0 32px rgba(2, 8, 20, 0.35);
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
    background: ${p =>
        p.$active
            ? "linear-gradient(110deg, rgba(31, 123, 255, 0.24), rgba(19, 178, 107, 0.2) 58%, rgba(217, 54, 68, 0.2))"
            : "transparent"};
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
    transition:
        transform 140ms ease,
        box-shadow 140ms ease,
        border-color 140ms ease;

    &:hover {
        transform: translateX(2px);
        border-color: ${t.blue};
    }

    ${p => p.$active && `box-shadow: 0 8px 18px rgba(10, 132, 255, 0.26), inset 0 0 0 1px rgba(255, 255, 255, 0.07);`}
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
    overflow-x: auto;
    overflow-y: auto;
    min-height: 0;
    padding: 22px 28px 60px;
    background: linear-gradient(180deg, rgba(7, 15, 40, 0.42), rgba(7, 15, 40, 0.86)), ${t.patternWave}, ${t.patternBurst};
    background-size:
        auto,
        260px 260px,
        180px 180px;
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
    color: #ffffff;
    text-shadow:
        0 0 14px rgba(10, 132, 255, 0.36),
        0 0 22px rgba(255, 47, 69, 0.16);
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
    background: ${p =>
        p.$variant === "primary" ? "linear-gradient(115deg, #13b26b, #1f7bff 72%)" : p.$variant === "danger" ? "transparent" : t.bgPanel2};
    ${p => p.$variant === "primary" && `color:${t.bg}; border-color:${t.accent};`}
    ${p => p.$variant === "danger" && `color:${t.danger}; border-color:${t.danger};`}
    transition:
        transform 140ms ease,
        box-shadow 140ms ease,
        filter 140ms ease;

    &:hover {
        transform: translateY(-1px);
        filter: saturate(1.08);
        box-shadow: 0 10px 20px rgba(4, 10, 24, 0.35);
    }
`;

export const StatRow = styled.div`
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

export const StatCard = styled.div`
    background: linear-gradient(165deg, rgba(16, 31, 74, 0.93), rgba(8, 18, 44, 0.95)), ${t.patternMark}, ${t.patternBurst};
    background-size:
        auto,
        240px 240px,
        180px 180px;
    border: 1px solid ${t.border};
    border-radius: 12px;
    padding: 12px 16px;
    min-width: 120px;
    box-shadow:
        0 14px 28px rgba(3, 8, 20, 0.35),
        inset 0 0 0 1px rgba(255, 255, 255, 0.05);
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
    grid-template-columns: repeat(2, 670px);
    justify-content: center;
    gap: 16px;

    @media (max-width: 1360px) {
        grid-template-columns: 670px;
    }
`;

export const AlbumPage = styled.section<{ $flagGradient?: string; $flagEdge?: string; $flagGlow?: string; $flag?: string; $page?: 1 | 2 }>`
    width: 670px;
    min-width: 670px;
    max-width: 670px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    background:
        ${p => (p.$flagGradient ? `${p.$flagGradient}, ` : "")}linear-gradient(165deg, rgba(16, 31, 74, 0.95), rgba(8, 18, 44, 0.98)),
        ${t.patternMark},
        ${t.patternBurst};
    background-size:
        auto,
        280px 280px,
        180px 180px;
    border: 1px solid ${p => p.$flagEdge ?? t.border};
    border-radius: 14px;
    padding: 14px;
    box-shadow:
        ${p => p.$flagGlow ?? "none"},
        0 18px 34px rgba(2, 8, 20, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;

    &::before {
        content: "${p => (p.$page === 1 ? p.$flag : "")}";
        position: absolute;
        left: 80px;
        top: 30px;
        font-size: 200px;
        opacity: 0.28;
        line-height: 1;
        pointer-events: none;
        filter: saturate(1.25);
    }

    > * {
        position: relative;
        z-index: 1;
    }
`;

export const AlbumPageTitle = styled.div`
    font-size: 12px;
    color: ${t.textDim};
    font-weight: 700;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
`;

export const AlbumGrid = styled.div<{ $align?: "left" | "right" }>`
    display: grid;
    grid-template-columns: repeat(4, 150px);
    gap: 10px;
    width: max-content;
    margin-left: ${p => (p.$align === "right" ? "auto" : "0")};
    margin-right: ${p => (p.$align === "right" ? "0" : "auto")};
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
