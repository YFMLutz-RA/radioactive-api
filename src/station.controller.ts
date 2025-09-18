import { Body, Controller, Get, Patch, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './auth/jwt.guard';

@Controller('v1/station')
@UseGuards(JwtAuthGuard)
export class StationController {
  constructor(private prisma: PrismaService) {}

  private async resolveTenantIdOrThrow(req: any): Promise<string> {
    const slugOrId = req.header('X-Tenant-Id');
    if (!slugOrId) throw new NotFoundException('Missing X-Tenant-Id');
    const tenant = await this.prisma.tenant.findUnique({ where: { slug: slugOrId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant.id;
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    const tenantId = await this.resolveTenantIdOrThrow(req);
    const profile = await this.prisma.stationProfile.findUnique({ where: { tenantId } });
    return profile ?? { streamUrl: null, timezone: null, locale: null };
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() body: any) {
    const tenantId = await this.resolveTenantIdOrThrow(req);
    const { streamUrl, timezone, locale } = body ?? {};
    const up = await this.prisma.stationProfile.upsert({
      where: { tenantId },
      update: { streamUrl, timezone, locale },
      create: { tenantId, streamUrl, timezone, locale },
    });
    return up;
  }
}