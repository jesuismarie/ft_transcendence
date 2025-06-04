export class TextController {
    private _value: string = "";
    private _listeners: ((value: string) => void)[] = [];
    private _boundInput?: HTMLInputElement;

    constructor(initialValue: string = "") {
        this._value = initialValue;
    }

    get text(): string {
        return this._value;
    }

    set text(val: string) {
        this._value = val;
        if (this._boundInput && this._boundInput.value !== val) {
            this._boundInput.value = val;
        }
        this._notify();
    }

    bindInput(input: HTMLInputElement) {
        this._boundInput = input;
        input.value = this._value;

        input.addEventListener("input", (e) => {
            const newValue = (e.target as HTMLInputElement).value;
            if (this._value !== newValue) {
                this._value = newValue;
                this._notify();
            }
        });
    }

    addListener(listener: (val: string) => void): void {
        this._listeners.push(listener);
    }

    removeListener(listener: (val: string) => void): void {
        this._listeners = this._listeners.filter((l) => l !== listener);
    }

    private _notify(): void {
        this._listeners.forEach((l) => l(this._value));
    }
}
