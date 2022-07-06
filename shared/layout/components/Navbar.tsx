import { Header } from "antd/lib/layout/layout";
import logo from "../../assets/images/logo.png";
import Image from "next/image";
import styles from "./Navbar.module.scss";
import { Space } from "antd";

export const Navbar = () => {
  return (
    <Header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Store Logo" />
      </div>
      <div className={styles.browserWrapper}>{/*<Input></Input>*/}</div>
    </Header>
  );
};
