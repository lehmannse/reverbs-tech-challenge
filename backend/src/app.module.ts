import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config.js';
import { PokemonModule } from './pokemon/pokemon.module.js';
import { BattleModule } from './battle/battle.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig()
    }),
    PokemonModule,
    BattleModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}



