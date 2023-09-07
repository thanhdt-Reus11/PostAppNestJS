import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { Post } from "src/post/entities/post.entity";
import { Role } from "src/user/entities/user.entity";
import { User } from "src/user/schemas/user.schema";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete'
}


//export type Subjects = InferSubjects<typeof User | Post> | 'all';


@Injectable()
export class AbilityFactory {
    defineAbility (user : User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
        //const { can, cannot, build } = new AbilityBuilder(MongoAbility<[Action, Subjects]>);
        if(user.isAdmin) {
            cannot(Action.Manage, 'object', {email: {$ne: user.email}}).because('bo may nghi dung roi');
            //cannot(Action.Manage, User).because('Only admin');
        } else {
            can(Action.Read, 'all');
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<{}>,
        });
    }
}
