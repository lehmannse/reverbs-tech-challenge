import { Injectable } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import type { PokemonBattleProfile } from '../pokemon/pokemon.service.js';

export type BattleAiOutcome = {
  winnerId: number;
  winnerName: string;
  narration: string;
  provider: 'gemini';
  model: string;
  promptVersion: string;
};

export const PROMPT_VERSION = 'v2-witcher-rounds';

function buildPersonaSystemInstruction() {
  return [
    'You are a dark fantasy writer narrating a duel in the literary voice of Andrzej Sapkowski (The Witcher style).',
    'Your prose should be vivid, grounded, and descriptive: sharp sensory detail, tension, and tactical combat beats.',
    'Do not mention The Witcher, Geralt, or any copyrighted characters by name. Maintain the tone, not direct references.',
    'Use a ROUND structure: 5–8 rounds. Each round should be 2–4 sentences.',
    'Incorporate real move names from pokemon1.moves and pokemon2.moves as attacks (at least 2 moves per Pokémon).',
    'You may describe bruising, exhaustion, and fainting, but NO gore. No slurs, hate, or sexual content.',
    'Avoid comedic/gamey UI language; write like a novel narrator describing combat.',
    'You MUST pick a winner (one of the two Pokémon).',
    'Output MUST be STRICT JSON ONLY (no markdown, no extra text).',
    'JSON schema: {"winnerId":number,"winnerName":string,"narration":string}',
    'winnerId MUST equal either pokemon1.id or pokemon2.id.',
    'In narration, label rounds clearly (e.g. "Round 1:", "Round 2:", etc.).',
    'End with a final line: "Winner: <NAME>."',
  ].join('\n');
}

function safeJsonParse<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(raw.slice(start, end + 1)) as T;
    }
    throw new Error('Gemini returned non-JSON output.');
  }
}

@Injectable()
export class BattleAiService {
  async narrateBattle(
    pokemon1: PokemonBattleProfile,
    pokemon2: PokemonBattleProfile
  ): Promise<BattleAiOutcome> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const candidates = [
      process.env.GEMINI_MODEL,
      // Commonly available Generative Language API model names (varies by key/project).
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-1.0-pro',
    ].filter(Boolean) as string[];

    const uniqCandidates = Array.from(new Set(candidates));

    const isModelNotFound = (err: any) => {
      const msg = String(err?.message ?? err ?? '');
      return (
        msg.includes('404') &&
        (msg.includes('models/') ||
          msg.includes('models') ||
          msg.includes('ListModels'))
      );
    };

    const payload = {
      pokemon1,
      pokemon2,
      rules: {
        decideWinner:
          'Choose a winner based on their stats/types/abilities and plausible combat narrative.',
        mustUseMoves:
          'Use the move names from each pokemon.moves list as attacks during the narration.',
        output: 'Strict JSON only.',
      },
    };

    const prompt = [
      'Write a round-by-round dark fantasy combat narration for the following matchup.',
      'IMPORTANT: Use move names from pokemon1.moves and pokemon2.moves as attacks.',
      'Return strict JSON only.',
      JSON.stringify(payload),
    ].join('\n');

    let lastErr: unknown = null;
    let chosenModel = uniqCandidates[0] ?? 'gemini-2.0-flash';
    let text = '';

    for (const modelName of uniqCandidates) {
      try {
        chosenModel = modelName;
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: buildPersonaSystemInstruction(),
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
          ],
        });

        const result = await model.generateContent(prompt);
        text = result.response.text();
        lastErr = null;
        break;
      } catch (e: any) {
        lastErr = e;
        // If this is a model-not-found error, try the next candidate.
        if (isModelNotFound(e)) continue;
        // Otherwise fail fast.
        throw e;
      }
    }

    if (lastErr) {
      throw lastErr;
    }

    const parsed = safeJsonParse<{
      winnerId: number;
      winnerName: string;
      narration: string;
    }>(text);

    const winnerId = Number(parsed.winnerId);
    if (![pokemon1.id, pokemon2.id].includes(winnerId)) {
      throw new Error(
        `Gemini winnerId must be ${pokemon1.id} or ${pokemon2.id}, got ${winnerId}.`
      );
    }

    return {
      winnerId,
      winnerName: String(parsed.winnerName ?? ''),
      narration: String(parsed.narration ?? '').trim(),
      provider: 'gemini',
      model: chosenModel,
      promptVersion: PROMPT_VERSION,
    };
  }
}
