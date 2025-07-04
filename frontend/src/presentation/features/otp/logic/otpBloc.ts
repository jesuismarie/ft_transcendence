import {Cubit} from "@/core/framework/bloc/cubit";
import {OTPState, OTPStatus} from "@/presentation/features/otp/logic/otpState";
import {inject} from "tsyringe";
import type {TwoFARepository} from "@/domain/respository/twoFARepository";
import {Validator} from "@/utils/validation";
import {ApiException} from "@/core/exception/exception";

export class OTPBloc extends Cubit<OTPState> {
    constructor(
        @inject('TwoFARepository') private twoFARepository: TwoFARepository,
    ) {
        super(new OTPState({}));
    }



    async enableOTP(): Promise<void> {
        this.emit(this.state.copyWith({status: OTPStatus.Loading}))
        const res = await this.twoFARepository.enable2FA();
        res.when({
            onError: (error) => {
                let errorMsg: string | null;
                if (error instanceof ApiException) {
                    errorMsg = error.message;
                } else {
                    errorMsg = error?.toString()
                }
                this.emit(this.state.copyWith({status: OTPStatus.Error, errorMessage: errorMsg}));
            }, onSuccess: (data) => {
                this.emit(this.state.copyWith({status: OTPStatus.TwoFAPending, otp: data}));
            }
        })
    }


    resetValidating() {
        this.emit(this.state.copyWith({isValidating: false}));
    }
    validateToken(token: string): void {
        const isValid = Validator.isValidToken(token);
        console.log(`KKKKKKKKK::::: ${token} ${isValid}`)
        this.emit(this.state.copyWith({isValid: isValid, isValidating: true}))
    }

    initializeOtp(): void {
        this.emit(this.state.copyWith({isInitialized: true}))
    }

    resetOtp(): void {
        this.emit(new OTPState({}))
    }

    async otpVerify(otp: string): Promise<void> {
        if (this.state.isValid) {
            this.emit(this.state.copyWith({status: OTPStatus.Loading}))
            const res = await this.twoFARepository.verify2FA(otp)
            res.when({
                onError: (error) => {
                    let errorMsg: string | null;
                    if (error instanceof ApiException) {
                        errorMsg = error.message;
                    } else {
                        errorMsg = error?.toString()
                    }
                    this.emit(this.state.copyWith({status: OTPStatus.Error, errorMessage: errorMsg}));
                }, onSuccess: (data) => {
                    this.emit(this.state.copyWith({status: OTPStatus.Success, verified: data}));
                }
            })
        }
    }
}