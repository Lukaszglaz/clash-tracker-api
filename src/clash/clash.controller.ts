import {
  Controller,
  Get,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClashService } from './clash.service';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Clash of Clans')
@Controller('clash')
export class ClashController {
  constructor(
    private readonly clashService: ClashService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('my-village')
  @ApiOperation({ summary: 'Pobiera dane wioski zalogowanego użytkownika' })
  async getMyVillage(@Request() req) {
    return this.clashService.getVillageDataByUserId(req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('my-clan')
  @ApiOperation({ summary: 'Pobiera dane klanu użytkownika' })
  async getMyClan(@Request() req) {
    return this.clashService.getClanDataByUserId(req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('history')
  @ApiOperation({ summary: 'Pobiera historię trofeów pod wykresy' })
  async getMyHistory(@Request() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { playerTag: true },
    });

    if (!user || !user.playerTag) {
      throw new NotFoundException(
        'Użytkownik nie ma przypisanego tagu gracza.',
      );
    }

    return this.prisma.playerHistory.findMany({
      where: { playerTag: user.playerTag },
      orderBy: { date: 'asc' },
      take: 20,
    });
  }
}
