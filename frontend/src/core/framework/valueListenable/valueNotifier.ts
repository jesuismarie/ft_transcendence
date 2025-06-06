import type {ValueListenable} from "@/core/framework/valueListenable/valueListenable";

export class ValueNotifier<T> implements ValueListenable<T> {
    private _value: T;
    private listeners: Set<() => void> = new Set();

    constructor(initialValue: T) {
        this._value = initialValue;
    }

    get value(): T {
        return this._value;
    }

    set value(newValue: T) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.notifyListeners();
        }
    }

    addListener(listener: () => void): void {
        this.listeners.add(listener);
    }

    removeListener(listener: () => void): void {
        this.listeners.delete(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener());
    }
}
