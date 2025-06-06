import type {SearchUser} from "@/domain/entity/searchUser";

export interface SearchEntity {
    totalCount:	number;
    users:		SearchUser[];
}