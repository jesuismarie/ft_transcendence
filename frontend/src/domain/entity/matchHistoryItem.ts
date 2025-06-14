export interface MatchHistoryItem {
    "id": number,
    "opponent":  number,
    "opponentName": string,
    "status": string,
    "is_won": boolean,
    "score": MatchScore,
    "date": string,
}

export interface MatchScore {
    user: number,
    opponent: number,
    opponentName: string,
}