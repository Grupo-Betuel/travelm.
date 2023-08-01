import {
  Avatar,
  Button,
  Carousel,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  Space,
  Spin,
  Tag,
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  LikeOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import React, {
  ChangeEvent,
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { handleEntityHook } from '@shared/hooks/handleEntityHook';
import { Resizable } from 're-resizable';
import { StickyFooter } from '@shared/layout/components/StickyFooter/StickyFooter';
import { useContextualRouting } from 'next-use-contextual-routing';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import { ImageBackground } from '@components/DetailView/components/ImageBackground/ImageBackground';
import {
  IProductParam,
  IProductSaleParam,
  ProductEntity,
} from '@shared/entities/ProductEntity';
import { ClientEntity } from '@shared/entities/ClientEntity';
import { ISale } from '@shared/entities/OrderEntity';
import OrderService from '@services/orderService';
import { structuredClone } from 'next/dist/compiled/@edge-runtime/primitives/structured-clone';
import { useOrderContext } from '@shared/contexts/OrderContext';
import { useAppStore } from '@services/store';
import { getAuthData } from '../../../utils/auth.utils';
import { sidebarWidth } from '../../../utils/layout.utils';
import styles from './DetailView.module.scss';
import { getSaleDataFromProduct } from '../../../utils/objects.utils';

export interface IDetailViewProps {
  previewPost?: any;
  selectedPost?: any;
  returnHref?: string;
}

function IconText({ icon, text }: { icon: any; text: string }) {
  return (
    <Space>
      {createElement(icon)}
      {text}
    </Space>
  );
}

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: 'https://ant.design',
  title: `Juan Felipe ${i}`,
  avatar:
    'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg?crop=0.670xw:1.00xh;0.167xw,0&resize=640:*',
  description: 'Revendedor | Tienda | Vendedor Oficial',
  content:
    'Me Encanto la tabla de surf que compre, de muy buena calidad, excelente servicios',
}));

const controlNamePrefix = 'quantity-';

export function DetailView({ previewPost, returnHref }: IDetailViewProps) {
  const [product, setProduct] = useState<ProductEntity>({} as ProductEntity);
  const [sale, setSale] = useState<Partial<ISale>>({} as ISale);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const router = useRouter();
  const carouselRef = useRef<any>();
  const { loading, get, item } = handleEntityHook<ProductEntity>('products');
  const { makeContextualHref } = useContextualRouting();
  const [productOptionsForm] = Form.useForm();
  const { orderService } = useOrderContext();
  const currentOrder = useAppStore((state) => state.currentOrder);

  useEffect(() => {
    const productId = router.query.productId as string;
    if (productId) {
      get({ endpoint: EndpointsAndEntityStateKeys.BY_ID, slug: productId });
    }
  }, [router.query]);

  useEffect(() => {
    setProduct({ ...item } as ProductEntity);
  }, [item]);

  useEffect(() => {
    if (product._id && currentOrder) {
      // const savedSale = orderService.getSaleByProductId(product._id) || {}
      const savedSale = currentOrder.sales.find(
        (s) => s.product._id === product._id,
      );
      setSale({
        ...getSaleDataFromProduct(product),
        ...savedSale,
      });
    }
  }, [product]);

  const back = () => {
    if (returnHref) {
      router.push(
        makeContextualHref({ return: true, productId: '' }),
        returnHref,
        {
          shallow: true,
        },
      );
    } else {
      router.push(`/${product.company}`);
    }
  };

  const navigate = (to: 'prev' | 'next') => () => carouselRef.current && carouselRef.current[to]();
  const hasImages = product.images && !!product.images.length;
  const hasMultipleImages = hasImages && product.images.length > 1;

  const handleSaleProductParams = (productParam: IProductParam | IProductSaleParam) => () => {
    const saleParam: any = (
      productParam as IProductSaleParam
    ).productParam
      ? (productParam as IProductSaleParam)
      : ({} as IProductSaleParam);

    const relatedParams = productParam.relatedParams?.map((item) => ({
      ...item,
      _id: undefined,
      productParam: item._id,
      productQuantity: item.quantity,
      quantity: 0,
    }));

    // @ts-ignore
    const param: IProductSaleParam = {
      // locator: Date.now().toString(),
      label: productParam.label,
      value: productParam.value,
      type: productParam.type,
      productQuantity: productParam.quantity,
      quantity: 0,
      relatedParams: relatedParams || ([] as any),
      productParam: productParam._id,
      ...saleParam,
    };

    const exist = sale?.params?.find((p) => p.productParam === param.productParam);
    if (exist) {
      const newParams = sale?.params?.filter((p) => p.productParam !== param.productParam);
      setSale({ ...sale, params: newParams });
    } else {
      const newParams = [...(sale?.params || [])];
      newParams.push(param);
      setSale({ ...sale, params: newParams });
    }
  };

  const handleSaleQuantity = (value?: any) => {
    const quantity = Number(value || 0);
    const newSale: Partial<ISale> = {
      ...structuredClone(sale),
      quantity,
    };
    if (quantity <= product.stock) {
      if (quantity > 0) {
        orderService?.handleLocalOrderSales(newSale);
      } else {
        orderService?.removeSale(product._id);
      }
      setSale(newSale);
    }
  };

  const resetSaleProductParam = (parentId: string, variantId?: string) => () => handleSaleProductParamsChange(parentId, variantId)(0);

  const handleSaleProductParamsChange = (parentId: string, variantId?: string) => async (value?: any) => {
    let newSale = structuredClone(sale);
    let total = 0;
    const productData = structuredClone(product);
    const quantity = Number(value || 0);
    const exist = newSale?.params?.find((p) => p.productParam === parentId);

    const productParam = exist;
    if (!productParam) {
      // productParam =
      //   productData.productParams.find((p) => p._id === parentId) ||
      //   ({} as IProductParam);
      console.log('no product param');
      return;
    }

    const variant = productParam?.relatedParams?.find(
      (v) => v.productParam === variantId,
    );
    if (variant) {
      variant.quantity = quantity;
      total = productParam?.relatedParams?.reduce(
        (acc, v) => acc + (v.quantity || 0),
        0,
      ) || 0;
    } else {
      total = quantity;
    }
    productParam.quantity = total;

    if (exist) {
      const newParams = newSale?.params?.map((p) => {
        if (p.productParam === parentId) {
          return productParam;
        }
        return p;
      }) as IProductParam[];
      newSale = {
        ...newSale,
        params: newParams.filter((item) => !!item),
      };
    } else {
      const newParams = [...(newSale?.params || [])];
      newParams.push(productParam);
      newSale = {
        ...newSale,
        params: newParams,
      };
    }

    const saleTotal = newSale.params?.reduce((acc, p) => acc + (p.quantity || 0), 0) || 0;
    newSale.quantity = saleTotal;

    const paramId = variantId || parentId;
    const controlName = `${controlNamePrefix}${paramId}`;
    const controlIsValid = await productOptionsForm
      .validateFields([controlName])
      .then(
        () => true,
        () => false,
      );

    if (controlIsValid) {
      setSale({ ...newSale });

      if (saleTotal <= 0) {
        orderService?.removeSale(product._id);
      } else {
        if (quantity <= 0) {
          newSale.params = newSale?.params?.filter(
            (item) => item._id !== parentId,
          );
        }

        orderService?.handleLocalOrderSales(newSale);
      }
    }
  };

  const getQuantityValue = (parentId: string, variantId?: string) => {
    const param = sale?.params?.find((p) => p._id === parentId);

    if (variantId) {
      return (
        param?.relatedParams?.find((v) => v._id === variantId)?.quantity || 0
      );
    }
    return param?.quantity || 0;
  };

  const maxQuantityError = useCallback(
    (quantity: number = 0) => (!quantity
      ? 'No quedan unidades disponibles'
      : `Solo quedan ${quantity} unidades`),
    [],
  );

  const productOptionFormValues = useMemo(() => {
    const initialValues: any = {};
    (sale?.params || []).forEach((param) => {
      initialValues[`${controlNamePrefix}${param.productParam}`] = param.quantity;
      (param?.relatedParams || []).forEach((variant) => {
        initialValues[`${controlNamePrefix}${variant.productParam}`] = variant.quantity;
      });
    });
    initialValues.quantity = sale?.quantity;
    productOptionsForm.setFieldsValue(initialValues);
    return initialValues;
  }, [sale]);

  const { toggleCart } = useOrderContext();

  return (
    <>
      {loading && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}
      <div className={`grid-container ${styles.DetailViewWrapper}`}>
        <div className={styles.ProductDetailBanner}>
          <h1>Offerta!</h1>
        </div>
        <div className={`grid-column-1 ${styles.GalleryWrapper}`}>
          {!previewPost && (
            <div className={styles.DetailViewBackButton} onClick={back}>
              <ArrowLeftOutlined rev="" />
            </div>
          )}
          {hasMultipleImages && (
            <>
              <div className={styles.DetailViewPrevButton}>
                <ArrowLeftOutlined rev="" onClick={navigate('prev')} />
              </div>
              <div className={styles.DetailViewNextButton}>
                <ArrowRightOutlined rev="" onClick={navigate('next')} />
              </div>
            </>
          )}
          <Image.PreviewGroup>
            <Carousel
              ref={carouselRef}
              nextArrow={(
                <div className={styles.DetailViewButton}>
                  <ArrowRightOutlined rev="" />
                </div>
              )}
            >
              {hasImages ? (
                product.images.map((img, i) => (
                  <ImageBackground image={img} key={`detailViewImage${i}`} />
                ))
              ) : (
                <ImageBackground />
              )}
            </Carousel>
          </Image.PreviewGroup>
        </div>
        <Resizable
          defaultSize={{ width: sidebarWidth, height: 'auto' }}
          enable={{ left: true, right: false }}
          className={styles.DetailViewPostDetails}
        >
          <div className={styles.DetailViewPostDetailsHeader}>
            <span className="title">{product.name}</span>
            <span className="subtitle">
              RD$
              {' '}
              {product.price?.toLocaleString()}
            </span>
            <span className="label">
              {product.stock}
              {' '}
              unidades disponibles
            </span>
          </div>
          <div className={styles.DetailViewPostDetailsContent}>
            <span className="subtitle mb-m">Cantidades</span>
            <Form
              form={productOptionsForm}
              name="productOptionsForm"
              className={styles.DetailViewPostDetailsContentOptionsWrapper}
            >
              {product?.productParams && product?.productParams.length ? (
                product?.productParams?.map((param, i) => {
                  const isActive = sale?.params?.find(
                    (saleParam) => saleParam.productParam === param._id,
                  );
                  return (
                    <div
                      className={`${
                        styles.DetailViewPostDetailsContentOption
                      } ${
                        isActive
                          ? `${styles.active} ${
                            param.relatedParams?.length ? ' w-100' : ''
                          }`
                          : ''
                      }`}
                      key={`detailViewOption${i}`}
                    >
                      <Button
                        className={styles.DetailViewPostDetailsContentOptionBtn}
                        shape="round"
                        size="middle"
                        onClick={handleSaleProductParams(param)}
                      >
                        {param.label}
                        {param.type === 'color' ? (
                          <span
                            className={
                              styles.DetailViewPostDetailsContentOptionBtnColorOption
                            }
                            style={{ backgroundColor: param.value }}
                          />
                        ) : (
                          param.value
                        )}
                      </Button>
                      {param?.relatedParams && !!param?.relatedParams.length ? (
                        <div
                          className={
                            styles.DetailViewPostDetailsContentOptionVariants
                          }
                        >
                          {param.relatedParams?.map((variant, i) => (
                            <div
                              className={
                                styles.DetailViewPostDetailsContentOptionVariantsItem
                              }
                              key={`detailViewOptionVariant${i}`}
                            >
                              <Tag>
                                {variant.label}
                                {' '}
                                -
                                {variant.value}
                              </Tag>
                              <Form.Item
                                name={`${controlNamePrefix}${variant._id}`}
                                rules={[
                                  {
                                    type: 'number',
                                    required: true,
                                    message: maxQuantityError(variant.quantity),
                                    max: variant.quantity,
                                    min: 0,
                                  },
                                ]}
                              >
                                <InputNumber
                                  type="number"
                                  placeholder="Cantidad"
                                  value={getQuantityValue(
                                    param._id,
                                    variant._id,
                                  )}
                                  defaultValue={0}
                                  onChange={handleSaleProductParamsChange(
                                    param._id,
                                    variant._id,
                                  )}
                                  addonAfter={(
                                    <CloseOutlined
                                      rev
                                      onClick={resetSaleProductParam(
                                        param._id,
                                        variant._id,
                                      )}
                                    />
                                  )}
                                  min={0}
                                />
                              </Form.Item>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Form.Item
                          name={`${controlNamePrefix}${param._id}`}
                          rules={[
                            {
                              type: 'number',
                              required: true,
                              message: maxQuantityError(param.quantity),
                              max: param.quantity,
                              min: 0,
                            },
                          ]}
                        >
                          <InputNumber
                            type="number"
                            className={
                              styles.DetailViewPostDetailsContentOptionQuantity
                            }
                            placeholder="Cantidad"
                            onChange={handleSaleProductParamsChange(param._id)}
                            value={getQuantityValue(param._id)}
                            defaultValue={0}
                            min={0}
                            addonAfter={(
                              <CloseOutlined
                                rev
                                onClick={resetSaleProductParam(param._id)}
                              />
                            )}
                          />
                        </Form.Item>
                      )}
                    </div>
                  );
                })
              ) : (
                <Form.Item
                  name="quantity"
                  rules={[
                    {
                      type: 'number',
                      required: true,
                      message: maxQuantityError(product.stock),
                      max: product.stock,
                      min: 0,
                    },
                  ]}
                >
                  <InputNumber
                    type="number"
                    addonAfter={(
                      <CloseOutlined
                        rev
                        onClick={() => handleSaleQuantity(0)}
                      />
                    )}
                    onChange={handleSaleQuantity}
                    value={sale.quantity}
                    defaultValue={0}
                    min={0}
                  />
                </Form.Item>
              )}
            </Form>
            <div
              className={styles.DetailViewPostDetailsContentDescriptionWrapper}
            >
              <h2 className="subtitle">Descripcion</h2>
              <div
                className={`${styles.DetailViewPostDetailsContentDescription} ${
                  showMoreDescription ? styles.showMoreDescription : ''
                }`}
              >
                {product.description}
              </div>
              <a
                className={styles.DetailViewPostDetailsContentDescriptionToggle}
                onClick={() => setShowMoreDescription(!showMoreDescription)}
              >
                {!showMoreDescription ? 'Mostrar mas' : 'Mostrar menos'}
              </a>
            </div>

            <div
              className={styles.DetailViewPostDetailsContentComments}
              style={{ display: 'none' }}
            >
              <span className="subtitle mb-xx-s">Comentarios</span>
              <div className="flex-between-center p-m gap-s">
                <Input
                  placeholder="Escribir comentario"
                  suffix={<UploadOutlined rev="" />}
                />
                <Button icon={<MessageOutlined rev="" />}>Enviar</Button>
              </div>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={data}
                footer={(
                  <div>
                    <b>ant design</b>
                    {' '}
                    footer part
                  </div>
                )}
                renderItem={(item) => (
                  <List.Item
                    key={item.title}
                    actions={[
                      <IconText
                        icon={StarOutlined}
                        text="156"
                        key="list-vertical-star-o"
                      />,
                      <IconText
                        icon={LikeOutlined}
                        text="156"
                        key="list-vertical-like-o"
                      />,
                      <IconText
                        icon={MessageOutlined}
                        text="2"
                        key="list-vertical-message"
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<a href={item.href}>{item.title}</a>}
                      description={item.description}
                    />
                    {item.content}
                  </List.Item>
                )}
              />
            </div>
          </div>
          <StickyFooter className={styles.DetailViewPostDetailsActions}>
            <Button
              type="primary"
              shape="round"
              block
              size="large"
              icon={<ShoppingCartOutlined rev="" />}
              className="me-m"
              onClick={toggleCart}
            >
              Realizar orden
            </Button>
          </StickyFooter>
        </Resizable>
      </div>
    </>
  );
}
