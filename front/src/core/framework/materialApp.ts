// material_app.ts
import {Navigator} from "./navigator";
import {BuildContext} from "@/core/framework/buildContext";
import {Widget} from "@/core/framework/widget";
import {StatelessWidget} from "@/core/framework/statelessWidget";
import {Builder} from "@/core/framework/builder";

type RouteBuilder = (context: BuildContext) => Widget;

interface MaterialAppProps {
    home: Widget;
    routes?: { [key: string]: RouteBuilder };
}

export class MaterialApp extends StatelessWidget {
    home: Widget;
    routes: { [key: string]: RouteBuilder };

    constructor(props: MaterialAppProps) {
        super();
        this.home = props.home;
        this.routes = props.routes || {};
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
            initialRoute: "/",
            routes: fullRoutes,
        });
    }
}
