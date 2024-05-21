import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { ProductsPage } from "../../ProductsPage.tsx";
import { ReactNode } from "react";
import { AppProvider } from "../../../context/AppProvider.tsx";
import { MockWebServer } from "../../../tests/MockWebServer.ts";
import {givenAproducts, givenThereAreNoproducts} from "./ProductsPage.fixture.ts";
import {verifyHeader} from "./ProductsPage.helpers.ts";

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

    test("Should show an empty table if there are no data", async () => {
        givenThereAreNoproducts(mockWebServer);
        renderComponent(<ProductsPage />);

        const rows = await screen.findAllByRole("row");

        expect(rows).toHaveLength(1);

        verifyHeader(rows[0])
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}


