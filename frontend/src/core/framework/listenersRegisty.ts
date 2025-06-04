type BindingDescriptor = {
    selector: string; // e.g. `#my-button`, `.some-class`
    event: keyof HTMLElementEventMap;
    handler: EventListener;
};

export class EventBindingManager {
    private static _instance: EventBindingManager;

    static getInstance(): EventBindingManager {
        return (this._instance ??= new EventBindingManager());
    }

    static global = EventBindingManager.getInstance();

    private _bindings: BindingDescriptor[] = [];

    track(selector: string, event: keyof HTMLElementEventMap, handler: EventListener) {
        this._bindings.push({ selector, event, handler });
    }

    bind(selector: string, event: keyof HTMLElementEventMap, handler: EventListener) {
        this.track(selector, event, handler);
        document.querySelectorAll(selector).forEach((el) => {
            el.addEventListener(event, handler);
        });
    }

    rebindAll() {
        for (const { selector, event, handler } of this._bindings) {
            document.querySelectorAll(selector).forEach((el) => {
                el.addEventListener(event, handler);
            });
        }
    }

    unbindAll() {
        for (const { selector, event, handler } of this._bindings) {
            document.querySelectorAll(selector).forEach((el) => {
                el.removeEventListener(event, handler);
            });
        }
    }

    clear() {
        this._bindings = [];
    }
}
