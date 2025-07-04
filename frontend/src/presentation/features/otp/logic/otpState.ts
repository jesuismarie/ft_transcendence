// Define possible statuses as enum
import type {Equatable} from "@/core/framework/core/equatable";
import { isEqual } from 'lodash';

export enum OTPStatus {
    Initial = 'initial',
    Loading = 'loading',
    Success = 'success',
    TwoFAPending = 'twoFAPending',
    Error = 'error',
}

// Your user type
import type {VerifiedEntity} from "@/domain/entity/verifiedEntity";
import type {OtpEntity} from "@/domain/entity/otpEntity";

export class OTPState implements Equatable<OTPState>{
    readonly status: OTPStatus;
    readonly otp?: OtpEntity;
    readonly isValid: boolean;
    readonly otpText: string;
    isValidating: boolean;
    readonly isInitialized: boolean;
    readonly verified?: VerifiedEntity;
    readonly errorMessage?: string;

    constructor(params: {
        status?: OTPStatus;
        verified?: VerifiedEntity;
        otp?: OtpEntity;
        isValidating?: boolean;
        otpText?: string;
        isInitialized?: boolean;
        isValid?: boolean
        errorMessage?: string;
    }) {
        this.status = params.status ?? OTPStatus.Initial;
        this.verified = params.verified;
        this.otp = params.otp;
        this.isValidating = params.isValidating ?? false;
        this.otpText = params.otpText ?? "";
        this.isInitialized = params.isInitialized ?? false
        this.isValid = params.isValid ?? true
        this.errorMessage = params.errorMessage;
    }


    copyWith(params: Partial<{
        status: OTPStatus;
        otp?: OtpEntity;
        otpText?: string;
        isInitialized?: boolean;
        isValid?: boolean;
        isValidating?: boolean;
        verified?: VerifiedEntity;
        errorMessage?: string;
    }>): OTPState {
        return new OTPState({
            status: params.status ?? this.status,
            verified: params.verified ?? this.verified,
            otp: params.otp ?? this.otp,
            isValidating: params.isValidating ?? this.isValidating,
            otpText: params.otpText ?? this.otpText,
            isInitialized: params.isInitialized ?? this.isInitialized,
            isValid: params.isValid ?? this.isValid,
            errorMessage: params.errorMessage ?? this.errorMessage,
        });
    }

    equals(value2: OTPState): boolean {
        return isEqual(this, value2);
    }
}
