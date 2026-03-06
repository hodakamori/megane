import DefaultTheme from "vitepress/theme";
import MoleculeDemo from "../components/MoleculeDemo.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    app.component("MoleculeDemo", MoleculeDemo);
  },
};
