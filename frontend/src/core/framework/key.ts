import {v4 as uuidv4} from "uuid";
import type {BuildContext} from "@/core/framework/buildContext";

export interface Key {
}

export class UniqueKey implements Key {
    private readonly uuid: string;

    constructor() {
        this.uuid = uuidv4();
    }

    toString(): string {
        return `UniqueKey(${this.uuid})`;
    }
}

export class ValueKey<T> implements Key {
    constructor(public readonly value: T) {
    }

    toString(): string {
        return `ValueKey(${this.value})`;
    }
}

export class GlobalKey<T> implements Key {
    private _currentContext?: BuildContext;

    constructor() {
    }

    currentContext(): BuildContext | undefined {
        return this._currentContext;
    }

    setCurrentContext(value: BuildContext) {
        this._currentContext = value;
    }

    toString(): string {
        return `GlobalKey(${this._currentContext})`;
    }
}