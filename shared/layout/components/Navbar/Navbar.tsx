import { Header } from "antd/lib/layout/layout";
import logo from "@assets/images/logo.png";
import Image from "next/image";
import styles from "./Navbar.module.scss";
import { Button, Drawer, Input, Select } from "antd";
const { Option } = Select;
import { useState } from "react";
import { CategoriesDrawer } from "@shared/layout/components/CategoriesDrawer/CategoriesDrawer";

const selectBefore = (
  <Select defaultValue="Todas" className="select-before">
    <Option value="All">Todas</Option>
    <Option value="Categoria 1">Categoria 1</Option>
    <Option value="Categoria 2">Categoria 2</Option>
  </Select>
);

export const Navbar = () => {
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
  const toggleAllCategoriesDrawer = () => {
    setShowAllCategories(!showAllCategories);
  };

  return (
    <>
      <Header className={`${styles.navbar}`}>
        <div className={`${styles.navbarLogoContainer} flex-start-center`}>
          <Image src={logo} alt="Store Logo" />
        </div>
        <div className={`${styles.navbarBrowserWrapper} flex-center-center`}>
          <Input.Search
            allowClear
            addonBefore={selectBefore}
            placeholder="Search"
          />
        </div>
        <ul className={`${styles.navbarOptionsList} flex-end-center`}>
          <li>item 1</li>
          <li>item 2</li>
          <li>item 3</li>
          <li>item 4</li>
          <li>item 5</li>
        </ul>
        <div className={styles.navbarFavoritesWrapper}>
          <ul className="flex-between-center w-100">
            <li>
              <div
                className="flex-start-center cursor-pointer"
                onClick={toggleAllCategoriesDrawer}
              >
                <i className="bi bi-list font-size-9" />
                <span>Ver Todo</span>
              </div>
            </li>
            <li>item 2</li>
            <li>item 3</li>
            <li>item 4</li>
            <li>item 5</li>
          </ul>
        </div>
      </Header>

      <CategoriesDrawer
        visible={showAllCategories}
        onClose={toggleAllCategoriesDrawer}
      />
    </>
  );
};
