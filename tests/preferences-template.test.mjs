import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

test("settings integration installs versioned JSON and the common latest API", async () => {
	for (const name of await readdir(new URL("../template/", import.meta.url))) {
		if (!name.endsWith(".handlebars") || name.includes("rewrite")) continue;
		const template = await readFile(new URL(`../template/${name}`, import.meta.url), "utf8");
		assert.ok(template.includes("https://github.com/NSNanoCat/PreferencePanes/releases/latest/download/api.js"), name);
		assert.ok(template.includes("api\\/(?:get|set|delete)"), name);
		const line = template.split("\n").find(line => line.includes("configs") && line.includes("biliverse"));
		assert.ok(line, name);
		const pattern = name.startsWith("shadowrocket") ? line.match(/pattern=([^,]+)/)[1] : name.startsWith("stash") ? line.trim().slice("- match: ".length) : line.split(" ")[0];
		const matcher = new RegExp(pattern);
		assert.ok(matcher.test("https://biliverse.github.io/configs/Global"));
		assert.ok(matcher.test("https://biliverse.github.io/configs/Global?v=1"));
		for (const pathname of ["/api/Global/", "/settings/", "/settings/Global", "/configs/Unknown", "/settings/assets/Global.boxjs.json", "/settings/assets/Global.config.js"]) assert.equal(matcher.test(`https://biliverse.github.io${pathname}`), false, name);
		assert.doesNotMatch(template, /biliverse\.github\.io\/settings\/assets\//);
		const development = name.includes(".dev.");
		const source = development ? "https://gist.githubusercontent.com/VirgilClyne/6b5c5164cc46cc9ac47f30b9824ec9b3/raw/" : "https://github.com/Biliverse/Global/releases/download/v{{@package 'version'}}/";
		const file = /^(surge|loon)/.test(name) ? `BiliBili.Global${development ? ".dev" : ""}.boxjs.json` : `config${development ? ".dev" : ""}.bundle.js`;
		assert.ok(template.includes(source + file), name);
	}
});
