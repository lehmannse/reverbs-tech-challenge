import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'battle_results' })
export class BattleResult {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  pokemon1Name!: string;

  @Column()
  pokemon2Name!: string;

  @Column()
  winnerName!: string;

  @CreateDateColumn()
  timestamp!: Date;
}


