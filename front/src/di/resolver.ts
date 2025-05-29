import {container} from "tsyringe";
import {ApiClient} from "@/core/network/apiClient.ts";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository.ts";

export const apiClient = container.resolve<ApiClient>('ApiClient');
export const authRepository = container.resolve<RemoteAuthRepository>('RemoteAuthRepository');