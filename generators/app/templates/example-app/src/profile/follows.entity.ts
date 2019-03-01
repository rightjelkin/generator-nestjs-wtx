import { IsEmail, Validate } from 'class-validator';
import * as crypto from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// import { CustomEmail } from '../user/CustomEmail';

@Entity('follows')
export class FollowsEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public followerId: number;

  @Column()
  public followingId: number;

}
