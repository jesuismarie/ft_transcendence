import type {UserEntity} from "@/domain/entity/user_entity";
import {inject, injectable} from "tsyringe";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import {ApiException, type GeneralException} from "@/core/exception/exception";
import {AuthState, AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import type {Either} from "@/core/models/either";
import {BlocBase} from "@/core/framework/bloc/blocBase";
import {Cubit} from "@/core/framework/bloc/cubit";
import type {PersistenceService} from "@/core/services/persistance_service";
import {PersistenceServiceImpl} from "@/core/services/persistance_service_impl";
import {ApiConstants} from "@/core/constants/apiConstants";
import {ProfileStatus} from "@/presentation/features/profile/bloc/profileState";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import type {PreferenceService} from "@/core/services/preference_service";
import '@/core/extensions/stringExtension';


@injectable()
export class AuthBloc extends Cubit<AuthState> {

    persistenceService: PersistenceService

    constructor(@inject('AuthRepository') private readonly authRepository: RemoteAuthRepository,
                @inject("PreferenceService") private readonly preferenceService: PreferenceService
    ) {
        super(new AuthState({}))
        this.persistenceService = new PersistenceServiceImpl(ApiConstants.websocketUrl, this);
        // this.persistenceService.init();
    }


    async resetState() {
        this.emit(this.state.copyWith({status: AuthStatus.Initial, errorMessage: ""}));
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
                let errorMessage: string | undefined;
                if (err instanceof ApiException) {
                    errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                }
                console.log('Error:', err)
                this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: errorMessage}));
                // user = null;
            },
            onSuccess: (user) => {
                this.preferenceService.setToken(user.accessToken);
                this.preferenceService.setRefreshToken(user.refreshToken);
                this.emit(this.state.copyWith({status: AuthStatus.Success, user: user}));
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
                let errorMessage: string | undefined;
                if (err instanceof ApiException) {
                    errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                }
                this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: errorMessage}));
                // user = null;
            },
            onSuccess: (user) => {
                this.preferenceService.setToken(user.accessToken);
                this.preferenceService.setRefreshToken(user.refreshToken);
                this.emit(this.state.copyWith({status: AuthStatus.Success, user: user}));
            }
        });
    }

    async requestRefresh(accessToken: string): Promise<void> {
        const res: Either<GeneralException, UserEntity> = await this.authRepository.requestRefresh(accessToken);
        res.when({
            onError: (err: any) => {
                console.log('Error:', err)
                let errorMessage: string | undefined;
                if (err instanceof ApiException) {
                    errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                }
                this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: errorMessage}));
                // user = null;
            },
            onSuccess: (user) => {
                console.log(`USERRR:::: ${user.userId}`)
                this.preferenceService.setToken(user.accessToken);
                this.preferenceService.setRefreshToken(user.refreshToken);
                this.emit(this.state.copyWith({status: AuthStatus.Success, user: user}));
            }
        });
    }

    async loginWithGoogle(): Promise<void> {

        const res: Either<GeneralException, UserEntity> = await this.authRepository.loginWithGoogle();
        res.when({
            onError: (err: any) => {
                console.log('Error:', err)
                let errorMessage: string | undefined;
                if (err instanceof ApiException) {
                    errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                }
                this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: errorMessage}));
                // user = null;
            },
            onSuccess: (user) => {
                this.preferenceService.setToken(user.accessToken);
                this.emit(this.state.copyWith({status: AuthStatus.Success, user: user}));
            }
        });
    }

    // async getUserProfile(id: string): Promise<void> {
    //     const res = await this.userRemoteRepository.getProfile(id);
    //     res.when({
    //         onError: (error) => {
    //             this.emit(this.state.copyWith({errorMessage: error.message, status: ProfileStatus.Error}));
    //         },
    //         onSuccess: (user) => {
    //             this.emit(this.state.copyWith({status: ProfileStatus.Success, profile: user}));
    //         }
    //     })
    // }

    validate() {

    }

    async logout(): Promise<void> {
        this.preferenceService.unsetToken();
        this.preferenceService.unsetRefreshToken();
    }
}