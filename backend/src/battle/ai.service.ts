import { Injectable } from '@nestjs/common';

@Injectable()
export class BattleAiService {
  // Placeholder for future AI integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async suggestWinner(pokemon1Name: string, pokemon2Name: string): Promise<string | null> {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return null;
    }
    // In the future, call an AI service using apiKey and inputs
    return null;
  }
}


