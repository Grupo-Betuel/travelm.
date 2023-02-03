import styles from './ImageBackground.module.scss'
import { FC } from 'react'
import logo from '@assets/images/logo.png'
import Image from 'next/image'
import { Image as AntdImage } from 'antd'

export interface ImageBackgroundProps {
  image?: any
}
export const ImageBackground: FC<ImageBackgroundProps> = ({ image }) => {
  return (
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
      ></div>
      {image ? (
        <AntdImage
          preview={{ mask: false }}
          src={image}
          rootClassName={styles.ImageWrapper}
        />
      ) : (
        <Image priority src={logo} />
      )}
    </div>
  )
}
