import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './entities/playlist.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddSongsToPlaylistDto } from './dto/add-song-to-playlist.dto';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistService: PlaylistsService) {}

  @Post()
  async create(
    @Body()
    createPlaylistDto: {
      name: string;
      userID: String;
      description?: string;
    },
  ): Promise<Playlist> {
    return this.playlistService.create(createPlaylistDto);
  }

  @Post('add-songs')
  async addSongsToPlaylist(
    @Body() addSongsToPlaylistDto: AddSongsToPlaylistDto,
  ): Promise<Playlist> {
    return await this.playlistService.addSongsToPlaylist(addSongsToPlaylistDto);
  }

  @Get('user/:userId')
  async getPlaylistsByUserId(
    @Param('userId') userId: string,
  ): Promise<Playlist[]> {
    return this.playlistService.findByUserId(userId);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    const result = await this.playlistService.searchSongs(query);
    return result;
  }

  @Get()
  async findAll(): Promise<Playlist[]> {
    return this.playlistService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Playlist | null> {
    return this.playlistService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: { name?: string; description?: string },
  ): Promise<Playlist> {
    return this.playlistService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.playlistService.delete(id);
  }
}
