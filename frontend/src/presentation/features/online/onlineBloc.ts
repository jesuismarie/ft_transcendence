import {Cubit} from "@/core/framework/bloc/cubit";
import type {Equatable} from "@/core/framework/core/equatable";
import type {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {Status} from "@/core/models/status";

export class OnlineState implements Equatable<OnlineState> {
    equals(value2: OnlineState): boolean {
        return false;
    }

}

export class OnlineBloc extends Cubit<OnlineState> {
    // persistenceService: PersistenceService;
    constructor(authBloc: AuthBloc) {
        super(new OnlineState());
        // this.persistenceService = new PersistenceServiceImpl(ApiConstants.websocketUrl, authBloc);
        // this.persistenceService.init();
    }

    getCurrentStatus(): Status {
        return Status.Offline;
        // return this.persistenceService.currentStatus();
    }
}