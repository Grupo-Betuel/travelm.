import { LandingCarousel, ProductCard, ScrollView } from '@shared/components';
import { Affix, Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { handleEntityHook } from '@shared/hooks/handleEntityHook';
import { ProductEntity } from '@shared/entities/ProductEntity';
import React, {
  useEffect, useState, useMemo, ChangeEvent,
} from 'react';
import { useRouter } from 'next/router';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { showProductDetailsHook } from '@shared/hooks/showProductDetailsHook';
import styles from './Company.module.scss';
import { layoutId, navbarOptionsHeight } from '../../utils/layout.utils';

export interface CompanyProps {
  company?: CompanyEntity;
}

export type ProductPerCategoryType = {
  [N in string]: {
    products: ProductEntity[];
    title: string;
    slug: string;
    company: string
  };
};

export function Company({ company }: CompanyProps) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>();
  const [companyProducts, setCompanyProducts] = useState<ProductEntity[]>([]);
  const {
    loading,
    get: getProducts,
    'by-company': companyProductsData,
  } = handleEntityHook<ProductEntity>('products');
  const {
    get: getCompany,
    [EndpointsAndEntityStateKeys.BY_REF_ID]: currentCompanyRes,
  } = handleEntityHook<CompanyEntity>('companies');
  const { goToProductDetail, ProductDetail } = showProductDetailsHook();
  // const [currentCompany, setCurrentCompany] = useState<CompanyEntity>(new CompanyEntity());

  const currentCompany: CompanyEntity = useMemo(
    () => currentCompanyRes?.data[0] || company || {} as CompanyEntity,
    [currentCompanyRes?.data, company],
  );

  useEffect(
    () => {
      if (!companyName || company?._id) return;
      getCompany({
        endpoint: EndpointsAndEntityStateKeys.BY_REF_ID,
        slug: companyName,
      });
    },
    [companyName],
  );

  const productsPerCategories = useMemo<ProductPerCategoryType>(() => {
    const data = companyProducts.reduce<ProductPerCategoryType>(
      (acc, product) => {
        if (!product.category?._id) return acc;
        const category = product.category?._id;

        if (!acc[category]) {
          acc[category] = {
            products: [],
            title: product.category?.title || 'Mas Productos',
            slug: product.category?.slug || 'mas-productos',
            company: product.company,
          };
        }
        acc[category].products = [...acc[category].products, product].sort((a, c) => (a.newArrival && !c.newArrival ? -1 : 1));
        return acc;
      },
      {},
    );
    return data || {};
  }, [companyProducts]);

  useEffect(() => {
    const company = router.query.company as string;

    if (company && company !== companyName) {
      getProducts({
        endpoint: EndpointsAndEntityStateKeys.BY_COMPANY,
        slug: company,
      });
      setCompanyName(company);
    }
  }, [router.query]);

  useEffect(() => {
    setCompanyProducts(companyProductsData?.data || []);
  }, [companyProductsData?.data]);

  const onSearch = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const deepMatch = (await import('../../utils/matching.util')).deepMatch;
    setSearchValue(value);
    const results = deepMatch<ProductEntity>(
      value,
      companyProductsData?.data || [],
    );
    setCompanyProducts([...results]);
  };

  useEffect(() => {
    if (currentCompany?.logo) {
      const fav = document.querySelector('link[rel="icon"]');
      fav?.setAttribute('href', currentCompany?.logo || '');
    }
  }, [currentCompany?.logo]);

  return (
    <>
      {(loading || (!companyProducts.length && !searchValue)) && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}
      <div className={styles.CompanyWrapper}>
        {company?.wallpaper
          && (
          <div className={styles.LandingCarouselWrapper}>
            <LandingCarousel images={[company?.wallpaper]} />
          </div>
          )}
        {ProductDetail}

        <div className={styles.CompanyContent}>
          <Affix
            className={styles.SidebarAffix}
            offsetTop={navbarOptionsHeight}
            target={() => document.getElementById(layoutId)}
          >
            <div>
              <div className={styles.CompanySearchWrapper}>
                <Input
                  value={searchValue}
                  className={styles.CompanyInputSearch}
                  placeholder="Buscar"
                  suffix={
                    <SearchOutlined rev="" className="site-form-item-icon" />
                  }
                  bordered={false}
                  onChange={onSearch}
                  size="large"
                />
              </div>
              {!companyProducts?.length && (
                <h2 className="p-xx-l">No hay resultados!</h2>
              )}
            </div>
          </Affix>
          {companyProducts.length > 0 && (
            <div className={styles.CompanyContentProducts}>
              {Object.keys(productsPerCategories).map((categoryId, i) => {
                const category = productsPerCategories[categoryId];
                const categoryStock = category.products
                  .map((item) => item.stock)
                  .reduce((a, b) => a + b, 0) || 0;

                if (categoryStock <= 0 || category.products.length <= 0) return;

                return (
                  <ScrollView
                    key={`scroll-view-category-${i}`}
                    wrapperClassName={
                      styles.CompanyContentProductsScrollViewCategories
                    }
                    seeMoreRoute={`/${category.company}/category/${category.slug}`}
                    handleProductClick={goToProductDetail}
                    products={category.products}
                    title={category.title}
                  />
                );
              })}
              <h2 className="mb-xx-l title">Todos los Productos</h2>
              <div className={styles.CompanyCardsGrid}>
                {companyProducts.map((item, i) => (
                  <ProductCard
                    key={`product-${i}`}
                    onClick={goToProductDetail}
                    product={item}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
