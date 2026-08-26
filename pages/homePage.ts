import {Page, Locator} from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly cookiesButton: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly languageButton: Locator;

    //There are multiple ways to solve the locator in a page issue, whereas I chose for centralizing the locators within the constructor
    constructor(page: Page){
        this.page = page;
        //Change locator below since it relies on site being in Dutch //*[@id="radix-_R_pl35_"]/div[3]/button[1] 
        this.cookiesButton = page.getByRole("button", {name: "Alles accepteren"});
        this.searchInput = page.locator('[data-test="search_input_trigger"]');
        this.searchButton = page.locator('[data-test="search-button"]');
        this.languageButton = page.getByRole("button", {name: "Doorgaan"});
        //rudimentary setup, polish this up later

    }

    async goto(){
        await this.page.goto('https://www.bol.com/be/nl/');
    }

    async acceptCookies(){
        try {
            await this.cookiesButton.waitFor({state: "visible"});
            await this.cookiesButton.click();
        } catch (error) {
            console.log("No cookies found");
        }
    }

    async acceptLanguage(){
        try {
            await this.languageButton.waitFor({state: "visible"});
            await this.languageButton.click();
        } catch (error) {
            console.log("No language button found");
        }
    }

    async searchForItem(item: string){
        await this.searchInput.fill(item);
        await this.searchButton.click(); //You can also use the enter key
        //await this.page.keyboard.press('Enter');
    }
}