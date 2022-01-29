import { RolesBuilder } from "nest-access-control";

export enum AppRoles {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
    MANAGER = 'MANAGER',
    AUTHORIZE = 'AUTHORIZE',
    STOCK  = 'STOCK'
}

export enum AppResources {
    USER = 'USER',
    MANAGER = 'MANAGER'
}

export const roles: RolesBuilder = new RolesBuilder();

roles.grant(AppRoles.ADMIN)
    .createOwn(AppResources.USER);