import { waitFor, within, screen } from "@testing-library/react";
import { expect } from "vitest";
import { RemoteProduct } from "../../../api/StoreApi.ts";
import { userEvent } from "@testing-library/user-event";

export function verifyHeader(headerRow: HTMLElement) {
    const headerScope = within(headerRow);

    const cells = headerScope.getAllByRole("columnheader");

    expect(cells).toHaveLength(6);

    within(cells[0]).getByText("ID");
    within(cells[1]).getByText("Title");
    within(cells[2]).getByText("Image");
    within(cells[3]).getByText("Price");
    within(cells[4]).getByText("Status");
}

export async function waitToTableIsLoaded() {
    await waitFor(async () =>
        expect((await screen.findAllByRole("row")).length).toBeGreaterThan(1)
    );
}

export function verifyRows(rows: HTMLElement[], products: RemoteProduct[]) {
    expect(rows).toHaveLength(products.length);

    rows.forEach((row, index) => {
        const rowScope = within(row);
        const cells = rowScope.getAllByRole("cell");
        expect(cells).toHaveLength(6);
        const product = products[index];

        within(cells[0]).getByText(product.id);
        within(cells[1]).getByText(product.title);
        const image: HTMLImageElement = within(cells[2]).getByRole("img") as HTMLImageElement;
        expect(image.src).toBe(product.image);
        within(cells[3]).getByText(`$${product.price.toFixed(2)}`);
        within(cells[4]).getByText(product.price === 0 ? "inactive" : "active");
    });
}

export async function openDialogToEditPrice(index: number): Promise<HTMLElement> {
    const allRows = await screen.findAllByRole("row");
    const [, ...rows] = allRows;
    const row = rows[index];

    const rowScope = within(row);
    await userEvent.click(rowScope.getByRole("menuitem"));
    const updatePriceMenu = await screen.findByRole("menuitem", { name: /update price/i });

    await userEvent.click(updatePriceMenu);

    return await screen.findByRole("dialog");
}

export function verifyDialog(dialog: HTMLElement, product: RemoteProduct) {
    const dialogScope = within(dialog);

    const image: HTMLImageElement = dialogScope.getByRole("img") as HTMLImageElement;
    expect(image.src).toBe(product.image);
    dialogScope.getByText(product.title);
    expect(dialogScope.getByDisplayValue(product.price));
}

export async function typePrice(dialog: HTMLElement, price: string) {
    const dialogScope = within(dialog);
    const priceTextBox = dialogScope.getByRole("textbox", { name: /price/i });
    await userEvent.clear(priceTextBox);
    await userEvent.type(priceTextBox, price);
}

export async function verifyError(dialog: HTMLElement, errorMessage: string) {
    const dialogScope = within(dialog);
    await dialogScope.findByText(errorMessage);
}

export async function savePrice(dialog: HTMLElement) {
    const dialogScope = within(dialog);
    await userEvent.click(dialogScope.getByRole("button", { name: /save/i }));
}

export async function verifyPriceAndStatusInRow(index: number, newPrice: string, status: string) {
    const allRows = await screen.findAllByRole("row");
    const [, ...rows] = allRows;
    const row = rows[index];
    const rowScope = within(row);
    const cells = rowScope.getAllByRole("cell");

    within(cells[3]).getByText(`$${(+newPrice).toFixed(2)}`);
    within(cells[4]).getByText(status);
}
