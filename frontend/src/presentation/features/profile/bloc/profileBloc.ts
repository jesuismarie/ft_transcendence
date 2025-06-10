import {inject, injectable} from "tsyringe";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {BlocBase} from "@/core/framework/bloc/blocBase";
import {fileToBase64, ProfileState, ProfileStatus} from "@/presentation/features/profile/bloc/profileState";
import {readImageFile, validateImageFile} from "@/profile/avatar";
import {showError} from "@/utils/error_messages";
import {Validator} from "@/utils/validation";
import type {ProfileValueObject} from "@/domain/value_objects/profile_value_object";
import {AxiosError} from "axios";
import {ApiException} from "@/core/exception/exception";
import {Cubit} from "@/core/framework/bloc/cubit";
import {AuthState} from "@/presentation/features/auth/logic/auth_state";


@injectable()
export class ProfileBloc extends Cubit<ProfileState> {

    constructor(@inject('UserRepository') private userRemoteRepository: UserRemoteRepository) {
        const saved = localStorage.getItem("profile_state");
        let initialState: ProfileState;
        console.log(`PROFILE BLOCCCC ${saved}`)
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                initialState = ProfileState.fromJson(parsed); // тебе нужно добавить fromJson()
            } catch {
                initialState = new ProfileState({});
            }
        } else {
            initialState = new ProfileState({});
        }

        super(initialState);
    }

    async selectAvatar(file: File): Promise<void> {
        const validate = validateImageFile(file);
        const imageDataUrl = await readImageFile(file);
        const base64 = await fileToBase64(file);

        this.emit(this.state.copyWith({
            selectedAvatar: file,
            selectedAvatarUrl: imageDataUrl?.toString(),
            selectedAvatarBase64: base64,
            isValid: !validate || validate.length === 0,
            errorMessage: validate?.toString(),
        }));
    }


    async uploadAvatar(): Promise<void> {
        console.log(`AAA::: ${this.state.profile?.id} ${this.state.selectedAvatar} ${this.state.isValid}`)
        if (this.state.profile?.id && this.state.selectedAvatar && this.state.isValid) {
            this.emit(this.state.copyWith({status: ProfileStatus.Loading}))
            const formData = new FormData();
            formData.append("avatar", this.state.selectedAvatar);
            const res = await this.userRemoteRepository.updateAvatar(this.state.profile.id, formData);
            res.when({
                onError: (error) => {
                    let errorMsg: string | null;
                    if (error instanceof ApiException) {
                        errorMsg = error.message;
                    } else {
                        errorMsg = error?.toString()
                    }
                    this.emit(this.state.copyWith({status: ProfileStatus.Error, errorMessage: errorMsg}));
                }, onSuccess: (data) => {

                    this.emit(this.state.copyWith({status: ProfileStatus.Uploaded, errorMessage: undefined}));
                }
            })
        }
    }

    async getUserProfile(id: string): Promise<void> {
        this.emit(this.state.copyWith({status: ProfileStatus.Loading}))
        const res = await this.userRemoteRepository.getProfile(id);
        res.when({
            onError: (error) => {
                let errorMsg: string | null;
                if (error instanceof ApiException) {
                    errorMsg = error.message;
                } else {
                    errorMsg = error?.toString()
                }
                this.emit(this.state.copyWith({errorMessage: errorMsg, status: ProfileStatus.Error}));
            },
            onSuccess: (user) => {
                // if (isOtherProfile) {
                //     this.emit(this.state.copyWith({status: ProfileStatus.Success, otherProfile: user}));
                // }

                const newSTate = this.state.copyWith({status: ProfileStatus.Success, profile: user});
                // else {
                    this.emit(newSTate);
                // }
            }
        })
    }

    async resetStatus(): Promise<void> {
        this.emit(this.state.copyWith({status: ProfileStatus.Initial, errorMessage: '', isValid: true}))
    }

    async resetState(): Promise<void> {
        this.emit(new ProfileState({}))
    }



    async onSaveProfile({username, email, password, newPassword, confirmPassword}: ProfileValueObject) {
        if (!this.validateForm({username, email, password, newPassword, confirmPassword})) {
            this.emit(this.state.copyWith({isValid: false}));
        } else if (!this.state.profile?.id) {
            alert(this.state.profile?.id)
            this.emit(this.state.copyWith({
                status: ProfileStatus.Error,
                errorMessage: 'User is not Authenticated',
                isValid: false
            }))
        } else {
            const currentUser = this.state.profile;
            console.log(`CURENUSERRR ${currentUser}`)
            if (currentUser && username !== currentUser.username || email !== currentUser.email && password != newPassword) {
                this.emit(this.state.copyWith({status: ProfileStatus.Loading, errorMessage: undefined}));
                const res = await this.userRemoteRepository.updateProfile(this.state.profile?.id, username, email);
                await res.when({
                    onError: async (e) => {
                        let errorMsg: string | null;
                        if (e instanceof AxiosError) {
                            errorMsg = e.message;
                        } else {
                            errorMsg = e?.toString()
                        }
                        this.emit(this.state.copyWith({status: ProfileStatus.Error, errorMessage: errorMsg}));
                    }, onSuccess: async () => {


                        const res = await this.userRemoteRepository.updatePassword(this.state.profile!.id, password, newPassword);
                        res.when({
                            onError: (e) => {
                                let errorMsg: string | null;
                                if (e instanceof ApiException) {
                                    errorMsg = e.message;
                                } else {
                                    errorMsg = e?.toString()
                                }
                                this.emit(this.state.copyWith({status: ProfileStatus.Error, errorMessage: errorMsg}));
                            }, onSuccess: () => {
                                this.emit(this.state.copyWith({
                                    status: ProfileStatus.Success,
                                    errorMessage: undefined
                                }));
                            }
                        })
                    }
                });
                await this.getUserProfile(currentUser.id.toString());
            }
        }
    }


    validateForm({username, email, password, newPassword, confirmPassword}: ProfileValueObject): boolean {

        let hasError = false;

        if (!username) {
            showError("edit_username", "Username is required.");
            hasError = true;
        }

        if (!email) {
            showError("edit_email", "Email is required.");
            hasError = true;
        } else if (!Validator.isValidEmail(email)) {
            showError("edit_email", "Invalid email.");
            hasError = true;
        }

        if (password && !newPassword) {
            showError("new_password", "New password is required.");
            hasError = true;
            alert(`1 ${hasError}`)
        } else if (!password && newPassword) {
            showError("old_password", "Old password is required.");
            hasError = true;
        } else if (password && password === newPassword) {
            showError("new_password", "New password can't be the same as old password.");
            hasError = true;
        } else if (newPassword || confirmPassword) {
            if (!Validator.isValidPassword(newPassword)) {
                showError("new_password", "Password must be at least 8 characters, include a capital letter and a symbol.");
                hasError = true;
            }
            if (newPassword !== confirmPassword) {
                showError("confirm_password", "Passwords do not match.");
                hasError = true;
            }
        }

        return !hasError;
    }
}