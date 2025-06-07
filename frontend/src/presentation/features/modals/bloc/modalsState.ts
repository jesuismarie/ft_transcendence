// Define possible statuses as enum
import type {Equatable} from "@/core/framework/core/equatable";
import {isEqual} from "lodash";
import type {User} from "@/domain/entity/user";


export class ModalsState implements Equatable<ModalsState>{
    readonly isTournamentModalOpen: boolean;
    readonly isSearchModalOpen: boolean;
    readonly isFriendsModalOpen: boolean;
    readonly isEditProfileModalOpen: boolean;

    constructor(params: {
        isTournamentModalOpen?: boolean;
        isSearchModalOpen?: boolean;
        isFriendsModalOpen?: boolean;
        isEditProfileModalOpen?: boolean;
    }) {
        this.isTournamentModalOpen = params.isTournamentModalOpen ?? false;
        this.isSearchModalOpen = params.isSearchModalOpen ?? false;
        this.isFriendsModalOpen = params.isFriendsModalOpen ?? false;
        this.isEditProfileModalOpen = params.isEditProfileModalOpen ?? false;
    }

    copyWith(params: Partial<{
        isTournamentModalOpen?: boolean;
        isSearchModalOpen?: boolean;
        isFriendsModalOpen?: boolean;
        isEditProfileModalOpen?: boolean;
    }>): ModalsState {
        return new ModalsState({
            isTournamentModalOpen: params.isTournamentModalOpen ?? this.isTournamentModalOpen,
            isSearchModalOpen: params.isSearchModalOpen ?? this.isSearchModalOpen,
            isFriendsModalOpen: params.isFriendsModalOpen ?? this.isFriendsModalOpen,
            isEditProfileModalOpen: params.isEditProfileModalOpen ?? this.isEditProfileModalOpen,
        });
    }

    equals(value: ModalsState): boolean {
        return isEqual(value, this);
    }
}
