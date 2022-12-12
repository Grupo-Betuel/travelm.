import styles from "./Search.module.scss";
import { ProductCard } from "@components/ProductCard";
import { Sidebar } from "@shared/layout/components/Sidebar";
import { FiltersSidebar } from "@components/FiltersSidebar";

export const Search = () => {
  const products = Array.from(new Array(20));
  return (
    <div className={styles.SearchWrapper}>
      <FiltersSidebar />
      <div className={`${styles.SearchContent} grid-gap-15 grid-column-fill-2`}>
        {products.map((item, i) => (
          <ProductCard key={i} />
        ))}
      </div>
    </div>
  );
};
