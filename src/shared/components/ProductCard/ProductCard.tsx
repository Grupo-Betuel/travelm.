import Image from "next/image";
import placeholder from "@assets/images/logo.png";
import { Rate } from "antd";
import styles from "./ProductCard.module.scss";
import Link from "next/link";

export const ProductCard = () => {
  return (
    <Link href="/detail">
      <div className={styles.ProductCard}>
        <Image src={placeholder} />
        <span className={styles.ProductTitle}>
        MILDPLUS Almohadillas de cama desechables de 30 x 36 pulgadas (50
        piezas) almohadillas extra grandes para incontinencia de enuresis para
        adultos y mascotas
      </span>
        <Rate allowHalf defaultValue={4.5} disabled />
        <span className={styles.ProductPrice}>RD$ 4,500</span>
      </div>
    </Link>
  );
};
