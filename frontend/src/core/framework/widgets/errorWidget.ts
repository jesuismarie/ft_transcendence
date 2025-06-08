// // ErrorWidget.ts
// import { Widget, type IWidgetElement } from "@/core/framework/core/base";
// import type {BuildContext} from "@/core/framework/core/buildContext";
// import {WidgetElement} from "@/core/framework/renderer/ElementWidget";
//
// export class ErrorWidget extends Widget {
//     error: Error | string;
//
//     constructor(error: Error | string, key?: string) {
//         super(key);
//         this.error = error;
//     }
//
//     createElement(): IWidgetElement {
//         return new ErrorWidgetElement(this);
//     }
// }
//
// class ErrorWidgetElement extends WidgetElement {
//     widget: ErrorWidget;
//
//     constructor(widget: ErrorWidget) {
//         super(widget);
//         this.widget = widget;
//     }
//
//     render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
//         const dom = document.createElement("div");
//         dom.style.backgroundColor = "#ffeeee";
//         dom.style.color = "#cc0000";
//         dom.style.padding = "12px";
//         dom.style.border = "1px solid #cc0000";
//         dom.style.fontFamily = "monospace";
//         dom.style.whiteSpace = "pre-wrap";
//         dom.style.userSelect = "text";
//
//         const message = typeof this.widget.error === "string"
//             ? this.widget.error
//             : this.widget.error.message || "Unknown error";
//
//         dom.textContent = `ErrorWidget: ${message}`;
//         return dom;
//     }
// }
