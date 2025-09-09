import { test, expect } from '@playwright/test';

// Vending Machine UI tests

test.describe('Vending Machine', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('should display initial products and money slot', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Vending Machine/i })).toBeVisible();
    await expect(page.getByAltText('Insert quarter')).toBeVisible();
    await expect(page.getByText('Coke')).toBeVisible();
    await expect(page.getByText('Pepsi')).toBeVisible();
    await expect(page.getByText('$1.25')).toBeVisible();
    await expect(page.getByText('$0.75')).toBeVisible();
  });

  test('should insert a quarter and update display', async ({ page }) => {
    const moneyDisplay = page.locator('.money-display');
    await expect(moneyDisplay).toHaveText('$0.00');
    await page.getByAltText('Insert quarter').click();
    await expect(moneyDisplay).toHaveText('$0.25');
  });

  test('should show error for insufficient funds', async ({ page }) => {
    await page.getByText('Coke').click();
    await expect(page.getByText(/Insufficient funds/)).toBeVisible();
  });

  test('should allow purchase when enough money is inserted', async ({ page }) => {
    for (let i = 0; i < 5; i++) await page.getByAltText('Insert quarter').click(); // $1.25
    await page.getByText('Coke').click();
    await expect(page.getByText(/Insufficient funds/)).not.toBeVisible();
    await expect(page.getByText('Coke')).toBeVisible();
    await expect(page.getByText('4')).toBeVisible(); // Remaining
  });

  test('should decrement product count after purchase', async ({ page }) => {
    for (let i = 0; i < 3; i++) await page.getByAltText('Insert quarter').click(); // $0.75
    await page.getByText('Pepsi').click();
    await expect(page.getByText('9')).toBeVisible();
  });

  test('should show error when product is out of stock', async ({ page }) => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 3; j++) await page.getByAltText('Insert quarter').click();
      await page.getByText('Pepsi').click();
    }
    // Try to purchase once more after stock is zero
    for (let j = 0; j < 3; j++) await page.getByAltText('Insert quarter').click();
    await page.getByText('Pepsi').click();
    await expect(page.getByText('Sorry, Pepsi is out of stock.')).toBeVisible();
  });

  test('should clear error when inserting a quarter after error', async ({ page }) => {
    await page.getByText('Coke').click();
    await expect(page.getByText(/Insufficient funds/)).toBeVisible();
    await page.getByAltText('Insert quarter').click();
    await expect(page.getByText(/Insufficient funds/)).not.toBeVisible();
  });
});
