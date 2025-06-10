// Define possible statuses as enum
import type {Equatable} from "@/core/framework/core/equatable";
import { isEqual } from 'lodash';

export enum AuthStatus {
    Initial = 'initial',
    Loading = 'loading',
    Success = 'success',
    Authenticated = 'authenticated',
    Error = 'error',
}

// Your user type
import type { UserEntity } from "@/domain/entity/user_entity";

export class AuthState implements Equatable<AuthState>{
    readonly status: AuthStatus;
    readonly  isRefresh: boolean;
    readonly user?: UserEntity;
    readonly errorMessage?: string;

    constructor(params: {
        status?: AuthStatus;
        user?: UserEntity;
        isRefresh?: boolean;
        errorMessage?: string;
    }) {
        this.status = params.status ?? AuthStatus.Initial;
        this.user = params.user;
        this.isRefresh = params.isRefresh ?? false;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: AuthStatus;
        user?: UserEntity;
        isRefresh?: boolean;
        errorMessage?: string;
    }>): AuthState {
        return new AuthState({
            status: params.status ?? this.status,
            user: params.user ?? this.user,
            isRefresh: params.isRefresh ?? this.isRefresh,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: AuthState): boolean {
        return isEqual(value, this);
    }

    toJson(): any {
        return {
            user: this.user ? {
                userId: this.user.userId,
                accessToken: this.user.accessToken,
                refreshToken: this.user.refreshToken,
            } : null,
            status: this.status,
            errorMessage: this.errorMessage
        };
    }

    static fromJson(json: any): AuthState {
        return new AuthState({
            user: json.user ? {
                userId: json.user.userId,
                accessToken: json.user.accessToken,
                refreshToken: json.user.refreshToken,
            } : undefined,
            status: json.status,
            errorMessage: json.errorMessage
        });
    }

}
