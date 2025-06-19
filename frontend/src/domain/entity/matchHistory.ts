import type {MatchHistoryItem} from "@/domain/entity/matchHistoryItem";

export interface MatchHistory {
    "totalCount":  number,
    "matches": MatchHistoryItem[],
}
