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
        await expect(searchPage.productSearchHeader).toContainText("lego");
        await expect(searchPage.page).toHaveURL(/.*searchtext=lego.*/);
        //await expect(searchPage.productTitles.nth(0)).toBeVisible();
        await expect(searchPage.productTitles.nth(0)).not.toBeEmpty();
        //await expect(searchPage.productPrices.nth(0)).toBeVisible();
        await expect(searchPage.productPrices.nth(0)).not.toBeEmpty();
        await test.info().attach(`${test.info().title}`, {
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
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.acceptCookies();
        await homePage.acceptLanguage();
    });

    test('Open a product detail page and check the title, price, availability and add it to the cart', async ({ context, page }) => {
        await homePage.searchForItem("lego");
        searchPage = new SearchPage(page);
        //const [productPage] = await Promise.all([searchPage.productTitles.nth(0).click()]);
        //await productPage.waitForLoadState('load');
        //await expect(productPage.productTitle).toBeVisible();


        //await searchPage.clickFirstProduct();
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
        await expect(productDetailsPage.productTitle.first()).toBeVisible();
        //await expect(productDetailsPage.productPrice.first()).toBeVisible();
        await expect(productDetailsPage.productAvailability.first()).toBeVisible();
        await expect(productDetailsPage.addToCartButton.first()).toBeVisible();
        //await productDetailsPage.addToCartButton.click();
        //await expect(productDetailsPage.page.getByTestId('add-to-cart-button')).toHaveText('Toegevoegd aan winkelwagen');

        //await page.route('**/cart/**', route => route.abort()); // Block the request to the cart page
        //await page.route('**/basket/**', route => route.abort()); // Block the request to the basket page
        //await page.route('**/order/**', route => route.abort()); // Block the request to the order page
        //await page.route('**/checkout/**', route => route.abort()); // Block the request to the checkout page

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

        productDetailsPage.addToCartButton.first().click();
        await expect(productDetailsPage.addToCartButton.first()).toHaveText('In winkelwagen');

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

    test('FirstFiveTitles', async ({ page }) => {
        await page.goto("https://www.bol.com/be/nl/");
        await homePage.searchForItem("lego");
        searchPage = new SearchPage(page);
        await waitForPageLoad(searchPage.page);
        const group1Titles = searchPage.getFirstFiveTitles(); //Promise with string array
        const titles1 = await group1Titles; //String array
        expect(titles1.length).toBe(5);

        searchPage.goToPageNumber(2);
        await waitForPageLoad(searchPage.page);
        await searchPage.page.waitForURL(new RegExp(`.*page=2.*`))
        await expect(searchPage.page).toHaveURL(new RegExp(`.*page=2.*`));
        const group2Titles = searchPage.getFirstFiveTitles();
        const titles2 = await group2Titles;
        expect(titles2.length).toBe(5);

        const allTitles = [...titles1, ...titles2]

        const duplicates = allTitles.filter((title, index) => allTitles.indexOf(title) !== index);
        //const duplicates = titles2.filter(title => titles1.includes(title));
        expect(duplicates).toEqual([]);


    });
});