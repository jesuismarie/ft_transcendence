import {Cubit} from "@/core/framework/bloc/cubit";
import {TournamentState, TournamentStatus} from "@/presentation/features/tournaments/logic/tournamentState";
import {inject} from "tsyringe";
import type {TournamentRemoteRepository} from "@/domain/respository/tournamentRemoteRepository";
import {ApiException} from "@/core/exception/exception";
// import {startTournament} from "@/profile/tournament_details";
import {AddTournament} from "@/presentation/features/tournaments/view/addTournament";
import {Bindings} from "@/presentation/features/bindings";
import {cloneDeep} from "lodash";
import type {TournamentInfoEntity} from "@/domain/entity/tournamentInfoEntity";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {Constants} from "@/core/constants/constants";

export class TournamentBloc extends Cubit<TournamentState> {
    constructor(@inject('TournamentRepository') private tournamentRemoteRepository: TournamentRemoteRepository,
                @inject('UserRepository') private userRepository: UserRemoteRepository
                ) {
        super(new TournamentState(({})));
    }

    validateTournament(name: string): void {
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
        await this.getAllTournaments(0, Constants.tournament_limit);
    }

    async unregisterToTournament(id: number, userId: number): Promise<void> {
        this.emit(this.state.copyWith({status: TournamentStatus.Loading}))
        const res = await this.tournamentRemoteRepository.unregisterFromTournament(id, userId);
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
        await this.getAllTournaments(0, Constants.tournament_limit);
    }

    async createTournament(name: string, maxPlayers: number, createdBy: number): Promise<void> {
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
                    this.emit(this.state.copyWith({status: TournamentStatus.ErrorCreate, errorMessage: errorMessage}))
                }, onSuccess: (data) => {
                    this.emit(this.state.copyWith({status: TournamentStatus.Created, createdTournament: data}))
                }
            });
            await this.getAllTournaments(0, Constants.tournament_limit);
        }
        else {
            this.emit(this.state.copyWith({status: TournamentStatus.ErrorCreate, errorMessage: "Please select tournament name"}))
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
                this.emit(this.state.copyWith({status: TournamentStatus.Success, results: data, offset: offset}))
            }
        });
    }



    async getOnlineState(id: number): Promise<void> {
        const tournaments = this.state.results.tournaments.filter((e) => e.id == id);

        if (tournaments.length > 0) {
            const tournament = tournaments[0];
            this.emit(this.state.copyWith({status: TournamentStatus.Loading}))
            const res = await this.userRepository.getOnlineStatuses(tournament.participants);
            res.when({
                onSuccess: (data) => {
                    this.emit(this.state.copyWith({online: data, status: TournamentStatus.SuccessOnline}))
                }, onError: (error) => {
                    console.log('Error:', error)
                    let errorMessage: string | undefined;
                    if (error instanceof ApiException) {
                        errorMessage = error.message.removeBefore('body/').capitalizeFirst()
                    }
                    this.emit(this.state.copyWith({status: TournamentStatus.Error, errorMessage: errorMessage}));
                }
            })
            await this.getAllTournaments(0, Constants.tournament_limit);
        }

    }

    async getRelevantParticipants(id: number): Promise<void> {
        this.emit(this.state.copyWith({status: TournamentStatus.Loading}))
        const res = await this.tournamentRemoteRepository.getRelevantParticipants(id);
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
                const newParticipants: TournamentInfoEntity  = cloneDeep<TournamentInfoEntity>(this.state.results);
                const participantsIndex = this.state.results.tournaments.findIndex((e, index) => e.id === id ? index : -1);
                if (participantsIndex != -1) {
                    newParticipants.tournaments[participantsIndex] = {
                        current_players_count: data.currentPlayersCount,
                        max_players_count: data.maxPlayersCount,
                        participants: data.participants,
                        id: newParticipants.tournaments[participantsIndex].id,
                        name: newParticipants.tournaments[participantsIndex].name,
                        status: newParticipants.tournaments[participantsIndex].status,
                        created_by: newParticipants.tournaments[participantsIndex].created_by,


                    };
                }
                this.emit(this.state.copyWith({status: TournamentStatus.SuccessRelevant, results: newParticipants}))
            }
        });
        await this.getAllTournaments(0, Constants.tournament_limit);
        Bindings.isTournamentItemBounded = false;
    }

    async deleteTournament(id: number, createdBy: number) {
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
        await this.getAllTournaments(0, Constants.tournament_limit);
        Bindings.isTournamentItemBounded = false;
    }

    resetAfterSubmit() {
        this.emit(this.state.copyWith({isValid: true, status: TournamentStatus.Initial, errorMessage: undefined}));
        // AddTournament.isSendRequest = false;
    }

}