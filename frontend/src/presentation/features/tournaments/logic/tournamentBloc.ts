import {Cubit} from "@/core/framework/cubit";
import {TournamentState, TournamentStatus} from "@/presentation/features/tournaments/logic/tournamentState";
import {inject} from "tsyringe";
import type {TournamentRemoteRepository} from "@/domain/respository/tournamentRemoteRepository";
import {ApiException} from "@/core/exception/exception";

export class TournamentBloc extends Cubit<TournamentState> {
    constructor(@inject('TournamentRepository') private tournamentRemoteRepository: TournamentRemoteRepository) {
        super(new TournamentState(({})));
    }

    async createTournament(name: string, maxPlayers: number, createdBy: string): Promise<void> {
        this.emit(this.state.copyWith({status: TournamentStatus.Loading}))
        const res = await this.tournamentRemoteRepository.createTournament(name, maxPlayers, createdBy);
        res.when({
            onError: (e) => {
                let errorMessage: string | undefined;
                if (e instanceof ApiException) {
                    errorMessage = e.message;
                }
                else {
                    errorMessage = e.toString();
                }
                this.emit(this.state.copyWith({status: TournamentStatus.Error, errorMessage: errorMessage}))
            }, onSuccess: (data) => {
                this.emit(this.state.copyWith({status: TournamentStatus.Success, createdTournament: data}))
            }
        });
    }
}