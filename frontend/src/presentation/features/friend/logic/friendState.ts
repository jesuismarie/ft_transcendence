// Define possible statuses as enum
import type {Equatable} from "@/core/framework/core/equatable";
import {isEqual} from 'lodash';
import type {FriendEntity} from "@/domain/entity/friendEntity";

export enum FriendStatus {
    Initial = 'initial',
    Loading = 'loading',
    Success = 'success',
    Authenticated = 'authenticated',
    Error = 'error',
}

// Your user type

export class FriendState implements Equatable<FriendState> {
    readonly status: FriendStatus;
    readonly results: FriendEntity;
    readonly offset: number;
    readonly query?: string;
    readonly errorMessage?: string;

    constructor(params: {
        status?: FriendStatus;
        results?: FriendEntity;
        readonly offset?: number;
        readonly query?: string;
        errorMessage?: string;
    }) {
        this.status = params.status ?? FriendStatus.Initial;
        this.results = params.results ?? {totalCount: 0, friends: []}
        this.offset = params.offset ?? 0;
        this.query = params.query;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: FriendStatus;
        readonly offset?: number;
        readonly query?: string;
        results?: FriendEntity;
        errorMessage?: string;
    }>): FriendState {
        return new FriendState({
            status: params.status ?? this.status,
            results: params.results ?? this.results,
            offset: params.offset ?? this.offset,
            query: params.query ?? this.query,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: FriendState): boolean {
        return isEqual(value, this);
    }
}
