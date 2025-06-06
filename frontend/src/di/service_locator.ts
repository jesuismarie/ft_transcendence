import {ApiClient} from "@/core/network/apiClient";
import {container, Lifecycle} from 'tsyringe';
import {RemoteAuthRepositoryImpl} from "@/data/repository/remote_auth_repository_impl";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import type {PersistenceService} from "@/core/services/persistance_service";
import {PersistenceServiceImpl} from "@/core/services/persistance_service_impl";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {UserRemoteRepositoryImpl} from "@/data/repository/userRemoteRepositoryImpl";
import type {PreferenceService} from "@/core/services/preference_service";
import {PreferenceServiceImpl} from "@/core/services/preferenceServiceImpl";
import type {TournamentRemoteRepository} from "@/domain/respository/tournamentRemoteRepository";
import {TournamentRemoteRepositoryImpl} from "@/data/repository/tournamentRemoteRepositoryImpl";
import type {TwoFARepository} from "@/domain/respository/twoFARepository";
import {TwoFARepositoryImpl} from "@/data/repository/twoFARepositoryImpl";
import type {FriendAddResponse} from "@/domain/entity/friendAddResponse";
import type {FriendRepository} from "@/domain/respository/friendRepository";
import {FriendRepositoryImpl} from "@/data/repository/friendRepositoryImpl";

export async function configureDependencies() {
    container.register('ApiClient', {useClass: ApiClient});
    container.register<RemoteAuthRepository>("AuthRepository", {
        useClass: RemoteAuthRepositoryImpl,
    });
    container.register<TournamentRemoteRepository>("TournamentRepository", {
        useClass: TournamentRemoteRepositoryImpl,
    });
    container.register<PreferenceService>("PreferenceService", {
        useClass: PreferenceServiceImpl,
    });

    container.register<UserRemoteRepository>("UserRepository", {
        useClass: UserRemoteRepositoryImpl,
    });
    container.register<TwoFARepository>("TwoFARepository", {
        useClass: TwoFARepositoryImpl,
    });
    container.register<FriendRepository>("FriendRepository", {
        useClass: FriendRepositoryImpl,
    });

}


