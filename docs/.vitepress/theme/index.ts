import DefaultTheme from "vitepress/theme";
import MoleculeDemo from "../components/MoleculeDemo.vue";
import FullViewerDemo from "../components/FullViewerDemo.vue";
import JupyterLiteEmbed from "../components/JupyterLiteEmbed.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    app.component("MoleculeDemo", MoleculeDemo);
    app.component("FullViewerDemo", FullViewerDemo);
    app.component("JupyterLiteEmbed", JupyterLiteEmbed);
  },
};
