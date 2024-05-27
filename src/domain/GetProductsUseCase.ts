import { Product } from "./Product.ts";
import { ProductRepository } from "./ProductRepository.ts";

export class GetProductsUseCase {
    constructor(private productRepository: ProductRepository) {}
    async execute(): Promise<Product[]> {
        return this.productRepository.getAll();
    }
}
