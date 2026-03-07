import { defineConfig } from "vitepress";
import path from "path";

export default defineConfig({
  title: "megane",
  description: "A fast, beautiful molecular viewer",
  base: "/megane/",

  head: [["link", { rel: "icon", href: "/megane/logo.png" }]],

  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../../src"),
      },
    },
  },

  themeConfig: {
    logo: "/logo.png",

    nav: [
      { text: "Guide", link: "/getting-started" },
      { text: "Examples", link: "/guide/jupyter" },
      { text: "API", link: "/api/" },
      {
        text: "Links",
        items: [
          { text: "GitHub", link: "https://github.com/hodakamori/megane" },
          { text: "PyPI", link: "https://pypi.org/project/megane/" },
          { text: "npm", link: "https://www.npmjs.com/package/megane-viewer" },
        ],
      },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Configuration", link: "/configuration" },
        ],
      },
      {
        text: "Examples",
        items: [
          { text: "Jupyter Widget", link: "/guide/jupyter" },
          { text: "CLI Server", link: "/guide/cli" },
          { text: "Web / React", link: "/guide/web" },
        ],
      },
      {
        text: "API Reference",
        items: [
          { text: "Overview", link: "/api/" },
          { text: "Python", link: "/api/python/" },
          { text: "TypeScript", link: "/api/typescript/" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/hodakamori/megane" },
    ],

    search: {
      provider: "local",
    },

    footer: {
      message: "Released under the MIT License.",
    },
  },
});
