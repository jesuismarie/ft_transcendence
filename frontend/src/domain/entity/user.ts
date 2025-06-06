export interface User {
    id:			number;
    username:	string;
    email:		string;
    wins:		number;
    losses:		number;
    avatar?:	string | null;
}