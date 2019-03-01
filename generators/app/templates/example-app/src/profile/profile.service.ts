import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

import { Component, HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from './follows.entity';
import { ProfileData, ProfileRO } from './profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}

  public async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  public async findOne(options?: DeepPartial<UserEntity>): Promise<ProfileRO> {
    const user = await this.userRepository.findOne(options);
    delete user.id;
    if (user) { delete user.password; }
    return {profile: user};
  }

  public async findProfile(id: number, followingUsername: string): Promise<ProfileRO> {
    const _profile = await this.userRepository.findOne( {username: followingUsername});

    if (!_profile) { return; }

    const profile: ProfileData = {
      username: _profile.username,
      bio: _profile.bio,
      image: _profile.image,
    };

    const follows = await this.followsRepository.findOne( {followerId: id, followingId: _profile.id});

    if (id) {
      profile.following = !!follows;
    }

    return {profile};
  }

  public async follow(followerEmail: string, username: string): Promise<ProfileRO> {
    if (!followerEmail || !username) {
      throw new HttpException('Follower email and username not provided.', HttpStatus.BAD_REQUEST);
    }

    const followingUser = await this.userRepository.findOne({username});
    const followerUser = await this.userRepository.findOne({email: followerEmail});

    if (followingUser.email === followerEmail) {
      throw new HttpException('FollowerEmail and FollowingId cannot be equal.', HttpStatus.BAD_REQUEST);
    }

    const _follows = await this.followsRepository.findOne( {followerId: followerUser.id, followingId: followingUser.id});

    if (!_follows) {
      const follows = new FollowsEntity();
      follows.followerId = followerUser.id;
      follows.followingId = followingUser.id;
      await this.followsRepository.save(follows);
    }

    const profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: true,
    };

    return {profile};
  }

  public async unFollow(followerId: number, username: string): Promise<ProfileRO> {
    if (!followerId || !username) {
      throw new HttpException('FollowerId and username not provided.', HttpStatus.BAD_REQUEST);
    }

    const followingUser = await this.userRepository.findOne({username});

    if (followingUser.id === followerId) {
      throw new HttpException('FollowerId and FollowingId cannot be equal.', HttpStatus.BAD_REQUEST);
    }
    const followingId = followingUser.id;
    await this.followsRepository.delete({followerId, followingId});

    const profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: false,
    };

    return {profile};
  }

}
