import esbuild from "esbuild";

await esbuild.build({
    entryPoints: ["src/main.ts", "src/preload.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    external: ["electron", "better-sqlite3", "express"],
    outdir: "dist"
});

console.log("desktop built -> dist/");
