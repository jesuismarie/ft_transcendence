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
import {ApiConstants} from "@/core/constants/apiConstants";
import {clearErrors, showError} from "@/utils/error_messages";
import {Validator} from "@/utils/validation";
import type {LoginTicketResponse} from "@/domain/entity/loginTicketResponse";


@injectable()
export class AuthBloc extends Cubit<AuthState> {
    constructor(@inject('AuthRepository') private readonly authRepository: RemoteAuthRepository,
                @inject("PreferenceService") private readonly preferenceService: PreferenceService
    ) {
        super(new AuthState({}));
    }

    validateLoginForm(email: string, password: string): boolean {
        let hasError = false;
        clearErrors();

        if (!email) {
            showError('login_email', 'Email is required.');
            hasError = true;
        } else if (!Validator.isValidEmail(email)) {
            showError('login_email', 'Invalid email format.');
            hasError = true;
        }

        if (!password) {
            showError('login_password', 'Password is required.');
            hasError = true;
        }

        return hasError;
    }

    validateRegisterForm(username: string, email: string, password: string, confirmPassword: string): boolean {

        let hasError = false;
        clearErrors();

        if (!username) {
            showError('reg_username', 'Username is required.');
            hasError = true;
        } else if (!Validator.isValidUsername(username)) {
            showError('reg_username', 'Invalid username.');
            hasError = true;
        }

        if (!email) {
            showError('reg_email', 'Email is required.');
            hasError = true;
        } else if (!Validator.isValidEmail(email)) {
            showError('reg_email', 'Invalid email address.');
            hasError = true;
        }

        if (!password) {
            showError('reg_password', 'Password is required.');
            hasError = true;
        }

        if (!confirmPassword) {
            showError('reg_confirm_password', 'Please confirm your password.');
            hasError = true;
        }

        if (!hasError && !Validator.isValidPassword(password)) {
            showError('reg_password', 'Invalid password.');
            showError('confirm_password', 'Invalid password.');
            hasError = true;
        }

        if (password !== confirmPassword) {
            showError('reg_confirm_password', 'Passwords do not match.');
            hasError = true;
        }
        return hasError;
    }

    async close(): Promise<void> {
        return super.close();
    }

    async resetState() {
        this.emit(this.state.copyWith({status: AuthStatus.Initial, errorMessage: ""}));
    }

    async register({email, username, password, confirmPassword}: {
        email: string;
        username: string;
        password: string;
        confirmPassword: string;
    }): Promise<void> {
        const hasError = this.validateRegisterForm(username,email, password, confirmPassword);
        if (!hasError) {
            const res: Either<GeneralException, UserEntity> = await this.authRepository.register({
                email,
                username,
                password
            });
            console.log(res)
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
        else {
            this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: "Failed to register."}));
        }
    }

    async login({email, password}: {
        email: string;
        password: string
    }): Promise<void> {
        this.emit(this.state.copyWith({status: AuthStatus.Loading}));
        const hasError = this.validateLoginForm(email, password);
        if (!hasError) {
            const res: Either<GeneralException, LoginTicketResponse> = await this.authRepository.login({email, password});
            res.when({
                onError: (err: any) => {

                    let errorMessage: string | undefined;
                    if (err instanceof ApiException) {
                        errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                    }
                    this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: errorMessage}));
                },
                onSuccess: (ticket) => {
                    // Hardcode for now, more graceful approach later
                    if (!ticket.requires2fa) {
                        // Claim the ticket
                        this.claimTicket(ticket.loginTicket ?? undefined).then();
                    }
                    else
                        this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: "We don't support 2FA yet."}));
                }
            });
        }
        else {
            this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: "Failed to Login."}));
        }
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

    oauth(): void {
        window.location.href = ApiConstants.auth;
    }

    async claimTicket(ticket?: string): Promise<void> {
        if (ticket) {
            const res: Either<GeneralException, UserEntity> = await this.authRepository.claim(ticket);
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
                    this.preferenceService.setRefreshToken(user.refreshToken);
                    this.emit(this.state.copyWith({status: AuthStatus.Success, user: user}));
                }
            });
        }
        else {
            this.emit(this.state.copyWith({status: AuthStatus.Error, errorMessage: "OAuth failed"}));
        }
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