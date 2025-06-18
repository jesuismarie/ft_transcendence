import {inject, injectable} from "tsyringe";
import type {TwoFARepository} from "@/domain/respository/twoFARepository";
import type {ApiClient} from "@/core/network/apiClient";
import {type Either, Left, Right} from "@/core/models/either";
import {ApiException, GeneralException} from "@/core/exception/exception";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AxiosError} from "axios";
import type {ApiError} from "@/utils/types";
import type {VerifiedEntity} from "@/domain/entity/verifiedEntity";
import type {OtpEntity} from "@/domain/entity/otpEntity";

@injectable()
export class TwoFARepositoryImpl implements TwoFARepository {
    constructor(@inject('ApiClient') private apiClient: ApiClient) {
    }
    async disable2FA(): Promise<Either<GeneralException, void>> {

        return new Left(new GeneralException("Unimplementer Error"));
    }

    async enable2FA(): Promise<Either<GeneralException, OtpEntity>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.twoFAEnable);
            if (res.status >= 200 && res.status < 400) {
                const otp: OtpEntity = {
                    otpAuthUrl: res.data.otpAuthUrl,
                    qrSvg: res.data.qrSvg,
                }
                return new Right(otp)
            }
            else {
                return new Left(new GeneralException())
            }
        }
        catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async verify2FA(otp: string): Promise<Either<GeneralException, VerifiedEntity>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.twoFAVerify, {otp: otp});
            if (res.status >= 200 && res.status < 400) {
                const verified: VerifiedEntity = {
                    verified: res.data.verified,
                }
                return new Right(verified)
            }
            else {
                return new Left(new GeneralException())
            }
        }
        catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

}