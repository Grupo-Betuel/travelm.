import { Header } from "antd/lib/layout/layout";
import logo from "@assets/images/logo.png";
import person from "@assets/images/person.png";
import Image from "next/image";
import styles from "./Navbar.module.scss";
import { Dropdown, Input, MenuProps, Select } from "antd";

const { Option } = Select;
import { useState } from "react";
import { CategoriesDrawer } from "@shared/layout/components/CategoriesDrawer/CategoriesDrawer";
import Link from "next/link";
import { useRouter } from "next/router";

const selectBefore = (
  <Select defaultValue="Todas" className="select-before">
    <Option value="All">Todas</Option>
    <Option value="Categoria 1">Categoria 1</Option>
    <Option value="Categoria 2">Categoria 2</Option>
  </Select>
);

const userDropdownItems: MenuProps["items"] = [
  {
    key: "acount",
    label: "account"
  },
  {
    key: "log-out",
    label: "log out"
  }
];

export const Navbar = () => {
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
  const toggleAllCategoriesDrawer = () => {
    setShowAllCategories(!showAllCategories);
  };
  const router = useRouter();

  const onSearch = () => {
    router.push('/search');
  }

  return (
    <>
      <Header className={`${styles.navbar}`}>
        <div className="grid-container grid-column-full px-xx-l">
          <div className={`${styles.navbarLogoContainer} flex-start-center`}>
            <Link href="/">
              <Image className="cursor-pointer" src={logo} alt="Store Logo" />
            </Link>
          </div>
          <div className={`${styles.navbarBrowserWrapper} flex-center-center`}>
            <Input.Search
              size="large"
              allowClear
              addonBefore={selectBefore}
              placeholder="DetailView"
              onSearch={onSearch}
            />
          </div>
          <ul className={`${styles.navbarOptionsList} flex-end-center`}>
            <li>item 1</li>
            <li>item 2</li>
            <li>item 3</li>
            <li>item 4</li>
            <li className={styles.userDropdown}>
              <Dropdown menu={{ items: userDropdownItems }} placement="bottom">
                <Image src={person} alt="user icon" />
              </Dropdown>
            </li>
          </ul>
        </div>
        <div className={`${styles.navbarFavoritesWrapper} px-xx-l`}>
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
            <li>
              item 5
            </li>
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
