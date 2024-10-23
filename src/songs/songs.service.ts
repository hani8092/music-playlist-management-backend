import { Injectable } from '@nestjs/common';

import { UpdateSongDto } from './dto/update-song.dto';
import axios from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Song } from './entities/song.entity';

@Injectable()
export class SongsService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async getSpotifySongData(songId: string, accessToken: string) {
    const url = `https://api.spotify.com/v1/tracks/${songId}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching song data from Spotify:', error);
      throw error;
    }
  }

  async createSongFromSpotifyId(songId: string, accessToken: string) {
    const songData = await this.getSpotifySongData(songId, accessToken);

    const newSong = new this.songModel({
      name: songData.name,
      albumName: songData.album.name,
      spotifyLink: songData.external_urls.spotify,
    });

    return await newSong.save();
  }
  findAll() {
    return `This action returns all songs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} song`;
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    return `This action updates a #${id} song`;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }
}
