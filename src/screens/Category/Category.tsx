import {
  MainContentModal,
  ProductCard,
} from '@shared/components';
import { Affix, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { handleEntityHook } from '@shared/hooks/handleEntityHook';
import { ProductEntity } from '@shared/entities/ProductEntity';
import {
  useEffect, useState, ChangeEvent,
} from 'react';
import { useRouter } from 'next/router';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import { useContextualRouting } from 'next-use-contextual-routing';
import { DetailView } from '@components/DetailView';
import styles from './Category.module.scss';
import { deepMatch } from '../../utils/matching.util';
import { layoutId, navbarOptionsHeight } from '../../utils/layout.utils';

export interface CategoryProps {}
export type ProductPerCategoryType = {
  [N in string]: {
    products: ProductEntity[]
    title: string
  }
};

// eslint-disable-next-line no-empty-pattern
export function Category({}: CategoryProps) {
  const router = useRouter();
  const { makeContextualHref, returnHref } = useContextualRouting();
  const [categoryProducts, setCategoryProducts] = useState<ProductEntity[]>([]);
  const [showContextProductDetailModal, setShowContextProductDetailModal] = useState<boolean>();
  const {
    get: getProducts,
    [EndpointsAndEntityStateKeys.BY_CATEGORY]: categoryProductsData,
  } = handleEntityHook<ProductEntity>('products');

  useEffect(() => {
    const category = router.query.category as string;
    const productId = router.query.productId as string;
    if (category) {
      getProducts({
        endpoint: EndpointsAndEntityStateKeys.BY_CATEGORY,
        slug: category,
      });
    }

    setShowContextProductDetailModal(!!productId);
  }, [router.query]);

  useEffect(() => {
    setCategoryProducts(categoryProductsData?.data || []);
  }, [categoryProductsData?.data]);

  const goToProductDetail = (product: ProductEntity) => {
    router.push(
      makeContextualHref({ productId: product._id }),
      `/${product.company}/detail/${product._id}`,
      {
        shallow: true,
      },
    );
  };

  const onSearch = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const results = deepMatch<ProductEntity>(
      value,
      categoryProductsData?.data || [],
    );
    setCategoryProducts([...results]);
  };

  return (
    <div className={styles.CategoryWrapper}>
      <MainContentModal show={showContextProductDetailModal}>
        <DetailView returnHref={returnHref} />
      </MainContentModal>
      <div className={styles.CategoryContent}>
        <Affix
          className={styles.SidebarAffix}
          offsetTop={navbarOptionsHeight}
          target={() => document.getElementById(layoutId)}
        >
          <div className={styles.CategorySearchWrapper}>
            <Input
              className={styles.CategoryInputSearch}
              placeholder="Buscar"
              suffix={<SearchOutlined rev="" className="site-form-item-icon" />}
              bordered={false}
              onChange={onSearch}
              size="large"
            />
          </div>
          {!categoryProducts?.length && (
            <h2 className="p-xx-l">No hay resultados!</h2>
          )}
        </Affix>
        {categoryProducts.length > 0 && (
          <div className={styles.CategoryContentProducts}>
            <h2 className="mb-xx-l title">
              {categoryProducts[0].category.title}
            </h2>
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
  );
}
