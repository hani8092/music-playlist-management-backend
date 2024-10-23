import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist } from './entities/playlist.entity';
import axios, { AxiosResponse } from 'axios';
import { AddSongsToPlaylistDto } from './dto/add-song-to-playlist.dto';

@Injectable()
export class PlaylistsService {
  private readonly clientId = '4986ccb6959d49baa2c36a8e1a6856ce';
  private readonly clientSecret = 'b3e184ef5bcc47a3ab199aaa06cd9961';
  private accessToken: string;

  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
  ) {}

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response: AxiosResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get access token from Spotify API',
      );
    }
  }

  async searchSongs(query: string): Promise<any> {
    const token = await this.getAccessToken();

    try {
      const response: AxiosResponse = await axios.get(
        'https://api.spotify.com/v1/search',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: query,
            type: 'track',
          },
        },
      );

      return response.data.tracks.items;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to search for songs on Spotify',
      );
    }
  }

  async findByUserId(userId: string): Promise<Playlist[]> {
    return await this.playlistModel.find({ user: userId }).exec();
  }

  async create(createPlaylistDto: {
    name: string;
    userID: String;
    description?: string;
  }): Promise<Playlist> {
    const newPlaylist = new this.playlistModel({
      name: createPlaylistDto.name,
      description: createPlaylistDto.description,
      user: createPlaylistDto.userID,
    });

    return await newPlaylist.save();
  }

  async addSongsToPlaylist(
    addSongsToPlaylistDto: AddSongsToPlaylistDto,
  ): Promise<Playlist> {
    const { playlistId, songIds } = addSongsToPlaylistDto;
    return await this.playlistModel
      .findByIdAndUpdate(
        playlistId,
        { $addToSet: { songs: { $each: songIds } } },
        { new: true },
      )
      .populate('songs');
  }

  async findAll(): Promise<Playlist[]> {
    return await this.playlistModel.find().exec();
  }

  async findById(id: string): Promise<Playlist | null> {
    return await this.playlistModel.findById(id).exec();
  }

  async update(
    id: string,
    updatePlaylistDto: { name?: string; description?: string },
  ): Promise<Playlist> {
    const updatedPlaylist = await this.playlistModel
      .findByIdAndUpdate(id, updatePlaylistDto, { new: true })
      .exec();
    if (!updatedPlaylist) {
      throw new NotFoundException(`Playlist not found`);
    }
    return updatedPlaylist;
  }

  async delete(id: string): Promise<void> {
    const result = await this.playlistModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Playlist not found`);
    }
  }
}
