import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users.controller';
import { FeaturesController } from './features.controller';
import { StationController } from './station.controller';

@Module({
  imports: [AuthModule],
  controllers: [HealthController, UsersController, FeaturesController, StationController],
  providers: [PrismaService],
})
export class AppModule {}