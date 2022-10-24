import styles from "./ScrollView.module.scss";
import Image from "next/image";
import logo from "@assets/images/logo.png";
import { useEffect, useRef } from "react";

export const ScrollView = () => {
  const preview = (back?: boolean) => () => {
    const scrollView = scrollViewRef.current as HTMLDivElement;
    const progress = 200;

    if (scrollView) {
      scrollView.scrollTo({
        left: back
          ? scrollView.scrollLeft - progress
          : scrollView.scrollLeft + progress,
        behavior: "smooth",
      });
    }
  };

  const products = Array.from(new Array(20));
  const scrollViewRef = useRef({} as any);

  return (
    <div className={styles.ScrollViewWrapper}>
      <i
        className={`bi bi-chevron-left ${styles.ScrollViewLeftArrow}`}
        onClick={preview(true)}
      />
      <div className={styles.ScrollView} ref={scrollViewRef}>
        {products.map((item) => (
          <div className={styles.ScrollViewItem}>
            <Image src={logo} />
          </div>
        ))}
      </div>
      <i
        className={`bi bi-chevron-right ${styles.ScrollViewRightArrow}`}
        onClick={preview(false)}
      />
    </div>
  );
};
