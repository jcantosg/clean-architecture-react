import {afterAll, afterEach, beforeAll, describe, test} from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { ProductsPage } from "../ProductsPage.tsx";
import { ReactNode } from "react";
import { AppProvider } from "../../context/AppProvider.tsx";
import {MockWebServer} from "../../tests/MockWebServer.ts";
import productsResponse from "./data/productsResponse.json";

const mockWebServer = new MockWebServer();

describe("ProductsPage", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("Loads and displays title", async () => {
        givenAproducts();
        renderComponent(<ProductsPage />);
        await screen.findAllByRole("heading", { name: "Product price updater" });
    });



});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}

function givenAproducts() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: `https://fakestoreapi.com/products`,
            httpStatusCode: 200,
            response: productsResponse,
        },
    ]);
}
