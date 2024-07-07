import { useRef } from 'react';
import { ProductCard } from '@shared/components';
import { ProductEntity } from '@shared/entities/ProductEntity';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import styles from './ScrollView.module.scss';

export interface IScrollViewProps {
  products: ProductEntity[];
  title: string;
  handleProductClick?: (product: ProductEntity) => void;
  wrapperClassName?: string;
  seeMoreRoute: string;
}

export function ScrollView({
  products,
  title,
  handleProductClick,
  wrapperClassName,
  seeMoreRoute,
}: IScrollViewProps) {
  const preview = (back?: boolean) => () => {
    const scrollView = scrollViewRef.current as HTMLDivElement;
    const progress = 280;
    if (scrollView) {
      scrollView.scrollTo({
        left: back
          ? scrollView.scrollLeft - progress
          : scrollView.scrollLeft + progress,
        behavior: 'smooth',
      });
    }
  };

  const scrollViewRef = useRef({} as any);

  return (
    <div className={`${styles.ScrollViewContainer} ${wrapperClassName}`}>
      <div className="flex-between-end mb-l">
        <h2 className="title m-0">{title}</h2>
        <Link href={seeMoreRoute}>
          <a className="subtitle">Ver mas</a>
        </Link>
      </div>
      <div className={styles.ScrollViewWrapper}>
        <Icon
          icon="mdi-light:chevron-left"
          className={styles.ScrollViewLeftArrow}
          onClick={preview(true)}
        />
        <div className={styles.ScrollView} ref={scrollViewRef}>
          {products?.map(
            (product, i) => !!product.stock && (
            <div
              className={styles.ScrollViewItem}
              key={`scrollview-item-${i}`}
            >
              <ProductCard onClick={handleProductClick} product={product} />
            </div>
            ),
          )}
        </div>
        <Icon
          icon="mdi-light:chevron-right"
          className={styles.ScrollViewRightArrow}
          onClick={preview(false)}
        />
      </div>
    </div>
  );
}
