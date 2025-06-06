// Define possible statuses as enum
import type {SearchUserResponse, UserView} from "@/utils/types";
import type {Equatable} from "@/core/framework/core/equatable";
import {isEqual} from "lodash";
import type {SearchEntity} from "@/domain/entity/searchEntity";

export enum SearchStatus {
    Initial = 'initial',
    Loading = 'loading',
    Success = 'success',
    Error = 'error',
}

export class SearchState implements Equatable<SearchState>{
    readonly status: SearchStatus;
    readonly query: string;
    readonly query2: string;
    readonly oldQuery: string;
    readonly offset: number;
    readonly results: SearchEntity;
    readonly errorMessage?: string;

    constructor(params: {
        status?: SearchStatus;
        query?: string;
        query2: string;
        oldQuery?: string;
        offset?: number;
        results?: SearchEntity;
        errorMessage?: string;
    }) {
        this.status = params.status ?? SearchStatus.Initial;
        this.results = params.results ?? {totalCount: 0, users: []};
        this.query = params.query ?? '';
        this.query2 = params.query ?? '';
        this.oldQuery = params.oldQuery ?? '';
        this.offset = params.offset ?? 0;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: SearchStatus;
        query?: string;
        query2: string;
        oldQuery?: string;
        offset?: number;
        results?: SearchEntity;
        errorMessage?: string;
    }>): SearchState {
        return new SearchState({
            status: params.status ?? this.status,
            query: params.query ?? this.query,
            query2: params.query2 ?? this.query2,
            oldQuery: params.oldQuery ?? this.oldQuery,
            offset: params.offset ?? this.offset,
            results: params.results ?? this.results,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: SearchState): boolean {
        return isEqual(value, this);
    }
}
