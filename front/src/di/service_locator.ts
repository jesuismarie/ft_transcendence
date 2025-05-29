import {ApiClient} from "@/core/network/apiClient.ts";
import { container, injectable } from 'tsyringe';
import {RemoteAuthRepositoryImpl} from "@/data/repository/remote_auth_repository_impl.ts";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository.ts";

export function configureDependencies() {
    console.log("configureDependencies registered");
    container.register('ApiClient', {useClass: ApiClient});
    container.register<RemoteAuthRepository>("RemoteAuthRepository", {
        useClass: RemoteAuthRepositoryImpl,
    });
}

