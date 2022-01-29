import { applyDecorators, UseGuards } from "@nestjs/common";
import { ACGuard, Role, UseRoles } from "nest-access-control";
import { AuthJwtGuard } from "../../guards/auth-jwt.guard";

export const Auth = (...roles: Role[]) => {
    return applyDecorators(
        UseGuards(AuthJwtGuard, ACGuard),
        UseRoles(...roles)
    )
}