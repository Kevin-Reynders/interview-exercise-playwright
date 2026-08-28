import { Locator, Page, expect } from "@playwright/test";
import { ReleaseYear, SortingOptions } from "../helpers/filters";
import { waitForPageLoad } from "../helpers/functions";

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
        //this.productPrices = page.locator('//div[@class="flex items-center justify-between"]');
        //this.productPrices = page.locator('span:has-text("De prijs van dit product is")');
        this.productPrices = page.locator('//span[contains(text(), "De prijs van dit product is")]');
        //this.productPrices = page.locator('span', { hasText: 'De prijs van dit product is' });
        this.searchInput = page.locator('[data-test="search_input_trigger"]');
        this.searchButton = page.locator('[data-test="search-button"]');
        this.filterReleaseYearTitle = page.getByRole('button', { name: 'Jaar van uitgave' });
    }

    async filterByReleaseYear(year: ReleaseYear) {
        const yearOptionLocator = this.page.locator(`//button[@id="${year}"]`);
        if (await this.filterReleaseYearTitle.getAttribute('data-state') === 'closed') {
            await this.filterReleaseYearTitle.click(); // Click the filter dropdown
        }
        //await this.filterReleaseYearTitle.click(); // Click the filter dropdown
        await yearOptionLocator.click();
        await expect(this.page).toHaveURL(new RegExp(`.*filter_N=${year}.*`)); // Verify the URL contains the selected year
        await expect(yearOptionLocator).toHaveAttribute('aria-checked','true');
    }

    async filterByCategory(category: string) {
        await this.page.getByRole("link", { name: new RegExp(`${category} \\(\\d+\\)`) }).click();
        await this.productSearchHeader.waitFor({ state: "visible" });
        await expect(this.productSearchHeader).toContainText(category);
    }

    async sortBy(sortingOption: SortingOptions) {
        const something = this.page.locator('//select[@label="Sortering"]').first();
        //this.page.getByLabel('Sortering').filter({ has: this.page.locator('select')});
        await something.selectOption(sortingOption);
        await something.waitFor({ state: "visible" });
        await expect(something).toHaveValue(sortingOption);
        await waitForPageLoad(this.page); // Wait for the page to load after sorting
    }

    async getThreePrices(): Promise<number[]> {
        await this.productPrices.first().waitFor({ state: "attached" });

        const allPrices = await this.productPrices.allTextContents();
        const filteredPrices = allPrices.filter((_, i) => i % 2 === 0); // Filter out every second element, as prices come in pairs for the different views
        return filteredPrices.slice(0, 3).map(text => { 
            const priceMatch = text.match(/De prijs van dit product is '(\d+)' euro en '(\d+)' cent/); 
            return parseFloat(`${priceMatch![1]}.${priceMatch![2]}`);
        });
    }

    async getFirstFiveTitles() {
        const allTitles = await this.productTitles.allTextContents();
        //const filteredTitles = await Promise.all(allTitles.slice(0, 5).map(title => title.trim()));
        const filteredTitles = allTitles.slice(2, 7); //First 2 results are always sponsered, so they will usually give back the same results, therefore excluding them
        console.log(filteredTitles);
        return filteredTitles;
    }
    
    //The producttitles and productprices do not have a proper test id, and these are the only locators I could find that give me a specific point to look from in the results


    async goToPageNumber(pageNumber: number) {
        this.page.locator(`[aria-label="ga naar pagina  ${pageNumber}"]`).click();
        await expect(this.page).toHaveURL(new RegExp(`.*page=${pageNumber}.*`));
    }
}