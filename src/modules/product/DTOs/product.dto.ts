import { TTypeProduct } from "../Enums/type-product.enum";

export class ProductDTO {
  imageProduct?: string;
  codeProductSigma: string;
  descriptionCatalogue: string;
  descriptionStock?: string;
  stock: number;
  restrictStock: number;
  typeProduct: TTypeProduct;
  sigma: boolean;
  categoryId: number;
  unitMeasureId: number;
  isActive: boolean;
  isToner: boolean;
}
