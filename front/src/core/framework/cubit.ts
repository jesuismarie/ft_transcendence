import {BlocBase} from "@/core/framework/blocBase";
import type {Equatable} from "@/core/framework/equatable";

export class Cubit<State extends Equatable<State>> extends BlocBase<State> {
    constructor(initialState: State) {
        super(initialState);
    }

    // Method to update state explicitly
    emit(newState: State): void {
        super.emit(newState);
    }
}