import type {UserEntity} from "@/domain/entity/user_entity";
import {inject, injectable} from "tsyringe";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import {ApiException, type GeneralException} from "@/core/exception/exception";
import {AuthState, AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import type {Either} from "@/core/models/either";
import {Cubit} from "@/core/framework/bloc/cubit";
import type {PreferenceService} from "@/core/services/preference_service";
import '@/core/extensions/stringExtension';
import {AddTournament} from "@/presentation/features/tournaments/view/addTournament";
import {Bindings} from "@/presentation/features/bindings";
import {jwtDecode} from "jwt-decode";


@injectable()
export class AuthBloc extends Cubit<AuthState> {
    constructor(@inject('AuthRepository') private readonly authRepository: RemoteAuthRepository,
                @inject("PreferenceService") private readonly preferenceService: PreferenceService
    ) {
        super(new AuthState({}));
    }


    async close(): Promise<void> {
        return super.close();
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
        console.log(res)
        res.when({
            onError:  (err: any) => {
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

                let errorMessage: string | undefined;
                if (err instanceof ApiException) {
                    errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                }
                this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: errorMessage}));
            },
            onSuccess: (user) => {
                this.preferenceService.setToken(user.accessToken);
                this.preferenceService.setRefreshToken(user.refreshToken);
                this.emit(this.state.copyWith({status: AuthStatus.Success, user: user}));
            }
        });
    }

    async requestRefresh(accessToken: string, refreshToken: string): Promise<void> {
        AddTournament.isSendRequest = false;
        Bindings.isMatchRequest = false;
        console.log("REFRESSSSHHHh")
        this.emit(this.state.copyWith({isRefresh: true}));
        try {
            const decode = jwtDecode(accessToken);
            const sub = decode.sub;
            const exp = decode.exp;
            if (exp) {
                const now = Math.floor(Date.now() / 1000);
                if (exp < now) {
                    console.log("EXPIREDDDD")
                    const res: Either<GeneralException, UserEntity> = await this.authRepository.requestRefresh(refreshToken);
                     res.when({
                        onError:  (err: any) => {
                            this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: err.message}));
                            // await this.logout();
                        },
                        onSuccess:  (user) => {
                            this.preferenceService.setToken(user.accessToken);
                            this.preferenceService.setToken(user.refreshToken);
                            this.emit(this.state.copyWith({user: user, status: AuthStatus.Success}));
                        }
                    })
                }
            }
            else {
                if (sub) {
                    const userId = Number.parseInt(sub!);
                    console.log(`USERIDDD:::: ${userId}`)
                    this.emit(this.state.copyWith({
                        status: AuthStatus.Success,
                        user: {accessToken: accessToken, refreshToken: '', userId: userId}
                    }));
                } else {
                    this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: "Unknown Error"}));
                    // await this.logout();
                }
            }
        }
        catch (error) {
            console.log(`ERRRR:::: ${error}`)
            this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: "Unknown Error"}))
            // await this.logout();
        }
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
        throw Error("HHHHH")
    }

    async fullResetState(): Promise<void> {
        this.emit(new AuthState({}))
    }

    async logout(): Promise<void> {
        this.preferenceService.unsetToken();
        this.preferenceService.unsetRefreshToken();
        localStorage.clear()
        window.location.reload();
    }
}