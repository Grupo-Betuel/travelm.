import {BaseModel} from "./BaseModel";

export type UserRoleTypes = 'admin' | 'employee';
export type UserTypes = 'organization' | 'agency';

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
