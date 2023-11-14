import { BaseService } from '@services/BaseService';
import OrderEntity, { ISale } from '@shared/entities/OrderEntity';
import { ClientEntity } from '@shared/entities/ClientEntity';
import { useAppStore } from '@services/store';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
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
      localStorage.getItem(this.localOrderKey) || '{}',
    );
    const currentOrder = useAppStore?.getState().currentOrder;
    return currentOrder?._id ? currentOrder : localOrder;
  }

  private set localOrder(order: OrderEntity) {
    const currentOrder = useAppStore?.getState().currentOrder;
    if (currentOrder?._id) {
      useAppStore?.getState().handleCurrentOrder(order);
    } else {
      if (order._id && currentOrder) {
        const currentOrderProducts = currentOrder.sales?.map(
          (sale) => sale.product,
        );
        const orderProducts = order.sales?.map((sale) => sale.product);
        const productIds = Array.from(
          new Set([
            ...currentOrderProducts.map((p) => p._id),
            ...orderProducts.map((p) => p._id),
          ]),
        );

        /// merging sales without repeating orders
        order.sales = productIds.map((
          pId,
        ) => currentOrder.sales.find((
          s,
        ) => s.product._id === pId) || order.sales.find((
          s,
        ) => s.product._id === pId)) as ISale[];
      }

      useAppStore?.getState().handleCurrentOrder(order);
    }

    const invalidStatus = ['completed', 'canceled', 'checking-transfer', 'delivering', 'delivered', 'confirmed'];

    if (invalidStatus.indexOf(order.status) !== -1) {
      order = new OrderEntity();
      useAppStore?.getState().handleCurrentOrder(order);
    }

    if (!order?._id) {
      localStorage.setItem(this.localOrderKey, JSON.stringify(order));
    } else {
      localStorage.removeItem(this.localOrderKey);
    }
  }

  public async initLocalOrder() {
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
        localStorage.getItem(this.localOrderKeyPrefix) || '{}',
      );
      localStorage.removeItem(this.localOrderKeyPrefix);
      if (oldOrder.sales?.length) {
        local = oldOrder;
      }
    }
    if (this.authClient?._id) {
      // const orderId =
      const queryString = window.location.search;
      const parameters = new URLSearchParams(queryString);
      const orderId = parameters.get('orderId');
      const order = await this.get({
        endpoint: EndpointsAndEntityStateKeys.PENDING,
        slug: this.authClient._id,
        queryParams: {
          orderId,
        },
      });
      local = order || local;
    }

    this.localOrder = local;
  }

  handleLocalOrderSales(sale: Partial<ISale>) {
    const newLocalOrder = structuredClone(this.localOrder);
    const exist = !!newLocalOrder.sales.find(
      (s) => s.product._id === sale.product?._id,
    );

    if (exist) {
      newLocalOrder.sales = newLocalOrder.sales.map((s) => {
        if (s.product._id === sale.product?._id) return sale;
        return s;
      }) as ISale[];
    } else {
      newLocalOrder.sales.push(sale as ISale);
    }

    newLocalOrder.company = Array.from(new Set(newLocalOrder.sales
      .map((s) => s.company)))
      .join(',');

    this.localOrder = newLocalOrder;
  }

  removeSale(productId: string) {
    const newLocalOrder = this.localOrder;
    newLocalOrder.sales = newLocalOrder.sales.filter(
      (s) => s.product._id !== productId,
    );
    this.localOrder = newLocalOrder;
  }

  getSaleByProductId(productId: string) {
    return this.localOrder.sales?.find((s) => s.product._id === productId);
  }

  resetOrder() {
    this.localOrder = new OrderEntity();
  }

  resetLocalStorageOrder() {
    localStorage.removeItem(this.localOrderKey);
  }
}
