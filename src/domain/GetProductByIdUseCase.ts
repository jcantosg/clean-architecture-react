import { Product } from "./Product.ts";
import {StoreApi} from "../data/api/StoreApi.ts";
import {buildProduct} from "../data/ProductApiRepository.ts";

export class ResourceNotFound extends Error {}
export class GetProductByIdUseCase {
    constructor(private storeApi: StoreApi) {}
    async execute(productId: number): Promise<Product> {
        try {
            const remoteProduct = await this.storeApi.get(productId);
            return buildProduct(remoteProduct);

        } catch (error) {
            throw new ResourceNotFound(`Product with id ${productId} not found`);
        }
    }
}