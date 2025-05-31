import {container} from "tsyringe";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository.ts";
import {AuthLogic} from "@/presentation/features/oauth/logic/auth_logic.ts";
import {loadHomePage} from "@/presentation/templates/templates.ts";

export function logoutCallback() {
    const googleLogoutButton = document.getElementById('logout-btn');
    if (!googleLogoutButton)
        return;

    googleLogoutButton.addEventListener('click', async () => {
        const authRepository = container.resolve<RemoteAuthRepository>('RemoteAuthRepository');
        const authLogic = new AuthLogic(authRepository);
        await authLogic.logout();
        loadHomePage();
    });
}