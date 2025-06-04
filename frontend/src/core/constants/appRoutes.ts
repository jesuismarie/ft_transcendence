import {ProfileScreen} from "@/presentation/features/profile/view/profileScreen";
import {RegisterScreen} from "@/presentation/features/auth/view/register_screen";
import {PongGameScreen} from "@/presentation/features/pongGame/view/pongGameScreen";

export abstract class AppRoutes {
    static root: string = '/';
    static register: string = '/register';
    static login: string = '/login';
    static profile: string = '/profile'
    static profileDetails: string = '/profile/:id';
    static game: string = '/game'
    static notFound: string = '/404'
}