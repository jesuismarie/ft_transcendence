import {ApiClient} from "@/core/network/apiClient.ts";
import { container, injectable } from 'tsyringe';
import {RemoteAuthRepositoryImpl} from "@/data/repository/remote_auth_repository_impl.ts";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository.ts";
import type {PersistenceService} from "@/core/services/persistance_service.ts";
import {PersistenceServiceImpl} from "@/core/services/persistance_service_impl.ts";
import { getCurrentUserId } from "@/utils/user";

export async function configureDependencies() {
    console.log("configureDependencies registered");
    container.register('ApiClient', {useClass: ApiClient});
    container.register<RemoteAuthRepository>("RemoteAuthRepository", {
        useClass: RemoteAuthRepositoryImpl,
    });

    const backendUrl = "ws://localhost:5002/ws";

    container.register<PersistenceService>("PersistenceService", {
        useFactory: () => new PersistenceServiceImpl(backendUrl),
    });
}

