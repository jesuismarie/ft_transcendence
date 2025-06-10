import {Cubit} from "@/core/framework/bloc/cubit";
import {MatchState, MatchStatus} from "@/presentation/features/match/bloc/match_state";
import {inject} from "tsyringe";
import type {MatchRepository} from "@/domain/respository/matchRepository";
import {ApiException} from "@/core/exception/exception";

export class MatchBloc extends Cubit<MatchState> {
    constructor(@inject('MatchRepository') private readonly matchRepository: MatchRepository) {
        super(new MatchState({}));
    }

    async getMatchHistory(userId: number, offset: number, limit: number): Promise<void> {
        this.emit(this.state.copyWith({status: MatchStatus.Loading}))
        const res = await this.matchRepository.fetchMatchList(userId, offset, limit);
        res.when({
            onError: (err: any) => {
                let errorMessage: string | undefined;
                if (err instanceof ApiException) {
                    errorMessage = err.message.removeBefore('body/').capitalizeFirst()
                }
                this.emit(this.state.copyWith({status: MatchStatus.Error, errorMessage: errorMessage}));
            },
            onSuccess: (data) => {
                const newState = this.state.copyWith({status: MatchStatus.Success, results: data});
                this.emit(newState);
            }
        });
    }
}