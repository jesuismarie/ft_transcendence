// Define possible statuses as enum
import type {Equatable} from "@/core/framework/equatable";
import { isEqual } from 'lodash';
import type {FriendEntity} from "@/domain/entity/friendEntity";

export enum FriendStatus {
    Initial = 'initial',
    Loading = 'loading',
    Success = 'success',
    Authenticated = 'authenticated',
    Error = 'error',
}

// Your user type

export class FriendState implements Equatable<FriendState>{
    readonly status: FriendStatus;
    readonly results?: FriendEntity;
    readonly errorMessage?: string;

    constructor(params: {
        status?: FriendStatus;
        results?: FriendEntity;
        errorMessage?: string;
    }) {
        this.status = params.status ?? FriendStatus.Initial;
        this.results = params.results;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: FriendStatus;
        results?: FriendEntity;
        errorMessage?: string;
    }>): FriendState {
        return new FriendState({
            status: params.status ?? this.status,
            results: params.results ?? this.results,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: FriendState): boolean {
        return isEqual(value, this);
    }
}
