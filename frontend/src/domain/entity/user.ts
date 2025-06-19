export interface User {
    id: number;
    username: string;
    email: string;
    is2FaEnabled: boolean;
    online: boolean;
    wins: number;
    losses: number;
    avatar?: string | null;
}

export function userFromJson(json: any): User {
    return {
        id: json.id,
        username: json.username,
        email: json.email,
        is2FaEnabled: json.is2FaEnabled,
        online: json.online,
        wins: json.wins,
        losses: json.losses,
        avatar: json.avatar ?? null,
    };
}

export function userToJson(user: User): any {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        is2FaEnabled: user.is2FaEnabled,
        online: user.online,
        wins: user.wins,
        losses: user.losses,
        avatar: user.avatar,
    };
}
