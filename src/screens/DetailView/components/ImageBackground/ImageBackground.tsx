import styles from "./ImageBackground.module.scss";
import { FC } from "react";
import Image from "next/image";

export interface ImageBackgroundProps {
  image: any;
}

export const ImageBackground: FC<ImageBackgroundProps> = ({ image }) => {
  return (
    <div className={styles.ImageBackgroundWrapper}>
      <div className={styles.ImageBackground}></div>
      <Image src={image} className={styles.Image} />
    </div>
  );
};