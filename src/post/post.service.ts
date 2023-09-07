import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from './schemas/post.schema';
import { Query  } from 'express-serve-static-core';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Posts.name) 
    private readonly postModel: mongoose.Model<Posts>
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Posts> {
    const data = Object.assign(createPostDto, {owner: user._id});
    const newPost = await this.postModel.create(data);
    return newPost;
  }

  async findAll(query: Query, user: User): Promise<Posts[]> {
    const {title, content, published, sort} = query;
    let searchOptions: any = {};

    if (title) {
      searchOptions.title = {
        $regex: title,
        $options: 'i'
      };
    }
    if (content) {
      searchOptions.content = {
        $regex: content,
        $options: 'i'
      };
    }
    if (published) {
      searchOptions.isPublished = published === 'true' ? true:false;
    }

    searchOptions.owner = user._id;

    let sortOptions: any = {};

    if (sort && typeof sort === 'string') {
      const sortFields = sort.split(',');

      for (const field of sortFields) {
        const sortOrder = field.startsWith('-') ? -1 : 1;
        const fieldName = field.replace(/^-/, '');
  
        sortOptions[fieldName] = sortOrder;
      }
    }
    else {
      sortOptions = { createdAt: -1 };
    }

    const posts = await this.postModel.find({...searchOptions}).sort(sortOptions);
    return posts;
  }

  async findOne(id: string) : Promise<Posts> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct id');
    }

    const data = await this.postModel.findById(id);

    if (!data) {
      throw new NotFoundException('Post not found');
    }

    return data;
  }

  async update(id: string, updatePostDto: UpdatePostDto) : Promise<Posts> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct id');
    } 

    const data = await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
      runValidators: true
    })

    if(!data) {
      throw new NotFoundException('Post not found');
    }

    return data;
  }

  async remove(id: string) : Promise<Posts> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct id');
    } 

    const data = await this.postModel.findByIdAndRemove(id, {
      new: true,
      runValidators: true
    })

    if(!data) {
      throw new NotFoundException('Post not found');
    }

    return data;
  }
}
