// import { Location } from 'whatsapp-web.js'
import { IMessenger } from '@interfaces/messenger.interface';
import { ClientEntity } from '@shared/entities/ClientEntity';
import { BaseEntity } from '@shared/entities/BaseEntity';
import { IProductParam, IProductSaleParam, ProductEntity } from '@shared/entities/ProductEntity';

export interface ProductId {
  _id: string;
  name: string;
  GodWord: string;
  price: number;
  cost: number;
  commission: number;
  image: string;
  flyerOptions: string;
  __v: number;
  productImage: string;
  description: string;
  company: string;
  lastFbPublicationDate: string;
  facebookId: string;
  lastIgPublicationDate: string;
  instagramId: string;
  productParams: IProductParam[];
  stock: number;
}

export interface ISale {
  _id: string;
  productId?: string;
  product: ProductEntity;
  profit: number;
  unitPrice: number;
  unitCost: number;
  unitProfit: number;
  shipping: number;
  commission: number;
  date: string;
  createDate: string;
  quantity: number;
  status: string;
  params: IProductSaleParam[];
  company: string;
  __v: number;
}

export type OrderTypes = 'shipping' | 'pickup';
export type OrderPaymentTypes = 'cash' | 'transfer' | 'card';
export type OrderStatusTypes =
  | 'pending'
  | 'personal-assistance'
  | 'confirmed'
  | 'checking-transfer'
  | 'pending-info'
  | 'delivering'
  | 'delivered'
  | 'canceled'
  | 'cancel-attempt'
  | 'completed';

export interface ITransferReceipt {
  _id?: string;
  image: string;
  order?: string;
  status: 'confirmed' | 'pending' | 'rejected';
  confirmedBy?: string;
  updateDate?: Date;
}

export interface IQuotedMessage {
  // type?: string;
  body: any;
  thumbnail?: '';
  inviteGrpType?: 'DEFAULT';
  type: 'image' | 'chat';
  deprecatedMms3Url: string;
  directPath: string;
  staticUrl: string;
  mimetype: 'image/jpeg' | 'image/png';
  caption: string;
  filehash: string;
  encFilehash: string;
  size: number;
  height: number;
  width: number;
  mediaKey: string;
  mediaKeyTimestamp: 1688058782;
  interactiveAnnotations: any[];
  scanLengths: any[];
  isViewOnce: false;
}

export type IOrderData = {
  [N in string]: OrderEntity[];
};

export default class OrderEntity extends BaseEntity {
  client?: ClientEntity;

  status: OrderStatusTypes = 'pending-info';

  paymentType?: OrderPaymentTypes;

  // productId: ProductId = {} as ProductId
  sales: ISale[] = [];

  company: string = '';

  type?: OrderTypes;

  location?: any;

  // eslint-disable-next-line no-use-before-define
  transferReceipt?: ITransferReceipt;

  messenger?: IMessenger;

  shippingPrice?: number;

  shippingTime?: string;
}
