import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './common/events/events.module';
import { FixturesModule } from './fixtures/fixtures.module';
import { NewsModule } from './news/news.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PlayersModule } from './players/players.module';
import { PrismaModule } from './prisma/prisma.module';
import { InternalModule } from './internal/internal.module';
import { RealtimeModule } from './realtime/realtime.module';
import { StandingsModule } from './standings/standings.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EventsModule,
    AuthModule,
    TeamsModule,
    PlayersModule,
    FixturesModule,
    StandingsModule,
    NewsModule,
    NotificationsModule,
    RealtimeModule,
    InternalModule,
  ],
})
export class AppModule {}
