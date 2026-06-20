import { Module } from '@nestjs/common';
import { InternalController } from './internal.controller';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [RealtimeModule],
  controllers: [InternalController],
})
export class InternalModule {}
