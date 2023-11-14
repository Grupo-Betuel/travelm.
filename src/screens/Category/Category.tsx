import { ProductCard } from '@shared/components';
import { Affix, Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { handleEntityHook } from '@shared/hooks/handleEntityHook';
import { ProductEntity } from '@shared/entities/ProductEntity';
import React, {
  useEffect, useState, ChangeEvent,
} from 'react';
import { useRouter } from 'next/router';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import { showProductDetailsHook } from '@shared/hooks/showProductDetailsHook';
import styles from './Category.module.scss';
import { layoutId, navbarOptionsHeight } from '../../utils/layout.utils';

export interface CategoryProps {}
export type ProductPerCategoryType = {
  [N in string]: {
    products: ProductEntity[];
    title: string;
  };
};

// eslint-disable-next-line no-empty-pattern
export function Category({}: CategoryProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>();
  const [categoryProducts, setCategoryProducts] = useState<ProductEntity[]>([]);
  const {
    loading,
    get: getProducts,
    [EndpointsAndEntityStateKeys.BY_CATEGORY]: categoryProductsData,
  } = handleEntityHook<ProductEntity>('products');
  const { goToProductDetail, ProductDetail } = showProductDetailsHook();

  useEffect(() => {
    const category = router.query.category as string;
    if (category) {
      getProducts({
        endpoint: EndpointsAndEntityStateKeys.BY_CATEGORY,
        slug: category,
      });
    }
  }, [router.query]);

  useEffect(() => {
    setCategoryProducts(categoryProductsData?.data || []);
  }, [categoryProductsData?.data]);

  const onSearch = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const deepMatch = (await import('../../utils/matching.util')).deepMatch;

    setSearchValue(value);
    const results = deepMatch<ProductEntity>(
      value,
      categoryProductsData?.data || [],
    );
    setCategoryProducts([...results]);
  };

  return (
    <>
      {(loading || (!categoryProducts.length && !searchValue)) && (
        <div className="loading">
          <Spin size="large" />
          spe
        </div>
      )}
      <div className={styles.CategoryWrapper}>
        {ProductDetail}
        <div className={styles.CategoryContent}>
          <Affix
            className={styles.SidebarAffix}
            offsetTop={navbarOptionsHeight}
            target={() => document.getElementById(layoutId)}
          >
            <div>
              <div className={styles.CategorySearchWrapper}>
                <Input
                  value={searchValue}
                  className={styles.CategoryInputSearch}
                  placeholder="Buscar"
                  suffix={
                    <SearchOutlined rev="" className="site-form-item-icon" />
                  }
                  bordered={false}
                  onChange={onSearch}
                  size="large"
                />
              </div>
              {!categoryProducts?.length && (
                <h2 className="p-xx-l">No hay resultados!</h2>
              )}
            </div>
          </Affix>
          {categoryProducts.length > 0 && (
            <div className={styles.CategoryContentProducts}>
              <h1 className="mb-xx-l title">
                {categoryProducts[0].category.title}
              </h1>
              <div className={styles.CategoryCardsGrid}>
                {categoryProducts.map((item, i) => (
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
