import {useCallback, useEffect, useState} from "react";
import { useReload } from "../hooks/useReload.ts";
import { Product } from "../../domain/Product.ts";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase.ts";
import {buildProduct} from "../../data/ProductApiRepository.ts";
import {StoreApi} from "../../data/api/StoreApi.ts";
import {useAppContext} from "../context/useAppContext.ts";

export function useProducts(getProductsUseCase: GetProductsUseCase, storeApi: StoreApi) {
    const { currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [error, setError] = useState<string>();

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products);
        });
    }, [reloadKey, getProductsUseCase]);

    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setError("Only admin users can edit the price of a product");
                    return;
                }

                storeApi
                    .get(id)
                    .then(buildProduct)
                    .then(product => {
                        setEditingProduct(product);
                    })
                    .catch(() => {
                        setError(`Product with id ${id} not found`);
                    });
            }
        },
        [currentUser.isAdmin, storeApi]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, [setEditingProduct]);

    return {
        products,
        reload,
        updatingQuantity,
        editingProduct,
        setEditingProduct,
        error,
        cancelEditPrice,
    };
}
