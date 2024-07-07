// import { ProductCard, ScrollView } from '@shared/components';
// import { Affix, Input, Spin } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
// import { handleEntityHook } from '@shared/hooks/handleEntityHook';
// import { ProductEntity } from '@shared/entities/ProductEntity';
// import React, {
//   useEffect, useState, useMemo, ChangeEvent,
// } from 'react';
// import { useRouter } from 'next/router';
// import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
// import { CompanyEntity } from '@shared/entities/CompanyEntity';
// import { showProductDetailsHook } from '@shared/hooks/showProductDetailsHook';
// import styles from './Company.module.scss';
// import { layoutId, navbarOptionsHeight, topbarOptionsHeight } from '../../utils/layout.utils';
//
// export interface CompanyProps {
//   company?: CompanyEntity;
// }
//
// export type ProductPerCategoryType = {
//   [N in string]: {
//     products: ProductEntity[];
//     title: string;
//     slug: string;
//     company: string
//   };
// };
//
// export function Company({ company }: CompanyProps) {
//   const router = useRouter();
//   const [companyName, setCompanyName] = useState<string>();
//   const [searchValue, setSearchValue] = useState<string>();
//   const [companyProducts, setCompanyProducts] = useState<ProductEntity[]>([]);
//   const {
//     loading,
//     get: getProducts,
//     'by-company': companyProductsData,
//   } = handleEntityHook<ProductEntity>('products');
//   const {
//     get: getCompany,
//     [EndpointsAndEntityStateKeys.BY_REF_ID]: currentCompanyRes,
//   } = handleEntityHook<CompanyEntity>('companies');
//   const { goToProductDetail, ProductDetail } = showProductDetailsHook();
//   // const [currentCompany, setCurrentCompany] = useState<CompanyEntity>(new CompanyEntity());
//
//   const currentCompany: CompanyEntity = useMemo(
//     () => currentCompanyRes?.data[0] || company || {} as CompanyEntity,
//     [currentCompanyRes?.data, company],
//   );
//
//   useEffect(
//     () => {
//       if (!companyName || company?._id) return;
//       getCompany({
//         endpoint: EndpointsAndEntityStateKeys.BY_REF_ID,
//         slug: companyName,
//       });
//     },
//     [companyName],
//   );
//
//   const productsPerCategories = useMemo<ProductPerCategoryType>(() => {
//     const data = companyProducts.reduce<ProductPerCategoryType>(
//       (acc, product) => {
//         if (!product.category?._id) return acc;
//         const category = product.category?._id;
//
//         if (!acc[category]) {
//           acc[category] = {
//             products: [],
//             title: product.category?.title || 'Mas Productos',
//             slug: product.category?.slug || 'mas-productos',
//             company: product.company,
//           };
//         }
//         acc[category].products = [...acc[category].products, product]
//           .sort((a, c) => (a.newArrival && !c.newArrival ? -1 : 1));
//         return acc;
//       },
//       {},
//     );
//     return data || {};
//   }, [companyProducts]);
//
//   useEffect(() => {
//     const company = router.query.company as string;
//
//     if (company && company !== companyName) {
//       getProducts({
//         endpoint: EndpointsAndEntityStateKeys.BY_COMPANY,
//         slug: company,
//       });
//       setCompanyName(company);
//     }
//   }, [router.query]);
//
//   useEffect(() => {
//     setCompanyProducts(companyProductsData?.data || []);
//   }, [companyProductsData?.data]);
//
//   const onSearch = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
//     const deepMatch = (await import('../../utils/matching.util')).deepMatch;
//     setSearchValue(value);
//     const results = deepMatch<ProductEntity>(
//       value,
//       companyProductsData?.data || [],
//     );
//     setCompanyProducts([...results]);
//   };
//
//   useEffect(() => {
//     if (currentCompany?.logo) {
//       const fav = document.querySelector('link[rel="icon"]');
//       fav?.setAttribute('href', currentCompany?.logo || '');
//     }
//   }, [currentCompany?.logo]);
//
//   return (
//     <>
//       {(loading || (!companyProducts.length && !searchValue)) && (
//         <div className="loading">
//           <Spin size="large" />
//         </div>
//       )}
//       <div className={styles.CompanyWrapper}>
//         {/* {company?.wallpaper */}
//         {/*  && ( */}
//         {/*  <div className={styles.LandingCarouselWrapper}> */}
//         {/*    <LandingCarousel images={[company?.wallpaper]} /> */}
//         {/*  </div> */}
//         {/*  )} */}
//         {ProductDetail}
//
//         <div className={styles.CompanyContent}>
//           <Affix
//             className={styles.SidebarAffix}
//             offsetTop={navbarOptionsHeight + topbarOptionsHeight}
//             target={() => document.getElementById(layoutId)}
//           >
//             <div>
//               <div className={styles.CompanySearchWrapper}>
//                 <Input
//                   value={searchValue}
//                   className={styles.CompanyInputSearch}
//                   placeholder="Buscar"
//                   suffix={
//                     <SearchOutlined rev="" className="site-form-item-icon" />
//                   }
//                   bordered={false}
//                   onChange={onSearch}
//                   size="large"
//                 />
//               </div>
//               {!companyProducts?.length && (
//                 <h2 className="p-xx-l">No hay resultados!</h2>
//               )}
//             </div>
//           </Affix>
//           {companyProducts.length > 0 && (
//             <div className={styles.CompanyContentProducts}>
//               {Object.keys(productsPerCategories).map((categoryId, i) => {
//                 const category = productsPerCategories[categoryId];
//                 const categoryStock = category.products
//                   .map((item) => item.stock)
//                   .reduce((a, b) => a + b, 0) || 0;
//
//                 if (categoryStock <= 0 || category.products.length <= 0) return;
//
//                 return (
//                   <ScrollView
//                     key={`scroll-view-category-${i}`}
//                     wrapperClassName={
//                       styles.CompanyContentProductsScrollViewCategories
//                     }
//                     seeMoreRoute={`/${category.company}/category/${category.slug}`}
//                     handleProductClick={goToProductDetail}
//                     products={category.products}
//                     title={category.title}
//                   />
//                 );
//               })}
//               <h2 className="mb-xx-l title">Todos los Productos</h2>
//               <div className={styles.CompanyCardsGrid}>
//                 {companyProducts.map((item, i) => (
//                   <ProductCard
//                     key={`product-${i}`}
//                     onClick={goToProductDetail}
//                     product={item}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// import dynamic from 'next/dynamic';
// import {
//   // Affix, Input,
//   Spin,
// } from 'antd';
// // import { SearchOutlined } from '@ant-design/icons';
// import { handleEntityHook } from '@shared/hooks/handleEntityHook';
// import { ProductEntity } from '@shared/entities/ProductEntity';
// import React, {
//   useEffect, useState, useMemo,
//   // ChangeEvent,
// } from 'react';
// import { useRouter } from 'next/router';
// import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
// import { CompanyEntity } from '@shared/entities/CompanyEntity';
// import { showProductDetailsHook } from '@shared/hooks/showProductDetailsHook';
// import { CategoryEntity } from '@shared/entities/CategoryEntity';
// import { IPaginatedResponse } from '@interfaces/pagination.interface';
// import styles from './Company.module.scss';
// // import {
// //   layoutId,
// //   navbarOptionsHeight,
// //   topbarOptionsHeight,
// // } from '../../utils/layout.utils';
//
// // Dynamically import heavy components
// const DynamicScrollView = dynamic(
//   () => import('@shared/components').then((mod) => mod.ScrollView),
//   { ssr: false },
// );
// const DynamicProductCard = dynamic(
//   () => import('@shared/components').then((mod) => mod.ProductCard),
//   { ssr: false },
// );
//
// export interface CompanyProps {
//   company?: CompanyEntity;
//   products?: ProductEntity[];
// }
//
// export type IProductPerCategory = {
//   category: CategoryEntity;
//   products: ProductEntity[];
// };
//
// export type ProductPerCategoryType = IPaginatedResponse<IProductPerCategory>;
//
// export function Company({ company, products }: CompanyProps) {
//   const router = useRouter();
//   const [companyName, setCompanyName] = useState<string>();
//   const [
//     searchValue,
//     // setSearchValue
//   ] = useState<string>();
//   const [companyProducts, setCompanyProducts] = useState<ProductEntity[]>(
//     products || [],
//   );
//
//   const {
//     loading,
//     get: getProducts,
//     'by-company': companyProductsData,
//     [EndpointsAndEntityStateKeys.PER_CATEGORY]: productsPerCategories,
//   } = handleEntityHook<ProductEntity>('products');
//
//   const {
//     get: getCompany,
//     [EndpointsAndEntityStateKeys.BY_REF_ID]: currentCompanyRes,
//   } = handleEntityHook<CompanyEntity>('companies');
//   const { goToProductDetail, ProductDetail } = showProductDetailsHook();
//
//   const currentCompany: CompanyEntity = useMemo(
//     () => currentCompanyRes?.data[0] || company || ({} as CompanyEntity),
//     [currentCompanyRes?.data, company],
//   );
//
//   useEffect(() => {
//     if (!companyName || company?._id) return;
//     getCompany({
//       endpoint: EndpointsAndEntityStateKeys.BY_REF_ID,
//       slug: companyName,
//     });
//   }, [companyName, company]);
//
//   // const productsPerCategories = useMemo<ProductPerCategoryType>(() => {
//   //   const data = companyProducts.reduce<ProductPerCategoryType>(
//   //     (acc, product) => {
//   //       if (!product.category?._id) return acc;
//   //       const category = product.category?._id;
//   //
//   //       if (!acc[category]) {
//   //         acc[category] = {
//   //           products: [],
//   //           title: product.category?.title || 'Mas Productos',
//   //           slug: product.category?.slug || 'mas-productos',
//   //           company: product.company,
//   //         };
//   //       }
//   //       acc[category].products = [...acc[category].products, product].sort(
//   //         (a, c) => (a.newArrival && !c.newArrival ? -1 : 1),
//   //       );
//   //       return acc;
//   //     },
//   //     {},
//   //   );
//   //   return data || {};
//   // }, [companyProducts]);
//
//   useEffect(() => {
//     const company = router.query.company as string;
//
//     if (company && company !== companyName && !products?.length) {
//       getProducts({
//         endpoint: EndpointsAndEntityStateKeys.BY_COMPANY,
//         slug: company,
//       });
//       setCompanyName(company);
//     }
//   }, [router.query]);
//
//   useEffect(() => {
//     companyProductsData?.data?.length
//       && setCompanyProducts(companyProductsData?.data || products || []);
//   }, [companyProductsData?.data]);
//
//   // const onSearch = async ({
//   //   target: { value },
//   // }: ChangeEvent<HTMLInputElement>) => {
//   //   const deepMatch = (await import('../../utils/matching.util')).deepMatch;
//   //   setSearchValue(value);
//   //   const results = deepMatch<ProductEntity>(
//   //     value,
//   //     companyProductsData?.data || [],
//   //   );
//   //   setCompanyProducts([...results]);
//   // };
//
//   useEffect(() => {
//     if (currentCompany?.logo) {
//       const fav = document.querySelector('link[rel="icon"]');
//       fav?.setAttribute('href', currentCompany?.logo || '');
//     }
//   }, [currentCompany?.logo]);
//
//   return (
//     <>
//       {(loading || (!companyProducts.length && !searchValue)) && (
//         <div className="loading">
//           <Spin size="large" />
//         </div>
//       )}
//       <div className={styles.CompanyWrapper}>
//         {ProductDetail}
//         <div className={styles.CompanyContent}>
//           {/* <Affix */}
//           {/*  className={styles.SidebarAffix} */}
//           {/*  offsetTop={navbarOptionsHeight + topbarOptionsHeight} */}
//           {/*  target={() => document.getElementById(layoutId)} */}
//           {/* > */}
//           {/*  <div> */}
//           {/*    <div className={styles.CompanySearchWrapper}> */}
//           {/*      <Input */}
//           {/*        value={searchValue} */}
//           {/*        className={styles.CompanyInputSearch} */}
//           {/*        placeholder="Buscar" */}
//           {/*        suffix={ */}
//           {/*          <SearchOutlined rev="" className="site-form-item-icon" /> */}
//           {/*        } */}
//           {/*        bordered={false} */}
//           {/*        onChange={onSearch} */}
//           {/*        size="large" */}
//           {/*      /> */}
//           {/*    </div> */}
//           {/*    {!companyProducts?.length && ( */}
//           {/*      <h2 className="p-xx-l">No hay resultados!</h2> */}
//           {/*    )} */}
//           {/*  </div> */}
//           {/* </Affix> */}
//           {companyProducts.length > 0 && (
//             <div className={styles.CompanyContentProducts}>
//               {Object.keys(productsPerCategories).map((categoryId, i) => {
//                 const category = productsPerCategories[categoryId];
//                 const categoryStock = category.products
//                   .map((item) => item.stock)
//                   .reduce((a, b) => a + b, 0) || 0;
//
//                 if (categoryStock <= 0 || category.products.length <= 0) return null;
//
//                 return (
//                   <DynamicScrollView
//                     key={`scroll-view-category-${i}`}
//                     wrapperClassName={
//                       styles.CompanyContentProductsScrollViewCategories
//                     }
//                     seeMoreRoute={`/${category.company}/category/${category.slug}`}
//                     handleProductClick={goToProductDetail}
//                     products={category.products}
//                     title={category.title}
//                   />
//                 );
//               })}
//               <h2 className="mb-xx-l title">Todos los Productos</h2>
//               <div className={styles.CompanyCardsGrid}>
//                 {companyProducts.map((item, i) => (
//                   <DynamicProductCard
//                     key={`product-${i}`}
//                     onClick={goToProductDetail}
//                     product={item}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

/// / V3
import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import { handleEntityHook } from '@shared/hooks/handleEntityHook';
import {
  IProductPerCategory,
} from '@shared/entities/ProductEntity';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { showProductDetailsHook } from '@shared/hooks/showProductDetailsHook';
import { useInfiniteScroll } from '@shared/hooks/useInfiniteScrollHook';
import styles from './Company.module.scss';

const DynamicScrollView = dynamic(
  () => import('@shared/components').then((mod) => mod.ScrollView),
  { ssr: false },
);
// const DynamicProductCard = dynamic(
//   () => import('@shared/components').then((mod) => mod.ProductCard),
//   { ssr: false },
// );

export interface CompanyProps {
  company?: CompanyEntity;
  productsPerCategoryData?: IProductPerCategory[];
}

export function Company({ company, productsPerCategoryData }: CompanyProps) {
  const router = useRouter();
  const avoidInitialLoad = useMemo(
    () => !!productsPerCategoryData,
    [productsPerCategoryData],
  );

  const [companyName, setCompanyName] = useState<string>(
    (router.query.company || '') as string,
  );
  const [companyProducts, setCompanyProducts] = useState<IProductPerCategory[]>(
    productsPerCategoryData || [],
  );

  const {
    get: getCompany,
    [EndpointsAndEntityStateKeys.BY_REF_ID]: currentCompanyRes,
  } = handleEntityHook<CompanyEntity>('companies');
  const { goToProductDetail, ProductDetail } = showProductDetailsHook();

  const {
    infinityScrollData,
    loadMoreCallback,
    isLastPage,
    // fetching: fetchingProducts,
    loading: loadingProducts,
  } = useInfiniteScroll<IProductPerCategory>('products', !avoidInitialLoad, {
    endpoint: EndpointsAndEntityStateKeys.PER_CATEGORY,
    slug: companyName,
    queryParams: {
      limit: 2,
      page: avoidInitialLoad ? 2 : 1,
    },
  });

  const currentCompany: CompanyEntity = useMemo(
    () => currentCompanyRes?.data[0] || company || ({} as CompanyEntity),
    [currentCompanyRes?.data, company],
  );

  useEffect(() => {
    if (!companyName || company?._id) return;
    getCompany({
      endpoint: EndpointsAndEntityStateKeys.BY_REF_ID,
      slug: companyName,
    });
  }, [companyName, company]);

  useEffect(() => {
    const company = router.query.company as string;
    if (
      company
      && company !== companyName
      && !productsPerCategoryData?.length
    ) {
      setCompanyName(company);
    }
  }, [router.query]);

  useEffect(() => {
    infinityScrollData?.data?.length
      && setCompanyProducts(
        infinityScrollData?.data || productsPerCategoryData || [],
      );
  }, [infinityScrollData?.data]);

  useEffect(() => {
    if (currentCompany?.logo) {
      const fav = document.querySelector('link[rel="icon"]');
      fav?.setAttribute('href', currentCompany?.logo || '');
    }
  }, [currentCompany?.logo]);

  return (
    <>
      {loadingProducts && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}
      <div className={styles.CompanyWrapper}>
        {ProductDetail}
        <div className={styles.CompanyContent}>
          {companyProducts && (
            <div className={styles.CompanyContentProducts}>
              {companyProducts.map((categoryData, i) => {
                const category = categoryData.category;
                const categoryStock = categoryData.products.reduce(
                  (acc, product) => acc + product.stock,
                  0,
                );

                if (categoryStock <= 0 || categoryData.products.length <= 0) return null;

                return (
                  <DynamicScrollView
                    key={`scroll-view-category-${i}`}
                    wrapperClassName={
                      styles.CompanyContentProductsScrollViewCategories
                    }
                    seeMoreRoute={`/${category.company}/category/${category.slug}`}
                    handleProductClick={goToProductDetail}
                    products={categoryData.products}
                    title={category.title}
                  />
                );
              })}
              {/* <h2 className="mb-xx-l title">Todos los Productos</h2> */}
              {/* <div className={styles.CompanyCardsGrid}> */}
              {/*  {companyProducts.map((item, i) => ( */}
              {/*    <DynamicProductCard */}
              {/*      key={`product-${i}`} */}
              {/*      onClick={goToProductDetail} */}
              {/*      product={item} */}
              {/*    /> */}
              {/*  ))} */}
              {/* </div> */}
              {!loadingProducts && (
                <div className="flex-center-center p-l">
                  {isLastPage ? (
                    <h2>No hay más productos</h2>
                  ) : (
                    <h2 ref={loadMoreCallback}>Cargando Productos...</h2>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
