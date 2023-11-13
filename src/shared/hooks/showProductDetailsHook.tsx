import { useEffect, useState } from 'react';
import { ProductEntity } from '@shared/entities/ProductEntity';
import { MainContentModal } from '@shared/components';
import { DetailView } from '@components/DetailView';
import { useContextualRouting } from 'next-use-contextual-routing';
import { useRouter } from 'next/router';
// import Animate from 'rc-animate';

export interface ShowProductDetailsHookReturn {
  goToProductDetail: (product: ProductEntity) => void;
  ProductDetail: JSX.Element;
}

export const showProductDetailsHook = (): ShowProductDetailsHookReturn => {
  const [productDetail, setProductDetail] = useState<ProductEntity>();
  const [openWrapper, setOpenWrapper] = useState(false);
  const { makeContextualHref, returnHref } = useContextualRouting();
  const router = useRouter();
  const goToProductDetail = (product: ProductEntity) => {
    setOpenWrapper(true);
    setTimeout(() => {
      setProductDetail(product);
      console.log('product', product);
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

  // const isMobile = typeof window === 'undefined' ? false : window?.innerWidth < 768;

  return {
    goToProductDetail,
    ProductDetail: (
    // <Animate
    //   showProp="show"
    //   transitionName={isMobile ? 'slide' : 'none'}
    //   transitionAppear
    // >
      <MainContentModal show={openWrapper}>
        {productDetail && (
        <DetailView
          goBack={goBack}
          returnHref={returnHref}
          productDetails={productDetail}
        />
        )}
      </MainContentModal>
    // </Animate>
    ),
  };
};
