import {Either, Left, Right} from 'purify-ts/Either';
import {GeneralException} from "@/core/exception/exception.ts";
import type {UserEntity} from "@/domain/entity/user_entity.ts";

export interface RemoteAuthRepository {
    register({email, username, password}: {
        email: string;
        username: string;
        password: string
    }): Promise<Either<GeneralException, UserEntity>>
    login({email, password}: {
        email: string,
        password: string
    }): Promise<Either<GeneralException, UserEntity>>;
}