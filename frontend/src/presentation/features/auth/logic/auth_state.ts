// Define possible statuses as enum
import type {Equatable} from "@/core/framework/equatable";
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
    readonly user?: UserEntity;
    readonly errorMessage?: string;

    constructor(params: {
        status?: AuthStatus;
        user?: UserEntity;
        errorMessage?: string;
    }) {
        this.status = params.status ?? AuthStatus.Initial;
        this.user = params.user;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: AuthStatus;
        user?: UserEntity;
        errorMessage?: string;
    }>): AuthState {
        return new AuthState({
            status: params.status ?? this.status,
            user: params.user ?? this.user,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: AuthState): boolean {
        return isEqual(value, this);
    }
}
