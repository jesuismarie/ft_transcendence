// Define possible statuses as enum
import type {Equatable} from "@/core/framework/equatable";
import { isEqual } from 'lodash';
import type {TournamentEntity} from "@/domain/entity/tournamentEntity";

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
    readonly errorMessage?: string;

    constructor(params: {
        status?: TournamentStatus;
        createdTournament?: TournamentEntity;
        errorMessage?: string;
    }) {
        this.status = params.status ?? TournamentStatus.Initial;
        this.createdTournament = params.createdTournament;
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        status: TournamentStatus;
        createdTournament?: TournamentEntity;
        errorMessage?: string;
    }>): TournamentState {
        return new TournamentState({
            status: params.status ?? this.status,
            createdTournament: params.createdTournament ?? this.createdTournament,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value: TournamentState, value2: TournamentState): boolean {
        return isEqual(value, value2);
    }
}
