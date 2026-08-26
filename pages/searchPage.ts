import { Locator, Page } from "@playwright/test";

export class SearchPage{
    readonly page: Page;
    readonly productTitles: Locator;
    readonly productPrices: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;


    constructor(page: Page){
        this.page = page;
        this.productTitles = page.locator('//*[@class="order-4"]');
        this.productPrices = page.locator('//div[@class="flex items-center justify-between"]');
        this.searchInput = page.locator('[data-test="search_input_trigger"]');
        this.searchButton = page.locator('[data-test="search-button"]');
    }
    
    
    //The producttitles and productprices do not have a proper test id, and these are the only locators I could find that give me a specific point to look from in the results




    


}