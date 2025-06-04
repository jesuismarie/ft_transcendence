// import {BuildContext} from "@/core/framework/buildContext";
// import type {WidgetElement} from "@/core/framework/ElementWidget";
// import {StatefulElement, StatefulWidget} from "@/core/framework/statefulWidget";
// import type {Widget} from "@/core/framework/base";
//
//
// interface ElementCache {
//     [key: string]: StatefulElement;
// }
//
// export class ElementManager {
//     public cache: ElementCache = {};
//
//     // This will be called when you want to mount or update a widget
//    public createOrUpdate(widget: Widget, parentDom: HTMLElement, parentId?: string): WidgetElement {
//        const cacheKey = this.getCacheKey(widget.constructor.name, widget.key);
//        let element: WidgetElement;
//
//        if (widget instanceof StatefulWidget) {
//            const previous = this.cache[cacheKey];
//            element = new StatefulElement(widget, parentId, previous?.state, parentContext);
//            this.cache[cacheKey] = element as StatefulElement;
//        } else {
//            element = widget.createElement() as WidgetElement;
//            element.currentContext = new BuildContext(element, parentContext);  // <-- fix
//        }
//
//        element.mount(parentDom, element.currentContext);
//        return element;
//     }
//
//    public removeWidget(widget: Widget) {
//         const cacheKey = this.getCacheKey(widget.constructor.name, widget.key);
//         const element = this.cache[cacheKey];
//         element?.state.dispose();
//         delete this.cache[cacheKey];
//     }
//
//     public getCacheKey(typeName: string, key?: string): string {
//         return key ? `${typeName}::${key}` : typeName;
//     }
//
//     // optionally expose clear mechanism for removed widgets
//     public clearCacheForKey(type: string, key?: string) {
//         delete this.cache[this.getCacheKey(type, key)];
//     }
// }
