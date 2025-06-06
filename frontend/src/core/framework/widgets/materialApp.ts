// material_app.ts
import {Navigator, type RouteBuilder, type RouteListen} from "./navigator";
import {BuildContext} from "@/core/framework/core/buildContext";
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {Builder} from "@/core/framework/widgets/builder";
import type {Widget} from "@/core/framework/core/base";
import {type Key, UniqueKey} from "@/core/framework/core/key";


interface MaterialAppProps {
    home: Widget;
    routes?: { [key: string]: RouteBuilder };
    routeListen?: RouteListen;
    key?: string;
    navigatorKey?: Key;
}

export class MaterialApp extends StatelessWidget {
    home: Widget;
    routes: { [key: string]: RouteBuilder };
    key: string;
    routeListen?: RouteListen;
    navigatorKey?: Key;

    constructor(props: MaterialAppProps) {
        super();
        this.home = props.home;
        this.routeListen = props.routeListen;
        this.routes = props.routes || {};
        this.key = props.key ?? new UniqueKey().toString()
        this.navigatorKey = props.navigatorKey
    }

    build(context: BuildContext): Widget {
        // Add default "/" route for home
        // context.logWidgetTree(context);
        const fullRoutes: { [key: string]: RouteBuilder } = {
            "/": (_) => this.home,
            ...this.routes,
        };

        // Pass initial route and route map to Navigator
        return new Navigator({
            navigatorKey: this.navigatorKey,
            routeListen: this.routeListen,
            initialRoute: "/",
            routes: fullRoutes,
        });
    }
}
