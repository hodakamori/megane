import { defineConfig } from "vitepress";
import path from "path";

export default defineConfig({
  title: "megane",
  description: "Spectacles for atomistic data",
  base: "/megane/",
  ignoreDeadLinks: [/localhost/],

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
      { text: "Demo", link: "/demo" },
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
        text: "Getting Started",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Configuration", link: "/configuration" },
        ],
      },
      {
        text: "Pipeline",
        items: [
          { text: "Pipeline Guide", link: "/guide/pipeline" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Jupyter Widget", link: "/guide/jupyter" },
          { text: "CLI Server", link: "/guide/cli" },
          { text: "Web / React", link: "/guide/web" },
          { text: "Integrations", link: "/guide/integrations" },
        ],
      },
      {
        text: "Demo",
        items: [
          { text: "Live Demo", link: "/demo" },
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
