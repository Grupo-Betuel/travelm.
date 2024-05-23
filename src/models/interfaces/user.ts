import {BaseModel} from "./BaseModel";

export type UserRoleTypes = 'user' | 'admin' | 'accountant' | 'client' | 'driver';
export default interface IUser  extends BaseModel {
    username?: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    role: UserRoleTypes;
}
