import { Locator, Page } from "@playwright/test";

export class ProductDetailsPage {
    readonly page: Page;
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly addToCartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTitle = page.getByRole('heading', { level: 1 }); //Title is in the only h1 on the page
        this.productPrice = page.locator('//*[@id="buyBlockSlot"]/div[1]/div[1]/div/div/div[1]/span');
        //*[@id="buyBlockSlot"]/div[1]/div[1]/div/div/div[1]/span
        //*[@id="buyBlockSlot"]/div[1]/div[1]/div/div/div[1]
        this.productAvailability = page.locator('//*[@id="buyBlockSlot"]/div[2]/div[1]/span');
        this.addToCartButton = page.getByRole('button', { name: 'In winkelwagen' });
    }


}