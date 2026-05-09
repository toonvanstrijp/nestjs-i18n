#!/usr/bin/env node
"use strict";
// Forward all CLI arguments to the real CLI entrypoint
import("../dist/cli/nestjs-i18n.js")
	.then((mod) => {
		if (typeof mod.main === 'function') {
			mod.main();
		}
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
