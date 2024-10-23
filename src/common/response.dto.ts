import { HttpStatus } from '@nestjs/common';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class ResponseDto {
  @IsEnum(ResponseStatus)
  status: ResponseStatus;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(HttpStatus)
  code: HttpStatus;

  @IsOptional()
  @IsObject()
  response?: object;
}
