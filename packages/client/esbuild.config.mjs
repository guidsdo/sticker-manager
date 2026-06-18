import esbuild from "esbuild";
import fs from "node:fs";

const watch = process.argv.includes("--watch");

fs.mkdirSync("dist/public", { recursive: true });
fs.copyFileSync("public/index.html", "dist/public/index.html");

const ctx = await esbuild.context({
    entryPoints: ["src/main.tsx"],
    bundle: true,
    outfile: "dist/public/bundle.js",
    format: "esm",
    target: ["es2020"],
    sourcemap: true,
    minify: !watch,
    loader: { ".json": "json" },
    define: { "process.env.NODE_ENV": watch ? '"development"' : '"production"' }
});

if (watch) {
    await ctx.watch();
    console.log("esbuild watching client...");
} else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log("client built -> dist/public/bundle.js");
}
