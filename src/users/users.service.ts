import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ResponseDto, ResponseStatus } from 'src/common/response.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<ResponseDto> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const createdUser = await new this.userModel({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      });
      await createdUser.save();

      return {
        code: HttpStatus.OK,
        message: 'User created sucessfully',
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong!!');
    }
  }

  async getTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            id: userId,
            email,
          },
          {
            secret: 'secret',
            expiresIn: '30d',
          },
        ),
        this.jwtService.signAsync(
          {
            id: userId,
            email,
          },
          {
            secret: 'secret',
            expiresIn: '30d',
          },
        ),
      ]);
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (err) {
      console.log('error while get tokens', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async signIn(authCredentialsDto: AuthDto, @Res() res): Promise<ResponseDto> {
    const { email, password } = authCredentialsDto;
    try {
      const user = await this.findByEmail(email);

      if (!user.email) {
        return res.status(404).json({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found.',
          status: ResponseStatus.ERROR,
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({
          code: HttpStatus.BAD_REQUEST,
          message: `Password didn't match.`,
          status: ResponseStatus.ERROR,
        });
      }

      const tokens = await this.getTokens(user._id.toString(), user.email);

      return res.status(200).json({
        code: HttpStatus.OK,
        message: 'Welcome aboard!',
        status: ResponseStatus.SUCCESS,
        response: { tokens: tokens, user: user },
      });
    } catch (error) {
      throw new InternalServerErrorException('something bad happened', error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
