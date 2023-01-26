import styles from './VerticalPreviewCard.module.scss'
import Image, { StaticImageData } from 'next/image'

export interface IVerticalPreviewCardItem {
  image: string | StaticImageData
  title: string
}

export interface IVerticalPreviewCardProps {
  items: IVerticalPreviewCardItem[]
  onSelect: (ev?: any) => void
}

export const VerticalPreviewCard = ({
  items,
  onSelect,
}: IVerticalPreviewCardProps) => {
  return (
    <div className={styles.VerticalPreviewCardWrapper} onClick={onSelect}>
      <span className="subtitle">Title</span>
      <div className={styles.VerticalPreviewCardGrid}>
        {items.map((item) => (
          <div
            className={`${styles.verticalPromotionCardGridItem} hover-red-2`}
          >
            <Image
              src={item.image}
              width="100%"
              height="100%"
              objectFit="contain"
            />
            <span className="font-size-4">{item.title}</span>
          </div>
        ))}
      </div>
      <p className={styles.verticalPromotionCardAction}>Ver Mas</p>
    </div>
  )
}
