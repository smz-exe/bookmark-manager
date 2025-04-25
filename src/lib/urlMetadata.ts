/**
 * This utility fetches metadata from URLs including title, description, and favicon
 */

export type URLMetadata = {
  title?: string;
  description?: string;
  faviconUrl?: string;
  imageUrl?: string;
};

/**
 * Extracts the base URL from a given URL
 */
export function getBaseUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
  } catch {
    return '';
  }
}

/**
 * Attempts to get a favicon URL for a website
 */
export function getFaviconUrl(url: string): string {
  const baseUrl = getBaseUrl(url);
  if (!baseUrl) return '';

  return `${baseUrl}/favicon.ico`;
}

/**
 * Fetches metadata from a URL by making an API request to our server
 * This is done server-side to avoid CORS issues
 */
export async function fetchUrlMetadata(url: string): Promise<URLMetadata> {
  try {
    // In a real implementation, we would send a request to a serverless function
    // that would scrape the page for metadata
    // For now, we'll return some basic data based on the URL

    const baseUrl = getBaseUrl(url);

    return {
      title: url.split('/').pop() || 'Untitled',
      description: `Content from ${baseUrl}`,
      faviconUrl: getFaviconUrl(url),
      imageUrl: '',
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return {};
  }
}
