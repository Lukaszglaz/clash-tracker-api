import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClashService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async getVillageDataByUserId(userId: number) {
    return this.getPlayerByUserId(userId);
  }

  async getPlayerByUserId(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.playerTag) {
      throw new NotFoundException(
        'Użytkownik nie ma przypisanego tagu gracza.',
      );
    }

    return this.getPlayer(user.playerTag);
  }

  async getClanDataByUserId(userId: number) {
    const player = await this.getPlayerByUserId(userId);

    const rawData = player.rawDetails as any;
    if (!rawData.clan || !rawData.clan.tag) {
      throw new BadRequestException('Gracz nie należy do żadnego klanu.');
    }

    const clanTag = rawData.clan.tag;
    const formattedTag = clanTag.replace('#', '%23');
    const url = `${process.env.COC_BASE_URL}/clans/${formattedTag}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${process.env.COC_API_KEY}`,
            Accept: 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Nie udało się pobrać danych klanu.',
      );
    }
  }

  async getPlayer(tag: string) {
    const baseUrl = process.env.COC_BASE_URL;
    const apiKey = process.env.COC_API_KEY;

    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
    const formattedTag = cleanTag.replace('#', '%23');
    const url = `${baseUrl}/players/${formattedTag}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
          },
        }),
      );

      const data = response.data;

      return await this.prisma.player.upsert({
        where: { tag: cleanTag },
        update: {
          name: data.name,
          townHallLevel: data.townHallLevel,
          rawDetails: data,
        },
        create: {
          tag: cleanTag,
          name: data.name,
          townHallLevel: data.townHallLevel,
          rawDetails: data,
        },
      });
    } catch (error) {
      const cachedPlayer = await this.prisma.player.findUnique({
        where: { tag: cleanTag },
      });

      if (cachedPlayer) return { ...cachedPlayer, _source: 'cache' };

      throw new InternalServerErrorException(
        `Błąd API CoC dla tagu ${cleanTag}`,
      );
    }
  }
}
