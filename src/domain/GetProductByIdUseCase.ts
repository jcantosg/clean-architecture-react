import { Product } from "./Product.ts";
import { ProductRepository } from "./ProductRepository.ts";

export class GetProductByIdUseCase {
    constructor(private productRepository: ProductRepository) {}
    async execute(productId: number): Promise<Product> {
        return this.productRepository.getById(productId);
    }
}
