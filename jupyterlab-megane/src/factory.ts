import { ABCWidgetFactory, DocumentWidget } from "@jupyterlab/docregistry";
import type { DocumentRegistry, IDocumentWidget } from "@jupyterlab/docregistry";
import type { Contents } from "@jupyterlab/services";
import { MeganeReactView } from "./MeganeDocWidget";
import { MeganePipelineReactView } from "./MeganePipelineDocWidget";

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

export class MeganePipelineDocFactory extends ABCWidgetFactory<
  IDocumentWidget<MeganePipelineReactView>,
  DocumentRegistry.IModel
> {
  constructor(
    options: DocumentRegistry.IWidgetFactoryOptions<
      IDocumentWidget<MeganePipelineReactView>
    >,
    private readonly contents: Contents.IManager,
  ) {
    super(options);
  }

  protected createNewWidget(
    context: DocumentRegistry.Context,
  ): IDocumentWidget<MeganePipelineReactView> {
    const content = new MeganePipelineReactView(context, this.contents);
    const widget = new DocumentWidget({ content, context });
    widget.title.iconClass = "jp-MaterialIcon jp-FileIcon";
    return widget;
  }
}
