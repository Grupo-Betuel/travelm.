import { BaseEntity } from './BaseEntity';

export class CompanyEntity extends BaseEntity {
  name: string = '';

  companyId: string = '';

  phone: string = '';

  logo: string = '';

  wallpaper: string = '';

  title: string = '';

  description: string = '';

  video: string = '';

  tags?: string[];

  facebook?: any;

  instagram?: any;

  youtube?: any;
}

export const companyTitles: { [N in string]: string } = {
  betueldance: 'Betuel Dance Shop | Tienda Virtual',
  betuelgroup: 'Betuel Group | Tienda Virtual',
  betueltravel: 'Betuel Travel | Tienda Virtual',
  betueltech: 'Betuel Tech | Tienda Virtual',
};
