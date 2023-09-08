import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { PostEntity } from "src/post/entities/post.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { User } from "src/user/schemas/user.schema";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete'
}


export type Subjects = InferSubjects<typeof UserEntity | typeof PostEntity> | 'all';


@Injectable()
export class AbilityFactory {
    defineAbility (user : User) {
        const { can, cannot, build } = new AbilityBuilder<MongoAbility<[Action, Subjects]>>(createMongoAbility);
        if(user.isAdmin) {
            can(Action.Manage, 'all');
        } else {
            can(Action.Read, UserEntity, {id: {$eq: user._id}});
            can(Action.Update, UserEntity, {id: {$eq: user._id}});
            can(Action.Read, PostEntity, {owner: {$eq : user._id.toString()}});
            can(Action.Read, PostEntity, {isPublished: true});
            can(Action.Update, PostEntity, {owner: {$eq : user._id.toString()}});
            can(Action.Delete, PostEntity, {owner: {$eq : user._id.toString()}});
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<{}>,
        });
    }
}
