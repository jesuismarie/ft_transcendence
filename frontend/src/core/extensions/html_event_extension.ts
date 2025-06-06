import {EventBindingManager} from "@/core/framework/core/listenersRegisty";

const originalAddEventListener = HTMLElement.prototype.addEventListener;

HTMLElement.prototype.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
) {
    if (typeof listener === "function") {
        const selector = this.id ? `#${this.id}` : null;
        if (selector) {
            EventBindingManager.getInstance().track(selector, type as keyof HTMLElementEventMap, listener);
        }
    }

    return originalAddEventListener.call(this, type, listener, options);
};
