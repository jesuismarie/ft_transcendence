import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {Composite} from "@/core/framework/widgets/composite";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import type {TournamentState} from "@/presentation/features/tournaments/logic/tournamentState";
import  {FriendBloc} from "@/presentation/features/friend/logic/friendBloc";
import {FriendState} from "@/presentation/features/friend/logic/friendState";
import {FriendListItem} from "@/presentation/features/friend/view/friendListItem";

export class FriendList extends StatelessWidget {
    constructor(private parentId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);

    }

    build(context: BuildContext): Widget {
        return new BlocBuilder<FriendBloc, FriendState>({
            blocType: FriendBloc,
            buildWhen: (oldState, newState) => !oldState.equals(newState),
            builder: (context, state) => {
                const friends = state.offset == 0 ? state.results.friends.slice(0, 3) : [];
                return new Composite(friends.map((e) => new FriendListItem(e.id.toString(), e.username, e.avatarPath)), this.parentId)
            }
        });
    }

}