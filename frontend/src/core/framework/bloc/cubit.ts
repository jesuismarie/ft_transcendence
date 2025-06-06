import {BlocBase} from "@/core/framework/bloc/blocBase";
import type {Equatable} from "@/core/framework/core/equatable";

export class Cubit<State extends Equatable<State>> extends BlocBase<State> {
    constructor(initialState: State) {
        super(initialState);
    }

    // Method to update state explicitly
    emit(newState: State): void {
        super.emit(newState);
    }
}