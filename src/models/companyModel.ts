import {ISocialNetwork} from "./ISocialNetwork";

export type CompanyTypes = 'store' | 'agency' | 'other';
export class CompanyModel {
    _id: any = '';

    name: string = '';

    type: CompanyTypes = 'store';

    companyId: string = '';

    description: string = '';

    tags: string[] = [];

    phone: string = '';

    storyTemplate: string = '';

    title: string = '';

    wallpaper: string = '';

    video: string = '';

    logo: string = '';

    facebook: ISocialNetwork = {} as ISocialNetwork;

    instagram: ISocialNetwork = {} as ISocialNetwork;
}
