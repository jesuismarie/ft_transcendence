import {Cubit} from "@/core/framework/bloc/cubit";
import {TournamentState, TournamentStatus} from "@/presentation/features/tournaments/logic/tournamentState";
import {inject} from "tsyringe";
import type {TournamentRemoteRepository} from "@/domain/respository/tournamentRemoteRepository";
import {ApiException, GeneralException} from "@/core/exception/exception";
import {showError} from "@/utils/error_messages";
import {startTournament} from "@/profile/tournament_details";
import {ApiConstants} from "@/core/constants/apiConstants";
import type {Either} from "@/core/models/either";
import {AddTournament} from "@/presentation/features/tournaments/view/addTournament";
import {Bindings} from "@/presentation/features/bindings";

export class TournamentBloc extends Cubit<TournamentState> {
    constructor(@inject('TournamentRepository') private tournamentRemoteRepository: TournamentRemoteRepository) {
        super(new TournamentState(({})));
    }

    validateTournament(name: string, maxPlayers: number, createdBy: string): void {
        this.emit(this.state.copyWith({isValid: name.length != 0}))
    }

    async registerToTournament(id: number, userId: number): Promise<void> {
        this.emit(this.state.copyWith({status: TournamentStatus.Loading}))
        const res = await this.tournamentRemoteRepository.registerToTournament(id, userId);
        res.when({
            onError: (e) => {
                let errorMessage: string | undefined;
                if (e instanceof ApiException) {
                    errorMessage = e.message;
                } else {
                    errorMessage = e.toString();
                }
                this.emit(this.state.copyWith({status: TournamentStatus.Error, errorMessage: errorMessage}))
            }, onSuccess: (data) => {
                this.emit(this.state.copyWith({status: TournamentStatus.Success}))
            }
        });
    }

    async createTournament(name: string, maxPlayers: number, createdBy: string): Promise<void> {
        if (this.state.isValid) {
            this.emit(this.state.copyWith({status: TournamentStatus.Loading}))
            const res = await this.tournamentRemoteRepository.createTournament(name, maxPlayers, createdBy);
            res.when({
                onError: (e) => {
                    let errorMessage: string | undefined;
                    if (e instanceof ApiException) {
                        errorMessage = e.message;
                    } else {
                        errorMessage = e.toString();
                    }
                    this.emit(this.state.copyWith({status: TournamentStatus.Error, errorMessage: errorMessage}))
                }, onSuccess: (data) => {
                    this.emit(this.state.copyWith({status: TournamentStatus.Success, createdTournament: data}))
                }
            });
        }
        AddTournament.isSendRequest = false;
    }

   async getAllTournaments(offset: number, limit: number) {
        this.emit(this.state.copyWith({status: TournamentStatus.Loading}))
        const res = await this.tournamentRemoteRepository.getAllTournaments(offset, limit);
        res.when({
            onError: (e) => {
                let errorMessage: string | undefined;
                if (e instanceof ApiException) {
                    errorMessage = e.message;
                } else {
                    errorMessage = e.toString();
                }
                this.emit(this.state.copyWith({status: TournamentStatus.Error, errorMessage: errorMessage}))
            }, onSuccess: (data) => {
                this.emit(this.state.copyWith({status: TournamentStatus.Success, results: data}))
            }
        });
    }

    async startTournament(tournamentId: number): Promise<void> {
        this.emit(this.state.copyWith({status: TournamentStatus.Loading}))
        const res = await this.tournamentRemoteRepository.startTournament(tournamentId);
        res.when({
            onError: (e) => {
                let errorMessage: string | undefined;
                if (e instanceof ApiException) {
                    errorMessage = e.message;
                } else {
                    errorMessage = e.toString();
                }
                this.emit(this.state.copyWith({status: TournamentStatus.Error, errorMessage: errorMessage}))
            }, onSuccess: (data) => {
                this.emit(this.state.copyWith({status: TournamentStatus.Success}))
            }
        });
    }

    async deleteTournament(id: number, createdBy: string) {
        this.emit(this.state.copyWith({status: TournamentStatus.Loading}))
        const res = await this.tournamentRemoteRepository.deleteTournament(id, createdBy);
        res.when({
            onError: (e) => {
                let errorMessage: string | undefined;
                if (e instanceof ApiException) {
                    errorMessage = e.message;
                } else {
                    errorMessage = e.toString();
                }
                this.emit(this.state.copyWith({status: TournamentStatus.Error, errorMessage: errorMessage}))
            }, onSuccess: (data) => {
                this.emit(this.state.copyWith({status: TournamentStatus.Success}))
            }
        });
        Bindings.isTournamentItemBounded = false;
    }

    resetAfterSubmit() {
        this.emit(this.state.copyWith({isValid: true, status: TournamentStatus.Initial, errorMessage: undefined}));
        // AddTournament.isSendRequest = false;
    }

}