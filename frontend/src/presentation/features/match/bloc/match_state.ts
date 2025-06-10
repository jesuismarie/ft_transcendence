// Define possible statuses as enum
import type {Equatable} from "@/core/framework/core/equatable";
import { isEqual } from 'lodash';
import type {MatchHistory} from "@/domain/entity/matchHistory";

export enum MatchStatus {
    Initial = 'initial',
    Loading = 'loading',
    Success = 'success',
    Error = 'error',
}


export class MatchState implements Equatable<MatchState>{
    readonly status: MatchStatus;
    readonly isRefresh: boolean;
    readonly results: MatchHistory;
    readonly errorMessage?: string;

    constructor(params: {
        status?: MatchStatus;
        results?: MatchHistory;
        isRefresh?: boolean;
        errorMessage?: string;
    }) {
        this.status = params.status ?? MatchStatus.Initial;
        this.results = params.results ?? {totalCount: 0, matches: []};
        this.isRefresh = params.isRefresh ?? false;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: MatchStatus;
        results?: MatchHistory;
        isRefresh?: boolean;
        errorMessage?: string;
    }>): MatchState {
        return new MatchState({
            status: params.status ?? this.status,
            results: params.results ?? this.results,
            isRefresh: params.isRefresh ?? this.isRefresh,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: MatchState): boolean {
        return isEqual(value, this);
    }

}
