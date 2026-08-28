import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { SearchPage } from '../pages/searchPage';
import { ReleaseYear, SortingOptions } from '../helpers/filters';

let homePage: HomePage;
let searchPage: SearchPage;

test.describe('Homepage en zoekfunctie', () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.acceptCookies();
        await homePage.acceptLanguage();
    });
    
    test('Open the homepage', async ({ page }) => {
        await page.goto("https://www.bol.com/be/nl/");
        await expect(page).toHaveURL("https://www.bol.com/be/nl/"); 
    });

    test('Search for lego and check the results', async ({ page }) => {
        searchPage = new SearchPage(page);
        await homePage.searchForItem("lego");
        await expect(searchPage.page).toHaveURL(/.*searchtext=lego.*/);
        await expect(searchPage.productTitles.nth(0)).toBeVisible();
        await expect(searchPage.productTitles.nth(0)).not.toBeEmpty();
        await expect(searchPage.productPrices.nth(0)).toBeVisible();
        await expect(searchPage.productPrices.nth(0)).not.toBeEmpty();
        await test.info().attach('screenshot', {
            body: await searchPage.page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        }); //Making a screenshot for proof and adding it to report
        //await searchPage.page.screenshot({ path: 'search_results.png', fullPage: true });
    });
});

test.describe('Filteren en sorteren', () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.acceptCookies();
        await homePage.acceptLanguage();
    });
    
    test('Apply Year and Category filter and sort to search results', async () => {
        await homePage.searchForItem("lego");
        searchPage = new SearchPage(homePage.page);
        // Apply filter and sort logic here
        //e.g. only show results from 2024
        await searchPage.filterByReleaseYear(ReleaseYear.Year2024);
        //Search for a specific category, e.g. "Gaming"
        await searchPage.filterByCategory("Gaming");
        await expect(searchPage.productSearchHeader).toContainText("Gaming");

        //Sort the results by price low to high
        await searchPage.sortBy(SortingOptions.PriceLowToHigh);
        //await expect(searchPage.page.getByLabel('Sortering')).toContainText(SortingOptions.PriceLowToHigh);

        //Get the first three prices and check if they are sorted correctly
        const prices = await searchPage.getThreePrices();
        //Putting in a console log to see the prices
        console.log("Prices: ", prices[0], prices[1], prices[2]);
        expect(prices.length).toBe(3);
        expect(prices[0]).toBeLessThanOrEqual(prices[1]);
        expect(prices[1]).toBeLessThanOrEqual(prices[2]);
    });
});

test.describe('Productdetailpagina', () => {
    test.beforeAll(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.acceptCookies();
        await homePage.acceptLanguage();
    });

    


});