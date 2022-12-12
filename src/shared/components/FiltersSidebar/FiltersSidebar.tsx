import Sider from "antd/lib/layout/Sider";
import styles from "./FiltersSidebar.module.scss";
import { Input, Slider, Switch } from "antd";
import { useState } from "react";

export const FiltersSidebar = () => {
  const [priceRange, setPriceRange] = useState<number[]>([]);

  const onChangePrice = (data: any) => setPriceRange(data);

  return (
    <Sider className={styles.SideBarWrapper}>
      <h3 className={styles.FilterTitle}>Hi</h3>
      <label className={styles.FilterWrapper}>
        <Switch defaultChecked />
        <span className={styles.FilterLabel}>Solo Tiendas</span>
      </label>
      <div className={styles.FilterList}>
        {Array.from(new Array(5)).map((item, i) => (
          <div className={styles.FilterListItem}>Category {i + 1}</div>
        ))}
      </div>
      <div className={`${styles.FilterWrapper} ${styles.Column}`}>
        <span className={styles.FilterLabel}>Precio</span>
        <Input.Group compact>
          <Input
            defaultValue=""
            style={{ width: "50%" }}
            value={priceRange[0]}
          />
          <Input
            defaultValue=""
            style={{ width: "50%" }}
            value={priceRange[1]}
          />
        </Input.Group>
        <Slider range defaultValue={[20, 50]} onChange={onChangePrice} />
      </div>
    </Sider>
  );
};
