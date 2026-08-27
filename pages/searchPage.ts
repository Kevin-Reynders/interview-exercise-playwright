import { Locator, Page, expect } from "@playwright/test";
import { ReleaseYear } from "../helpers/filters";

export class SearchPage{
    readonly page: Page;
    readonly productTitles: Locator;
    readonly productPrices: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly filterReleaseYearTitle: Locator;
    readonly productSearchHeader: Locator;

    constructor(page: Page){
        this.page = page;
        this.productSearchHeader = page.locator('//*[@id="mainContent"]/div[1]/div[1]/h1');
        this.productTitles = page.locator('//*[@class="order-4"]');
        this.productPrices = page.locator('//div[@class="flex items-center justify-between"]');
        this.searchInput = page.locator('[data-test="search_input_trigger"]');
        this.searchButton = page.locator('[data-test="search-button"]');
        this.filterReleaseYearTitle = page.getByRole('button', { name: 'Jaar van uitgave' });

    }

    async filterByReleaseYear(year: ReleaseYear) {
        const yearOptionLocator = this.page.locator(`//button[@id="${year}"]`);
        await this.page.locator('//*[@id="radix-_R_j558ml35_"]/ul/div/button').click(); // Click the filter dropdown
        await yearOptionLocator.click();
        await expect(this.page).toHaveURL(new RegExp(`.*filter_N=${year}.*`)); // Verify the URL contains the selected year
        await yearOptionLocator.setChecked(true);
    }

    async filterByCategory(category: string) {
        await this.page.getByRole("link", { name: new RegExp(`${category} \\(\\d+\\)`) }).click();
        await this.productSearchHeader.waitFor({ state: "visible" });
        await expect(this.productSearchHeader).toContainText(category);

    }
    
    //The producttitles and productprices do not have a proper test id, and these are the only locators I could find that give me a specific point to look from in the results




    


}