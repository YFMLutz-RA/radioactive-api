import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Require X-Tenant-Id on all routes except auth + health
  app.use((req: any, _res: any, next: any) => {
    const path: string = req.path as string;
    const skip = path.startsWith('/v1/auth') || path.startsWith('/v1/healthz');

    if (!skip) {
      const tenantSlug = req.header('X-Tenant-Id');
      if (!tenantSlug) {
        throw new BadRequestException('Missing X-Tenant-Id');
      }
    }

    // Attach for downstream handlers/controllers
    req.tenantId = req.header('X-Tenant-Id') || null;
    next();
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(`API listening on :${port}`);
}

bootstrap();