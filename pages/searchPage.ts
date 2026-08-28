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
        this.productSearchHeader = page.getByRole('heading', { level: 1});
        this.productTitles = page.locator('//*[@class="order-4"]');
        this.productPrices = page.locator('//span[contains(text(), "De prijs van dit product is")]');
        this.searchInput = page.locator('[data-test="search_input_trigger"]');
        this.searchButton = page.locator('[data-test="search-button"]');
        this.filterReleaseYearTitle = page.getByRole('button', { name: 'Jaar van uitgave' });
    }

    async filterByReleaseYear(year: ReleaseYear) {
        const yearOptionLocator = this.page.locator(`//button[@id="${year}"]`);
        if (await this.filterReleaseYearTitle.getAttribute('data-state') === 'closed') {
            await this.filterReleaseYearTitle.click(); // Click the filter dropdown
        }
        await expect(yearOptionLocator).toBeVisible();
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
        const selectedSorting = this.page.locator('//select[@label="Sortering"]').first();
        await selectedSorting.selectOption(sortingOption);
        await waitForPageLoad(this.page); // Wait for the page to load after sorting
        await expect(selectedSorting).toBeVisible();
        await selectedSorting.waitFor({ state: "visible" });
        await expect(selectedSorting).toHaveValue(sortingOption);
    }

    async getThreePrices(): Promise<number[]> {
        await this.productPrices.first().waitFor({ state: "attached" });

        const allPrices = await this.productPrices.allTextContents();
        const filteredPrices = allPrices.filter((_, i) => i % 2 === 0); // Filter out every second element, as prices come in pairs for the different views (list and grid)
        return filteredPrices.slice(0, 3).map(text => { 
            const priceMatch = text.match(/De prijs van dit product is '(\d+)' euro en '(\d+)' cent/); 
            return parseFloat(`${priceMatch![1]}.${priceMatch![2]}`);
        });
    }

    async getFirstFiveTitles() {
        await expect(this.productTitles.first()).toBeVisible();
        const allTitles = await this.productTitles.allTextContents();
        const filteredTitles = allTitles.slice(2, 7); //First 2 results are always sponsered, so they will usually give back the same results, therefore excluding them
        console.log(filteredTitles);
        return filteredTitles;
    }
    
    async goToPageNumber(pageNumber: number) {
        this.page.locator(`[aria-label="ga naar pagina  ${pageNumber}"]`).click();
        await expect(this.page).toHaveURL(new RegExp(`.*page=${pageNumber}.*`));
    }
}