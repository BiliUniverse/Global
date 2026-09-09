import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { configAsset } from "../rollup.config.mjs";

test("both release channels compile configuration responses from their own JSON artifact", async () => {
	const root = await mkdtemp(path.join(tmpdir(), "global-artifacts-"));
	const original = process.cwd();
	try {
		await mkdir(path.join(root, "dist"));
		process.chdir(root);
		for (const suffix of ["", ".dev"]) {
			const json = [{ id: "@Root.Module.Settings.flag", name: suffix || "release", type: "boolean", val: true }];
			await writeFile(`dist/BiliBili.Global${suffix}.boxjs.json`, JSON.stringify(json));
			const files = new Map();
			await configAsset(suffix).generateBundle.call({ emitFile: ({ fileName, source }) => files.set(fileName, source) });
			assert.deepEqual([...files.keys()], [`config${suffix}.bundle.js`]);
			const response = await new Promise(resolve =>
				vm.runInNewContext(files.get(`config${suffix}.bundle.js`), {
					$environment: { "surge-version": "test" },
					$script: { startTime: Date.now() / 1000 },
					$request: { url: "https://biliverse.github.io/configs/Module", method: "GET" },
					$done: result => resolve(result.response),
					console: { log() {}, error() {} },
				}),
			);
			assert.equal(response.status, 200);
			assert.deepEqual(JSON.parse(response.body), json);
		}
	} finally {
		process.chdir(original);
		await rm(root, { recursive: true, force: true });
	}
});
