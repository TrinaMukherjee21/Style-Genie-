// Centralized image utility for consistent product image matching

export const PRODUCT_IMAGES = {
  // Male products
  'Classic White T-Shirt': 'photo-1521572163474-6864f9cf17ab',
  'Vintage Denim Jacket': 'photo-1551028719-00167b16eac5',
  'Streetwear Hoodie': 'photo-1556821840-3a63f95609a7',
  'Black Hoodie': 'photo-1556821840-3a63f95609a7',
  'Navy Blazer': 'photo-1594633312681-425c7b97ccd1',
  'Tailored Navy Blazer': 'photo-1594633312681-425c7b97ccd1',
  'Oxford Dress Shirt': 'photo-1598033129183-c4f50c7176c8',
  'Classic Oxford Shirt': 'photo-1598033129183-c4f50c7176c8',
  'Dress Shirt': 'photo-1598033129183-c4f50c7176c8',
  'Wool Dress Pants': 'photo-1542272604-787c3835535d',
  'Slim Fit Chinos': 'photo-1473966968600-fa801b869a1a',
  'Denim Jeans': 'photo-1542272604-787c3835535d',
  'White Leather Sneakers': 'photo-1549298916-b41d501d3772',
  'White Sneakers': 'photo-1549298916-b41d501d3772',
  'Combat Boots': 'photo-1608256246200-53e8b694267f',
  'Leather Biker Jacket': 'photo-1594938298603-c8148c4dae35',
  'Leather Jacket': 'photo-1594938298603-c8148c4dae35',
  'Minimalist Watch': 'photo-1523275335684-37898b6baf30',
  'Luxury Watch': 'photo-1523275335684-37898b6baf30',
  'Vintage Sunglasses': 'photo-1511499767150-a48a237f0083',
  'Graphic Band Tee': 'photo-1544957992-20514f595d6f',
  'Tech Cargo Shorts': 'photo-1591195853828-11db59a44f6b',
  'Polo Shirt': 'photo-1598033129183-c4f50c7176c8',
  'Leather Messenger Bag': 'photo-1553062407-98eeb64c6a62',
  'Cargo Pants': 'photo-1473966968600-fa801b869a1a',
  'Knit Sweater': 'photo-1434389677669-e08b4cac3105',
  'Formal Suit': 'photo-1507003211169-0a1dd7228f2d',

  // Female products
  'Silk Slip Dress': 'photo-1595777457583-95e059d581b8',
  'Bohemian Maxi Dress': 'photo-1469334031218-e382a71b716b',
  'Vintage Maxi Dress': 'photo-1469334031218-e382a71b716b',
  'Elegant Midi Dress': 'photo-1595777457583-95e059d581b8',
  'Oversized Blazer': 'photo-1594633312681-425c7b97ccd1',
  'Blazer Jacket': 'photo-1543163521-1bf539c55dd2',
  'High-Waisted Jeans': 'photo-1541099649105-f69ad21f3246',
  'High-Waisted Vintage Jeans': 'photo-1541099649105-f69ad21f3246',
  'Oversized Knit Sweater': 'photo-1434389677669-e08b4cac3105',
  'Cashmere Knit Sweater': 'photo-1434389677669-e08b4cac3105',
  'Cozy Sweater': 'photo-1434389677669-e08b4cac3105',
  'Casual White Tee': 'photo-1544957992-20514f595d6f',
  'Silk Camisole': 'photo-1594633312681-425c7b97ccd1',
  'Leather Moto Jacket': 'photo-1594938298603-c8148c4dae35',
  'Tailored Blazer Dress': 'photo-1595777457583-95e059d581b8',
  'Silk Midi Dress': 'photo-1595777457583-95e059d581b8',
  'Minimalist Silk Blouse': 'photo-1562157873-818bc0726f68',
  'Silk Blouse': 'photo-1562157873-818bc0726f68',
  'Wide-Leg Trousers': 'photo-1594633312681-425c7b97ccd1',
  'Sequin Mini Dress': 'photo-1566479179817-c0b5b4b4b1e8',
  'Sequin Party Dress': 'photo-1566479179817-c0b5b4b4b1e8',
  'Satin Slip Dress': 'photo-1595777457583-95e059d581b8',
  'White Canvas Sneakers': 'photo-1549298916-b41d501d3772',
  'Platform Heels': 'photo-1543163521-1bf539c55dd2',
  'High Heels': 'photo-1543163521-1bf539c55dd2',
  'Statement Earrings': 'photo-1515562141207-7a88fb7ce338',
  'Statement Chandelier Earrings': 'photo-1515562141207-7a88fb7ce338',
  'Statement Jewelry': 'photo-1515562141207-7a88fb7ce338',
  'Delicate Gold Necklace': 'photo-1515562141207-7a88fb7ce338',
  'Cropped Cardigan': 'photo-1434389677669-e08b4cac3105',
  'Flowy Palazzo Pants': 'photo-1594633312681-425c7b97ccd1',
  'Vintage Band Tee': 'photo-1544957992-20514f595d6f',
  'Structured Handbag': 'photo-1553062407-98eeb64c6a62'
};

export const CATEGORY_FALLBACK_IMAGES = {
  'tops': 'photo-1521572163474-6864f9cf17ab',
  'bottoms': 'photo-1542272604-787c3835535d',
  'dresses': 'photo-1595777457583-95e059d581b8',
  'outerwear': 'photo-1594633312681-425c7b97ccd1',
  'shoes': 'photo-1549298916-b41d501d3772',
  'accessories': 'photo-1523275335684-37898b6baf30',
  'garment upper body': 'photo-1521572163474-6864f9cf17ab',
  'garment lower body': 'photo-1542272604-787c3835535d',
  'garment full body': 'photo-1595777457583-95e059d581b8'
};

export const DEFAULT_IMAGE = 'photo-1556905055-8f358a7a47b2';

/**
 * Get the appropriate image URL for a product
 * @param {string} title - Product title
 * @param {string} category - Product category
 * @param {string} aesthetic - Product aesthetic (optional)
 * @param {number} width - Image width (default: 300)
 * @param {number} height - Image height (default: 400)
 * @returns {string} Unsplash image URL
 */
export const getProductImage = (title, category, aesthetic = '', width = 300, height = 400) => {
  // First try exact title match
  if (title && PRODUCT_IMAGES[title]) {
    const imageId = PRODUCT_IMAGES[title];
    return `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
  }

  // Try partial title match
  if (title) {
    const partialMatch = Object.keys(PRODUCT_IMAGES).find(key => 
      title.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(title.toLowerCase())
    );
    
    if (partialMatch) {
      const imageId = PRODUCT_IMAGES[partialMatch];
      return `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
    }
  }

  // Fallback to category
  if (category && CATEGORY_FALLBACK_IMAGES[category]) {
    const imageId = CATEGORY_FALLBACK_IMAGES[category];
    return `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
  }

  // Final fallback
  return `https://images.unsplash.com/${DEFAULT_IMAGE}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
};

/**
 * Get quiz item image with proper sizing
 * @param {string} title - Product title
 * @param {string} category - Product category
 * @returns {string} Unsplash image URL optimized for quiz
 */
export const getQuizImage = (title, category) => {
  return getProductImage(title, category, '', 500, 600);
};

/**
 * Get recommendation card image with proper sizing
 * @param {string} title - Product title
 * @param {string} category - Product category
 * @returns {string} Unsplash image URL optimized for cards
 */
export const getRecommendationImage = (title, category) => {
  return getProductImage(title, category, '', 300, 400);
};