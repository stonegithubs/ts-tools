export async function waitAndClick(page, selector) {
    await page.waitFor(1000);
    await page.waitForSelector(selector, { visible: true });
    await page.click(selector);
  }