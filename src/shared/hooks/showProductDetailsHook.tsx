// import { useEffect, useState } from 'react';
// import { ProductEntity } from '@shared/entities/ProductEntity';
// import { MainContentModal } from '@shared/components';
// import { DetailView } from '@components/DetailView';
// import { useContextualRouting } from 'next-use-contextual-routing';
// import { useRouter } from 'next/router';
// // import Animate from 'rc-animate';
//
// export interface ShowProductDetailsHookReturn {
//   goToProductDetail: (product: ProductEntity) => void;
//   ProductDetail: JSX.Element | null;
// }
//
// export const showProductDetailsHook = (): ShowProductDetailsHookReturn => {
//   const [productDetail, setProductDetail] = useState<ProductEntity>();
//   const [openWrapper, setOpenWrapper] = useState(false);
//   const { makeContextualHref, returnHref } = useContextualRouting();
//   const router = useRouter();
//   const goToProductDetail = (product: ProductEntity) => {
//     setOpenWrapper(true);
//     setTimeout(() => {
//       setProductDetail(product);
//       router.push(
//         makeContextualHref({ productId: product._id }),
//         `/${product.company}/products/${product.slug}`,
//         {
//           shallow: true,
//         },
//       );
//     });
//   };
//
//   const goBack = () => {
//     setProductDetail(undefined);
//     setOpenWrapper(false);
//     setTimeout(() => {
//       router.push(
//         makeContextualHref({ return: true, productId: '' }),
//         returnHref,
//         {
//           shallow: true,
//         },
//       );
//     });
//   };
//
//   useEffect(() => {
//     const productId = router.query.productId as string;
//     if (!productId) {
//       setProductDetail(undefined);
//       setOpenWrapper(false);
//     }
//   }, [router.query]);
//
//   // const isMobile = typeof window === 'undefined' ? false : window?.innerWidth < 768;
//
//   return {
//     goToProductDetail,
//     ProductDetail: openWrapper ? (
//     // <Animate
//     //   showProp="show"
//     //   transitionName={isMobile ? 'slide' : 'none'}
//     //   transitionAppear
//     // >
//       <MainContentModal show={openWrapper}>
//         {productDetail && (
//         <DetailView
//           goBack={goBack}
//           returnHref={returnHref}
//           productDetails={productDetail}
//         />
//         )}
//       </MainContentModal>
//     // </Animate>
//     ) : null,
//   };
// };

import { useEffect, useState } from 'react';
import { ProductEntity } from '@shared/entities/ProductEntity';
import { MainContentModal } from '@shared/components';
import { DetailView } from '@components/DetailView';
import { useContextualRouting } from 'next-use-contextual-routing';
import { useRouter } from 'next/router';
import { useImageCache } from '@shared/contexts/ImageCacheContext';

export interface ShowProductDetailsHookReturn {
  goToProductDetail: (product: ProductEntity) => void;
  ProductDetail: JSX.Element | null;
}

export const showProductDetailsHook = (): ShowProductDetailsHookReturn => {
  const [productDetail, setProductDetail] = useState<ProductEntity>();
  const [openWrapper, setOpenWrapper] = useState(false);
  const { makeContextualHref, returnHref } = useContextualRouting();
  const router = useRouter();
  const { isImageCached } = useImageCache();

  const goToProductDetail = (product: ProductEntity) => {
    setOpenWrapper(true);
    setTimeout(() => {
      setProductDetail(product);
      if (!isImageCached(product.image)) {
        // Optionally handle if image is not cached
        console.log('Image is not cached, consider loading indicator or similar');
      }
      router.push(
        makeContextualHref({ productId: product._id }),
        `/${product.company}/products/${product.slug}`,
        {
          shallow: true,
        },
      );
    });
  };

  const goBack = () => {
    setProductDetail(undefined);
    setOpenWrapper(false);
    setTimeout(() => {
      router.push(
        makeContextualHref({ return: true, productId: '' }),
        returnHref,
        {
          shallow: true,
        },
      );
    });
  };

  useEffect(() => {
    const productId = router.query.productId as string;
    if (!productId) {
      setProductDetail(undefined);
      setOpenWrapper(false);
    }
  }, [router.query]);

  return {
    goToProductDetail,
    ProductDetail: openWrapper ? (
      <MainContentModal show={openWrapper}>
        {productDetail && (
          <DetailView
            goBack={goBack}
            returnHref={returnHref}
            productDetails={productDetail}
          />
        )}
      </MainContentModal>
    ) : null,
  };
};
