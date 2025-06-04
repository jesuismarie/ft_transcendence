import {StatelessWidget} from "@/core/framework/statelessWidget";
import  {type BuildContext} from "@/core/framework/buildContext";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import {showModal} from "@/utils/modal_utils";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import type {Widget} from "@/core/framework/base";
import {State, StatefulWidget} from "@/core/framework/statefulWidget";
import {WidgetBinding} from "@/core/framework/widgetBinding";
import {Navigator} from "@/core/framework/navigator";

export class NavigationMenu extends StatefulWidget {
    constructor(public parentId?: string) {
        super();
    }

    createState(): State<NavigationMenu> {
        return new NavigationMenuState();
    }

}

export class NavigationMenuState extends State<NavigationMenu> {

    initState(context: BuildContext) {
        super.initState(context);
        WidgetBinding.getInstance().postFrameCallback(()=>{
            const btn = document.getElementById('search-modal-btn');
            const logoutBtn = document.getElementById('logout-btn');
            btn?.addEventListener('click', () => {
                showModal('search-users-modal')
            })
            logoutBtn?.addEventListener('click', async () => {
                const authBloc = context.read(AuthBloc)
                authBloc.logout();
                Navigator.of(context).pushNamed('/')
            })
        })

    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
		<nav class="flex items-center space-x-2">
			<button id="search-modal-btn" class="flex items-center gap-2 h-[40px] px-4 rounded-full hover:bg-hover transition">
				<span class="text-sm font-medium">Search</span>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5">
					<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
				</svg>
			</button>
			<button id="logout-btn" class="flex items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-hover transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
                </svg>
		    </button>
		</nav>
	`, this.widget.parentId);
    }

}