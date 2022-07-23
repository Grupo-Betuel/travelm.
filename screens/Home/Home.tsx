import { VerticalPreviewCard } from "@components/VerticalPreviewCard";
import styles from "./Home.module.scss";
import logo from "@assets/images/logo.png";
import { HomeCarousel } from "./components/HomeCarousel";
import { AppCarousel } from "@components/Carousel";
import { ScrollView } from "@components/ScrollView/ScrollView";

export const Home = () => {
  const products = [
    {
      title: "First Item",
      image: logo,
    },
    {
      title: "First Item",
      image: logo,
    },
    {
      title: "First Item",
      image: logo,
    },
    {
      title: "First Item",
      image: logo,
    },
  ];
  return (
    <div className={styles.HomeWrapper}>
      <HomeCarousel />
      <div className={styles.HomeContent}>
        <div className={styles.HomeTopCardsGrid}>
          <VerticalPreviewCard products={products} />
          <VerticalPreviewCard products={products.slice(0, 3)} />
          <VerticalPreviewCard products={products.slice(0, 1)} />
          <VerticalPreviewCard products={products} />
        </div>

        <div className={styles.HomeSection}>
          <span className="subtitle">Inspirados por Tu Compra</span>
          <ScrollView />
        </div>
        <div className={styles.HomeSection}>
          <span className="subtitle">Inspirados por Tu Compra</span>
          <ScrollView />
        </div>
      </div>
    </div>
  );
};
