import type {GeneralException} from "@/core/exception/exception";
import type {UserEntity} from "@/domain/entity/user_entity";
import type {Either} from "@/core/models/either";
import type {LoginTicketEntity} from "@/domain/entity/loginTicketEntity";



export interface RemoteAuthRepository {
    register({email, username, password}: {
        email: string;
        username: string;
        password: string
    }): Promise<Either<GeneralException, UserEntity>>
    login({email, password}: {
        email: string,
        password: string
    }): Promise<Either<GeneralException, LoginTicketEntity>>;
    
    claim(ticket: string): Promise<Either<GeneralException, UserEntity>>;

    loginTwoFa(ticket: string, otp: string): Promise<Either<GeneralException, UserEntity>>;

    requestRefresh(accessToken: string): Promise<Either<GeneralException, UserEntity>>;
}