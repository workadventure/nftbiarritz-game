import 'dotenv/config';
import { defineConfig } from "vite";
import { getMaps, getMapsOptimizers, getMapsScripts, LogLevel, OptimizeOptions } from "wa-map-optimizer-vite";

const maps = getMaps();

let optimizerOptions: OptimizeOptions = {
    logs: process.env.LOG_LEVEL && process.env.LOG_LEVEL in LogLevel ? LogLevel[process.env.LOG_LEVEL] : LogLevel.NORMAL,
};

if (process.env.TILESET_OPTIMIZATION && process.env.TILESET_OPTIMIZATION === "true") {
    const qualityMin = process.env.TILESET_OPTIMIZATION_QUALITY_MIN ? parseInt(process.env.TILESET_OPTIMIZATION_QUALITY_MIN) : 0.9;
    const qualityMax = process.env.TILESET_OPTIMIZATION_QUALITY_MAX ? parseInt(process.env.TILESET_OPTIMIZATION_QUALITY_MAX) : 1;

    optimizerOptions.output = {
        tileset: {
            compress: {
                quality: [qualityMin, qualityMax],
            }
        }
    }
}

export default defineConfig({
    base: "./",
    build: {
        rollupOptions: {
            input: {
                discussion_index: "./index.html",
                discussion_info1: "./views/info1/discussion.html",
                discussion_info2: "./views/info2/discussion.html",
                discussion_treasureenigma: "./views/treasureEnigma/discussion.html",
                modal_treasurenigma: "./views/treasureEnigma/modal.html",
                discussion_surfenigma: "./views/surfEnigma/discussion.html",
                vwaveenigma: "./views/waveEnigma/discussion.html",
                discussion_start: "./views/start/discussion.html",
                inventory: "./views/inventory/inventory.html",
                discussion_noboard: "./views/noBoard/discussion.html",
                modal_waveenigma: "./views/waveEnigma/modal.html",
                discussion_quit: "./views/quit/discussion.html",
                ...getMapsScripts(maps),
            },
        },
    },
    plugins: [...getMapsOptimizers(maps, optimizerOptions)],
    server: {
        host: "localhost",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
            "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        open: "/",
    },
});
