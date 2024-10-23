import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Song extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  albumName: string;

  @Prop({ required: true })
  spotifyLink: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);
