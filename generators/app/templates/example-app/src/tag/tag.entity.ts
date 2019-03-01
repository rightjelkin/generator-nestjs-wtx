import { IsEmail, Validate } from 'class-validator';
import * as crypto from 'crypto';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// import { CustomEmail } from './CustomEmail';

@Entity('tag')
export class TagEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public tag: string;

}
