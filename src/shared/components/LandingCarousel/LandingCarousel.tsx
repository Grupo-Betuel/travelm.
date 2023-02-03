import { Carousel, CarouselProps, Image } from 'antd'
import { useRef } from 'react'
import styles from './LandingCarousel.module.scss'
export interface IAppMainPromotionCarouselProps extends CarouselProps {
  showArrow?: boolean
}

export const LandingCarousel = (props: IAppMainPromotionCarouselProps) => {
  const { showArrow } = { showArrow: true, ...props }

  const carousel = useRef<any>()

  const next = () => {
    carousel.current && carousel.current?.next()
  }
  const prev = () => carousel.current && carousel.current?.prev()

  return (
    <div className={styles.HomeCarouselWrapper}>
      {showArrow && (
        <i
          className={`bi bi-chevron-left ${styles.HomeCarouselLeftArrow}`}
          onClick={prev}
        />
      )}
      <Image.PreviewGroup>
        <Carousel dots={false} {...props} ref={carousel} autoplay>
          <div>
            <div className={styles.HomeCarouselItemWrapper}>
              <Image
                className={styles.HomeCarouselItemImage}
                rootClassName={styles.HomeCarouselItemImageWrapper}
                src="https://imageup.me/images/f06c0473-da9c-4d46-b6a6-49f774bb640f.png"
              ></Image>
            </div>
          </div>
          <div>
            <div className={styles.HomeCarouselItemWrapper}>
              <Image
                className={styles.HomeCarouselItemImage}
                rootClassName={styles.HomeCarouselItemImageWrapper}
                src="https://i.pinimg.com/originals/c4/a2/05/c4a2050a1cbbd8158e717f29185d9ab1.jpg"
              ></Image>
            </div>
          </div>
          <div>
            <div className={styles.HomeCarouselItemWrapper}>
              <Image
                className={styles.HomeCarouselItemImage}
                rootClassName={styles.HomeCarouselItemImageWrapper}
                src="https://imageup.me/images/f06c0473-da9c-4d46-b6a6-49f774bb640f.png"
              ></Image>
            </div>
          </div>
          <div>
            <div className={styles.HomeCarouselItemWrapper}>
              <Image
                className={styles.HomeCarouselItemImage}
                rootClassName={styles.HomeCarouselItemImageWrapper}
                src="https://imageup.me/images/f06c0473-da9c-4d46-b6a6-49f774bb640f.png"
              ></Image>
            </div>
          </div>
        </Carousel>
      </Image.PreviewGroup>
      {showArrow && (
        <i
          className={`bi bi-chevron-right ${styles.HomeCarouselRightArrow}`}
          onClick={next}
        />
      )}
    </div>
  )
}
