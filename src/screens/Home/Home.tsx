import { VerticalPreviewCard } from "@components/VerticalPreviewCard";
import styles from "./Home.module.scss";
import logo from "@assets/images/logo.png";
import { LandingCarousel } from "./components/HomeCarousel";
import { ScrollView } from "@components/ScrollView/ScrollView";
import { useStore } from "@services/store";
import { ProductEntity } from "@models/ProductEntity";
import { useEffect, useState } from "react";

export const Home = () => {
  const count = useStore((state) => state.count);
  const name = useStore((state) => state.name);
  const handleCount = useStore((state) => state.handleCount);
  const productEntity = useStore((state) => state.posts((statep) => statep));

  const [product, setProduct] = useState<ProductEntity>(new ProductEntity());
  const products = [
    {
      title: "First Item",
      image: logo
    },
    {
      title: "First Item",
      image: logo
    },
    {
      title: "First Item",
      image: logo
    },
    {
      title: "First Item",
      image: logo
    }
  ];

  const onchange = ({ target: { value, name } }: any) =>
    setProduct({
      ...product,
      [name]: value
    });

  const onSelectProduct = (item: ProductEntity) => () =>
    setProduct({ ...item });

  const createProduct = () => {
    if (!product.id) {
      productEntity.add(product);
    } else {
      productEntity.update(product.id, product);
    }
    setProduct({} as ProductEntity);
  };

  const removeProduct = (id: number) => () => {
    productEntity.remove(id);
  };
  useEffect(() => {
    productEntity.get({});
  }, []);
  return (
    <div className={styles.HomeWrapper}>
      {/*{productEntity.loading ? (*/}
      {/*  <p>Loading...</p>*/}
      {/*) : (*/}
      {/*  <h1>*/}
      {/*    Count {count} - {name}*/}
      {/*  </h1>*/}
      {/*)}*/}
      {/*<br />*/}
      {/*<br />*/}
      {/*<input*/}
      {/*  type="text"*/}
      {/*  name="title"*/}
      {/*  onChange={onchange}*/}
      {/*  value={product.title}*/}
      {/*  placeholder="title"*/}
      {/*/>{" "}*/}
      {/*<br /> <br />*/}
      {/*<input*/}
      {/*  type="text"*/}
      {/*  name="description"*/}
      {/*  onChange={onchange}*/}
      {/*  value={product.description}*/}
      {/*  placeholder="description"*/}
      {/*/>{" "}*/}
      {/*<br /> <br />*/}
      {/*<input*/}
      {/*  type="text"*/}
      {/*  name="image"*/}
      {/*  onChange={onchange}*/}
      {/*  value={product.image}*/}
      {/*  placeholder="image"*/}
      {/*/>{" "}*/}
      {/*<br /> <br />*/}
      {/*<button onClick={createProduct}>*/}
      {/*  {product.id ? "Update" : "Create"} product*/}
      {/*</button>{" "}*/}
      {/*<br /> <br />*/}
      {/*<button onClick={handleCount()}>Increase</button>*/}
      {/*<br /> <br />*/}
      {/*<button onClick={handleCount(true)}>Decrease</button>*/}
      {/*<br />*/}
      {/*<br />*/}
      {/*<div className={styles.products}>*/}
      {/*  {productEntity.data.map((item, i) => (*/}
      {/*    <div key={i} onClick={onSelectProduct(item)}>*/}
      {/*      <img src={item.image} alt="" />*/}
      {/*      <h5>{item.title}</h5>*/}
      {/*      <p>{item.description}</p>*/}
      {/*      <a href="#" onClick={removeProduct(item.id)}>*/}
      {/*        Eliminar*/}
      {/*      </a>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
      <div className={styles.LandingCarouselWrapper}>
        <LandingCarousel />
      </div>
      <div className={styles.HomeContent}>
        <div className={styles.HomeTopCardsGrid}>
          <VerticalPreviewCard products={products} />
          <VerticalPreviewCard products={products.slice(0, 3)} />
          <VerticalPreviewCard products={products.slice(0, 1)} />
          <VerticalPreviewCard products={products} />
        </div>
        <ScrollView />
        <ScrollView />
      </div>
    </div>
  );
};
