import {Cubit} from "@/core/framework/bloc/cubit";
import {MatchState, MatchStatus} from "@/presentation/features/match/bloc/match_state";
import {inject} from "tsyringe";
import type {MatchRepository} from "@/domain/respository/matchRepository";
import {ApiException} from "@/core/exception/exception";
import {type OnlineEntity, OnlineStatuses} from "@/domain/entity/onlineStatus";
import type {TournamentRemoteRepository} from "@/domain/respository/tournamentRemoteRepository";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import type {MatchHistoryItem} from "@/domain/entity/matchHistoryItem";
import type {MatchHistory} from "@/domain/entity/matchHistory";

export class MatchBloc extends Cubit<MatchState> {
    constructor(@inject('MatchRepository') private readonly matchRepository: MatchRepository,
                @inject('TournamentRepository') private readonly tournamentRepository: TournamentRemoteRepository,
                @inject('UserRepository') private readonly userRepository: UserRemoteRepository,
                ) {
        super(new MatchState({}));
    }


    resetStatus() {
        this.emit(this.state.copyWith({status: MatchStatus.Initial, errorMessage: ''}))
    }


    async createMatch(tournamentId: number, createdBy: number, online: OnlineEntity): Promise<void> {
        if (online.every((e) => e == OnlineStatuses.Online) && this.state.status != MatchStatus.Created) {
            this.emit(this.state.copyWith({status: MatchStatus.Loading}))
            const res = await this.tournamentRepository.startTournament(tournamentId, createdBy);
           await res.when({
                onError: async (e) => {
                    let errorMessage: string | undefined;
                    if (e instanceof ApiException) {
                        errorMessage = e.message;
                    } else {
                        errorMessage = e.toString();
                    }
                    this.emit(this.state.copyWith({status: MatchStatus.Error, errorMessage: errorMessage}))
                }, onSuccess: async (match) => {
                    const res = await this.matchRepository.createMatch({
                        matchId: match.matchId,
                        player2Id: match.player2Id,
                        player1Id: match.player1Id,
                    });
                   console.log(`CURRRR::::: ${JSON.stringify(match)}`)
                    res.when({
                        onError: (err: any) => {
                            let errorMessage: string | undefined;
                            if (err instanceof ApiException) {
                                errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                            }
                            this.emit(this.state.copyWith({status: MatchStatus.Error, errorMessage: errorMessage}));
                        },
                        onSuccess: (data) => {
                            const newState = this.state.copyWith({status: MatchStatus.Created, currentMatch: match});
                            this.emit(newState);
                        }
                    });
                }
            });
        }
        else {
            this.emit(this.state.copyWith({status: MatchStatus.Error, errorMessage: "Please wait until all participants are online."}))
        }
    }

    async getNextMatch(tournamentId: number): Promise<void> {
        this.emit(this.state.copyWith({status: MatchStatus.Loading}))
        const res = await this.matchRepository.getNextMatch(tournamentId);
        res.when({
            onError: (err: any) => {
                let errorMessage: string | undefined;
                if (err instanceof ApiException) {
                    errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                }
                this.emit(this.state.copyWith({status: MatchStatus.Error, errorMessage: errorMessage}));
            },
            onSuccess: (data) => {
                if (data.status == 'ended') {
                    this.emit(this.state.copyWith({status: MatchStatus.Ended, nextMatch: undefined}));
                }
                else {
                    this.emit(this.state.copyWith({status: MatchStatus.Success, nextMatch: data}));
                }
            }
        });
    }

    async getMatchHistory(userId: number, offset: number, limit: number): Promise<void> {
        this.emit(this.state.copyWith({status: MatchStatus.Loading}))
        const res = await this.matchRepository.fetchMatchList(userId, offset, limit);
        await res.when({
            onError: async (err: any) => {
                let errorMessage: string | undefined;
                if (err instanceof ApiException) {
                    errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                }
                console.log(`ERRRRRRRRRRRRRRRRRRRRR::::: ${JSON.stringify(err)}`)
                this.emit(this.state.copyWith({status: MatchStatus.Error, errorMessage: errorMessage}));
            },
            onSuccess: async (data) => {

                const userIds: number[] = data.matches.map((e) => e.opponent);
                const response = await this.userRepository.getUserNames(userIds);
                console.log(`AAAAAAAAAAAAAAAA::::: ${JSON.stringify(response)}`)

                response.when({
                    onError: (err) => {
                        console.log(`IIIIIIIIIIIIIIII::::: ${JSON.stringify(err)}`)

                        // this.emit(this.state.copyWith({status: MatchStatus.Error}));
                        const newState = this.state.copyWith({status: MatchStatus.Success, results: data});
                        this.emit(newState);
                    },
                    onSuccess: (userNames) => {
                        const newRes = data.matches.map((e, index) => {
                            console.log(`DDDDDDDDDDDDDDDDDDDDDD::::: ${userNames[index]}`)

                            const match: MatchHistoryItem = {
                                id: e.id,
                                opponent: e.opponent,
                                opponentName: userNames[index],
                                status: e.status,
                                is_won: e.is_won,
                                score: {
                                    user: e.score.user,
                                    opponent: e.score.opponent,
                                    opponentName: userNames[index],
                                },
                                date: e.date,
                            }
                            return match;
                        });
                        const res: MatchHistory = {
                            totalCount: data.totalCount,
                            matches: newRes,
                        }

                        this.emit(this.state.copyWith({status: MatchStatus.Success, results: res}));
                    }
                })

            }
        });
    }
}