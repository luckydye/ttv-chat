import { defineConfig } from "vite";
import pkg from "./package.json";

declare module process {
	const NODE_ENV: "production" | "development";
}

// https://vitejs.dev/config/
export default defineConfig({
	publicDir: "static",
	mode: process.NODE_ENV,
	define: {
		__APP_VERSION__: `"${pkg.version.toString()}"`,
		__IS_DEBUG__: process.NODE_ENV === "production" ? "false" : "true",
	},
	server: {},
	build: {
		outDir: "../../dist",
		target: "es2018",
	},
	base: "./",
});
