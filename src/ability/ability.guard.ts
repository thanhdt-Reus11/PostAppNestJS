import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AbilityFactory } from "./ability.factory";
import { Observable } from "rxjs";
import { CHECK_ABILITY, RequiredRule } from "./ability.decorator";
import { ForbiddenError } from "@casl/ability";

@Injectable()
export class AbilityGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private abilityFactory : AbilityFactory) {}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRules = this.reflector.getAllAndOverride<RequiredRule[]>(CHECK_ABILITY, [
            context.getHandler(),
            context.getClass
        ]);

        if(!requiredRules) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        const ability = this.abilityFactory.defineAbility(user);

        try {
            requiredRules.forEach((rule) => {
                ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject)
            });

            return true
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }

            throw new BadRequestException(error.message);
        }
    }
}