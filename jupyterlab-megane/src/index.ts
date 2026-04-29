import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";
import { WidgetTracker } from "@jupyterlab/apputils";
import type { IDocumentWidget } from "@jupyterlab/docregistry";
import { MeganeDocFactory } from "./factory";
import type { MeganeReactView } from "./MeganeDocWidget";
import {
  FACTORY_NAME,
  FACTORY_NAME_BINARY,
  STRUCTURE_FILETYPES_TEXT,
  STRUCTURE_FILETYPES_BINARY,
  STRUCTURE_FILETYPE_NAMES_TEXT,
  STRUCTURE_FILETYPE_NAMES_BINARY,
} from "./filetypes";

const PLUGIN_ID = "megane-jupyterlab:plugin";
const TRACKER_NAMESPACE = "megane";

const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description:
    "Open molecular structure files (PDB, GRO, XYZ, MOL, SDF, CIF, LAMMPS data, ASE traj) with megane",
  autoStart: true,
  requires: [ILayoutRestorer],
  activate: (app: JupyterFrontEnd, restorer: ILayoutRestorer) => {
    for (const ft of [...STRUCTURE_FILETYPES_TEXT, ...STRUCTURE_FILETYPES_BINARY]) {
      app.docRegistry.addFileType(ft);
    }

    const textFactory = new MeganeDocFactory({
      name: FACTORY_NAME,
      modelName: "text",
      fileTypes: STRUCTURE_FILETYPE_NAMES_TEXT,
      defaultFor: STRUCTURE_FILETYPE_NAMES_TEXT,
      readOnly: true,
    });
    app.docRegistry.addWidgetFactory(textFactory);

    const binaryFactory = new MeganeDocFactory({
      name: FACTORY_NAME_BINARY,
      modelName: "base64",
      fileTypes: STRUCTURE_FILETYPE_NAMES_BINARY,
      defaultFor: STRUCTURE_FILETYPE_NAMES_BINARY,
      readOnly: true,
    });
    app.docRegistry.addWidgetFactory(binaryFactory);

    const tracker = new WidgetTracker<IDocumentWidget<MeganeReactView>>({
      namespace: TRACKER_NAMESPACE,
    });

    for (const factory of [textFactory, binaryFactory]) {
      factory.widgetCreated.connect((_sender, widget) => {
        widget.context.pathChanged.connect(() => {
          void tracker.save(widget);
        });
        void tracker.add(widget);
      });
    }

    const binaryExtensions = new Set(
      STRUCTURE_FILETYPES_BINARY.flatMap((f) => f.extensions ?? []),
    );
    const factoryForPath = (path: string): string => {
      const dot = path.lastIndexOf(".");
      const ext = dot >= 0 ? path.slice(dot).toLowerCase() : "";
      return binaryExtensions.has(ext) ? FACTORY_NAME_BINARY : FACTORY_NAME;
    };

    void restorer.restore(tracker, {
      command: "docmanager:open",
      // Restore via the factory that originally opened the widget so binary
      // documents come back with the base64 model.
      args: (widget) => ({
        path: widget.context.path,
        factory: factoryForPath(widget.context.path),
      }),
      name: (widget) => widget.context.path,
    });
  },
};

export default plugin;
