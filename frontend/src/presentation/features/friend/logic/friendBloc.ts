import {Cubit} from "@/core/framework/cubit";
import {FriendState} from "@/presentation/features/friend/logic/friendState";
import {inject} from "tsyringe";
import type {FriendRepository} from "@/domain/respository/friendRepository";

export class FriendBloc extends Cubit<FriendState> {
    constructor(
        @inject("FriendRepository") private friendRepository: FriendRepository
    ) {
        super(new FriendState({}));
    }

    getFriends()  {}
    addFriend() {}
    deleteFriend() {}
    checkFriendStatus() {}
}