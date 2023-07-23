import { Button, Drawer, DrawerProps, Spin, Steps } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SendOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useAppStore } from '@services/store';
import { handleEntityHook } from '@shared/hooks/handleEntityHook';
import OrderEntity from '@shared/entities/OrderEntity';
import { useAuthClientHook } from '@shared/hooks/useAuthClientHook';
import { ShoppingCart } from '@components/ShoppingCart';
import { Register } from '@screens/Auth/components/Register';
import { ProductEntity } from '@shared/entities/ProductEntity';
import { toast } from 'react-toastify';
import { StickyFooter } from '@shared/layout/components/StickyFooter/StickyFooter';
import Title from 'antd/lib/typography/Title';
import { useOrderContext } from '@shared/contexts/OrderContext';
import styles from './ShoppingCartDrawer.module.scss';

export interface IShoppingCartDrawerProps extends DrawerProps {
  onClose: () => void;
}

const data = Array.from({ length: 2 }).map((_, i) => ({
  title: 'Alas de Danza',
  description: 'Cantidad: 5',
  content: <h1>RD$400</h1>,
}));

export function ShoppingCartDrawer({
  open,
  onClose,
}: IShoppingCartDrawerProps) {
  const router = useRouter();
  const order = useAppStore((state) => state.currentOrder);
  const { client } = useAuthClientHook();
  const {
    add: sendOrder,
    update: updateOrder,
    loading,
  } = handleEntityHook<OrderEntity>('orders');
  const [current, setCurrent] = useState(0);
  const substotal = useMemo(
    () =>
      order?.sales?.reduce(
        (acc, sale) => acc + sale.product.price * sale.quantity,
        0
      ),
    [order]
  );
  const { orderService } = useOrderContext();

  useEffect(() => {
    if (client) {
      setCurrent(0);
    }
  }, [client]);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const editSale = (product: ProductEntity) => {
    router.push(`/${product.company}/detail/${product?._id}`);
    onClose && onClose();
  };

  const removeSale = (product: ProductEntity) => {
    orderService.removeSale(product._id);
    // router.push(`/${product.company}/detail/${product?._id}`)
    // onClose && onClose({} as any)
  };

  const handleSendOrder = async () => {
    if (order?._id) {
      await updateOrder(order);
    } else if (client || current === 1) {
      await sendOrder({ ...order, client });
    } else {
      next();
    }
    // TODO: Success
  };
  const onChangeStep = (value: number) => {
    setCurrent(value);
  };
  const goToProfile = () => {
    router.push('/client/profile');
    onClose && onClose();
  };

  const goToHome = () => {
    router.push('/');
    onClose && onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 0, paddingTop: 0 }}
      className={styles.ShoppingCartDrawer}
    >
      {loading && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}
      <div className={styles.ShoppingCartDrawerHeader}>
        {!client ? (
          <Steps
            onChange={onChangeStep}
            current={current}
            items={[
              {
                title: 'Articulos',
              },
              {
                title: 'Registro',
              },
            ]}
          />
        ) : (
          <>
            <h3 className="flex-between-center">
              Datos del Cliente{' '}
              <div onClick={goToProfile} className="cursor-pointer">
                <a>Editar Datos</a>
              </div>
            </h3>
            <div className="flex-column-center-center gap-s">
              <div className="flex-between-center w-100">
                <b>Nombre:</b>
                <span>{client.firstName}</span>
              </div>
              <div className="flex-between-center w-100">
                <b>Whatsapp:</b>
                <span>{client.phone}</span>
              </div>
            </div>
          </>
        )}
      </div>
      {current === 0 && (
        <>
          <ShoppingCart
            sales={order?.sales || []}
            itemActions={[
              {
                icon: DeleteOutlined,
                text: 'Eliminar',
                key: 'list-vertical-star-o',
                onClick: removeSale,
              },
              {
                icon: EditOutlined,
                text: 'Editar',
                key: 'list-vertical-star-o',
                onClick: editSale,
              },
            ]}
          />
          <StickyFooter className={styles.ShoppingCartDrawerFooter}>
            <div className="flex-between-start py-s">
              <Title className="m-0" level={5}>
                Subtotal
              </Title>
              <Title className="m-0" level={2}>
                RD$ {(substotal || '0').toLocaleString()}
              </Title>
            </div>
            {order?._id && (
              <Button
                className="mb-l"
                shape="round"
                block
                size="large"
                icon={client ? <PlusOutlined rev /> : null}
                onClick={goToHome}
              >
                Agregar más productos
              </Button>
            )}
            <Button
              type="primary"
              shape="round"
              block
              size="large"
              icon={client ? <ShoppingCartOutlined rev /> : null}
              onClick={!order?.sales?.length ? undefined : handleSendOrder}
              disabled={order?.sales?.length === 0}
            >
              {order?._id
                ? 'Actualizar Order'
                : client
                ? 'Realizar Orden'
                : 'Siguiente'}
            </Button>
          </StickyFooter>
        </>
      )}
      {current === 1 && (
        <div className={styles.ShoppingCartDrawerRegisterWrapper}>
          <Register onSubmit={handleSendOrder} />
          <Button
            htmlType="submit"
            type="default"
            shape="round"
            block
            size="large"
            onClick={prev}
          >
            Atras
          </Button>
        </div>
      )}
    </Drawer>
  );
}
