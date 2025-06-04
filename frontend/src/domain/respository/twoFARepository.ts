import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";
import type {VerifiedEntity} from "@/domain/entity/verifiedEntity";
import type {OtpEntity} from "@/domain/entity/otpEntity";

export interface TwoFARepository {
    enable2FA(): Promise<Either<GeneralException, OtpEntity>>;
    disable2FA(): Promise<Either<GeneralException, void>>;
    verify2FA(otp: string): Promise<Either<GeneralException, VerifiedEntity>>;
}