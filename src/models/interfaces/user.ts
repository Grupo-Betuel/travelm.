import {BaseModel} from "./BaseModel";

export enum UserRoleTypes {
    ADMIN = 'admin',
    EMPLOYEE = 'employee'
}

export enum UserTypes {
    ORGANIZATION = 'organization',
    AGENCY = 'agency'
}

export default interface IUser extends BaseModel {
    username?: string;
    firstName: string;
    lastName: string;
    password?: string;
    phone: string;
    email?: string;
    role: UserRoleTypes;
    organization: string,
    type: UserTypes,
}
