import { FC } from 'react';
import Image from 'next/image';
import { Image as AntdImage } from 'antd';
import styles from './ImageBackground.module.scss';

export interface ImageBackgroundProps {
  image?: any
}
// eslint-disable-next-line react/function-component-definition
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
    {/* <Image priority alt={image} src={image} width="800" height="800" /> */}
    <AntdImage
      preview={{ mask: false }}
      src={image}
      rootClassName={styles.ImageWrapper}
      alt={image}
    />
    {/* {image ? ( */}
    {/*  <AntdImage */}
    {/*    preview={{ mask: false }} */}
    {/*    src={image} */}
    {/*    rootClassName={styles.ImageWrapper} */}
    {/*    alt={image} */}
    {/*  /> */}
    {/* ) : ( */}
    {/*  <Image priority alt={image} src={image} /> */}
    {/* )} */}
  </div>
);
