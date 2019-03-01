import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';

@ApiBearerAuth()
@ApiUseTags('tags')
@Controller('tags')
export class TagController {

  constructor(private readonly tagService: TagService) {}

  @Get()
  public async findAll(): Promise<TagEntity[]> {
    return await this.tagService.findAll();
  }

}
