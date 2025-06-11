import type {UserEntity} from "@/domain/entity/user_entity";
import {inject, injectable} from "tsyringe";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import {ApiException, type GeneralException} from "@/core/exception/exception";
import {AuthState, AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import type {Either} from "@/core/models/either";
import {Cubit} from "@/core/framework/bloc/cubit";
import type {PersistenceService} from "@/core/services/persistance_service";
import {PersistenceServiceImpl} from "@/core/services/persistance_service_impl";
import {ApiConstants} from "@/core/constants/apiConstants";
import type {PreferenceService} from "@/core/services/preference_service";
import '@/core/extensions/stringExtension';
import {AddTournament} from "@/presentation/features/tournaments/view/addTournament";
import {Bindings} from "@/presentation/features/bindings";
import {jwtDecode} from "jwt-decode";


@injectable()
export class AuthBloc extends Cubit<AuthState> {

    // persistenceService: PersistenceService

    constructor(@inject('AuthRepository') private readonly authRepository: RemoteAuthRepository,
                @inject("PreferenceService") private readonly preferenceService: PreferenceService
    ) {
        const saved = localStorage.getItem("auth_state");
        let initialState: AuthState;
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                initialState = AuthState.fromJson(parsed); // тебе нужно добавить fromJson()
            } catch {
                initialState = new AuthState({});
            }
        } else {
            initialState = new AuthState({});
        }

        super(initialState);
        // this.persistenceService = new PersistenceServiceImpl(ApiConstants.websocketUrl, this);
        // this.persistenceService.init();
    }


    async close(): Promise<void> {
        // this.persistenceService.disconnect();
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

    async requestRefresh(accessToken: string): Promise<void> {
        AddTournament.isSendRequest = false;
        Bindings.isMatchRequest = false;
        this.emit(this.state.copyWith({isRefresh: true}));
        try {
            const decode = jwtDecode(accessToken);
            const sub = decode.sub;
            if (sub) {
                const userId = Number.parseInt(sub!);

                this.emit(this.state.copyWith({
                    status: AuthStatus.Success,
                    user: {accessToken: accessToken, refreshToken: '', userId: userId}
                }));
            }
            else  {
                this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: "Unknown Error"}))
            }
        }
        catch (error) {
            this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: "Unknown Error"}))
        }
        // const res: Either<GeneralException, UserEntity> = await this.authRepository.requestRefresh(accessToken);
        // res.when({
        //     onError: (err: any) => {
        //         let errorMessage: string | undefined;
        //         if (err instanceof ApiException) {
        //             errorMessage = err.message.removeBefore('body/').capitalizeFirst()
        //         }
        //         this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: errorMessage, isRefresh: false}));
        //     },
        //     onSuccess: (user) => {
        //         this.preferenceService.setToken(user.accessToken);
        //         this.preferenceService.setRefreshToken(user.refreshToken);
        //         const newState = this.state.copyWith({status: AuthStatus.Success, user: user, isRefresh: false});
        //         this.emit(newState);
        //     }
        // });
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