import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {initPongGame} from "@/game/browser";
import {type Widget} from "@/core/framework/core/base";
import {MultiBlocProvider} from "@/core/framework/bloc/multiBlocProvider";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import {PaginationType, TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import {Resolver} from "@/di/resolver";
import {MatchBloc} from "@/presentation/features/match/bloc/match_bloc";
import {Constants} from "@/core/constants/constants";

export class PongGameScreen extends StatelessWidget {
    build(context: BuildContext): Widget {
        return new MultiBlocProvider({
            providers: [
                new BlocProvider({
                    create: () => new TournamentBloc(
                        Resolver.tournamentRepository(),
                        Resolver.userRepository(),
                        Resolver.matchRepository()
                    ),
                }),
                new BlocProvider({
                    create: () => new MatchBloc(
                        Resolver.matchRepository(),
                        Resolver.tournamentRepository(),
                        Resolver.userRepository()
                    )
                })
            ],
            child: new PongGameScreenContent()
        })
    }
}

export class PongGameScreenContent extends StatelessWidget {
    didMounted(context: BuildContext) {
        super.didMounted(context);
        context.read(TournamentBloc).getAllTournaments(0, Constants.tournament_limit, PaginationType.none).then(() => {
            initPongGame(context);
        });
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
    <div class="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center">
      <h1 class="overflow-hidden text-[1rem] sm:text-[2rem] md:text-[3rem] font-bold select-none text-primary"> Score </h1>
      <div class="container bg-black border-5 border-solid border-white" id="gamecontainer"></div>
    </div>`);
    }
}