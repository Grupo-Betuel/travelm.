import { Badge, Button, Card, Rate } from 'antd';
import Link from 'next/link';
import { ProductEntity } from '@shared/entities/ProductEntity';
import { ProductsConstants } from '@shared/constants/products.constants';
import { useMemo } from 'react';
import { useAppStore } from '@services/store';
import { useOrderContext } from '@shared/contexts/OrderContext';
import styles from './ProductCard.module.scss';
import { getSaleDataFromProduct } from '../../../utils/objects.utils';

export interface IProductProps {
  product: ProductEntity;
  onClick?: (post: ProductEntity) => void;
}
export function ProductCard({ product, onClick }: IProductProps) {
  const order = useAppStore((state) => state.currentOrder);
  const img = product && product.images ? product.images[0] : '';
  const isAlmostSoldOut =
    product.stock <= ProductsConstants.ALMOST_SOLD_OUT_QUANTITY &&
    product.stock > 0;
  const { orderService, toggleCart } = useOrderContext();
  const handleProductAction = (ev: any) => {
    ev.stopPropagation();
    if (isOnCart) {
      toggleCart();
    } else if (!product.productParams.length) {
      orderService.handleLocalOrderSales({
        ...getSaleDataFromProduct(product),
        quantity: 1,
      });
      toggleCart();
    } else if (product.productParams.length) {
      onClick && onClick(product);
    }
  };

  const ribbonText = useMemo(() => {
    if (isAlmostSoldOut) {
      return ProductsConstants.ALMOST_SOLD_OUT;
    }
    if (!product.stock || product.stock === 0) {
      return ProductsConstants.SOLD_OUT;
    }
    return '';
  }, [product.stock]);

  const isOnCart = useMemo(
    () => order?.sales.some((sale) => sale.product._id === product._id),
    [order?.sales]
  );

  const handleClick = () => {
    onClick && onClick(product);
  };
  return (
    <Badge.Ribbon
      text={ribbonText}
      style={{ display: ribbonText ? 'block' : 'none' }}
      color={isAlmostSoldOut ? 'gold' : 'red'}
    >
      <Card
        className={styles.ProductCard}
        bodyStyle={{ padding: '10px 0' }}
        cover={<img src={img} className={styles.ProductImage} />}
        onClick={handleClick}
      >
        <div className={styles.ProductCardContent}>
          <div className={styles.ProductCardContentHeader}>
            <span className={styles.ProductTitle}>{product.name}</span>
            <span className={styles.ProductPrice}>
              RD$ {product.price.toLocaleString()}
            </span>
          </div>
          <div>
            {isAlmostSoldOut && (
              <span className="text-red">
                Solo quedan: {product.stock || 0}
              </span>
            )}
          </div>
          {product.stock ? (
            <Button className="mt-s" onClick={handleProductAction}>
              {isOnCart
                ? ProductsConstants.VIEW_CART
                : ProductsConstants.ADD_CART}
            </Button>
          ) : null}
        </div>
      </Card>
    </Badge.Ribbon>
  );
}
