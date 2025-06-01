import {container} from "tsyringe";
import {ApiClient} from "@/core/network/apiClient";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository.ts";
import type {PersistenceService} from "@/core/services/persistance_service.ts";

export function getPersistenceService(): PersistenceService {
    return container.resolve<PersistenceService>('PersistenceService');
}

export function getApiClient(): ApiClient {
    return container.resolve<ApiClient>('ApiClient');
}

export function getAuthRepository(): RemoteAuthRepository {
    return container.resolve<RemoteAuthRepository>('RemoteAuthRepository');
}