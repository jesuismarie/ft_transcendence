import {inject, injectable} from "tsyringe";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {BlocBase} from "@/core/framework/blocBase";
import {ProfileState, ProfileStatus} from "@/presentation/profile/bloc/profileState";
import {readImageFile, validateImageFile} from "@/profile/avatar";

@injectable()
export class ProfileBloc extends BlocBase<ProfileState> {

    constructor(@inject('UserRepository') private userRemoteRepository: UserRemoteRepository) {
        super(new ProfileState({}));
    }

    async selectAvatar(file: File): Promise<void> {
        const validate = validateImageFile(file);
        const imageDataUrl = await readImageFile(file);
        console.log(`IMageURL:::: ${imageDataUrl} ${this.state.selectedAvatarUrl}`)
        this.emit(this.state.copyWith({
            selectedAvatar: file,
            isValid: !validate || validate.length == 0,
            errorMessage: validate?.toString(),
            selectedAvatarUrl: imageDataUrl?.toString()
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
                    this.emit(this.state.copyWith({status: ProfileStatus.Error, errorMessage: error.message}));
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
                this.emit(this.state.copyWith({errorMessage: error.message, status: ProfileStatus.Error}));
            },
            onSuccess: (user) => {
                this.emit(this.state.copyWith({status: ProfileStatus.Success, profile: user}));
            }
        })
    }

    async resetStatus(): Promise<void> {
        this.emit(this.state.copyWith({status: ProfileStatus.Initial, errorMessage: '', isValid: true}))
    }

    setStatus(status: ProfileStatus) {
        this.emit(this.state.copyWith({status: status}))
    }
}