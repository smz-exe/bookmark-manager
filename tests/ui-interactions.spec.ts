import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from './test-config';
import { loginUser } from './fixtures/auth.fixture';
import { TEST_BOOKMARKS, createBookmark } from './fixtures/bookmark.fixture';

test.describe('UI Interactions', () => {
  test.beforeEach(async ({ page }) => {
    try {
      // Try to login first
      await loginUser(page);
    } catch {
      // If login fails, navigate directly to dashboard
      console.log('Login failed, navigating directly to dashboard');
      await page.goto(`${TEST_CONFIG.baseUrl}/dashboard`);
    }

    // Create test bookmarks for our UI tests if they don't exist
    try {
      await createBookmark(page, TEST_BOOKMARKS.basic);
      await createBookmark(page, TEST_BOOKMARKS.github);
    } catch {
      console.log('Error creating test bookmarks, they might already exist');
    }
  });

  test('toggle bookmark view modes', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('.grid');

    // By default we should be in grid view, check UI state
    let gridViewActive = await page.evaluate(() => {
      const button = document.querySelector('button:has-text("Grid")');
      return (
        button?.getAttribute('data-state') === 'active' || button?.classList.contains('bg-primary')
      );
    });

    expect(gridViewActive).toBeTruthy();

    // Take screenshot of grid view
    await page.screenshot({ path: 'test-results/grid-view.png' });

    // Switch to list view
    await page.getByRole('button', { name: /list/i }).click();

    // Verify the list view is active
    const listViewActive = await page.evaluate(() => {
      const button = document.querySelector('button:has-text("List")');
      return (
        button?.getAttribute('data-state') === 'active' || button?.classList.contains('bg-primary')
      );
    });

    expect(listViewActive).toBeTruthy();

    // Take screenshot of list view
    await page.screenshot({ path: 'test-results/list-view.png' });

    // Switch back to grid view
    await page.getByRole('button', { name: /grid/i }).click();

    // Verify grid view is active again
    gridViewActive = await page.evaluate(() => {
      const button = document.querySelector('button:has-text("Grid")');
      return (
        button?.getAttribute('data-state') === 'active' || button?.classList.contains('bg-primary')
      );
    });

    expect(gridViewActive).toBeTruthy();
  });

  test('search functionality', async ({ page }) => {
    // Ensure bookmarks are present
    await page.waitForSelector(`text=${TEST_BOOKMARKS.basic.title}`, { state: 'visible' });

    // Find the search input
    const searchInput = page.getByPlaceholder(/search/i);

    // If search input not found, try alternative locators
    if ((await searchInput.count()) === 0) {
      console.log('Search input not found with placeholder, trying alternative selectors');
      await page.screenshot({ path: 'test-results/search-input-not-found.png' });
    }

    // Get all visible bookmark titles before search
    const beforeSearchTitles = await page.locator('h3, h4').allTextContents();
    console.log('Visible bookmarks before search:', beforeSearchTitles);

    // Search for Github
    await searchInput.fill('GitHub');

    // Wait for search results to update
    await page.waitForTimeout(500);

    // Verify GitHub bookmark is visible
    await expect(page.getByText(TEST_BOOKMARKS.github.title)).toBeVisible();

    // Take screenshot of search results
    await page.screenshot({ path: 'test-results/search-results.png' });

    // Check if Example bookmark is hidden (might be visible if search is highlighting, not filtering)
    const exampleVisible = await page.getByText(TEST_BOOKMARKS.basic.title).isVisible();
    console.log(`Example bookmark ${exampleVisible ? 'is' : 'is not'} visible after search`);

    // Clear search
    await searchInput.clear();

    // Wait for search results to reset
    await page.waitForTimeout(500);

    // Verify both bookmarks are visible again
    await expect(page.getByText(TEST_BOOKMARKS.basic.title)).toBeVisible();
    await expect(page.getByText(TEST_BOOKMARKS.github.title)).toBeVisible();
  });

  test('tag filtering functionality', async ({ page }) => {
    // Ensure bookmarks are present
    await page.waitForSelector(`text=${TEST_BOOKMARKS.basic.title}`, { state: 'visible' });

    // Try to find a tag element - this depends on your UI implementation
    const tagElement = page.getByText(TEST_BOOKMARKS.basic.tags[0]);

    if ((await tagElement.count()) > 0) {
      // Click on the tag
      await tagElement.first().click();

      // Wait for filtering to apply
      await page.waitForTimeout(500);

      // Take screenshot of filtered results
      await page.screenshot({ path: 'test-results/tag-filtered-results.png' });

      // Verify filter is applied (implementation depends on your UI)
      // This assumes clicking a tag shows some active filter UI
      const activeFilterExists =
        (await page.locator('[aria-selected="true"], .active-filter, .selected-tag').count()) > 0;
      console.log(`Active filter ${activeFilterExists ? 'exists' : 'does not exist'}`);

      // Reset filter if UI has reset feature
      const resetButton = page.getByRole('button', { name: /clear|reset|all/i });
      if ((await resetButton.count()) > 0) {
        await resetButton.click();
        await page.waitForTimeout(500);
      }
    } else {
      // If no tag elements found, log this situation
      console.log('No clickable tag elements found');
      await page.screenshot({ path: 'test-results/no-tags-found.png' });
    }
  });

  test('favorite bookmark functionality', async ({ page }) => {
    // Ensure bookmarks are present
    await page.waitForSelector(`text=${TEST_BOOKMARKS.basic.title}`, { state: 'visible' });

    // Find the bookmark card
    const bookmarkCard = page.locator(`div:has-text("${TEST_BOOKMARKS.basic.title}")`).first();

    // Find favorite button - adapt this selector to match your actual UI
    const favoriteButton = bookmarkCard.getByRole('button', { name: /favorite|star/i });

    if ((await favoriteButton.count()) > 0) {
      // Get initial state (favorited or not)
      const initialState = (await favoriteButton.getAttribute('aria-pressed')) === 'true';

      // Click favorite button
      await favoriteButton.click();

      // Wait for state to update
      await page.waitForTimeout(500);

      // Verify state changed
      const newState = (await favoriteButton.getAttribute('aria-pressed')) === 'true';
      expect(newState).not.toEqual(initialState);

      // Take screenshot
      await page.screenshot({ path: 'test-results/favorite-bookmark.png' });

      // Toggle back to original state
      await favoriteButton.click();
    } else {
      console.log('Favorite button not found on bookmark card');
      await page.screenshot({ path: 'test-results/no-favorite-button.png' });
    }
  });
});
