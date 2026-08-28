import { Page } from "@playwright/test";

export const waitForPageLoad = async (page: Page) => {
    await page.waitForFunction(() => {
        const spinners = document.querySelectorAll('[class*="spinner"], [class*="loading"]');
    return spinners.length === 0;
    });
}