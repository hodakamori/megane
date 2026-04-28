import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";
import { WidgetTracker } from "@jupyterlab/apputils";
import type { IDocumentWidget } from "@jupyterlab/docregistry";
import { MeganeDocFactory } from "./factory";
import type { MeganeReactView } from "./MeganeDocWidget";
import { FACTORY_NAME, STRUCTURE_FILETYPES, STRUCTURE_FILETYPE_NAMES } from "./filetypes";

const PLUGIN_ID = "megane-jupyterlab:plugin";
const TRACKER_NAMESPACE = "megane";

const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description: "Open molecular structure files (PDB, GRO, XYZ, MOL, SDF, CIF) with megane",
  autoStart: true,
  requires: [ILayoutRestorer],
  activate: (app: JupyterFrontEnd, restorer: ILayoutRestorer) => {
    for (const ft of STRUCTURE_FILETYPES) {
      app.docRegistry.addFileType(ft);
    }

    const factory = new MeganeDocFactory({
      name: FACTORY_NAME,
      modelName: "text",
      fileTypes: STRUCTURE_FILETYPE_NAMES,
      defaultFor: STRUCTURE_FILETYPE_NAMES,
      readOnly: true,
    });
    app.docRegistry.addWidgetFactory(factory);

    const tracker = new WidgetTracker<IDocumentWidget<MeganeReactView>>({
      namespace: TRACKER_NAMESPACE,
    });

    factory.widgetCreated.connect((_sender, widget) => {
      widget.context.pathChanged.connect(() => {
        void tracker.save(widget);
      });
      void tracker.add(widget);
    });

    void restorer.restore(tracker, {
      command: "docmanager:open",
      args: (widget) => ({ path: widget.context.path, factory: FACTORY_NAME }),
      name: (widget) => widget.context.path,
    });
  },
};

export default plugin;
