import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs'; // Sprawdź czy masz ten import!
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
    const formattedTag = tag.replace('#', '%23');
    const url = `${baseUrl}/players/${formattedTag}`;

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }),
    );

    const data = response.data;

    const savedPlayer = await this.prisma.player.upsert({
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

    return savedPlayer;
  }
}
