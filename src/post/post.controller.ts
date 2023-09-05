import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Posts } from './schemas/post.schema';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

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
    @Param('id') id: string
    ): Promise<Posts> {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto
    ) : Promise<Posts> {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string
    ) : Promise<Posts> {
    return this.postService.remove(id);
  }
}
