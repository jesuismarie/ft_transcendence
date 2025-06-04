import type {User} from "@/domain/entity/user";

export interface FriendEntity {
    totalCount:	number;
    friends:	User[];
}