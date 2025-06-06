import type {FriendUser} from "@/domain/entity/friendUser";

export interface FriendEntity {
    totalCount:	number;
    friends:	FriendUser[];
}