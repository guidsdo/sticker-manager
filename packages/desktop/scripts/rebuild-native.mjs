import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const electronRange = packageJson.dependencies?.electron ?? packageJson.devDependencies?.electron ?? "";
const electronVersion = String(electronRange).replace(/^[^0-9]*/, "");

if (!electronVersion) {
    throw new Error("Missing electron dependency version in packages/desktop/package.json");
}

const result = spawnSync(
    process.platform === "win32" ? "pnpm.cmd" : "pnpm",
    ["exec", "electron-rebuild", "-f", "-w", "better-sqlite3", "-v", electronVersion],
    { stdio: "inherit" }
);

if (result.status !== 0) {
    process.exit(result.status ?? 1);
}
