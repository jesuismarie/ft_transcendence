export abstract class Either<L, R> {
    abstract isLeft(): this is Left<L, R>;
    abstract isRight(): this is Right<L, R>;

    abstract when<T>(handlers: {
        onSuccess: (value: R) => T;
        onError: (value: L) => T;
    }): T;

    abstract map<T>(fn: (r: R) => T): Either<L, T>;

    abstract flatMap<T>(fn: (r: R) => Either<L, T>): Either<L, T>;

    abstract fold<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T;

    static left<L, R = never>(value: L): Either<L, R> {
        return new Left(value);
    }

    static right<R, L = never>(value: R): Either<L, R> {
        return new Right(value);
    }
}

export class Left<L, R> extends Either<L, R> {
    constructor(private readonly value: L) {
        super();
    }

    isLeft(): this is Left<L, R> {
        return true;
    }

    isRight(): this is Right<L, R> {
        return false;
    }

    when<T>({
                onError,
                onSuccess,
            }: {
        onError: (value: L) => T;
        onSuccess: (value: R) => T;
    }): T {
        return onError(this.value);
    }

    map<T>(_fn: (r: R) => T): Either<L, T> {
        return new Left<L, T>(this.value);
    }

    flatMap<T>(_fn: (r: R) => Either<L, T>): Either<L, T> {
        return new Left<L, T>(this.value);
    }

    fold<T>(onLeft: (l: L) => T, _onRight: (r: R) => T): T {
        return onLeft(this.value);
    }
}

export class Right<L, R> extends Either<L, R> {
    constructor(private readonly value: R) {
        super();
    }

    isLeft(): this is Left<L, R> {
        return false;
    }

    isRight(): this is Right<L, R> {
        return true;
    }

    when<T>({
                onError,
                onSuccess,
            }: {
        onError: (value: L) => T;
        onSuccess: (value: R) => T;
    }): T {
        return onSuccess(this.value);
    }

    map<T>(fn: (r: R) => T): Either<L, T> {
        return new Right<L, T>(fn(this.value));
    }

    flatMap<T>(fn: (r: R) => Either<L, T>): Either<L, T> {
        return fn(this.value);
    }

    fold<T>(_onLeft: (l: L) => T, onRight: (r: R) => T): T {
        return onRight(this.value);
    }
}
