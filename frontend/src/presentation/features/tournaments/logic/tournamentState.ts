// Define possible statuses as enum
import type {Equatable} from "@/core/framework/core/equatable";
import { isEqual } from 'lodash';
import type {TournamentEntity} from "@/domain/entity/tournamentEntity";
import type {TournamentInfoEntity} from "@/domain/entity/tournamentInfoEntity";

export enum TournamentStatus {
    Initial = 'initial',
    Loading = 'loading',
    Success = 'success',
    Authenticated = 'authenticated',
    Error = 'error',
}


export class TournamentState implements Equatable<TournamentState>{
    readonly status: TournamentStatus;
    readonly createdTournament?: TournamentEntity;
    readonly results: TournamentInfoEntity;
    readonly errorMessage?: string;
    readonly isValid: boolean

    constructor(params: {
        status?: TournamentStatus;
        results?: TournamentInfoEntity;
        createdTournament?: TournamentEntity;
        errorMessage?: string;
        isValid?: boolean
    }) {
        this.status = params.status ?? TournamentStatus.Initial;
        this.createdTournament = params.createdTournament;
        this.isValid = params.isValid ?? true;
        this.results = params.results ?? {totalCount: 0, tournament: []};
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: TournamentStatus;
        isValid?: boolean,
        results?: TournamentInfoEntity;
        createdTournament?: TournamentEntity;
        errorMessage?: string;
    }>): TournamentState {
        return new TournamentState({
            isValid: params.isValid ?? this.isValid,
            status: params.status ?? this.status,
            results: params.results ?? this.results,
            createdTournament: params.createdTournament ?? this.createdTournament,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: TournamentState): boolean {
        return isEqual(value, this);
    }
}
