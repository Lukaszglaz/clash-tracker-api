import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClashService } from './clash.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private prisma: PrismaService,
    private clash: ClashService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncPlayerData() {
    this.logger.log('Rozpoczynam nocną synchronizację danych...');

    const players = await this.prisma.player.findMany();

    for (const player of players) {
      try {
        const data = await this.clash.getPlayer(player.tag);
        const raw = data.rawDetails as any;

        await this.prisma.playerHistory.create({
          data: {
            playerTag: player.tag,
            trophies: raw.trophies,
            expLevel: raw.expLevel,
          },
        });
        this.logger.log(`Zsynchronizowano: ${player.tag}`);
      } catch (e) {
        this.logger.error(
          `Błąd synchronizacji dla ${player.tag}: ${e.message}`,
        );
      }
    }
  }
}
