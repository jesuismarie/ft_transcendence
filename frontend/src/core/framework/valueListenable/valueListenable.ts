export interface ValueListenable<T> {
    get value(): T;
    addListener(listener: () => void): void;
    removeListener(listener: () => void): void;
}