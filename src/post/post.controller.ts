import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, ForbiddenException, BadRequestException, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Posts } from './schemas/post.schema';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from './entities/post.entity';
import { CheckAbility } from '../ability/ability.decorator';
import { AbilityGuard } from 'src/ability/ability.guard';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly abilityFactory : AbilityFactory
    ) {}

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req
    ): Promise<Posts> {
    return this.postService.create(createPostDto, req.user);
  }

  @Get()
  async findAll(
    @Query() query: ExpressQuery,
    @Req() req : any
    ): Promise<Posts[]> {
    return this.postService.findAll(query, req.user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req : any
    ): Promise<Posts> {
    const data = await this.postService.findOne(id);
    const post = new PostEntity();
    post.id = data._id,
    post.isPublished = data.isPublished,
    post.owner = data.owner.toString()

    const ability = this.abilityFactory.defineAbility(req.user);
    try {
      ForbiddenError
                .from(ability)
                .throwUnlessCan(Action.Read, post);
      return data;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
    }
    throw new BadRequestException('Bad request');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto
    ) : Promise<Posts> {
    return this.postService.update(id, updatePostDto);
  }

  @UseGuards(AbilityGuard)
  @CheckAbility({action: Action.Delete, subject: PostEntity})
  @Delete(':id')
  async remove(
    @Param('id') id: string
    ) : Promise<Posts> {
    return this.postService.remove(id);
  }
}

