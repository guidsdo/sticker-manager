type PatternType = "horizontal" | "vertical" | "diagonal" | "cross" | "radial";

type FlagStyle = {
    pattern: PatternType;
    colors: string[];
    edge?: string;
    glow?: string;
};

type SectionVisual = {
    gradient: string;
    edge: string;
    glow: string;
};

const FLAG_STYLES: Record<string, FlagStyle> = {
    ALG: { pattern: "vertical", colors: ["#0b8f44", "#ffffff", "#d72828"] },
    ARG: { pattern: "horizontal", colors: ["#75aadb", "#ffffff", "#75aadb"] },
    AUS: { pattern: "diagonal", colors: ["#012169", "#ffffff", "#e4002b"] },
    AUT: { pattern: "horizontal", colors: ["#ed2939", "#ffffff", "#ed2939"] },
    BEL: { pattern: "vertical", colors: ["#000000", "#ffd90c", "#ef3340"] },
    BIH: { pattern: "diagonal", colors: ["#002f6c", "#f7d117", "#ffffff"] },
    BRA: { pattern: "diagonal", colors: ["#008c38", "#ffcd00", "#001f5a"], glow: "#00c870" },
    CAN: { pattern: "vertical", colors: ["#d80621", "#ffffff", "#d80621"] },
    CPV: { pattern: "horizontal", colors: ["#003893", "#ffffff", "#cf2027"] },
    COL: { pattern: "horizontal", colors: ["#fcd116", "#003893", "#ce1126"] },
    COD: { pattern: "diagonal", colors: ["#00a3e0", "#ef3340", "#f7d117"] },
    CRO: { pattern: "horizontal", colors: ["#ff0000", "#ffffff", "#171796"] },
    CUW: { pattern: "horizontal", colors: ["#002b7f", "#fcd116", "#ffffff"] },
    CZE: { pattern: "diagonal", colors: ["#ffffff", "#d7141a", "#11457e"] },
    ECU: { pattern: "horizontal", colors: ["#fcd116", "#003893", "#ce1126"] },
    EGY: { pattern: "horizontal", colors: ["#ce1126", "#ffffff", "#000000"] },
    ENG: { pattern: "cross", colors: ["#ffffff", "#ce1126"] },
    FRA: { pattern: "vertical", colors: ["#003087", "#ffffff", "#d91d2e"], glow: "#0066ff" },
    GER: { pattern: "horizontal", colors: ["#000000", "#dd0000", "#ffce00"] },
    GHA: { pattern: "horizontal", colors: ["#ce1126", "#fcd116", "#006b3f"] },
    HAI: { pattern: "horizontal", colors: ["#00209f", "#d21034", "#ffffff"] },
    IRN: { pattern: "horizontal", colors: ["#239f40", "#ffffff", "#da0000"] },
    IRQ: { pattern: "horizontal", colors: ["#ce1126", "#ffffff", "#000000"] },
    CIV: { pattern: "vertical", colors: ["#f77f00", "#ffffff", "#009e60"] },
    JPN: { pattern: "radial", colors: ["#ffffff", "#c80018"], glow: "#ff1744" },
    JOR: { pattern: "diagonal", colors: ["#000000", "#ffffff", "#007a3d", "#ce1126"] },
    MEX: { pattern: "vertical", colors: ["#006847", "#ffffff", "#ce1126"] },
    MAR: { pattern: "radial", colors: ["#d1232a", "#007c4d"], glow: "#d1232a" },
    NED: { pattern: "horizontal", colors: ["#f7931e", "#ffffff", "#204798"], glow: "#ff9c1f" },
    NZL: { pattern: "diagonal", colors: ["#012169", "#ffffff", "#c8102e"] },
    NOR: { pattern: "cross", colors: ["#ba0c2f", "#00205b", "#ffffff"] },
    PAN: { pattern: "diagonal", colors: ["#ffffff", "#d21034", "#005293"] },
    PAR: { pattern: "horizontal", colors: ["#d52b1e", "#ffffff", "#0038a8"] },
    POR: { pattern: "vertical", colors: ["#006600", "#ff0000", "#f9d616"] },
    QAT: { pattern: "vertical", colors: ["#8d1b3d", "#ffffff"] },
    KSA: { pattern: "radial", colors: ["#006c35", "#ffffff"] },
    SCO: { pattern: "diagonal", colors: ["#0065bd", "#ffffff", "#0065bd"] },
    SEN: { pattern: "vertical", colors: ["#00853f", "#fdef42", "#e31b23"] },
    RSA: { pattern: "diagonal", colors: ["#00a86d", "#ffbc42", "#000000", "#de291e", "#001a4d"], glow: "#00c878" },
    KOR: { pattern: "radial", colors: ["#ffffff", "#cd2e3a", "#0047a0"] },
    ESP: { pattern: "horizontal", colors: ["#c60c1f", "#ffc40f", "#c60c1f"], glow: "#d81e1e" },
    SWE: { pattern: "cross", colors: ["#006aa7", "#fecc02"] },
    SUI: { pattern: "cross", colors: ["#d52b1e", "#ffffff"] },
    TUN: { pattern: "radial", colors: ["#e70013", "#ffffff"] },
    TUR: { pattern: "radial", colors: ["#e30a17", "#ffffff"] },
    URU: { pattern: "horizontal", colors: ["#ffffff", "#55acee", "#ffffff", "#f6c700"] },
    USA: { pattern: "horizontal", colors: ["#c41f3d", "#ffffff", "#0a3470"], glow: "#ff2e3d" },
    UZB: { pattern: "horizontal", colors: ["#1eb8ff", "#ffffff", "#1eb53a", "#ce1126"] }
};

function withAlpha(hex: string, alpha: string) {
    if (!hex.startsWith("#")) return hex;
    if (hex.length === 7) return `${hex}${alpha}`;
    return hex;
}

function segmentedGradient(direction: string, colors: string[]) {
    const step = 100 / colors.length;
    const stops = colors
        .map((color, index) => {
            const start = (index * step).toFixed(2);
            const end = ((index + 1) * step).toFixed(2);
            return `${withAlpha(color, "44")} ${start}% ${end}%`;
        })
        .join(", ");

    return `linear-gradient(${direction}, ${stops})`;
}

function buildGradient(code: string, page: 1 | 2) {
    const style = FLAG_STYLES[code] ?? { pattern: "horizontal", colors: ["#2e5aac", "#ffffff", "#00c978"] };

    if (style.pattern === "horizontal") {
        return segmentedGradient(page === 1 ? "180deg" : "0deg", style.colors);
    }

    if (style.pattern === "vertical") {
        return segmentedGradient(page === 1 ? "90deg" : "270deg", style.colors);
    }

    if (style.pattern === "diagonal") {
        const angle = page === 1 ? "135deg" : "315deg";
        return segmentedGradient(angle, style.colors);
    }

    if (style.pattern === "cross") {
        const base = withAlpha(style.colors[0] ?? "#ffffff", "34");
        const cross = withAlpha(style.colors[1] ?? "#d52b1e", "4c");
        const edge = withAlpha(style.colors[2] ?? style.colors[1] ?? "#ffffff", "42");

        return [
            `linear-gradient(90deg, transparent 0 39%, ${edge} 39% 45%, ${cross} 45% 55%, ${edge} 55% 61%, transparent 61% 100%)`,
            `linear-gradient(180deg, transparent 0 39%, ${edge} 39% 45%, ${cross} 45% 55%, ${edge} 55% 61%, transparent 61% 100%)`,
            `linear-gradient(180deg, ${base}, ${base})`
        ].join(", ");
    }

    if (style.pattern === "radial") {
        const outer = withAlpha(style.colors[0] ?? "#ffffff", "30");
        const middle = withAlpha(style.colors[1] ?? "#ce1126", "48");
        const inner = withAlpha(style.colors[2] ?? style.colors[1] ?? "#ce1126", "60");

        return `radial-gradient(circle at ${page === 1 ? "72% 26%" : "28% 26%"}, ${inner} 0 14%, ${middle} 14% 30%, ${outer} 30% 100%)`;
    }

    return segmentedGradient("180deg", style.colors);
}

export function getSectionVisual(code: string, page: 1 | 2): SectionVisual {
    const style = FLAG_STYLES[code] ?? { pattern: "horizontal", colors: ["#2e5aac", "#ffffff", "#00c978"] };
    const edge = style.edge ?? withAlpha(style.colors[0] ?? "#3f62b8", "aa");

    let glowColor: string;
    if (style.glow) {
        // Use explicit glow color if defined (for polished countries)
        glowColor = style.glow;
    } else {
        // Fall back to computed glow from colors
        glowColor = withAlpha(style.colors[1] ?? style.colors[0] ?? "#0a84ff", "66");
    }

    return {
        gradient: buildGradient(code, page),
        edge,
        glow: `0 0 0 1px ${withAlpha(edge, "44")} inset, 0 0 24px ${withAlpha(glowColor, "88")}`
    };
}
