import {inject, injectable} from "tsyringe";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {BlocBase} from "@/core/framework/bloc/blocBase";
import {SearchState, SearchStatus} from "@/presentation/features/search/logic/searchState";

@injectable()
export class SearchBloc extends BlocBase<SearchState>{

    constructor(@inject('UserRepository') private userRepository: UserRemoteRepository) {
        super(new SearchState({query2: ''}))
    }



    changeQuery(query: string) {
        this.emit(this.state.copyWith({query2: query}))
    }

    async searchUser(query: string, offset: number, limit: number): Promise<void> {
        this.emit(this.state.copyWith({status: SearchStatus.Loading}));
        console.log('REQUES WITH SEARCH')
        const res = await this.userRepository.searchUser(query, offset, limit);
        res.when({
            onSuccess: (data) => {
                this.emit(this.state.copyWith({results: data, offset: offset, status: SearchStatus.Success}))
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