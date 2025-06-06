import {BlocBase} from "@/core/framework/bloc/blocBase";
import type {BlocSubscription} from "@/core/framework/bloc/blocSubscription";
import type {Equatable} from "@/core/framework/core/equatable";

type EventHandler<Event extends object, State extends Equatable<State>> = (event: Event, emit: (state: State) => void) => void | Promise<void>;

export class Bloc<Event extends object, State extends Equatable<State>> extends BlocBase<State> {
    private _eventQueue: Event[] = [];
    private _processing: boolean = false;

    // Map event constructor (class) to handler function
    private _eventHandlers = new Map<new (...args: any[]) => Event, EventHandler<Event, State>>();

    constructor(initialState: State) {
        super(initialState);
    }



    // Register handler for specific event type
    on<E extends Event>(
        eventType: new (...args: any[]) => E,
        handler: (event: E, emit: (state: State) => void) => void | Promise<void>
    ): void {
        this._eventHandlers.set(eventType, handler as EventHandler<Event, State>);
    }

    add(event: Event): void {
        this._eventQueue.push(event);
        this._processEvents();
    }

    private async _processEvents(): Promise<void> {
        if (this._processing) return;
        this._processing = true;

        try {
            while (this._eventQueue.length > 0) {
                const event = this._eventQueue.shift()!;
                const handler = this._findHandlerForEvent(event);

                if (!handler) {
                    throw new Error(`No handler registered for event type ${event.constructor.name}`);
                }

                // Call handler with event and emit callback
                await handler(event, (state: State) => this.emit(state));
            }
        } catch (error) {
            this.addError(error);
        } finally {
            this._processing = false;
        }
    }

    // Find handler by event constructor (exact match)
    private _findHandlerForEvent(event: Event): EventHandler<Event, State> | undefined {
        return this._eventHandlers.get(event.constructor as new (...args: any[]) => Event);
    }
}
