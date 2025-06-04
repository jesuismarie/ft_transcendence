import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import {container} from "tsyringe";
import {ApiClient} from "@/core/network/apiClient";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import type {PreferenceService} from "@/core/services/preference_service";
import type {TournamentRemoteRepository} from "@/domain/respository/tournamentRemoteRepository";
import type {TwoFARepository} from "@/domain/respository/twoFARepository";

export class Resolver {
    static authRepository(): RemoteAuthRepository {
        return  container.resolve<RemoteAuthRepository>('AuthRepository');}
    static userRepository(): UserRemoteRepository {
        return  container.resolve<UserRemoteRepository>('UserRepository');}
    static apiClient(): ApiClient {
        return  container.resolve<ApiClient>('ApiClient');}
    static preferenceService(): PreferenceService {
        return  container.resolve<PreferenceService>('PreferenceService');}
    static tournamentRepository(): TournamentRemoteRepository {
        return container.resolve<TournamentRemoteRepository>('TournamentRepository');
    }
    static twoFaRepository(): TwoFARepository {
        return  container.resolve<TwoFARepository>('TwoFARepository');
    }
}