import { Body, Controller, Get, Param, Put, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './auth/jwt.guard';

@Controller('v1/features')
@UseGuards(JwtAuthGuard)
export class FeaturesController {
  constructor(private prisma: PrismaService) {}

  private async resolveTenantIdOrThrow(req: any): Promise<string> {
    const slugOrId = req.header('X-Tenant-Id');
    if (!slugOrId) throw new NotFoundException('Missing X-Tenant-Id');
    const tenant = await this.prisma.tenant.findUnique({ where: { slug: slugOrId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant.id;
  }

  @Get()
  async list(@Req() req: any) {
    const tenantId = await this.resolveTenantIdOrThrow(req);
    const flags = await this.prisma.featureFlag.findMany({ where: { tenantId } });
    return flags.map(f => ({ key: f.key, value: f.value }));
  }

  @Put(':key')
  async set(@Req() req: any, @Param('key') key: string, @Body() body: any) {
    const tenantId = await this.resolveTenantIdOrThrow(req);
    const value = String(body?.value ?? '');
    const up = await this.prisma.featureFlag.upsert({
      where: { tenantId_key: { tenantId, key } },
      update: { value },
      create: { tenantId, key, value },
    });
    return { key: up.key, value: up.value };
  }
}