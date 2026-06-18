const wcBlue = "#0a84ff";
const wcGreen = "#00c978";
const wcRed = "#ff2f45";
const wcGold = "#ffc83d";

const markPattern =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'%3E%3Cg fill='none' stroke-width='8' opacity='0.26'%3E%3Ccircle cx='58' cy='62' r='34' stroke='%231f7bff'/%3E%3Ccircle cx='210' cy='70' r='42' stroke='%23d93644'/%3E%3Ccircle cx='104' cy='218' r='48' stroke='%2313b26b'/%3E%3Cpath d='M250 190a44 44 0 1 1 0 88' stroke='%23f3bf3d'/%3E%3C/g%3E%3C/svg%3E\")";

const wavePattern =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cg fill='none' stroke-linecap='round' stroke-width='4' opacity='0.2'%3E%3Cpath d='M-10 48C38 14 74 86 126 48C170 16 200 78 250 48' stroke='%231f7bff'/%3E%3Cpath d='M-10 116C38 82 74 154 126 116C170 84 200 146 250 116' stroke='%2313b26b'/%3E%3Cpath d='M-10 184C38 150 74 222 126 184C170 152 200 214 250 184' stroke='%23d93644'/%3E%3C/g%3E%3C/svg%3E\")";

const burstPattern =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Cg fill='none' stroke-width='6' opacity='0.24'%3E%3Cpath d='M-10 160L160 -10' stroke='%230a84ff'/%3E%3Cpath d='M20 190L190 20' stroke='%2300c978'/%3E%3Cpath d='M-40 120L120 -40' stroke='%23ff2f45'/%3E%3C/g%3E%3C/svg%3E\")";

export const theme = {
    bg: "#070f28",
    bgPanel: "#101f4a",
    bgPanel2: "#19326c",
    text: "#f4f7ff",
    textDim: "#afbddf",
    border: "#3f62b8",
    accent: wcGreen,
    accentDim: "#008a53",
    blue: wcBlue,
    gold: wcGold,
    danger: wcRed,
    hostBlue: wcBlue,
    hostGreen: wcGreen,
    hostRed: wcRed,
    panelGlow: "rgba(10, 132, 255, 0.38)",
    panelGlowWarm: "rgba(255, 47, 69, 0.28)",
    patternMark: markPattern,
    patternWave: wavePattern,
    patternBurst: burstPattern
};
