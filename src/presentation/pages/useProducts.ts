import { useEffect, useState } from "react";
import { useReload } from "../hooks/useReload.ts";
import { Product } from "../../domain/Product.ts";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase.ts";

export function useProducts(getProductsUseCase: GetProductsUseCase) {
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products);
        });
    }, [reloadKey, getProductsUseCase]);

    return {
        products,
        reload,
    };
}
