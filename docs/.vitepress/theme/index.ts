import DefaultTheme from "vitepress/theme";
import CustomLayout from "./CustomLayout.vue";
import MoleculeDemo from "../components/MoleculeDemo.vue";
import FullViewerDemo from "../components/FullViewerDemo.vue";
import NotebookCell from "../components/NotebookCell.vue";
import NotebookEmbed from "../components/NotebookEmbed.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }: { app: any }) {
    app.component("MoleculeDemo", MoleculeDemo);
    app.component("FullViewerDemo", FullViewerDemo);
    app.component("NotebookCell", NotebookCell);
    app.component("NotebookEmbed", NotebookEmbed);
  },
};
