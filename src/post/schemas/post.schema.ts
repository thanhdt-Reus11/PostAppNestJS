import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/user/schemas/user.schema";
import { Document } from "mongoose";




@Schema({timestamps: true})
export class Posts extends Document{
    @Prop()
    title: string;

    @Prop()
    content: string;

    @Prop()
    description: string;

    @Prop({default: false})
    isPublished: boolean;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    owner: User;
}

export const PostSchema = SchemaFactory.createForClass(Posts);