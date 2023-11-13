import {
  IProductParam, IProductSaleParam, ProductEntity, ProductParamTypes,
} from '@shared/entities/ProductEntity';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import { BETUEL_GROUP_ECOMMERCE_URL } from './constants/url.constants';

export const getProductUrl = (product: ProductEntity) => `${BETUEL_GROUP_ECOMMERCE_URL}${product.company}/products/${product.slug}`;
export const getCompanyUrl = (company: CompanyEntity) => `${BETUEL_GROUP_ECOMMERCE_URL}${company.companyId}`;
export function generateProductSitemapXML(product: ProductEntity): string {
  const productUrl = getProductUrl(product);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  xml += '<url>\n';
  xml += `<loc>${encodeURI(productUrl)}</loc>\n`;
  xml += `<lastmod>${new Date().toISOString()}</lastmod>\n`;
  xml += '<changefreq>weekly</changefreq>\n';
  xml += '<priority>0.8</priority>\n';
  xml += `<image:image>
${product.images.map((image) => `<image:loc>${image}</image:loc>\n`)}
</image:image>\n`;
  xml += '</url>\n';

  // if (product.productParams && product.productParams.length > 0) {
  //   product.productParams.forEach((param) => {
  //     xml += '<url>\n';
  //     xml += `<loc>${encodeURI(`https://example.com/product/${product._id}/param/${param._id}`)}</loc>\n`;
  //     xml += `<lastmod>${new Date().toISOString()}</lastmod>\n`;
  //     xml += '<changefreq>weekly</changefreq>\n';
  //     xml += '<priority>0.6</priority>\n';
  //     xml += '</url>\n';
  //
  //     if (param.relatedParams && param.relatedParams.length > 0) {
  //       param.relatedParams.forEach((relatedParam) => {
  //         xml += '<url>\n';
  //         xml += `<loc>${encodeURI(
  //           `https://example.com/product/${product._id}/param/${param._id}/relatedParam/${relatedParam._id}`,
  //         )}</loc>\n`;
  //         xml += `<lastmod>${new Date().toISOString()}</lastmod>\n`;
  //         xml += '<changefreq>weekly</changefreq>\n';
  //         xml += '<priority>0.4</priority>\n';
  //         xml += '</url>\n';
  //       });
  //     }
  //   });
  // }

  xml += '</urlset>';
  return xml;
}

export const generateCompanySitemapXml = (company: CompanyEntity): string => {
  const companyURl = getCompanyUrl(company);
  const urlsetHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';
  const urlsetFooter = '</urlset>';
  const companyUrl = `<url>
<loc>${companyURl}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.9</priority>
<image:image>
  <image:loc>${company.logo}</image:loc>
</image:image>
<image:image>
  <image:loc>${company.wallpaper}</image:loc>
</image:image>
<video:video>
  <video:content_loc>${company.video}</video:content_loc>
</video:video>
</url>`;
  const facebookUrl = `<url><loc>${company.facebook.url}</loc></url>`;
  const instagramUrl = `<url><loc>${company.instagram.url}</loc></url>`;

  // const tags = company.tags?.map((tag) => `<url><loc>${tag}</loc></url>`).join('');

  const sitemapXml = `${urlsetHeader}${companyUrl}${facebookUrl}${instagramUrl}${urlsetFooter}`;

  return sitemapXml;
};

export const generateCategorySitemapXml = (
  category: CategoryEntity,
): string => {
  const categoryUrl = `${BETUEL_GROUP_ECOMMERCE_URL}${category.company}/category/${category.slug}`;
  const urlsetHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';
  const urlsetFooter = '</urlset>';
  const categoryUrlElement = `<url>
<loc>${categoryUrl}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.9</priority>
<image:image>
  <image:loc>${category.wallpaper}</image:loc>
</image:image>
<video:video>
  <video:content_loc>${category.video}</video:content_loc>
</video:video>
</url>`;

  const sitemapXml = `${urlsetHeader}${categoryUrlElement}${urlsetFooter}`;

  return sitemapXml;
};

export const generateCompanyJsonLd = (company: CompanyEntity) => {
  const companyURl = `${BETUEL_GROUP_ECOMMERCE_URL}${company.companyId}`;
  const name = `${company.name} ${company?.title || ''}`;
  const jsonLd = {
    '@context': 'http://schema.org',
    '@type': 'Store',
    '@id': company.companyId,
    name,
    alternateName: company?.title || '',
    description: company.description,
    url: companyURl, // Replace with your actual website URL
    telephone: company.phone,
    logo: company.logo,
    image: company.wallpaper,
    video: company.video,
    sameAs: [
      {
        '@type': 'WebSite',
        '@id': 'Facebook',
        name: `Facebook ${name}`,
        url: company.facebook.url,
      },
      {
        '@type': 'WebSite',
        '@id': 'Instagram',
        name: `Instagram ${name}`,
        url: company.instagram.url,
      },
    ], // Add other social media URLs as needed
  };

  return JSON.stringify(jsonLd);
};

export function generateProductJSONLD(product: ProductEntity) {
  const productUrl = getProductUrl(product);
  const productName = `${product.name} ${product?.category?.title || ''}`;
  console.log('category ?', product.category);
  const jsonLD: any = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    '@id': productUrl,
    name: productName,
    image: product.image,
    description: product.description,
    sku: product.slug,
    url: productUrl,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'DOP', // Change currency as needed
      price: product.price,
      availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
      url: productUrl,
    },
    brand: {
      '@type': 'Brand',
      name: product.company,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '10', // Replace with actual rating if available
      reviewCount: 10, // Replace with actual review count if available
    },
    mpn: product.slug,
    // gtin13: '1234567890123', // Replace with actual GTIN-13 if available
    // gtin8: '12345678', // Replace with actual GTIN-8 if available
    // gtin14: '12345678901234', // Replace with actual GTIN-14 if available
    identifier: product.slug,
    // weight: '1.2', // Replace with actual weight if available
    // height: '10', // Replace with actual height if available
    // width: '5', // Replace with actual width if available
    // depth: '2', // Replace with actual depth if available
    category: {
      '@type': 'ProductCategory',
      name: product.category?.title || '',
    },
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'GodWord',
      value: product.GodWord,
    },
    review: [], // Add reviews if available
    hasVariant: [], // Add variants if available
    isRelatedTo: [], // Add related products if available
    isAccessoryOrSparePartFor: [], // Add related accessories if available
    manufacturer: {
      '@type': 'Organization',
      name: product.company,
    },
    model: {
      '@type': 'ProductModel',
      name: product.name,
    },
  };
  const { productParams } = product;

  if (productParams.length > 0) {
    jsonLD.additionalProperty = productParams.map((param) => ({
      '@type': 'PropertyValue',
      name: `${param.type} ${param.label}`,
      value: `${param.label} ${param.value}`,
    }));
  }

  const params = mergeParamsAndRelatedParams(productParams);
  if (params?.color?.length > 0) {
    jsonLD.color = params?.color.map((colorParam) => colorParam.value);
  }

  if (params?.size?.length > 0) {
    jsonLD.size = params?.size.map((sizeParam) => sizeParam.value);
  }

  // Add relatedParams information
  jsonLD.relatedParams = productParams
    .filter((param) => (param?.relatedParams?.length || 0) > 0)
    .map((param) => ({
      '@type': 'PropertyValue',
      name: `${param.type} ${param.label}`,
      value: param.relatedParams?.map((relatedParam) => `${relatedParam.label} ${relatedParam.value}`),
    }));

  console.log('jsonld', jsonLD);
  return JSON.stringify(jsonLD, null, 2);
}

export function mergeParamsAndRelatedParams(
  params: IProductSaleParam[],
): { [N in ProductParamTypes]: IProductSaleParam[] } {
  const mergedParams: any = {};
  params.forEach((item) => {
    const {
      type, label, value, quantity, relatedParams,
    } = item;

    // If the type is not present in mergedParams, initialize it
    if (!mergedParams[type]) {
      mergedParams[type] = [];
    }

    mergedParams[type].push({ label, value, quantity });

    // Recursively merge relatedParams
    if (relatedParams && relatedParams.length > 0) {
      const mergedRelatedParams = mergeParamsAndRelatedParams(relatedParams);
      const merged = {
        ...mergedParams,
        ...mergedRelatedParams,
      };
      Object.keys(merged).forEach((key) => {
        mergedParams[key] = (mergedParams[key] || [])
          .concat((mergedRelatedParams as any)[key] as any).filter(
            (item: any) => !!item,
          );
      });
    }
  });

  return mergedParams;
}
