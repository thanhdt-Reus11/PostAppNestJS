import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './common/guards/access.guard';
import { UserModule } from './user/user.module';
import { AbilityModule } from './ability/ability.module';
import { RoleGuard } from './common/guards/role.guard';
import { SocketIOAdapter } from './socket-io-adapter';

@Module({
  imports: [
    PostModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [PostModule, ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DB_USER')}:${configService.get(
          'DB_PASSWORD',
        )}@${configService.get('DB_HOST')}/${configService.get('DB_NAME')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    AbilityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
    ],
})
export class AppModule {}
