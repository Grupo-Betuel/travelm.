import { BaseService } from '@services/BaseService';
import OrderEntity, { ISale } from '@shared/entities/OrderEntity';
import { ClientEntity } from '@shared/entities/ClientEntity';
import { useAppStore } from '@services/store';
import { getAuthData } from '../../utils/auth.utils';

export default class OrderService extends BaseService<OrderEntity> {
  authClient?: ClientEntity;

  localOrderKeyPrefix = 'betuelGroupLocalOrder';

  localOrderKey = '';

  constructor() {
    super('orders');
    this.initLocalOrder();
  }

  public get localOrder(): OrderEntity {
    // if (typeof window === 'undefined') return new OrderEntity()
    const localOrder = JSON.parse(
      localStorage.getItem(this.localOrderKey) || '{}'
    );
    const currentOrder = useAppStore?.getState().currentOrder;
    return currentOrder?._id ? currentOrder : localOrder;
  }

  private set localOrder(order: OrderEntity) {
    const currentOrder = useAppStore?.getState().currentOrder;
    if (currentOrder?._id) {
      console.log('current order not updated', currentOrder);
      order._id && useAppStore?.getState().handleCurrentOrder(order);
    } else {
      useAppStore?.getState().handleCurrentOrder(order);
    }

    if (!order?._id) {
      localStorage.setItem(this.localOrderKey, JSON.stringify(order));
    }
  }

  private initLocalOrder() {
    this.authClient = getAuthData('all') as ClientEntity;
    this.localOrderKey = `${this.localOrderKeyPrefix}${
      this.authClient?._id || ''
    }`;
    if (typeof window === 'undefined') return;

    let local = JSON.parse(localStorage.getItem(this.localOrderKey) || '{}');
    if (!local.sales) {
      local = new OrderEntity();
      this.localOrder = local;
    }

    if (!!this.authClient && !local?.sales?.length) {
      const oldOrder = JSON.parse(
        localStorage.getItem(this.localOrderKeyPrefix) || '{}'
      );
      localStorage.removeItem(this.localOrderKeyPrefix);
      if (oldOrder.sales?.length) {
        local = oldOrder;
      }
    }

    this.localOrder = local;
  }

  handleLocalOrderSales(sale: Partial<ISale>) {
    const newLocalOrder = this.localOrder;
    const exist = !!newLocalOrder.sales.find(
      (s) => s.product._id === sale.product?._id
    );

    if (exist) {
      newLocalOrder.sales = newLocalOrder.sales.map((s) => {
        if (s.product._id === sale.product?._id) return sale;
        return s;
      }) as ISale[];
    } else {
      newLocalOrder.sales.push(sale as ISale);
    }

    newLocalOrder.company = newLocalOrder.sales
      .map((s) => s.company)
      .join(', ');
    this.localOrder = newLocalOrder;
  }

  removeSale(productId: string) {
    const newLocalOrder = this.localOrder;
    newLocalOrder.sales = newLocalOrder.sales.filter(
      (s) => s.product._id !== productId
    );
    this.localOrder = newLocalOrder;
  }

  getSaleByProductId(productId: string) {
    return this.localOrder.sales.find((s) => s.product._id === productId);
  }

  resetOrder() {
    console.log('reseting order', new OrderEntity());
    this.localOrder = new OrderEntity();
  }
}
