import { Carousel, CarouselProps, Image } from 'antd';
import { useRef } from 'react';
import styles from './LandingCarousel.module.scss';

export interface IAppMainPromotionCarouselProps extends CarouselProps {
  showArrow?: boolean
}

export function LandingCarousel(props: IAppMainPromotionCarouselProps) {
  const { showArrow } = { showArrow: true, ...props };

  const carousel = useRef<any>();

  const next = () => {
    carousel.current && carousel.current?.next();
  };
  const prev = () => carousel.current && carousel.current?.prev();

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
                src="https://i.pinimg.com/originals/eb/a7/60/eba760e4d470d2de478d26038e5fc9a9.jpg"
              />
            </div>
          </div>
          <div>
            <div className={styles.HomeCarouselItemWrapper}>
              <Image
                className={styles.HomeCarouselItemImage}
                rootClassName={styles.HomeCarouselItemImageWrapper}
                src="https://i.pinimg.com/originals/eb/a7/60/eba760e4d470d2de478d26038e5fc9a9.jpg"
              />
            </div>
          </div>
          <div>
            <div className={styles.HomeCarouselItemWrapper}>
              <Image
                className={styles.HomeCarouselItemImage}
                rootClassName={styles.HomeCarouselItemImageWrapper}
                src="https://i.pinimg.com/originals/eb/a7/60/eba760e4d470d2de478d26038e5fc9a9.jpg"
              />
            </div>
          </div>
          <div>
            <div className={styles.HomeCarouselItemWrapper}>
              <Image
                className={styles.HomeCarouselItemImage}
                rootClassName={styles.HomeCarouselItemImageWrapper}
                src="https://i.pinimg.com/originals/eb/a7/60/eba760e4d470d2de478d26038e5fc9a9.jpg"
              />
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
  );
}
