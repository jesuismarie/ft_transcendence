import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";
import type {FriendEntity} from "@/domain/entity/friendEntity";
import type {FriendAddResponse} from "@/domain/entity/friendAddResponse";
import type {FriendStatusEntity} from "@/domain/entity/friendStatusEntity";

export interface FriendRepository {
    getFriendList(id: number, offset: number, limit: number): Promise<Either<GeneralException, FriendEntity>>;
    addFriend(id: number, friendId: number): Promise<Either<GeneralException, FriendAddResponse>>;
    removeFriend(id: number, friendId: number): Promise<Either<GeneralException, void>>;
    checkFriendShip(id: number, friendId: number): Promise<Either<GeneralException, FriendStatusEntity>>;
}