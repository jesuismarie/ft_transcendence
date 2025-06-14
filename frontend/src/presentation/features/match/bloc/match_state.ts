// Define possible statuses as enum
import type {Equatable} from "@/core/framework/core/equatable";
import { isEqual } from 'lodash';
import type {MatchHistory} from "@/domain/entity/matchHistory";
import type {OnlineEntity} from "@/domain/entity/onlineStatus";
import type {MatchEntity} from "@/domain/entity/matchEntity";
import type {ActiveMatchEntity} from "@/domain/entity/activeMatchEntity";

export enum MatchStatus {
    Initial = 'initial',
    Loading = 'loading',
    Success = 'success',
    Ended = 'ended',
    Error = 'error',
    Created = 'created'
}


export class MatchState implements Equatable<MatchState>{
    readonly status: MatchStatus;
    readonly isRefresh: boolean;
    readonly results: MatchHistory;
    readonly nextMatch?: ActiveMatchEntity;
    readonly currentMatch?: MatchEntity;
    readonly errorMessage?: string;

    constructor(params: {
        status?: MatchStatus;
        results?: MatchHistory;
        nextMatch?: ActiveMatchEntity;
        currentMatch?: MatchEntity;
        isRefresh?: boolean;
        errorMessage?: string;
    }) {
        this.status = params.status ?? MatchStatus.Initial;
        this.results = params.results ?? {totalCount: 0, matches: []};
        this.isRefresh = params.isRefresh ?? false;
        this.nextMatch = params.nextMatch;
        this.currentMatch = params.currentMatch;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: MatchStatus;
        online?: OnlineEntity;
        nextMatch?: ActiveMatchEntity;
        currentMatch?: MatchEntity;
        results?: MatchHistory;
        isRefresh?: boolean;
        errorMessage?: string;
    }>): MatchState {
        return new MatchState({
            status: params.status ?? this.status,
            results: params.results ?? this.results,
            isRefresh: params.isRefresh ?? this.isRefresh,
            nextMatch: params.nextMatch ?? this.nextMatch,
            currentMatch: params.currentMatch ?? this.currentMatch,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: MatchState): boolean {
        return isEqual(value, this);
    }

}
