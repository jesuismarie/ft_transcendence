import type {SearchUserResponse, UserView} from "@/utils/types";
import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";
import type {ProfileValueObject} from "@/domain/value_objects/profile_value_object";

export interface UserRemoteRepository {
    getProfile(id: string): Promise<Either<GeneralException, UserView>>;
    searchUser(query: string, offset: number): Promise<Either<GeneralException, SearchUserResponse>>;
    updateAvatar(id: number, data: FormData): Promise<Either<GeneralException, void>>;
    updateProfile(id: number, username: string, email: string): Promise<Either<GeneralException, void>>;
    updatePassword(id: number, oldPassword: string, newPassword: string): Promise<Either<GeneralException, void>>;
}