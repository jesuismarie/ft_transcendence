
export class GeneralException extends Error {
    constructor(public message: string = '') {
        super(message);
        this.name = 'GeneralException';
    }

    toString() {
        return `message: ${this.message}`;
    }
}

export class ApiException extends GeneralException {
    constructor(
        public statusCode: number = 500,
        public message: string = '',
        public error?: unknown
    ) {
        super(message);
        this.name = 'ApiException';
    }

    toString() {
        return `status: ${this.statusCode}, message: ${this.message}, error: ${this.error}`;
    }
}

export class InternalServerException extends ApiException {
    constructor() {
        super(500, 'Error while communicating to the server');
        this.name = 'InternalServerException';
    }
}

export class BadGateWayException extends ApiException {
    constructor() {
        super(502, "Bad Gate Way");
        this.name = 'BadGateWayException';
    }
}

export class BadRequestException extends ApiException {
    constructor(message?: string) {
        super(400, message ?? "Bad Request");
        this.name = 'BadRequestException';
    }
}

export class UnauthorizedException extends ApiException {
    constructor() {
        super(401, "Unauthorized");
        this.name = 'UnauthorizedException';
    }
}

export class ConflictException extends ApiException {
    constructor() {
        super(409, "Conflict");
        this.name = 'ConflictException';
    }
}

export class ForbiddenException extends ApiException {
    constructor() {
        super(403, "forbidden");
        this.name = 'ForbiddenException';
    }
}

export class NotFoundException extends ApiException {
    constructor(message?: string) {
        super(404, message ?? "Resource Not Found");
        this.name = 'NotFoundException';
    }
}

export class InvalidException extends ApiException {
    constructor(statusCode: number, message: string = '') {
        super(
            statusCode,
            `Invalid Request ${statusCode} ${message}`,
        );
        this.name = 'InvalidException';
    }
}

export class BackendException extends Error {
    constructor(public message: any) {
        super(typeof message === 'string' ? message : JSON.stringify(message));
        this.name = 'BackendException';
    }
}

export class ResponseEmptyException extends ApiException {
    constructor() {
        super(204, "Response empty");
        this.name = 'ResponseEmptyException';
    }
}

export class ValidationException extends GeneralException {
    constructor(message?: string) {
        super(message ?? "Validation failed");
        this.name = 'ValidationException';
    }
}

export class PermissionDeniedException extends ApiException {
    constructor(message?: string) {
        super(403, message ?? "Permission Denied");
        this.name = 'PermissionDeniedException';
    }
}

export class LocalException extends GeneralException {
    stackTrace?: string;
    constructor(message?: string, stackTrace?: string) {
        super(message ?? "Local Error");
        this.name = 'LocalException';
        this.stackTrace = stackTrace;
    }
}
