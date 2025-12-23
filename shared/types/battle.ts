export interface BattleResultDto {
  id: string;
  matchKey: string;
  pokemon1Id: number;
  pokemon1Name: string;
  pokemon2Id: number;
  pokemon2Name: string;
  winnerId: number | null;
  winnerName: string;
  narration: string;
  provider: string;
  model: string;
  promptVersion: string;
  timestamp: string; // serialized Date
}


