export async function waitAndClick(page, selector) {
    await page.waitFor(100);
    await page.waitForSelector(selector, { visible: true });
    await page.click(selector);
  }