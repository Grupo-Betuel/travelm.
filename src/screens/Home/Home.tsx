import { MainContentModal, ProductCard, ScrollView } from '@shared/components';
import { Affix, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { handleEntityHook } from '@shared/hooks/handleEntityHook';
import { ProductEntity } from '@shared/entities/ProductEntity';
import {
  useEffect, useState, useMemo, ChangeEvent,
} from 'react';
import { useRouter } from 'next/router';
import { useContextualRouting } from 'next-use-contextual-routing';
import { DetailView } from '@components/DetailView';
import Head from 'next/head';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import styles from './Home.module.scss';
import { deepMatch } from '../../utils/matching.util';
import { layoutId, navbarOptionsHeight } from '../../utils/layout.utils';

export interface HomeProps {
  hideCarousel?: boolean;
}

export type ProductPerCategoryType = {
  [N in string]: {
    products: ProductEntity[];
    title: string;
  };
};

export function Home({}: HomeProps) {
  const router = useRouter();
  const { makeContextualHref, returnHref } = useContextualRouting();
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [showContextProductDetailModal, setShowContextProductDetailModal] = useState<boolean>();
  const { data: productsData } = handleEntityHook<ProductEntity>(
    'products',
    true,
  );
  const { data: companies } = handleEntityHook<CompanyEntity>(
    'companies',
    true,
  );
  const [productId, setProductId] = useState('');

  const productsPerCompanies = useMemo<ProductPerCategoryType>(() => {
    const data = products.reduce<ProductPerCategoryType>((acc, product) => {
      const category = product.company;
      const company = companies.find(
        (item) => item.companyId === product.company,
      ) || { name: 'Productos' };

      if (!acc[category]) {
        acc[category] = {
          products: [],
          title: company?.name,
        };
      }
      acc[category].products.push(product);
      return acc;
    }, {});
    return data || {};
  }, [products, companies]);

  useEffect(() => {
    const productId = router.query.productId as string;
    setShowContextProductDetailModal(!!productId);
    setProductId(productId);
  }, [router.query]);

  useEffect(() => {
    setProducts(productsData || []);
  }, [productsData]);

  const goToProductDetail = (product: ProductEntity) => {
    setProductId(product._id);
    router.push(
      makeContextualHref({ productId: product._id }),
      `/${product.company}/detail/${product._id}`,
      {
        shallow: true,
      },
    );
  };

  const handleSeeMore = (product: ProductEntity) => {
    router.push(`/${product.company}`);
  };

  const onSearch = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const results = deepMatch<ProductEntity>(value, productsData || []);
    setProducts([...results]);
  };

  return (
    <div className={styles.HomeWrapper}>
      <Head>
        <meta property="og:title" content="Tienda Virtual de Grupo Betuel" />
        <meta property="og:description" content="Todo tipo de acccesorios" />
        <meta property="og:type" content="website" />
        <title>Grupo Betuel Ecommerce | Tienda Virtual</title>
        <meta name="description" content="Toda clase de articulos" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/wallpaper.png" />
        <meta property="og:video" content="/images/video.mp4" />
        <meta property="og:video:secure_url" content="/images/video.mp4" />
        <meta property="og:video:type" content="video/mp4" />
      </Head>
      <MainContentModal show={!!productId || showContextProductDetailModal}>
        <DetailView returnHref={returnHref} productId={productId} />
      </MainContentModal>
      {/* <div className={styles.LandingCarouselWrapper}> */}
      {/*  {!hideCarousel && <LandingCarousel />} */}
      {/* </div> */}
      <div className={styles.HomeContent}>
        <Affix
          className={styles.SidebarAffix}
          offsetTop={navbarOptionsHeight}
          target={() => document.getElementById(layoutId)}
        >
          <div>
            <div className={styles.HomeSearchWrapper}>
              {/* <Input placeholder="Borderless" bordered={false} /> */}
              <Input
                className={styles.HomeInputSearch}
                placeholder="Buscar"
                suffix={
                  <SearchOutlined rev="" className="site-form-item-icon" />
                }
                bordered={false}
                onChange={onSearch}
                size="large"
              />
            </div>
            {!products?.length && (
              <h2 className="p-xx-l">No hay resultados!</h2>
            )}
          </div>
        </Affix>
        {products.length > 0 && (
          <div className={styles.HomeContentProducts}>
            {Object.keys(productsPerCompanies).map((categoryId) => {
              const category = productsPerCompanies[categoryId];
              return (
                <ScrollView
                  wrapperClassName={
                    styles.HomeContentProductsScrollViewCategories
                  }
                  handleSeeMore={handleSeeMore}
                  handleProductClick={goToProductDetail}
                  products={category.products}
                  title={category.title}
                  key={`company-${categoryId}`}
                />
              );
            })}
            <h2 className="mb-xx-l title">Todos los Productos</h2>
            <div className={styles.HomeCardsGrid}>
              {products.map((item, i) => (
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
