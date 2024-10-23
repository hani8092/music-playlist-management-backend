import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaylistsModule } from './playlists/playlists.module';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/music-playlist-management',
    ),
    UsersModule,
    PlaylistsModule,
    SongsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
