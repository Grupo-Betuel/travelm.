import styles from "./VerticalPreviewCard.module.scss";
import Image from "next/image";

export interface IVerticalPreviewCardProps {
  products: any[];
}

export const VerticalPreviewCard = ({
  products,
}: IVerticalPreviewCardProps) => {
  return (
    <div className={styles.VerticalPreviewCardWrapper}>
      <span className="subtitle">Title</span>
      <div className={styles.VerticalPreviewCardGrid}>
        {products.map((item) => (
          <div
            className={`${styles.verticalPromotionCardGridItem} hover-red-2`}
          >
            <Image src={item.image} />
            <span className="font-size-4">{item.title}</span>
          </div>
        ))}
      </div>
      <p className={styles.verticalPromotionCardAction}>Ver Mas</p>
    </div>
  );
};
