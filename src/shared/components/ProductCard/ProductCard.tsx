import Image from 'next/image'
import placeholder from '@assets/images/logo.png'
import { Rate } from 'antd'
import styles from './ProductCard.module.scss'
import Link from 'next/link'
import { PostEntity } from '@models/PostEntity'

export interface IProductProps {
  product: PostEntity
}
export const ProductCard = ({ product }: IProductProps) => {
  return (
    <Link href="/detail">
      <div className={styles.ProductCard}>
        <Image src={placeholder} />
        <span className={styles.ProductTitle}>{product.title}</span>
        <Rate allowHalf defaultValue={4.5} disabled />
        <span className={styles.ProductPrice}>RD$ 4,500</span>
      </div>
    </Link>
  )
}
