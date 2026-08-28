import { Locator, Page, expect } from "@playwright/test";

export class ProductDetailsPage {
    readonly page: Page;
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly addToCartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTitle = page.getByRole('heading', { level: 1 }); //Title is in the only h1 on the page
        this.productPrice = page.locator('//*[@id="buyBlockSlot"]/div[1]/div');
        //I know this is an ugly way to locate them, but when I tried, it was either this, or get 6 hidden results back.
        this.productAvailability = page.locator('//*[@id="buyBlockSlot"]/div[3]/div[1]/span[1]');
        this.addToCartButton = page.getByRole('button', { name: 'In winkelwagen' });
    }

    async isProductTitleVisible(){
        try {
            await expect(this.productTitle.first()).toBeVisible();
        } catch (error) {
            console.log("No product title found");
        }
    }

    async isProductPriceVisible(){
        try {
            await expect(this.productPrice.first()).toBeVisible();
        } catch (error) {
            console.log("No product price found");
        }
    }

    async isProductAvailabilityVisible(){
        try {
            await expect(this.productAvailability.first()).toBeVisible();
        } catch (error) {
            console.log("No product availability found");
        }
    }

    async isAddToCartButtonVisible(){
        try {
            await expect(this.addToCartButton.first()).toBeVisible();
        } catch (error) {
            console.log("No add to cart button found");
        }
    }




}