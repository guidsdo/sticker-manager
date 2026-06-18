import { spawn, spawnSync } from "node:child_process";

const esbuildCmd = process.platform === "win32" ? "esbuild.cmd" : "esbuild";
const buildArgs = ["src/index.ts", "--bundle", "--platform=node", "--format=esm", "--packages=external", "--outfile=dist/server.js"];

const initial = spawnSync(esbuildCmd, buildArgs, { stdio: "inherit" });
if (initial.status !== 0) {
    process.exit(initial.status ?? 1);
}

const builder = spawn(esbuildCmd, [...buildArgs, "--watch"], {
    stdio: "inherit"
});
const server = spawn(process.execPath, ["--watch", "dist/server.js"], {
    stdio: "inherit"
});

let shuttingDown = false;

function shutdown(exitCode = 0) {
    if (shuttingDown) return;
    shuttingDown = true;

    builder.kill("SIGTERM");
    server.kill("SIGTERM");

    setTimeout(() => {
        builder.kill("SIGKILL");
        server.kill("SIGKILL");
        process.exit(exitCode);
    }, 500);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

builder.on("exit", code => {
    if (!shuttingDown && code && code !== 0) {
        shutdown(code);
    }
});

server.on("exit", code => {
    if (!shuttingDown && code && code !== 0) {
        shutdown(code);
    }
});
