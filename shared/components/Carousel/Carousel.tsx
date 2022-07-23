import { Carousel, CarouselProps } from "antd";
import { useRef } from "react";
import styles from "./Carousel.module.scss";

const contentStyle: React.CSSProperties = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export interface IAppCarouselProps extends CarouselProps {
  showArrow?: boolean;
}

export const AppCarousel = (props: IAppCarouselProps) => {
  const { showArrow } = { showArrow: true, ...props };

  const carousel = useRef<any>();

  const next = () => {
    carousel.current && carousel.current?.next();
  };
  const prev = () => carousel.current && carousel.current?.prev();

  return (
    <div className={styles.CarouselWrapper}>
      {showArrow && (
        <i
          className={`bi bi-chevron-left ${styles.CarouselLeftArrow}`}
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
          className={`bi bi-chevron-right ${styles.CarouselRightArrow}`}
          onClick={next}
        />
      )}
    </div>
  );
};
