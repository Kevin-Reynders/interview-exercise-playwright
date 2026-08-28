import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { SearchPage } from '../pages/searchPage';
import { ProductDetailsPage } from '../pages/productsDetailsPage';
import { ReleaseYear, SortingOptions } from '../helpers/filters';
import { waitForPageLoad } from '../helpers/functions';

let homePage: HomePage;
let searchPage: SearchPage;
let productDetailsPage: ProductDetailsPage;

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
        await expect(homePage.searchInput).toBeVisible();
        await expect(searchPage.productSearchHeader).toContainText("lego");
        await expect(searchPage.page).toHaveURL(/.*searchtext=lego.*/);
        await expect(searchPage.productTitles.nth(0)).not.toBeEmpty();
        await expect(searchPage.productPrices.nth(0)).not.toBeEmpty();
        await test.info().attach(`${test.info().title}`, {
            body: await searchPage.page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        }); //Making a screenshot for proof and adding it to report
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
        await homePage.searchForItem("lego"); //Search term is needed because if leaving it empty, it will refer to the homepage
        searchPage = new SearchPage(homePage.page);
        //Only show results from 2024
        await searchPage.filterByReleaseYear(ReleaseYear.Year2024);
        //Search for a specific category, e.g. "Gaming"
        await searchPage.filterByCategory("Gaming");
        await expect(searchPage.productSearchHeader).toContainText("Gaming");
        //Sort the results by price low to high
        await searchPage.sortBy(SortingOptions.PriceLowToHigh);
        //Get the first three prices and check if they are sorted correctly
        const prices = await searchPage.getThreePrices();
        //Putting in a console log to see the prices
        console.log("Prices: ", prices[0], prices[1], prices[2]);
        expect(prices.length).toBe(3);
        expect(prices[0]).toBeLessThanOrEqual(prices[1]);
        expect(prices[1]).toBeLessThanOrEqual(prices[2]);
        await test.info().attach(`${test.info().title} - Sorted page`, {
            body: await searchPage.page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });
    });
});

test.describe('Productdetailpagina', () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.acceptCookies();
        await homePage.acceptLanguage();
    });

    test('Open a product detail page and check the title, price, availability and add it to the cart', async ({ context, page }) => {
        await homePage.searchForItem("lego");
        searchPage = new SearchPage(page);
        const pagePromise = context.waitForEvent('page'); // Wait for the new tab to open
        await Promise.all([
            searchPage.productTitles.nth(0).click({ modifiers: ['Control'] }), // Open in a new tab
        ]);
        const newPage = await pagePromise;
        await newPage.waitForLoadState('load'); // Wait for the new page to load
        productDetailsPage = new ProductDetailsPage(newPage);
        searchPage.page.close(); // Close the original page to focus on the new product details page

        await waitForPageLoad(newPage); // Wait for the page to load after clicking the product
        productDetailsPage.page.bringToFront(); // Bring the new page to the front
        await productDetailsPage.isProductTitleVisible();
        await productDetailsPage.isProductPriceVisible();
        await productDetailsPage.isProductAvailabilityVisible();
        await productDetailsPage.isAddToCartButtonVisible();

        await productDetailsPage.page.route('**/*', async (route) => {
            if (route.request().method() === 'POST') {
                // Abort the request if it is a POST
                await route.abort();
            } else {
                // Let all other requests (GET, PUT, DELETE, etc.) proceed normally
                await route.continue();
            }});

        await test.info().attach(`${test.info().title} - Before cart`, {
            body: await productDetailsPage.page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });
        const currentURL: string = productDetailsPage.page.url();
        productDetailsPage.addToCartButton.first().click();
        await expect(productDetailsPage.addToCartButton.first()).toHaveText('In winkelwagen');
        //Check the URL if staying on the PDP
        await expect(productDetailsPage.page).toHaveURL(currentURL)
        
        await test.info().attach(`${test.info().title} - After cart`, {
            body: await productDetailsPage.page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });
    });
});

test.describe('Paginering', () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.acceptCookies();
        await homePage.acceptLanguage();
    });

    test('Check the first five titles of page 1 and 2 with eachother', async ({ page }) => {
        await page.goto("https://www.bol.com/be/nl/");
        await homePage.searchForItem("lego");
        searchPage = new SearchPage(page);
        await waitForPageLoad(searchPage.page);
        const group1Titles = searchPage.getFirstFiveTitles(); //Promise with string array
        const titles1 = await group1Titles; //String array
        expect(titles1.length).toBe(5);
        await test.info().attach(`${test.info().title} - Page 1`, {
            body: await searchPage.page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });

        //Everything page 2 and onwards
        searchPage.goToPageNumber(2);
        await searchPage.page.waitForURL(new RegExp(`.*page=2.*`));
        await expect(searchPage.page).toHaveURL(new RegExp(`.*page=2.*`));
        await expect(searchPage.page.locator(`[aria-label="huidige pagina 2"]`)).toHaveAttribute('aria-current', 'page');
        await waitForPageLoad(searchPage.page);
        const group2Titles = searchPage.getFirstFiveTitles();
        const titles2 = await group2Titles;
        expect(titles2.length).toBe(5);
        await test.info().attach(`${test.info().title} - Page 2`, {
            body: await searchPage.page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });

        //Checks if the titles are unique or not
        const allTitles = [...titles1, ...titles2]
        const duplicates = allTitles.filter((title, index) => allTitles.indexOf(title) !== index);
        expect(duplicates).toEqual([]);
    });
});