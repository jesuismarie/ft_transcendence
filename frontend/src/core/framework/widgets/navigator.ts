import {State, StatefulElement, StatefulWidget} from "@/core/framework/widgets/statefulWidget";
import { BuildContext } from "@/core/framework/core/buildContext";
import  {type Widget} from "@/core/framework/core/base";
import {GlobalKey, type Key, UniqueKey} from "@/core/framework/core/key";
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {WidgetElement} from "@/core/framework/renderer/ElementWidget";

export type RouteBuilder = (context: BuildContext, params?: Record<string, string>) => Widget;

export type RouteListen = (context: BuildContext, url: string) => void

export interface NavigatorProps {
    initialRoute: string;
    key?: string;
    routes: { [key: string]: RouteBuilder };
    routeListen?: RouteListen;
    navigatorKey?: Key;
}


export class Navigator extends StatefulWidget {
    routes: { [key: string]: RouteBuilder };
    initialRoute: string;
    navigatorKey?: Key;
    routeListen?: RouteListen;

    constructor(props: NavigatorProps) {
        super();
        this.routes = props.routes;
        this.routeListen = props.routeListen;
        this.key = props.key ?? new UniqueKey().toString();
        this.initialRoute = props.initialRoute;
        this.navigatorKey = props.navigatorKey;
    }

    static of<T>(context: BuildContext): NavigatorState {
        let current: WidgetElement | undefined = context.element;

        while (current) {
            if (current instanceof StatefulElement && current.state instanceof NavigatorState) {
                return current.state;
            }
            current = current.parent;
        }

        throw new Error("Navigator not found in widget tree.");
    }

    createState(): State<Navigator> {
        return new NavigatorState();
    }
}

export class NavigatorState extends State<Navigator> {
    private stack: Widget[] = [];
    private _currentContext?: BuildContext;
    private _currentRouteName?: string;
    private _previousRouteName?: string;

    private matchRoute(routeName: string): [RouteBuilder, Record<string, string>] | null {
        for (const path in this.widget.routes) {
            const pathParts = path.split("/");
            const routeParts = routeName.split("/");

            if (pathParts.length !== routeParts.length) continue;

            const params: Record<string, string> = {};
            let matched = true;

            for (let i = 0; i < pathParts.length; i++) {
                const pathPart = pathParts[i];
                const routePart = routeParts[i];

                if (pathPart.startsWith(":")) {
                    params[pathPart.slice(1)] = routePart;
                } else if (pathPart !== routePart) {
                    matched = false;
                    break;
                }
            }

            if (matched) {
                return [this.widget.routes[path]!, params];
            }
        }

        return null;
    }

    initState(context: BuildContext): void {
        super.initState(context);
        if (this.widget.navigatorKey && this.widget.navigatorKey instanceof GlobalKey) {
            this.widget.navigatorKey.setCurrentContext(context)
        }
        this._currentContext = context;
        this._currentRouteName = this.widget.initialRoute;

        window.addEventListener('locationchange', () => {
            if (this.widget.routeListen) {
                this.widget.routeListen(context, window.location.href);
            }
        });

        const match = this.matchRoute(this.widget.initialRoute);
        if (!match) {
            throw new Error(`Initial route "${this.widget.initialRoute}" not found.`);
        }

        const [builder, params] = match;
        this.stack.push(builder(context, params));
    }

    get currentContext(): BuildContext {
        if (!this._currentContext) {
            throw new Error(`No any Navigator in current Context`);
        }
        return this._currentContext;
    }

    pushNamed(routeName: string) {
        const match = this.matchRoute(routeName);
        if (!match) {
            throw new Error(`Route "${routeName}" not found.`);
        }

        const [builder, params] = match;
        this._previousRouteName = this._currentRouteName;
        window.history.pushState(undefined, routeName, routeName);
        this.stack.push(builder(this.currentContext, params));
        this._currentRouteName = routeName;
        this.setState(() => {});
    }

    pop(): void {
        console.log("AAAAA")
        window.history.back()
        if (this.stack.length > 1) {
            this.stack.pop();
            this.setState(() => {});
        }
    }
    replace(routeName: string): void {
        const match = this.matchRoute(routeName);
        if (!match) {
            throw new Error(`Route "${routeName}" not found.`);
        }
        this._previousRouteName = routeName;
        const [builder, params] = match;
        window.history.replaceState('', routeName, routeName);
        window.location.href = routeName;
        this._currentRouteName = routeName;
        this.stack = [builder(this.currentContext, params)];
        this.setState(() => {});
    }

    build(context: BuildContext): Widget {
        context.logWidgetTree(context)
        console.log("NAVIGATOR BUILTTTT")

        return this.stack[this.stack.length - 1];
    }
}
