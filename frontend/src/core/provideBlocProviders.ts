import {MultiBlocProvider} from "@/core/framework/bloc/multiBlocProvider";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {Resolver} from "@/di/resolver";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import type {Widget} from "@/core/framework/core/base";
import {FriendBloc} from "@/presentation/features/friend/logic/friendBloc";
import {SearchBloc} from "@/presentation/features/search/logic/searchBloc";
import {ModalsBloc} from "@/presentation/features/modals/bloc/modalsBloc";

export function provideBlocProviders(child: Widget): Widget {
    return new MultiBlocProvider(
        {
            providers: [
                new BlocProvider(
                    {
                        create: () => {
                           return  new AuthBloc(
                                Resolver.authRepository(),
                                Resolver.preferenceService()
                            )
                        }
                    }
                ),
                new BlocProvider(
                    {
                        create: () => new ProfileBloc(
                            Resolver.userRepository()
                        )
                    }
                ),
                new BlocProvider({
                    create: () => new ModalsBloc()
                }),
             new BlocProvider(
                {
                    create: () => new FriendBloc(
                        Resolver.friendRepository()
                    ),
                }
            )
                // new BlocProvider(
                //     {
                //         create: () => new FriendBloc(Resolver.friendRepository()),
                //     },),
                // new BlocProvider(
                //     {
                //         create: () => new SearchBloc(Resolver.userRepository()),
                //     },)
            ],
            child: child
        },
    )
}