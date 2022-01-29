import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';

export const UserParam = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        try {
            const request = ctx.switchToHttp().getRequest();
            var user = request.user;
            return data ? user && user[data] : user;
        } catch (error) {
            throw new ForbiddenException();
        }
    }
)