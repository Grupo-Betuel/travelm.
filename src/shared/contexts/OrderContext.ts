import {
  createContext, useContext, useEffect, useState,
} from 'react';
import OrderService from '@services/orderService';

export interface IOrderContextValue {
  orderService: OrderService
  toggleCart: () => void
  cartIsOpen?: boolean
}
export const OrderContext = createContext<IOrderContextValue>(
  {} as IOrderContextValue,
);

export const useOrderContext = (): IOrderContextValue => {
  const { orderService, toggleCart, cartIsOpen } = useContext(OrderContext);
  const [orderContext, setOrderContext] = useState<IOrderContextValue>(
    {} as IOrderContextValue,
  );

  useEffect(() => {
    setOrderContext({ orderService, toggleCart, cartIsOpen });
  }, [orderService, cartIsOpen]);

  return orderContext;
};
