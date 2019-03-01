import { Request } from 'express';
import { DeleteResult } from 'typeorm';

import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

import { ValidationPipe } from '../common/pipes/validation.pipe';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './user.decorator';
import { UserEntity } from './user.entity';
import { UserRO } from './user.interface';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiUseTags('user')
@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get('user')
  public async findMe(@User('email') email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  @Put('user')
  public async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto): Promise<UserEntity> {
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  public async create(@Body('user') userData: CreateUserDto): Promise<UserRO> {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  public async delete(@Param() params: any): Promise<DeleteResult> {
    return await this.userService.delete(params.slug);
  }

  @UsePipes(new ValidationPipe())
  @Post('users/login')
  public async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = {User: ' not found'};
    if (!_user) { throw new HttpException({errors}, 401); }

    const token = await this.userService.generateJWT(_user);
    const {email, username, bio, image} = _user;
    const user = {email, token, username, bio, image};
    return {user};
  }
}
