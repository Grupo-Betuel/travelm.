import { FC } from 'react';
import logo from '@assets/images/logo.png';
import Image from 'next/image';
import { Image as AntdImage } from 'antd';
import styles from './ImageBackground.module.scss';

export interface ImageBackgroundProps {
  image?: any
}
export const ImageBackground: FC<ImageBackgroundProps> = ({ image }) => (
  <div className={styles.ImageBackgroundWrapper}>
    <div
      className={styles.ImageBackground}
      style={
          image
            ? {
              backgroundImage: `url(${image})`,
            }
            : {}
        }
    />
    {image ? (
      <AntdImage
        preview={{ mask: false }}
        src={image}
        rootClassName={styles.ImageWrapper}
      />
    ) : (
      <Image priority alt="" src={logo} />
    )}
  </div>
);
