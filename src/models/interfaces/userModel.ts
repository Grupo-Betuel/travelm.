import {BaseModel} from "./BaseModel";
import {IOrganization} from "@/models/organizationModel";

export enum UserRoleTypes {
    ADMIN = 'admin',
    EMPLOYEE = 'employee',
}

export enum UserTypes {
    ORGANIZATION = 'organization',
    AGENCY = 'agency',
    DRIVER = 'driver'
}

export default interface IUser extends BaseModel {
    username?: string;
    firstName: string;
    lastName?: string;
    password?: string;
    phone: string;
    email?: string;
    role: UserRoleTypes;
    organization: IOrganization,
    type: UserTypes,
}
