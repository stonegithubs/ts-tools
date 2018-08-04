"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function waitAndClick(page, selector) {
    await page.waitFor(1000);
    await page.waitForSelector(selector, { visible: true });
    await page.click(selector);
}
exports.waitAndClick = waitAndClick;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVwcGV0ZWVyLXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi91dGlscy9wdXBwZXRlZXItdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBTyxLQUFLLHVCQUF1QixJQUFJLEVBQUUsUUFBUTtJQUM3QyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBSkgsb0NBSUcifQ==