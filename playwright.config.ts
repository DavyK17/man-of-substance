import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	webServer: {
		command: "npm run preview",
		port: 8788
	},
	testDir: "e2e",
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
