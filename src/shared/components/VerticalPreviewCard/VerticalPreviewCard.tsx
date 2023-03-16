import styles from './VerticalPreviewCard.module.scss'
import { Image } from 'antd'

export interface IVerticalPreviewCardItem {
  images: string[]
  title: string
}

export interface IVerticalPreviewCardProps {
  items?: IVerticalPreviewCardItem[]
  onSelect?: (ev?: any) => void
  title?: string
}

export const VerticalPreviewCard = (
  { items, onSelect, title }: IVerticalPreviewCardProps = {
    items: [],
    title: 'example',
  }
) => {
  return (
    <div className={styles.VerticalPreviewCardWrapper} onClick={onSelect}>
      <span className="subtitle">{title}</span>
      <div className={styles.VerticalPreviewCardGrid}>
        {items &&
          items.map((item, i) => (
            <div
              className={`${styles.verticalPromotionCardGridItem} hover-red-2`}
              key={i}
            >
              <Image
                rootClassName={styles.verticalPromotionCardGridItemImageWrapper}
                className={styles.verticalPromotionCardGridItemImage}
                preview={{ mask: false }}
                src={item.images[0]}
              />
              <span className="font-size-4">{item.title}</span>
            </div>
          ))}
      </div>
      <p className={styles.verticalPromotionCardAction}>Ver Mas</p>
    </div>
  )
}
