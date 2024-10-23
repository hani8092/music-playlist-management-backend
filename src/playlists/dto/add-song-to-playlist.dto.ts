import { IsArray, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class AddSongsToPlaylistDto {
  @IsNotEmpty()
  playlistId: Types.ObjectId;

  @IsArray()
  @IsNotEmpty({ each: true })
  songIds: Types.ObjectId[];
}
