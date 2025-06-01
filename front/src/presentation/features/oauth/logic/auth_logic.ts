import type {UserEntity} from "@/domain/entity/user_entity";
import {inject} from "tsyringe";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import type {GeneralException} from "@/core/exception/exception";
import {AuthState, AuthStatus} from "@/presentation/features/oauth/state/auth_state";
import type { Either } from "@/core/models/either";

export class AuthLogic {
    public state: AuthState;

    constructor(@inject('AuthRepository') private readonly authRepository: RemoteAuthRepository) {
        this.state = new AuthState({})
    }


    async resetState() {
        this.state = this.state.copyWith({status: AuthStatus.Initial, errorMessage: ""});
    }

    async register({email, username, password}: {
        email: string;
        username: string;
        password: string
    }): Promise<void> {
        const res: Either<GeneralException, UserEntity> = await this.authRepository.register({
            email,
            username,
            password
        });
        res.when({
            onError: (err: any) => {
                console.log('Error:', err)
                this.state = this.state.copyWith({status: AuthStatus.Error, errorMessage: err.message});
                // user = null;
            },
            onSuccess: (user) => {
                this.state = this.state.copyWith({status: AuthStatus.Success, user: user});
            }
        });
    }

    async login({email, password}: {
        email: string;
        password: string
    }): Promise<void> {

        const res: Either<GeneralException, UserEntity> = await this.authRepository.login({email, password});
        res.when({
            onError: (err: any) => {
                console.log('Error:', err)
                this.state = this.state.copyWith({status: AuthStatus.Error, errorMessage: err.message});
                // user = null;
            },
            onSuccess: (user) => {
                this.state = this.state.copyWith({status: AuthStatus.Success, user: user});
            }
        });
    }

    validate()  {

    }

    async logout(): Promise<void> {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentUserId");
    }
}