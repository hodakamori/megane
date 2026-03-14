import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.03,
    },
  },
  use: {
    // Galata auto-starts JupyterLab; configure the base URL
    baseURL: "http://localhost:8888",
    launchOptions: {
      args: [
        "--use-gl=angle",
        "--use-angle=swiftshader-webgl",
      ],
    },
    video: "off",
    contextOptions: {
      permissions: [],
    },
  },
  retries: 0,
  workers: 1, // Sequential execution to avoid resource contention
  reporter: [["html", { open: "never" }]],
  webServer: {
    command:
      "jupyter lab --no-browser --port=8888 --allow-root" +
      " --ServerApp.token=''" +
      " --ServerApp.disable_check_xsrf=True" +
      ` --ServerApp.root_dir=${process.cwd()}/../../`,
    port: 8888,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
  },
});
