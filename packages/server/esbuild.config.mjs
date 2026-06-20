import esbuild from "esbuild";

await esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    external: ["better-sqlite3", "express"],
    loader: { ".json": "json" },
    outfile: "dist/server.js"
});

console.log("server built -> dist/server.js");
