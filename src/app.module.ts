import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaylistsModule } from './playlists/playlists.module';
import { SongsModule } from './songs/songs.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(
      'mongodb+srv://hanipatel:ACRL5aq8mRy1d5jg@hani.lnyou.mongodb.net/music-playlist-management',
    ),
    UsersModule,
    PlaylistsModule,
    SongsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
