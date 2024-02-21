import { Carousel, CarouselProps, Image } from 'antd';
import { useRef } from 'react';
import styles from './LandingCarousel.module.scss';

export interface IAppMainPromotionCarouselProps extends CarouselProps {
  showArrow?: boolean;
  images: string[];
}

export function LandingCarousel({
  images,
  ...props
}: IAppMainPromotionCarouselProps) {
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
          {images.map((image, index) => (
            <div key={index}>
              <div className={styles.HomeCarouselItemWrapper}>
                <Image
                  alt="carousel"
                  className={styles.HomeCarouselItemImage}
                  rootClassName={styles.HomeCarouselItemImageWrapper}
                  src={image}
                />
              </div>
            </div>
          ))}
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
