import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { SearchPage } from '../pages/searchPage';

let homePage: HomePage;
let searchPage: SearchPage;

test.describe('Homepage en Zoekfunctie', () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.acceptCookies();
        await homePage.acceptLanguage();
    });
    
    test('Open the homepage', async () => {
        await homePage.goto();
        await expect(homePage.page).toHaveURL("https://www.bol.com/be/nl/"); 
    });

    test('Search for lego and check the results', async () => {
        const searchPage = new SearchPage(homePage.page);
        await homePage.searchForItem("lego");
        await expect(homePage.page).toHaveURL(/.*searchtext=lego.*/);
        await expect(searchPage.productTitles.nth(0)).toBeVisible();
        await expect(searchPage.productTitles.nth(0)).not.toBeEmpty();
        await expect(searchPage.productPrices.nth(0)).toBeVisible();
        await expect(searchPage.productPrices.nth(0)).not.toBeEmpty();
        await test.info().attach('screenshot', {
            body: await homePage.page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        }); //Making a screenshot for proof and adding it to report
        //await homePage.page.screenshot({ path: 'search_results.png', fullPage: true });
    });


});