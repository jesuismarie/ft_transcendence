import type {SearchUserResponse, UserView} from "@/utils/types";
import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";

export interface UserRemoteRepository {
    getProfile(id: string): Promise<Either<GeneralException, UserView>>;
    searchUser(query: string, offset: number): Promise<Either<GeneralException, SearchUserResponse>>;
    updateAvatar(id: number, data: FormData): Promise<Either<GeneralException, void>>;
}