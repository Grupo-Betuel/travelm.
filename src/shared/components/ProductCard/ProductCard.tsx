import { Badge, Button, Card, Rate } from 'antd'
import styles from './ProductCard.module.scss'
import Link from 'next/link'
import { PostEntity } from '@shared/entities/PostEntity'

export interface IProductProps {
  product: PostEntity
  handleAction: (post: PostEntity) => void
}
export const ProductCard = ({ product, handleAction }: IProductProps) => {
  const img = product && product.images ? product.images[0] : ''
  const handle = (ev: any) => {
    ev.stopPropagation()
    handleAction(product)
  }

  return (
    <Badge.Ribbon text="Tienda">
      <Card
        className={styles.ProductCard}
        bodyStyle={{ padding: '10px' }}
        cover={<img src={img} className={styles.ProductImage} />}
      >
        <div className={styles.ProductCardContent}>
          <span className={styles.ProductTitle}>{product.title}</span>
          {/*<Rate allowHalf defaultValue={4.5} disabled />*/}
          <span className={styles.ProductPrice}>RD$ 1,500</span>
          <span className={styles.ProductCommission}>Comision: RD$ 150</span>
          <Button className="mt-s" onClick={handle}>
            Add to my Board
          </Button>
        </div>
      </Card>
    </Badge.Ribbon>
  )
}
