import fs from 'fs';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { ProductEntity } from '@shared/entities/ProductEntity';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import { BaseEntity } from '@shared/entities/BaseEntity';

export type CachedResourceType = 'companies' | 'products' | 'categories';
export const getCachePath = (
  id: string,
  type: CachedResourceType,
) => `data/${type}/${id}.json`;

export async function setCachedResource<T>(product: T & BaseEntity, type: CachedResourceType, id?: string) {
  product && await fs.writeFileSync(getCachePath(id || product._id, type), JSON.stringify(product));
}
export async function getCachedResources<T>(id: string, type: CachedResourceType) {
  if (!id) return;
  if (await fs.existsSync(getCachePath(id, type))) {
    const data = JSON.parse((await fs.readFileSync(getCachePath(id, type), 'utf8')) || '{}') as T;
    return JSON.stringify(data) === '{}' ? undefined : data;
  }
}
