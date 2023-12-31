import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostSchema } from './schemas/post.schema';
import { AbilityModule } from 'src/ability/ability.module';
import { PostGateWay } from './post.gateway';

@Module({
  imports:[
    AbilityModule,
    MongooseModule.forFeature([{name: Posts.name, schema: PostSchema}],
      )],
  controllers: [PostController],
  providers: [PostService, PostGateWay],
})
export class PostModule {}
