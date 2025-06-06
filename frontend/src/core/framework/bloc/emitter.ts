type Dispose = () => void | Promise<void>;

export interface Emitter<State> {
    // Emit a new state
    emit(state: State): void;

    // Subscribe to a stream, calling onData for each value, no state transformation
    onEach<T>(
        stream: AsyncIterable<T> | AsyncIterator<T>,
        options: {
            onData: (data: T) => void;
            onError?: (error: unknown) => void;
        }
    ): Promise<void>;

    // Subscribe to a stream, transform each data to a new State, and emit it
    forEach<T>(
        stream: AsyncIterable<T> | AsyncIterator<T>,
        options: {
            onData: (data: T) => State;
            onError?: (error: unknown) => State;
        }
    ): Promise<void>;

    // Whether emitter is done (completed or canceled)
    readonly isDone: boolean;

    // Cancel subscriptions and prevent further emits
    cancel(): void;

    // Mark the emitter as complete, no more emits allowed
    complete(): void;
}
export class EmitterImpl<State> implements Emitter<State> {
    private _isCanceled = false;
    private _isCompleted = false;
    private _disposables: Dispose[] = [];
    private _pendingPromises: Promise<void>[] = [];

    constructor(private _emit: (state: State) => void) {
    }

    get isDone(): boolean {
        return this._isCanceled || this._isCompleted;
    }

    emit(state: State): void {
        this.call(state);
    }

    call(state: State) {
        if (this._isCompleted) {
            throw new Error(
                `emit was called after the emitter was completed. Await async operations to avoid this.`
            );
        }
        if (!this._isCanceled) {
            this._emit(state);
        }
    }

    private toAsyncIterable<T>(source: AsyncIterable<T> | AsyncIterator<T>): AsyncIterable<T> {
        if (typeof (source as AsyncIterable<T>)[Symbol.asyncIterator] === 'function') {
            return source as AsyncIterable<T>;
        }
        // Wrap AsyncIterator to AsyncIterable
        const iterator = source as AsyncIterator<T>;
        return {
            [Symbol.asyncIterator]() {
                return iterator;
            }
        };
    }

    async onEach<T>(
        stream: AsyncIterable<T> | AsyncIterator<T>,
        options: { onData: (data: T) => void; onError?: (error: unknown) => void }
    ): Promise<void> {
        if (this.isDone) return;

        const {onData, onError} = options;

        try {
            const iterable = this.toAsyncIterable(stream);
            for await (const data of iterable) {
                if (this.isDone) break;
                onData(data);
            }
        } catch (error) {
            if (onError) {
                onError(error);
            } else {
                throw error;
            }
        }
    }

    async forEach<T>(
        stream: AsyncIterable<T> | AsyncIterator<T>,
        options: {
            onData: (data: T) => State;
            onError?: (error: unknown) => State;
        }
    ): Promise<void> {
        if (this.isDone) return;

        const {onData, onError} = options;

        await this.onEach<T>(stream, {
            onData: (data) => this.call(onData(data)),
            onError: onError ? (error) => this.call(onError(error)) : undefined,
        });
    }

    cancel() {
        if (this.isDone) return;
        this._isCanceled = true;
        this._disposeAll();
    }

    complete() {
        if (this.isDone) return;
        if (this._disposables.length > 0) {
            throw new Error(
                `An event handler completed but left pending subscriptions. Make sure to await async operations.`
            );
        }
        this._isCompleted = true;
        this._disposeAll();
    }

    addDisposable(dispose: Dispose) {
        this._disposables.push(dispose);
    }

    private _disposeAll() {
        for (const dispose of this._disposables) {
            try {
                const result = dispose();
                if (result instanceof Promise) {
                    result.catch(() => {
                        /* ignore */
                    });
                }
            } catch {
                // ignore errors on dispose
            }
        }
        this._disposables = [];
    }
}