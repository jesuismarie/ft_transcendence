// Define possible statuses as enum
import type {UserView} from "@/utils/types";
import type {Equatable} from "@/core/framework/equatable";
import {isEqual} from "lodash";

export enum ProfileStatus {
    Initial = 'initial',
    Loading = 'loading',
    Uploaded = 'uploaded',
    Success = 'success',
    Error = 'error',
}

export class ProfileState implements Equatable<ProfileState>{
    readonly status: ProfileStatus;
    readonly profile?: UserView;
    readonly selectedAvatar?: File;
    readonly isValid: boolean
    readonly selectedAvatarUrl?: string;
    readonly errorMessage?: string;

    constructor(params: {
        status?: ProfileStatus;
        profile?: UserView;
        isValid?: boolean;
        selectedAvatar?: File;
        selectedAvatarUrl?: string;
        errorMessage?: string;
    }) {
        this.status = params.status ?? ProfileStatus.Initial;
        this.profile = params.profile;
        this.isValid = params.isValid ?? true;
        this.selectedAvatarUrl = params.selectedAvatarUrl;
        this.selectedAvatar = params.selectedAvatar;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: ProfileStatus;
        profile?: UserView;
        isValid?: boolean
        selectedAvatarUrl?: string;
        selectedAvatar?: File;
        errorMessage?: string;
    }>): ProfileState {
        return new ProfileState({
            status: params.status ?? this.status,
            profile: params.profile ?? this.profile,
            isValid: params.isValid ?? this.isValid,
            selectedAvatarUrl: params.selectedAvatarUrl ?? this.selectedAvatarUrl,
            selectedAvatar: params.selectedAvatar ?? this.selectedAvatar,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: ProfileState, value2: ProfileState): boolean {
        return isEqual(value, value2);
    }
}
