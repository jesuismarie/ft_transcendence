import {inject, injectable} from "tsyringe";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {BlocBase} from "@/core/framework/bloc/blocBase";
import {SearchState, SearchStatus} from "@/presentation/features/search/logic/searchState";
import {SearchResults} from "@/presentation/features/search/view/searchResults";

@injectable()
export class SearchBloc extends BlocBase<SearchState>{

    constructor(@inject('UserRepository') private userRepository: UserRemoteRepository) {
        super(new SearchState({}))
    }



    changeQuery(query: string) {
        this.emit(this.state.copyWith({query2: query}))
    }

    async searchUser(query: string, offset: number, limit: number): Promise<void> {
        this.emit(this.state.copyWith({status: SearchStatus.Loading}));
        const res = await this.userRepository.searchUser(query, offset, limit);
        res.when({
            onSuccess: (data) => {
                console.log(JSON.stringify(`++++++ ${JSON.stringify(data)}`));
                this.emit(this.state.copyWith({results: data, offset: offset, status: SearchStatus.Success}))
            }, onError: (error) => {
                this.emit(this.state.copyWith({
                    results: {totalCount: 0, users: []},
                    status: SearchStatus.Error,
                    errorMessage: error.message
                }));
            }
        })
    }

}