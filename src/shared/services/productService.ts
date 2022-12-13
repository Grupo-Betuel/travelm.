import { BaseService } from "@services/BaseService";
import { ProductEntity } from "@models/ProductEntity";

export class ProductService extends BaseService<ProductEntity> {
  constructor() {
    super("posts");
  }
}