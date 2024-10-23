import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Song } from 'src/songs/entities/song.entity';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class Playlist extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Song.name }] })
  songs: Types.ObjectId[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
