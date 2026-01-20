import { Module } from '@nestjs/common';
import { ClashService } from './clash.service';
import { ClashController } from './clash.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [ClashService, TasksService],
  controllers: [ClashController],
})
export class ClashModule {}
