// material_app.ts
import {Navigator} from "./navigator";
import {BuildContext} from "@/core/rendering-engine/buildContext";
import {Widget} from "@/core/rendering-engine/widget";
import {StatelessWidget} from "@/core/rendering-engine/statelessWidget";
import {Builder} from "@/core/rendering-engine/builder";

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
