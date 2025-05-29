import type {UserEntity} from "@/domain/entity/user_entity.ts";
import {inject} from "tsyringe";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository.ts";
import type {GeneralException} from "@/core/exception/exception.ts";
import {type Either, Left} from "purify-ts/Either";
import {AuthState, AuthStatus} from "@/presentation/features/oauth/state/auth_state.ts";

export class AuthLogic {
    public state: AuthState;
    constructor(@inject('AuthRepository') private readonly authRepository: RemoteAuthRepository)  {
        this.state = new AuthState({})
    }

    async register({email, username, password}: {
        email: string;
        username: string;
        password: string
    }): Promise<void> {
        const res: Either<GeneralException, void> = await this.authRepository.register({email, username, password});
        res.caseOf({
            Left: (err: any) => {
                console.log('Error:', err)
                this.state = this.state.copyWith({status: AuthStatus.Error, errorMessage: err.message});
                // user = null;
            },
            Right: (_) => {
                this.state = this.state.copyWith({status: AuthStatus.Success});
            }
        });
    }

    async logout(): Promise<void> {
        localStorage.removeItem("currentUser");
    }
}