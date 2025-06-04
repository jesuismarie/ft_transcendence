import {inject, injectable} from "tsyringe";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {BlocBase} from "@/core/framework/blocBase";
import {SearchState, SearchStatus} from "@/presentation/features/search/logic/searchState";

@injectable()
export class SearchBloc extends BlocBase<SearchState>{

    constructor(@inject('UserRepository') private userRepository: UserRemoteRepository) {
        super(new SearchState({}))
    }

    async searchUser(query: string, offset: number): Promise<void> {
        const res = await this.userRepository.searchUser(query, offset);
        res.when({
            onSuccess: (data) => {
                this.emit(this.state.copyWith({results: data, status: SearchStatus.Success}))
                // this.state = ;
            }, onError: (error) => {
                this.emit(this.state.copyWith({
                    results: undefined,
                    status: SearchStatus.Error,
                    errorMessage: error.message
                }));
            }
        })
    }

    onQueryChanged(query: string) {
        const oldQuery = this.state.query;
        this.emit(this.state.copyWith({query: query, oldQuery: oldQuery}))
    }

    onOffsetChanged(offset: number) {
        this.emit(this.state.copyWith({offset: offset}))
    }

    resetStatus() {
        this.emit(this.state.copyWith({status: SearchStatus.Initial, errorMessage: ''}))
    }

}