import type { Widget } from "@/core/framework/widget";
import { State, StatefulWidget } from "@/core/framework/statefulWidget";
import { BuildContext } from "@/core/framework/buildContext";

export type RouteBuilder = (context: BuildContext) => Widget;

export interface NavigatorProps {
    initialRoute: string;
    routes: { [key: string]: RouteBuilder };
}

export class Navigator extends StatefulWidget {
    routes: { [key: string]: RouteBuilder };
    initialRoute: string;

    constructor(props: NavigatorProps) {
        super();
        this.routes = props.routes;
        this.initialRoute = props.initialRoute;
    }

    createState(): State<Navigator> {
        return new NavigatorState();
    }
}

export class NavigatorState extends State<Navigator> {
    private stack: Widget[] = [];

    initState(context: BuildContext): void {
        super.initState(context);
        const initialWidget = this.widget.routes[this.widget.initialRoute]?.(context);
        if (!initialWidget) {
            throw new Error(`Route "${this.widget.initialRoute}" not found.`);
        }
        this.stack.push(initialWidget);
    }

    pushNamed(context: BuildContext, routeName: string) {
        const routeBuilder = this.widget.routes[routeName];
        if (!routeBuilder) {
            throw new Error(`Route "${routeName}" not found.`);
        }
        window.history.pushState(undefined, routeName, routeName)
        this.stack.push(routeBuilder(context));
        this.setState(() => {});
    }

    pop(context: BuildContext): void {
        window.history.back()
        if (this.stack.length > 1) {
            this.stack.pop();
            this.setState(() => {});
        }
    }

    build(context: BuildContext): Widget {
        context.logWidgetTree(context)
        return this.stack[this.stack.length - 1];
    }
}
