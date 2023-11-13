import { BaseEntity } from './BaseEntity';

export class CategoryEntity extends BaseEntity {
  title: string = '';

  company: string = '';

  description: string = '';

  wallpaper: string = '';

  video: string = '';

  slug: string = '';

  tags?: string[];
}
