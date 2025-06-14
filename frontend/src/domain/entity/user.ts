export interface User {
    id:			number;
    username:	string;
    email:		string;
    online:     boolean;
    wins:		number;
    losses:		number;
    avatar?:	string | null;
}

export function userFromJson(json: any): User {
    return {
        id: json.id,
        username: json.username,
        email: json.email,
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
        online: user.online,
        wins: user.wins,
        losses: user.losses,
        avatar: user.avatar,
    };
}
