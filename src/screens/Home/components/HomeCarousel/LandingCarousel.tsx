import { Carousel, CarouselProps } from "antd";
import { useRef } from "react";
import styles from "./HomeCarousel.module.scss";

const contentStyle: React.CSSProperties = {
  height: "500px",
  lineHeight: "160px",
  textAlign: "center",
  background: "linear-gradient(180deg, green 70%, transparent)",
};
export interface IAppMainPromotionCarouselProps extends CarouselProps {
  showArrow?: boolean;
}

export const LandingCarousel = (props: IAppMainPromotionCarouselProps) => {
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
      <Carousel dots={false} {...props} ref={carousel}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
      {showArrow && (
        <i
          className={`bi bi-chevron-right ${styles.HomeCarouselRightArrow}`}
          onClick={next}
        />
      )}
    </div>
  );
};
