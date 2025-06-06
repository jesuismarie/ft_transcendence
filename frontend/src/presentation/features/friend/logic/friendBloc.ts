import {Cubit} from "@/core/framework/bloc/cubit";
import {FriendState, FriendStatus} from "@/presentation/features/friend/logic/friendState";
import {inject} from "tsyringe";
import type {FriendRepository} from "@/domain/respository/friendRepository";
import {Constants} from "@/core/constants/constants";
import {ApiException} from "@/core/exception/exception";

export class FriendBloc extends Cubit<FriendState> {
    constructor(
        @inject("FriendRepository") private friendRepository: FriendRepository
    ) {
        super(new FriendState({}));
    }

    onChangeOffset(offset: number) {
        this.emit(this.state.copyWith({offset: offset}))
    }

    onChangeQuery(query: string) {
        this.emit(this.state.copyWith({query: query}))
    }

    async onSearch(id: number, offset: number, limit: number): Promise<void> {
        this.emit(this.state.copyWith({status: FriendStatus.Loading}))
        const res = await this.friendRepository.getFriendList(id, offset, limit);
        res.when({
            onSuccess: (data) => {
                this.emit(this.state.copyWith({results: data, status: FriendStatus.Success}))
            }, onError: (error) => {
                console.log('Error:', error)
                let errorMessage: string | undefined;
                if (error instanceof ApiException) {
                    errorMessage = error.message.removeBefore('body/').capitalizeFirst()
                }
                this.emit(this.state.copyWith({status: FriendStatus.Error, errorMessage: errorMessage}));
            }
        })
    }

    getFriends() {
    }

    addFriend() {
    }

    deleteFriend() {
    }

    checkFriendStatus() {
    }
}