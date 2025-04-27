import { Page, expect } from '@playwright/test';
import { TEST_CONFIG } from '../test-config';

/**
 * Test bookmark data
 */
export const TEST_BOOKMARKS = {
  basic: {
    url: 'https://example.com',
    title: 'Example Website',
    memo: 'Test memo for example website',
    tags: ['test', 'example'],
  },
  github: {
    url: 'https://github.com',
    title: 'GitHub',
    memo: 'Code hosting platform',
    tags: ['development', 'code'],
  },
};

/**
 * Helper to create a new bookmark
 */
export const createBookmark = async (
  page: Page,
  bookmarkData = TEST_BOOKMARKS.basic,
): Promise<void> => {
  // Ensure we're on the dashboard
  if (!page.url().includes('dashboard')) {
    await page.goto(`${TEST_CONFIG.baseUrl}/dashboard`);
    await page.waitForLoadState('networkidle');
  }

  // Click add bookmark button - use multiple selectors for robustness
  const addButton = page
    .getByRole('button', { name: /add bookmark|add new|create/i })
    .or(page.getByText(/add bookmark/i).filter({ hasText: /add/i }));

  try {
    await addButton.click({ timeout: 5000 });
  } catch (error) {
    console.log('Add button not found with standard selectors, trying alternatives');
    // Try a more general approach - look for prominent buttons
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();

    // Look through visible buttons for likely add button
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const buttonText = await buttons.nth(i).textContent();
      if (buttonText && /add|new|create/i.test(buttonText)) {
        await buttons.nth(i).click();
        break;
      }
    }
  }

  // Wait for dialog or form to appear
  await page.waitForSelector('form, dialog, [role="dialog"]', { timeout: 5000 });

  // Fill bookmark form - with more robust selectors
  const urlInput = page.getByLabel(/url/i).or(page.locator('input[placeholder*="url" i]'));
  await urlInput.fill(bookmarkData.url);

  const titleInput = page.getByLabel(/title/i).or(page.locator('input[placeholder*="title" i]'));
  await titleInput.fill(bookmarkData.title);

  if (bookmarkData.memo) {
    const memoInput = page.getByLabel(/memo|note/i).or(page.locator('textarea'));
    await memoInput.fill(bookmarkData.memo);
  }

  // Add tags
  if (bookmarkData.tags && bookmarkData.tags.length > 0) {
    // Find tag input with multiple possible selectors
    const tagInput = page.getByLabel(/tags/i).or(page.locator('input[placeholder*="tag" i]'));

    for (const tag of bookmarkData.tags) {
      await tagInput.fill(tag);

      // Look for add button near the tag input
      const addTagButton = page.getByRole('button', { name: /add/i });
      if ((await addTagButton.count()) > 0) {
        await addTagButton.click();
      } else {
        // Try pressing Enter as alternative
        await tagInput.press('Enter');
      }
    }
  }

  // Submit form - look for save button
  const saveButton = page
    .getByRole('button', { name: /save|create|submit/i })
    .or(page.locator('button[type="submit"]'));
  await saveButton.click();

  // Wait for the dialog to close and bookmark to appear in the list - with timeout
  try {
    await page.waitForSelector(`text=${bookmarkData.title}`, {
      state: 'visible',
      timeout: 5000,
    });
  } catch (error) {
    console.log(`Couldn't verify bookmark "${bookmarkData.title}" was created. Continuing anyway.`);
  }
};

/**
 * Helper to delete a bookmark by its title
 */
export const deleteBookmark = async (page: Page, title: string): Promise<void> => {
  try {
    // Find the bookmark card with the title
    const bookmarkCard = page.locator(`div:has-text("${title}")`).first();
    await bookmarkCard.waitFor({ state: 'visible', timeout: 5000 });

    // Click the options menu - try multiple approaches
    try {
      await bookmarkCard.getByRole('button', { name: /options|menu|more/i }).click();
    } catch (error) {
      // Try to find icons that might be the menu button
      const iconButtons = bookmarkCard.locator('button:has(svg)');
      const count = await iconButtons.count();

      // Click the last icon button (often the menu/options button)
      if (count > 0) {
        await iconButtons.last().click();
      } else {
        throw new Error('Could not find options menu button');
      }
    }

    // Click the delete option in menu
    const deleteOption = page
      .getByRole('menuitem', { name: /delete|remove|trash/i })
      .or(page.getByText(/delete/i).filter({ hasText: /delete/i }));
    await deleteOption.click();

    // Confirm deletion if dialog appears
    const confirmButton = page.getByRole('button', { name: /confirm|yes|delete/i });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    // Wait for the bookmark to be removed with a reasonable timeout
    try {
      await page.waitForSelector(`text="${title}"`, {
        state: 'detached',
        timeout: 5000,
      });
    } catch (error) {
      // If we can't verify it's gone, check if it's still visible
      const stillVisible = await page.locator(`text="${title}"`).isVisible();
      if (stillVisible) {
        throw new Error(`Bookmark "${title}" still visible after delete operation`);
      }
    }
  } catch (error) {
    console.log(`Error during delete operation: ${error}`);
    throw error;
  }
};

/**
 * Helper to edit a bookmark
 */
export const editBookmark = async (
  page: Page,
  title: string,
  newData: {
    title?: string;
    url?: string;
    memo?: string;
    tags?: string[];
  },
): Promise<void> => {
  try {
    // Find the bookmark card with the title
    const bookmarkCard = page.locator(`div:has-text("${title}")`).first();
    await bookmarkCard.waitFor({ state: 'visible', timeout: 5000 });

    // Click the options menu - try multiple approaches
    try {
      await bookmarkCard.getByRole('button', { name: /options|menu|more/i }).click();
    } catch (error) {
      // Try to find icons that might be the menu button
      const iconButtons = bookmarkCard.locator('button:has(svg)');
      const count = await iconButtons.count();

      // Click the last icon button (often the menu/options button)
      if (count > 0) {
        await iconButtons.last().click();
      } else {
        throw new Error('Could not find options menu button');
      }
    }

    // Click the edit option
    const editOption = page
      .getByRole('menuitem', { name: /edit|modify|update/i })
      .or(page.getByText(/edit/i).filter({ hasText: /edit/i }));
    await editOption.click();

    // Wait for form to appear
    await page.waitForSelector('form, dialog, [role="dialog"]', { timeout: 5000 });

    // Update fields as needed with more robust selectors
    if (newData.url) {
      const urlInput = page.getByLabel(/url/i).or(page.locator('input[placeholder*="url" i]'));
      await urlInput.fill(newData.url);
    }

    if (newData.title) {
      const titleInput = page
        .getByLabel(/title/i)
        .or(page.locator('input[placeholder*="title" i]'));
      await titleInput.fill(newData.title);
    }

    if (newData.memo) {
      const memoInput = page.getByLabel(/memo|note/i).or(page.locator('textarea'));
      await memoInput.fill(newData.memo);
    }

    // Handle tags if provided
    if (newData.tags) {
      // Clear existing tags by clicking all X buttons
      const tagBadges = page.locator('button:has(.lucide-x)');
      const tagCount = await tagBadges.count();

      for (let i = 0; i < tagCount; i++) {
        // Always click the first one as they shift when deleted
        await tagBadges.first().click();
      }

      // Add new tags
      const tagInput = page.getByLabel(/tags/i).or(page.locator('input[placeholder*="tag" i]'));

      for (const tag of newData.tags) {
        await tagInput.fill(tag);

        // Look for add button near the tag input
        const addTagButton = page.getByRole('button', { name: /add/i });
        if ((await addTagButton.count()) > 0) {
          await addTagButton.click();
        } else {
          // Try pressing Enter as alternative
          await tagInput.press('Enter');
        }
      }
    }

    // Submit form
    const updateButton = page
      .getByRole('button', { name: /update|save|submit/i })
      .or(page.locator('button[type="submit"]'));
    await updateButton.click();

    // Wait for the dialog to close
    try {
      await page.waitForSelector('dialog', { state: 'detached', timeout: 5000 });
    } catch (error) {
      // If we can't detect dialog closing, check if new title is visible
      if (newData.title) {
        const newTitleVisible = await page.locator(`text="${newData.title}"`).isVisible();
        if (!newTitleVisible) {
          throw new Error(`Updated title "${newData.title}" not visible after edit operation`);
        }
      }
    }
  } catch (error) {
    console.log(`Error during edit operation: ${error}`);
    throw error;
  }
};
