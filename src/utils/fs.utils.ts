import fs from 'fs';
import { BaseEntity } from '@shared/entities/BaseEntity';
import * as path from 'path';
import * as os from 'os';
import { ProductEntity } from '@shared/entities/ProductEntity';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import { generateCategorySitemapXml, generateCompanySitemapXml, generateProductSitemapXML } from './seo.utils';

const tmpDir = os.tmpdir();

export type CachedResourceType = 'companies' | 'products' | 'categories';
export const getCachePath = (
  id: string,
  type: CachedResourceType,
) => path.join(tmpDir, `data/${type}/${id}.json`);

export async function setCachedResource<T>(
  product: T & BaseEntity,
  type: CachedResourceType,
  id?: string,
) {
  // fs.writeFile(getCachePath(id || product._id, type), JSON.stringify(product), () => {
  //   console.log('cached');
  // });
  product && await fs.writeFileSync(getCachePath(id || product._id, type), JSON.stringify(product));
}
export async function getCachedResources<T>(id: string, type: CachedResourceType) {
  if (!id) return;
  if (await fs.existsSync(getCachePath(id, type))) {
    const data = JSON.parse((await fs.readFileSync(getCachePath(id, type), 'utf8')) || '{}') as T;
    return JSON.stringify(data) === '{}' ? undefined : data;
  }
}

export function saveProductSitemap(product: ProductEntity) {
  const productSitemapPath = path.join(process.cwd(), 'public/sitemaps/products', `${product._id}.xml`);
  const productSitemapContent = generateProductSitemapXML(product);
  fs.writeFile(productSitemapPath, productSitemapContent, (err) => {
    if (err) {
      console.error(`Error writing to file ${productSitemapPath}:`, err);
    } else {
      // console.log(`File ${productSitemapPath} has been written.`);
    }
  });
}

export function saveCompanySitemap(company: CompanyEntity) {
  const companySitemapPath = path.join(process.cwd(), 'public/sitemaps/companies', `${company._id}.xml`);
  const companySitemapContent = generateCompanySitemapXml(company);
  fs.writeFile(companySitemapPath, companySitemapContent, (err) => {
    if (err) {
      console.error(`Error writing to file ${companySitemapPath}:`, err);
    } else {
      // console.log(`File ${companySitemapPath} has been written.`);
    }
  });
}

export function saveCategorySitemap(category: CategoryEntity) {
  const categorySitemapPath = path.join(process.cwd(), 'public/sitemaps/categories', `${category._id}.xml`);
  const categorySitemapContent = generateCategorySitemapXml(category);
  fs.writeFile(categorySitemapPath, categorySitemapContent, (err) => {
    if (err) {
      console.error(`Error writing to file ${categorySitemapPath}:`, err);
    } else {
      // console.log(`File ${categorySitemapPath} has been written.`);
    }
  });
}
