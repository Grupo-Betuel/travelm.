import { useRef } from 'react';
import { ProductCard } from '@shared/components';
import { ProductEntity } from '@shared/entities/ProductEntity';
import styles from './ScrollView.module.scss';

export interface IScrollViewProps {
  products: ProductEntity[]
  title: string
  handleProductClick?: (product: ProductEntity) => void
  wrapperClassName?: string
  handleSeeMore?: (product: ProductEntity) => void
}

export function ScrollView({
  products,
  title,
  handleProductClick,
  wrapperClassName,
  handleSeeMore,
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

  const onSeeMore = () => {
    handleSeeMore && handleSeeMore(products[0]);
  };

  const scrollViewRef = useRef({} as any);

  return (
    <div className={`${styles.ScrollViewContainer} ${wrapperClassName}`}>
      <div className="flex-between-end mb-l">
        <h2 className="title m-0">{title}</h2>
        <span className="cursor-pointer subtitle text-blue" onClick={onSeeMore}>
          Ver mas
        </span>
      </div>
      <div className={styles.ScrollViewWrapper}>
        <i
          className={`bi bi-chevron-left ${styles.ScrollViewLeftArrow}`}
          onClick={preview(true)}
        />
        <div className={styles.ScrollView} ref={scrollViewRef}>
          {products.map((product, i) => (
            <div className={styles.ScrollViewItem} key={`scrollview-item-${i}`}>
              <ProductCard onClick={handleProductClick} product={product} />
            </div>
          ))}
        </div>
        <i
          className={`bi bi-chevron-right ${styles.ScrollViewRightArrow}`}
          onClick={preview(false)}
        />
      </div>
    </div>
  );
}
