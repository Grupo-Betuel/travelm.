import { CompanyTypes } from "./common";
import {ICategory} from "./CategoryModel";

export interface IProductData {
  _id: string;
  name: string;
  price: number;
  wholeSale: string;
  cost: number;
  commission: number;
  image: string;
  flyerOptions: string;
  GodWord: string;
  productImage: string;
  description: string;
  stock: number;
  productParams: IProductParam[];
  category: ICategory;
  facebookId?: string;
  newArrival?: boolean;
  tags?: string[];
}

export type ProductParamTypes = 'color' | 'size';
export interface IProductParam {
  _id?: string;
  quantity?: number,
  value?: string,
  label?: string,
  type: ProductParamTypes,
  productId: string
  isRelated?: boolean;
  relatedParams?: IProductParam[];
}

export type IProductBackground = {
  [N in CompanyTypes]: { [R in 1 | 2 | 3 | 4]?: any }
}
