import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'battle_results' })
@Index('ux_battle_match_key', ['matchKey'], { unique: true })
export class BattleResult {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Cache key for a matchup (order-independent), versioned by prompt:
   * `${promptVersion}:${minId}-${maxId}`
   * Used to avoid re-calling Gemini for the same pair and prompt version.
   */
  @Column()
  matchKey!: string;

  @Column('int')
  pokemon1Id!: number;

  @Column()
  pokemon1Name!: string;

  @Column('int')
  pokemon2Id!: number;

  @Column()
  pokemon2Name!: string;

  @Column('int', { nullable: true })
  winnerId!: number | null;

  @Column()
  winnerName!: string;

  @Column('text')
  narration!: string;

  @Column({ default: 'gemini' })
  provider!: string;

  @Column({ default: 'gemini-1.5-flash' })
  model!: string;

  @Column({ default: 'v1' })
  promptVersion!: string;

  @CreateDateColumn()
  timestamp!: Date;
}



