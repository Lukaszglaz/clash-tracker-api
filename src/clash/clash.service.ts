import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClashService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async getPlayer(tag: string) {
    const baseUrl = process.env.COC_BASE_URL;
    const apiKey = process.env.COC_API_KEY;

    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
    const formattedTag = cleanTag.replace('#', '%23');
    const url = `${baseUrl}/players/${formattedTag}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        }),
      );

      const data = response.data;

      console.log('DOSTĘPNE TABLICE:', Object.keys(data));
      console.log('PEŁNY JSON:', JSON.stringify(data, null, 2));

      return await this.prisma.player.upsert({
        where: { tag: data.tag },
        update: {
          name: data.name,
          townHallLevel: data.townHallLevel,
          rawDetails: data,
        },
        create: {
          tag: data.tag,
          name: data.name,
          townHallLevel: data.townHallLevel,
          rawDetails: data,
        },
      });
    } catch (error) {
      const cachedPlayer = await this.prisma.player.findUnique({
        where: { tag: cleanTag },
      });

      if (cachedPlayer) return cachedPlayer;

      throw new Error(`Nie znaleziono gracza o tagu ${tag}`);
    }
  }
}
