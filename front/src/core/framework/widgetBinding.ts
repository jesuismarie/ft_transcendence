export class WidgetBinding {
    private constructor() {}

    private static _instance?: WidgetBinding;
    static getInstance(): WidgetBinding {
        if (!this._instance) this._instance = new WidgetBinding();
        return this._instance;
    }

    private _callbacks: (() => void)[] = [];
    private _scheduled = false;

    postFrameCallback(callback: () => void) {
        this._callbacks.push(callback);

        if (!this._scheduled) {
            this._scheduled = true;
            requestAnimationFrame(() => {
                // Run all callbacks once
                const callbacksToRun = this._callbacks;
                this._callbacks = [];
                this._scheduled = false;

                callbacksToRun.forEach(cb => {
                    try {
                        cb();
                    } catch (e) {
                        console.error("Error in postFrameCallback:", e);
                    }
                });
            });
        }
    }
}


type PostFrameCallback = () => void;

export class WidgetsBinding {
    private static _instance?: WidgetsBinding;
    private _postFrameCallbacks: PostFrameCallback[] = [];
    private _initialized = false;

    static ensureInitialized(): WidgetsBinding {
        if (!WidgetsBinding._instance) {
            WidgetsBinding._instance = new WidgetsBinding();
            WidgetsBinding._instance._init();
        }
        return WidgetsBinding._instance;
    }

    private _init() {
        if (this._initialized) return;

        // Callbacks after the first frame
        requestAnimationFrame(() => {
            this._flushPostFrameCallbacks();
        });

        this._initialized = true;
    }

    addPostFrameCallback(callback: PostFrameCallback) {
        this._postFrameCallbacks.push(callback);
    }

    private _flushPostFrameCallbacks() {
        const callbacks = this._postFrameCallbacks.slice();
        this._postFrameCallbacks.length = 0;

        for (const cb of callbacks) {
            try {
                cb();
            } catch (e) {
                console.error("Error in post frame callback", e);
            }
        }
    }
}
