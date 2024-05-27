import {Product} from "./Product.ts";

export interface ProductRepository {
    getAll(): Promise<Product[]>;
}