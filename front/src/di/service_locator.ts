import {ApiClient} from "@/core/network/apiClient";
import { container, injectable } from 'tsyringe';
import {RemoteAuthRepositoryImpl} from "@/data/repository/remote_auth_repository_impl";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import type {PersistenceService} from "@/core/services/persistance_service";
import {PersistenceServiceImpl} from "@/core/services/persistance_service_impl";
import { getCurrentUserId } from "@/utils/user";

export async function configureDependencies() {
    console.log("configureDependencies registered");
    container.register('ApiClient', {useClass: ApiClient});
    container.register<RemoteAuthRepository>("RemoteAuthRepository", {
        useClass: RemoteAuthRepositoryImpl,
    });

    const backendUrl = "ws://localhost:5002/users/ws";

    container.register<PersistenceService>("PersistenceService", {
        useFactory: () => new PersistenceServiceImpl(backendUrl),
    });
}

