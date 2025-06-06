export class SelectController {
    private _value: string = "";
    private _listeners: ((value: string) => void)[] = [];
    private _boundSelect?: HTMLSelectElement;

    constructor(initialValue: string = "") {
        this._value = initialValue;
    }

    get value(): string {
        return this._value;
    }

    set value(val: string) {
        this._value = val;
        if (this._boundSelect && this._boundSelect.value !== val) {
            this._boundSelect.value = val;
        }
        this._notify();
    }

    bindSelect(select: HTMLSelectElement): void {
        this._boundSelect = select;
        select.value = this._value;

        select.addEventListener("change", (e) => {
            const newValue = (e.target as HTMLSelectElement).value;
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
