import {MultiBlocProvider} from "@/core/framework/multiBlocProvider";
import {BlocProvider} from "@/core/framework/blocProvider";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {Resolver} from "@/di/resolver";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import type {Widget} from "@/core/framework/base";

export function provideBlocProviders(child: Widget): Widget {
    return new MultiBlocProvider(
        {
            providers: [
                new BlocProvider(
                    {
                        create: () => new AuthBloc(
                            Resolver.authRepository(),
                            Resolver.preferenceService()
                        )
                    }
                ),
                new BlocProvider(
                    {
                        create: () => new ProfileBloc(
                            Resolver.userRepository()
                        )
                    }
                )
            ],
            child: child
        },
    )
}