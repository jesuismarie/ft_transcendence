import {inject, injectable} from "tsyringe";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {ProfileState, ProfileStatus} from "@/presentation/features/profile/bloc/profileState";
import {showError} from "@/utils/error_messages";
import {Validator} from "@/utils/validation";
import type {ProfileValueObject} from "@/domain/value_objects/profile_value_object";
import {AxiosError} from "axios";
import {ApiException} from "@/core/exception/exception";
import {Cubit} from "@/core/framework/bloc/cubit";
import {fileToBase64} from "@/presentation/utils/encoding";
import {Constants} from "@/core/constants/constants";


@injectable()
export class ProfileBloc extends Cubit<ProfileState> {

    constructor(@inject('UserRepository') private userRemoteRepository: UserRemoteRepository) {
        super(new ProfileState({}));
    }

    async selectAvatar(file: File): Promise<void> {
        const validate = this.validateImageFile(file);
        const imageDataUrl = await this.readImageFile(file);
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
                    this.emit(this.state.copyWith({status: ProfileStatus.ErrorUpload, errorMessage: errorMsg}));
                }, onSuccess: (data) => {

                    this.emit(this.state.copyWith({status: ProfileStatus.Uploaded, errorMessage: undefined}));
                }
            });
            await this.getUserProfile(this.state.profile.id.toString());
        }
    }
    
    validateImageFile(file: File): string | null {
        if (file.size > Constants.max_file_size)
            return "Image file size must be less than 5MB.";
        return null;
    }
    
    async readImageFile(file: File): Promise<string | null> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = () => {
                const result = reader.result as string;
                if (!Validator.isValidAvatar(result)) {
                    showError("avatar", "Please select a valid image file (JPEG, PNG, GIF, or WebP).");
                    resolve(null);
                    return;
                }
                resolve(result);
            };
            
            reader.onerror = () => {
                showError("avatar", "Failed to read image file.");
                resolve(null);
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    async getUserProfile(id: string): Promise<void> {

        this.emit(this.state.copyWith({status: ProfileStatus.Loading}))
        const res = await this.userRemoteRepository.getProfile(id);
        console.log(`USSSSSS:::::: ${id}`);
        res.when({
            onError: (error) => {
                console.log(`EERRRRRR::::: ${error}`)
                let errorMsg: string | null;
                if (error instanceof ApiException) {
                    errorMsg = error.message;
                } else {
                    errorMsg = error?.toString()
                }
                this.emit(this.state.copyWith({errorMessage: errorMsg, status: ProfileStatus.Error}));
            },
            onSuccess: (user) => {
                const newSTate = this.state.copyWith({status: ProfileStatus.Success, profile: user});
                this.emit(newSTate);
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
        const isValid = this.validateForm({username, email, password, newPassword, confirmPassword});

        if (!this.state.profile?.id) {
            console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRR")
            this.emit(this.state.copyWith({
                status: ProfileStatus.Error,
                errorMessage: 'User is not Authenticated',
                isValid: false
            }))
        } else if (isValid && this.state.profile) {
            const currentUser = this.state.profile;
                this.emit(this.state.copyWith({status: ProfileStatus.Loading}));
                if (username && email) {
                    const res = await this.userRemoteRepository.updateProfile(currentUser!.id, username, email);
                     res.when({
                        onError: (e) => {
                            let errorMsg: string | null;
                            if (e instanceof AxiosError) {
                                errorMsg = e.message;
                            } else {
                                errorMsg = e?.toString()
                            }
                            this.emit(this.state.copyWith({status: ProfileStatus.ErrorSubmit, errorMessage: errorMsg}));
                        }, onSuccess:  () => {
                            this.emit(this.state.copyWith({status: ProfileStatus.Success}));
                        }
                    });
                }
            if (newPassword && newPassword.length > 0) {
                const pwd = password && password.length > 0 ? password : newPassword;
                const res = await this.userRemoteRepository.updatePassword(this.state.profile!.id, pwd, newPassword);
                res.when({
                    onError: (e) => {
                        let errorMsg: string | null;
                        if (e instanceof ApiException) {
                            errorMsg = e.message;
                        } else {
                            errorMsg = e?.toString()
                        }
                        this.emit(this.state.copyWith({
                            status: ProfileStatus.ErrorSubmit,
                            errorMessage: errorMsg
                        }));
                    }, onSuccess: () => {
                        this.emit(this.state.copyWith({
                            status: ProfileStatus.Success,
                            errorMessage: undefined
                        }));
                    }
                })
            }
            await this.getUserProfile(currentUser.id.toString());

        }
        else {
            this.emit(this.state.copyWith({isValid: false}));
        }
    }


    validateForm({username, email, password, newPassword, confirmPassword}: ProfileValueObject): boolean {

        let hasError = false;

        if (email && !Validator.isValidEmail(email)) {
            showError("edit_email", "Invalid email.");
            hasError = true;
        }
        if (username && username.length < 8) {
            showError("edit_username", "Username must be at least 8 characters.");
            hasError = true;
        }

        if (password && password.length > 0 && (!newPassword || newPassword.length == 0)) {
            showError("new_password", "New password is required.");
            hasError = true;
        }
        if (password && password.length > 0 && password === newPassword) {
            showError("new_password", "New password can't be the same as old password.");
            hasError = true;
        }
        if (newPassword || confirmPassword) {
            if (!Validator.isValidPassword(newPassword)) {
                showError("new_password", "Password must be at least 8 characters, include a capital letter and a symbol.");
                hasError = true;
            }
            if (newPassword !== confirmPassword) {
                showError("confirm_password", "Passwords do not match.");
                hasError = true;
            }
        }
        console.log(`HHHH:::: ${hasError}`)

        return !hasError;
    }
}