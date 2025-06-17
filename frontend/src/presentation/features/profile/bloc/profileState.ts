// Define possible statuses as enum
import type {Equatable} from "@/core/framework/core/equatable";
import {isEqual} from "lodash";
import {type User, userFromJson, userToJson} from "@/domain/entity/user";
import { base64ToFile, fileToBase64 } from "@/presentation/utils/encoding";

export enum ProfileStatus {
    Initial = 'initial',
    Loading = 'loading',
    Uploaded = 'uploaded',
    Success = 'success',
    Error = 'error',
    ErrorUpload = 'error_uploaded',
    ErrorSubmit = 'ErrorSubmit',
}

export class ProfileState implements Equatable<ProfileState>{
    readonly status: ProfileStatus;
    readonly profile?: User;
    readonly otherProfile?: User;
    readonly selectedAvatar?: File;
    readonly isValid: boolean
    readonly selectedAvatarUrl?: string;
    readonly errorMessage?: string;
    readonly selectedAvatarBase64?: string;

    constructor(params: {
        status?: ProfileStatus;
        profile?: User;
        otherProfile?: User;
        isValid?: boolean;
        selectedAvatar?: File;
        selectedAvatarUrl?: string;
        selectedAvatarBase64?: string;
        errorMessage?: string;
    }) {
        this.status = params.status ?? ProfileStatus.Initial;
        this.profile = params.profile;
        this.otherProfile = params.otherProfile;
        this.isValid = params.isValid ?? true;
        this.selectedAvatarUrl = params.selectedAvatarUrl;
        this.selectedAvatarBase64 = params.selectedAvatarBase64;
        this.errorMessage = params.errorMessage;

        // Попробовать восстановить File из base64, если File не передан, но base64 есть
        if (!params.selectedAvatar && params.selectedAvatarBase64) {
            try {
                this.selectedAvatar = base64ToFile(params.selectedAvatarBase64, "avatar.png");
            } catch (e) {
                console.error("Не удалось восстановить selectedAvatar из base64:", e);
                this.selectedAvatar = undefined;
            }
        } else {
            this.selectedAvatar = params.selectedAvatar;
        }
    }

    copyWith(params: Partial<{
        status: ProfileStatus;
        profile?: User;
        otherProfile?: User;
        isValid?: boolean
        selectedAvatarUrl?: string;
        selectedAvatar?: File;
        errorMessage?: string;
        selectedAvatarBase64?: string;
    }>): ProfileState {
        return new ProfileState({
            status: params.status ?? this.status,
            profile: params.profile ?? this.profile,
            otherProfile: params.otherProfile ?? this.otherProfile,
            isValid: params.isValid ?? this.isValid,
            selectedAvatarUrl: params.selectedAvatarUrl ?? this.selectedAvatarUrl,
            selectedAvatar: params.selectedAvatar ?? this.selectedAvatar,
            errorMessage: params.errorMessage ?? this.errorMessage,
            selectedAvatarBase64: params.selectedAvatarBase64 ?? this.selectedAvatarBase64,

        });
    }

    equals(value: ProfileState): boolean {
        return isEqual(value, this);
    }

    toJson(): any {
        return {
            status: this.status,
            profile: this.profile ? userToJson(this.profile) : null,
            otherProfile: this.otherProfile ? userToJson(this.otherProfile) : null,
            isValid: this.isValid,
            selectedAvatarUrl: this.selectedAvatarUrl,
            selectedAvatarBase64: this.selectedAvatarBase64, // Сохраняем base64 строку
            errorMessage: this.errorMessage,
        };
    }

    static fromJson(json: any): ProfileState {
        return new ProfileState({
            status: json.status as ProfileStatus,
            profile: json.profile ? userFromJson(json.profile) : undefined,
            otherProfile: json.otherProfile ? userFromJson(json.otherProfile) : undefined,
            isValid: json.isValid,
            selectedAvatarUrl: json.selectedAvatarUrl,
            selectedAvatarBase64: json.selectedAvatarBase64, // передаём base64
            errorMessage: json.errorMessage,
        });
    }

}
