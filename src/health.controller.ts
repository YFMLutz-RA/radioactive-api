import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('v1')
export class HealthController {
  constructor(private prisma: PrismaService) {}
  @Get('healthz')
  async healthz() {
    await this.prisma.$queryRaw`SELECT 1`; // ping DB
    return { ok: true };
  }
}
