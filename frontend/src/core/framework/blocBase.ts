import type {BlocSubscription} from "@/core/framework/blocSubscription";
import type {Equatable} from "@/core/framework/equatable";

type Listener<State extends Equatable<State>> = (state: State) => void;
type ErrorListener = (error: any, stackTrace?: any) => void;

// A minimal global observer interface like Flutter's BlocObserver
class BlocObserver {
    onCreate(bloc: BlocBase<any>) {}
    onChange<State extends Equatable<State>>(bloc: BlocBase<State>, change: Change<State>) {}
    onError<State extends Equatable<State>>(bloc: BlocBase<State>, error: any, stackTrace?: any) {}
    onClose(bloc: BlocBase<any>) {}
}

// Singleton observer instance (could be customizable)
export const blocObserver = new BlocObserver();

export interface Change<State extends Equatable<State>> {
    currentState: State;
    nextState: State;
}

export abstract class BlocBase<State extends Equatable<State>> {
    private _listeners = new Set<Listener<State>>();
    private _errorListeners = new Set<ErrorListener>();

    protected _state: State;
    private _emitted: boolean = false;
    private _isClosed: boolean = false;

    constructor(initialState: State) {
        this._state = initialState;
        blocObserver.onCreate(this);
    }

    get state(): State {
        return this._state;
    }

    subscribe(listener: Listener<State>): BlocSubscription {
        this._listeners.add(listener);
        return {
            unsubscribe: () => {
                this._listeners.delete(listener);
            },
        };
    }

    get stream(): {
        subscribe: (listener: Listener<State>) => () => void;
    } {
        // Expose a minimal stream interface
        return {
            subscribe: (listener: Listener<State>) => {
                this._listeners.add(listener);
                // Immediately notify listener of current state
                listener(this._state);
                return () => this._listeners.delete(listener);
            },

        };
    }

    get isClosed(): boolean {
        return this._isClosed;
    }

    protected emit(newState: State): void {
        if (this._isClosed) {
            throw new Error("Cannot emit new states after close");
        }
        if (this._emitted && newState.equals(newState, this._state)) {
            return; // Ignore equal states except the first emit
        }
        this.onChange({ currentState: this._state, nextState: newState });
        this._state = newState;
        this._emitted = true;
        this._listeners.forEach((listener) => listener(this._state));
    }

    protected equals(a: State, b: State): boolean {
        return a === b; // Override if deep equality needed
    }

    protected onChange(change: Change<State>): void {
        blocObserver.onChange(this, change);
    }

    addError(error: any, stackTrace?: any): void {
        this.onError(error, stackTrace);
    }

    protected onError(error: any, stackTrace?: any): void {
        blocObserver.onError(this, error, stackTrace);
        this._errorListeners.forEach((listener) => listener(error, stackTrace));
    }

    subscribeErrors(listener: ErrorListener): () => void {
        this._errorListeners.add(listener);
        return () => this._errorListeners.delete(listener);
    }

    async close(): Promise<void> {
        if (this._isClosed) return;
        this._isClosed = true;
        blocObserver.onClose(this);
        // Clear listeners to avoid leaks
        this._listeners.clear();
        this._errorListeners.clear();
    }
}

