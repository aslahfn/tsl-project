import { Controller, Get, Param, Query } from '@nestjs/common';
import { FixturesService } from './fixtures.service';

@Controller('fixtures')
export class FixturesController {
  constructor(private readonly fixturesService: FixturesService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.fixturesService.findAll(status);
  }

  @Get('results')
  findResults() {
    return this.fixturesService.findResults();
  }

  @Get('live')
  findLive() {
    return this.fixturesService.findLive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fixturesService.findOne(id);
  }
}
