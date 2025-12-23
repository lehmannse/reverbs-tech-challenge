import { Body, Controller, Get, Post } from '@nestjs/common';
import { BattleService, SimulateBattleDto } from './battle.service.js';

@Controller('battle')
export class BattleController {
  constructor(private readonly service: BattleService) {}

  @Post('simulate')
  simulate(@Body() body: SimulateBattleDto) {
    return this.service.simulate(body);
  }

  @Get('results')
  results() {
    return this.service.findAll();
  }
}



