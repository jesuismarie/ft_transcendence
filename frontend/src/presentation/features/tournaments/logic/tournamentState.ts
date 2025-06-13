// Define possible statuses as enum
import type {Equatable} from "@/core/framework/core/equatable";
import { isEqual } from 'lodash';
import type {TournamentEntity} from "@/domain/entity/tournamentEntity";
import type {TournamentInfoEntity} from "@/domain/entity/tournamentInfoEntity";
import {type OnlineEntity, OnlineStatuses} from "@/domain/entity/onlineStatus";

export enum TournamentStatus {
    Initial = 'initial',
    Loading = 'loading',
    Success = 'success',
    Created = 'created',
    ErrorCreate = 'errorCreate',
    SuccessOnline = 'successOnline',
    SuccessRelevant = 'successRelevant',
    Error = 'error',
}


export class TournamentState implements Equatable<TournamentState>{
    readonly status: TournamentStatus;
    readonly createdTournament?: TournamentEntity;
    readonly results: TournamentInfoEntity;
    readonly offset: number;
    readonly errorMessage?: string;
    readonly online: OnlineEntity;
    readonly isValid: boolean

    constructor(params: {
        offset?: number;
        status?: TournamentStatus;
        results?: TournamentInfoEntity;
        createdTournament?: TournamentEntity;
        online?: OnlineEntity;
        errorMessage?: string;
        isValid?: boolean
    }) {
        this.status = params.status ?? TournamentStatus.Initial;
        this.createdTournament = params.createdTournament;
        this.isValid = params.isValid ?? true;
        this.offset = params.offset ?? 0;
        this.online = params.online ?? new Array<OnlineStatuses>();
        this.results = params.results ?? {totalCount: 0, tournaments: []};
        this.errorMessage = params.errorMessage;
    }

    copyWith(params: Partial<{
        offset?: number;
        status: TournamentStatus;
        isValid?: boolean,
        results?: TournamentInfoEntity;
        online: OnlineEntity
        createdTournament?: TournamentEntity;
        errorMessage?: string;
    }>): TournamentState {
        return new TournamentState({
            offset: params.offset ?? this.offset,
            online: params.online ?? this.online,
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
