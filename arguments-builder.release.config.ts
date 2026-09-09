import { defineConfig } from "@iringo/arguments-builder";
import { args, output } from "./arguments-builder.full.config";

export default defineConfig({ output: { ...output, boxjsSettings: { ...output.boxjsSettings, path: "./dist/BiliBili.Global.boxjs.json" } }, args });
