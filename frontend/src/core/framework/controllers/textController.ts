export class TextController {
    private _value: string = "";
    private _listeners: ((value: string) => void)[] = [];
    private _boundInput?: HTMLInputElement;
    private _isClosed: boolean = false;

    constructor(initialValue: string = "") {
        this._value = initialValue;
    }

    get text(): string {
        return this._value;
    }

    isClosed(): boolean {
        return this._isClosed
    }

    close(): void {
        this._listeners = [];
        this.unbind();
        this._value = "";
        this._isClosed = true;
    }

    set text(val: string) {
        this._value = val;
        if (this._boundInput && this._boundInput.value !== val) {
            this._boundInput.value = val;
        }
        this._notify();
    }

    unbind(): void {
        this._boundInput = undefined;
    }

    bindInput(input: HTMLInputElement, useDocument = false, eventType?: string) {
        this._boundInput = input;
        input.value = this._value;

        if (useDocument) {
            document.addEventListener(eventType ?? 'input', (e) => {
                if (e.target instanceof HTMLElement && e.target instanceof HTMLInputElement && e.target.getAttribute('id') == input.getAttribute('id')) {
                    const newValue = (e.target as HTMLInputElement).value;
                    if (this._value !== newValue) {
                        this._value = newValue;
                        this._notify();
                    }
                }
            })
        }
        else {
            input.addEventListener("input", (e) => {
                const newValue = (e.target as HTMLInputElement).value;
                if (this._value !== newValue) {
                    this._value = newValue;
                    this._notify();
                }
            });
        }
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
