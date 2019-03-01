import { Repository } from 'typeorm';

import { Component, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  public async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }

}
