export async function waitAndClick(page, selector) {
    await page.waitFor(300);
    await page.waitForSelector(selector, { visible: true });
    await page.click(selector);
  }