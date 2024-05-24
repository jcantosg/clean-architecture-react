import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { ProductsPage } from "../../ProductsPage.tsx";
import { ReactNode } from "react";
import { AppProvider } from "../../../context/AppProvider.tsx";
import { MockWebServer } from "../../../tests/MockWebServer.ts";
import { givenAproducts, givenThereAreNoproducts } from "./ProductsPage.fixture.ts";
import {
    openDialogToEditPrice,
    verifyDialog,
    verifyHeader,
    verifyRows,
    waitToTableIsLoaded
} from "./ProductsPage.helpers.ts";

const mockWebServer = new MockWebServer();

describe("ProductsPage", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("Loads and displays title", async () => {
        givenAproducts(mockWebServer);
        renderComponent(<ProductsPage />);
        await screen.findAllByRole("heading", { name: "Product price updater" });
    });

    describe("table", () => {
        test("Should show an empty table if there are no data", async () => {
            givenThereAreNoproducts(mockWebServer);
            renderComponent(<ProductsPage />);

            const rows = await screen.findAllByRole("row");

            expect(rows).toHaveLength(1);

            verifyHeader(rows[0]);
        });

        test("Should show expected header and rows in the table", async () => {
            const products = givenAproducts(mockWebServer);
            renderComponent(<ProductsPage />);
            await waitToTableIsLoaded();

            const allRows = await screen.findAllByRole("row");

            const [header, ...rows] = allRows;
            verifyHeader(header);
            verifyRows(rows, products);
        });
    });

    describe("Edit price", () => {
       test("Should show a dialog when clicking on a row with the product", async () => {
           const products = givenAproducts(mockWebServer);
           renderComponent(<ProductsPage />);
           await waitToTableIsLoaded();

           const dialog = await openDialogToEditPrice(0);
           verifyDialog(dialog, products[0]);
       });
    });



});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
