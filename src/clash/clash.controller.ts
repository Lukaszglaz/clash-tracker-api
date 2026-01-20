import { Controller, Get, Param } from '@nestjs/common';
import { ClashService } from './clash.service';

@Controller('clash')
export class ClashController {
  constructor(private readonly clashService: ClashService) {}

  @Get('player/:tag')
  async getPlayer(@Param('tag') tag: string) {
    return await this.clashService.getPlayer(tag);
  }
}
