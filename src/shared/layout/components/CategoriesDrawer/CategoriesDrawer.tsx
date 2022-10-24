import { Drawer, DrawerProps } from "antd";
import styles from "./CategoriesDrawer.module.scss";

export interface ICategoriesDrawerProps extends DrawerProps {}
export const CategoriesDrawer = (props: ICategoriesDrawerProps) => {
  return (
    <Drawer
      className={styles.categoriesDrawer}
      title="All Categories"
      placement="left"
      {...props}
    >
      <ul className={styles.categoryList}>
        <li className={`${styles.categoryListItemTitle}`}>Title</li>
        <li className={styles.categoryListItem}>Mas Vendidos</li>
        <li className={styles.categoryListItem}>Mas Vendidos</li>
        <li className={styles.categoryListItem}>Mas Vendidos</li>
      </ul>
      <ul className={styles.categoryList}>
        <li className={`${styles.categoryListItemTitle}`}>Title</li>
        <li className={styles.categoryListItem}>Mas Vendidos</li>
        <li className={styles.categoryListItem}>Mas Vendidos</li>
        <li className={styles.categoryListItem}>Mas Vendidos</li>
      </ul>
      <ul className={styles.categoryList}>
        <li className={`${styles.categoryListItemTitle}`}>Title</li>
        <li className={styles.categoryListItem}>Mas Vendidos</li>
        <li className={styles.categoryListItem}>Mas Vendidos</li>
        <li className={styles.categoryListItem}>Mas Vendidos</li>
      </ul>
    </Drawer>
  );
};
