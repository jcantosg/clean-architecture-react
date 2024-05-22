import { MockWebServer } from "../../../tests/MockWebServer.ts";
import productsResponse from "./data/productsResponse.json";
import {RemoteProduct} from "../../../api/StoreApi.ts";

export function givenAproducts(mockWebServer: MockWebServer): RemoteProduct[] {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `https://fakestoreapi.com/products`,
            httpStatusCode: 200,
            response: productsResponse,
        },
    ]);

    return productsResponse;
}

export function givenThereAreNoproducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `https://fakestoreapi.com/products`,
            httpStatusCode: 200,
            response: [],
        },
    ]);
}
