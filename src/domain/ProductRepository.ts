import { Product } from "./Product.ts";

export class ResourceNotFound extends Error {}

export interface ProductRepository {
    getAll(): Promise<Product[]>;
    getById(productId: number): Promise<Product>;
}
