// Define possible statuses as enum
import type {UserView} from "@/utils/types";
import type {Equatable} from "@/core/framework/core/equatable";
import {isEqual} from "lodash";
import type {User} from "@/domain/entity/user";

export enum ProfileStatus {
    Initial = 'initial',
    Loading = 'loading',
    Uploaded = 'uploaded',
    Success = 'success',
    Error = 'error',
}

export class ProfileState implements Equatable<ProfileState>{
    readonly status: ProfileStatus;
    readonly profile?: User;
    readonly otherProfile?: User;
    readonly selectedAvatar?: File;
    readonly isValid: boolean
    readonly selectedAvatarUrl?: string;
    readonly errorMessage?: string;

    constructor(params: {
        status?: ProfileStatus;
        profile?: User;
        otherProfile?: User;
        isValid?: boolean;
        selectedAvatar?: File;
        selectedAvatarUrl?: string;
        errorMessage?: string;
    }) {
        this.status = params.status ?? ProfileStatus.Initial;
        this.profile = params.profile;
        this.otherProfile = params.otherProfile
        this.isValid = params.isValid ?? true;
        this.selectedAvatarUrl = params.selectedAvatarUrl;
        this.selectedAvatar = params.selectedAvatar;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: ProfileStatus;
        profile?: User;
        otherProfile?: User;
        isValid?: boolean
        selectedAvatarUrl?: string;
        selectedAvatar?: File;
        errorMessage?: string;
    }>): ProfileState {
        return new ProfileState({
            status: params.status ?? this.status,
            profile: params.profile ?? this.profile,
            otherProfile: params.otherProfile ?? this.otherProfile,
            isValid: params.isValid ?? this.isValid,
            selectedAvatarUrl: params.selectedAvatarUrl ?? this.selectedAvatarUrl,
            selectedAvatar: params.selectedAvatar ?? this.selectedAvatar,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: ProfileState): boolean {
        return isEqual(value, this);
    }
}
