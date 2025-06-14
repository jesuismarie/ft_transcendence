import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";
import type {User} from "@/domain/entity/user";
import type {SearchEntity} from "@/domain/entity/searchEntity";
import type {OnlineEntity} from "@/domain/entity/onlineStatus";

export interface UserRemoteRepository {
    getProfile(id: string): Promise<Either<GeneralException, User>>;
    searchUser(query: string, offset: number, limit: number): Promise<Either<GeneralException, SearchEntity>>;
    updateAvatar(id: number, data: FormData): Promise<Either<GeneralException, void>>;
    updateProfile(id: number, username: string, email: string): Promise<Either<GeneralException, void>>;
    updatePassword(id: number, oldPassword: string, newPassword: string): Promise<Either<GeneralException, void>>;
    getOnlineStatuses(users: number[]): Promise<Either<GeneralException, OnlineEntity>>
}