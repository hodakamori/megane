import { ABCWidgetFactory, DocumentWidget } from "@jupyterlab/docregistry";
import type { DocumentRegistry, IDocumentWidget } from "@jupyterlab/docregistry";
import { MeganeReactView } from "./MeganeDocWidget";

export class MeganeDocFactory extends ABCWidgetFactory<
  IDocumentWidget<MeganeReactView>,
  DocumentRegistry.IModel
> {
  protected createNewWidget(
    context: DocumentRegistry.Context,
  ): IDocumentWidget<MeganeReactView> {
    const content = new MeganeReactView(context);
    const widget = new DocumentWidget({ content, context });
    widget.title.iconClass = "jp-MaterialIcon jp-FileIcon";
    return widget;
  }
}
