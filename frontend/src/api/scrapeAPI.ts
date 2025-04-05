import axios from 'axios';

export const scrapeProduct = async (product: string) => {
  try {
    // Send a POST request with the product name in the request body
    const response = await axios.post('/api/scrape', {
      product: product  // This matches the ScrapeDTO structure
    });
    
    // The response will contain carousell_results and insights
    return response.data;
  } catch (error) {
    console.error('Error scraping product:', error);
    throw error;
  }
};
