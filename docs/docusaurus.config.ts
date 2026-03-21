import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: Config = {
  title: "megane",
  tagline: "Spectacles for atomistic data",
  favicon: "logo.png",
  url: "https://hodakamori.github.io",
  baseUrl: "/megane/",
  organizationName: "hodakamori",
  projectName: "megane",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  staticDirectories: ["public"],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "megane",
      logo: {
        alt: "megane",
        src: "logo.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Guide",
        },
        { to: "/gallery", label: "Gallery", position: "left" },
        { to: "/demo", label: "Demo", position: "left" },
        {
          type: "docSidebar",
          sidebarId: "apiSidebar",
          position: "left",
          label: "API",
        },
        {
          href: "https://github.com/hodakamori/megane",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://pypi.org/project/megane/",
          label: "PyPI",
          position: "right",
        },
        {
          href: "https://www.npmjs.com/package/megane-viewer",
          label: "npm",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: "Released under the MIT License.",
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    function customWebpack() {
      return {
        name: "custom-webpack",
        configureWebpack() {
          return {
            resolve: {
              alias: {
                "@": path.resolve(__dirname, "../src"),
              },
            },
          };
        },
      };
    },
  ],
};

export default config;
