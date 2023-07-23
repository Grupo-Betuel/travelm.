import { Image, List, Space } from 'antd';
import React, { FC } from 'react';
import Title from 'antd/lib/typography/Title';
import { useAppStore } from '@services/store';
import { handleEntityHook } from '@shared/hooks/handleEntityHook';
import OrderEntity, { ISale } from '@shared/entities/OrderEntity';
import { ProductEntity } from '@shared/entities/ProductEntity';
import styles from './ShoppingCart.module.scss';

export interface IShoppingCartAction {
  key: string;
  icon: any;
  text: string;
  onClick: (product: ProductEntity) => void;
}
export interface IShoppingCartProps {
  itemActions: IShoppingCartAction[];
  // eslint-disable-next-line react/require-default-props
  submitButtonLabel?: string;
  // eslint-disable-next-line react/require-default-props
  sales?: ISale[];
}
const data = Array.from({ length: 2 }).map((_, i) => ({
  title: 'Alas de Danza',
  description: 'Cantidad: 5',
  content: <h1>RD$400</h1>,
}));

const IconText: FC<IShoppingCartAction> = ({ icon, text, onClick }: any) => (
  <Space className={styles.ShoppingCartListItemAction} onClick={onClick}>
    {React.createElement(icon)}
    {text}
  </Space>
);

export function ShoppingCart({ itemActions, sales }: IShoppingCartProps) {
  return (
    <List
      className={styles.ShoppingCartList}
      itemLayout="vertical"
      size="large"
      locale={{
        emptyText: 'No hay productos en el carrito',
      }}
      dataSource={sales}
      renderItem={(sale, i) => (
        <List.Item
          className={styles.ShoppingCartListItem}
          key={`sale-${i}`}
          actions={itemActions.map((action) => (
            <IconText
              {...action}
              onClick={() => action.onClick && action.onClick(sale.product)}
            />
          ))}
          extra={<Image width={100} alt="logo" src={sale.product.image} />}
        >
          <List.Item.Meta
            title={sale.product.name}
            description={`Cantidad: ${sale.quantity}`}
          />
          <Title level={3}>
            RD$
            {sale.product.price.toLocaleString()}
          </Title>
        </List.Item>
      )}
    />
  );
}
