import { Image, List, Space } from 'antd'
import styles from './ShoppingCart.module.scss'
import React, { FC } from 'react'
import Title from 'antd/lib/typography/Title'
import { useAppStore } from '@services/store'
import { handleEntityHook } from '@shared/hooks/handleEntityHook'
import OrderEntity, { ISale } from '@shared/entities/OrderEntity'
import { ProductEntity } from '@shared/entities/ProductEntity'

export interface IShoppingCartAction {
  key: string
  icon: React.FC
  text: string
  onClick?: (sale: ProductEntity) => void
}
export interface IShoppingCartProps {
  itemActions: IShoppingCartAction[]
  submitButtonLabel?: string
  sales?: ISale[]
}
const data = Array.from({ length: 2 }).map((_, i) => ({
  title: `Alas de Danza`,
  description: 'Cantidad: 5',
  content: <h1>RD$400</h1>,
}))

const IconText: FC<IShoppingCartAction> = ({
  icon,
  text,
  onClick,
}: {
  icon: React.FC
  text: string
  onClick?: () => void
}) => (
  <Space className={styles.ShoppingCartListItemAction} onClick={onClick}>
    {React.createElement(icon)}
    {text}
  </Space>
)

export const ShoppingCart = ({ itemActions, sales }: IShoppingCartProps) => {
  return (
    <List
      className={styles.ShoppingCartList}
      itemLayout="vertical"
      size="large"
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
          <Title level={3}>RD${sale.product.price.toLocaleString()}</Title>
        </List.Item>
      )}
    />
  )
}
