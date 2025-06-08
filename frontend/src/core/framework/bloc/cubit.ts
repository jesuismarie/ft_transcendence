import {BlocBase} from "@/core/framework/bloc/blocBase";
import type {Equatable} from "@/core/framework/core/equatable";
import {AuthState} from "@/presentation/features/auth/logic/auth_state";
import {ProfileState} from "@/presentation/features/profile/bloc/profileState";

export class Cubit<State extends Equatable<State>> extends BlocBase<State> {
    constructor(initialState: State) {
        super(initialState);
    }

    // Method to update state explicitly
    emit(newState: State): void {
        if (newState instanceof AuthState) {
            localStorage.setItem('auth_state', JSON.stringify(newState.toJson()));
        } else if (newState instanceof ProfileState) {
            localStorage.setItem('profile_state', JSON.stringify(newState.toJson()));
        }
        super.emit(newState);
    }
}