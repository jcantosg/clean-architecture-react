import {ProductRepository, ResourceNotFound} from "../domain/ProductRepository.ts";
import { Product } from "../domain/Product.ts";
import { RemoteProduct, StoreApi } from "./api/StoreApi.ts";

export class ProductApiRepository implements ProductRepository {
    constructor(private storeApi: StoreApi) {}
    async getAll(): Promise<Product[]> {
        const remoteProducts = await this.storeApi.getAll();

        return remoteProducts.map(buildProduct);
    }

    async getById(productId: number): Promise<Product> {
        try {
            const remoteProduct = await this.storeApi.get(productId);
            return buildProduct(remoteProduct);
        } catch (error) {
            throw new ResourceNotFound(`Product with id ${productId} not found`);
        }

    }
}

function buildProduct(remoteProduct: RemoteProduct): Product {
    return {
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }),
    };
}
