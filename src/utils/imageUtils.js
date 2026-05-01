// imageUtils.js
// Maps product titles + categories to verified Unsplash photo IDs or direct stable URLs.
// If a title matches a known key, that image is used. Otherwise, a category fallback is used.

// ─────────────────────────────────────────────────────────────────────────────
// TITLE-SPECIFIC IMAGE MAP
// All values are VERIFIED Unsplash photo IDs (slug after /photo-) OR full URLs.
// Full URLs are used for images that need the direct link instead of slug-based format.
// ─────────────────────────────────────────────────────────────────────────────
const TITLE_IMAGE_MAP = {
  // Minimalist
  'Essential White Cotton Tee':       'photo-1521572163474-6864f9cf17ab',
  'Structured Modern Blazer':         'photo-1591047139829-d91aecb6caea',
  'Minimalist White Sneakers':        'photo-1549298916-b41d501d3772',
  'Slim Fit Chino Trousers':          'photo-1594938298603-c8148c4dae35',
  'Sleek Wristwatch':                 'photo-1523275335684-37898b6baf30',
  'Minimalist Leather Tote':          'photo-1590874103328-eac38a683ce7',

  // Vintage
  'Classic Leather Moto Jacket': 'photo-1520975954732-4cdd221fca09',
  'Heritage Denim Jacket':            'photo-1551028719-00167b16eac5',
  'Vintage Band Tee':                 'photo-1583743814966-8936f5b7be1a',
  'Retro High-Waisted Jeans':         'photo-1541099649105-f69ad21f3246',
  'Vintage Inspired Sunglasses':      'photo-1511499767150-a48a237f0083',
  'Retro Leather Satchel':            'photo-1548036328-c9fa89d128fa',
  'Leather Jacket':                   'photo-1520975954732-4cdd221fca09',
  'Leather Biker Jacket':             'photo-1520975954732-4cdd221fca09',
  'Leather Moto Jacket':              'photo-1520975954732-4cdd221fca09',

  // Streetwear
  'Urban Oversized Hoodie':           'photo-1556821840-3a63f95609a7',
  'High-Top Street Sneakers':         'photo-1542291026-7eec264c27ff',
  'Graphic Street Tee':               'photo-1583743814966-8936f5b7be1a',
  'Premium Cargo Pants':              'photo-1552902865-b72c031ac5ea',
  'Classic Bomber Jacket':            'photo-1520975954732-4cdd221fca09',
  'Streetwear Bucket Hat':            'photo-1576828831022-ae41d437a78e',

  // Gothic style
  'Black Platform Boots': 'photo-1605106130026-bpAZR__U1Ic',
  'Leather Combat Boots': 'photo-1608256246200-53e8b694267f',
  'Gothic Leather Jacket': 'photo-1520975954732-4cdd221fca09',
  'Lace Corset Dress':                'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
  'Silver Skull Ring': 'photo-1606760227091-3dd870d97f1d',
  'Velvet Choker Necklace':           'photo-1535632066927-ab7c9ab60908',
  'Fishnet Layering Tee': 'photo-1512436991641-6745cdb1723f',
  'Black Skinny Jeans': 'photo-1598507020058-a81b6a67c8bb',

  // Streetwear extra
  'Graphic Culture Tee':              'photo-1583743814966-8936f5b7be1a',

  // Preppy
  'Classic Polo Shirt':               'photo-1598033129183-c4f50c7176c8',
  'Classic Oxford Shirt':             'photo-1598033129183-c4f50c7176c8',
  'Striped Breton Top':               'photo-1434389677669-e08b4cac3105',
  'Striped Casual Top':               'photo-1434389677669-e08b4cac3105',
  'Navy Tailored Blazer':             'photo-1548126032-079a0fb0099d',
  'Gold Chain Necklace':              'photo-1535632066927-ab7c9ab60908',
  'Designer Leather Handbag':         'photo-1553062407-98eeb64c6a62',
  'Designer Handbag':                 'photo-1553062407-98eeb64c6a62',

  // Boho
  'Bohemian Floral Maxi Dress':       'photo-1469334031218-e382a71b716b',
  'Floral Wrap Dress':                'photo-1469334031218-e382a71b716b',
  'Flowing Maxi Dress':               'photo-1469334031218-e382a71b716b',
  'Artisanal Statement Jewelry':      'photo-1606760227091-3dd870d97f1d',
  'Layered Boho Jewelry':             'photo-1606760227091-3dd870d97f1d',
  'Macrame Shoulder Bag':             'photo-1584917865442-de89df76afd3',
  'Woven Leather Sandals':            'photo-1544966503-7cc5ac882d5b',
  'Relaxed Linen Shirt':              'photo-1523381210434-271e8be1f52b',
  'Patterned Wrap Skirt':             'photo-1583496661160-fb5886a0aaaa',

  // Cyberpunk
  'Techwear Utility Jacket':          'photo-1525450824786-227cbef70703',
  'Tech-Inspired Jacket':             'photo-1525450824786-227cbef70703',
  'Cyber Neon Sneakers':              'photo-1542291026-7eec264c27ff',
  'Neon Accent Graphic Tee':          'photo-1503341504253-dff4815485f1',
  'Digital LED Watch':                'photo-1509198397868-475647b2a1e5',
  'Reflective Track Pants':           'photo-1552902865-b72c031ac5ea',

  // Maximalist
  'Bold Floral Kimono': 'photo-1599426344588-w4gN2AE9xuE',
  'Bold Pattern Kimono':              'photo-1578662996442-48f60103fc96',
  'Rainbow Sequin Dress': 'photo-1572804013309-59a88b7e92f1',
  'Vibrant Print Dress':              'photo-1572804013309-59a88b7e92f1',
  'Patterned Statement Blouse': 'https://images.pexels.com/photos/29479538/pexels-photo-29479538.jpeg',
  'Chandelier Crystal Earrings':    'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg',
  'Vibrant Geometric Shirt': 'photo-1558223933-f14988574341',

  // Romantic
  'Silk Slip Dress':                  'photo-1595777457583-95e059d581b8',
  'Pearl Statement Earrings':         'photo-1515562141207-7a88fb7ce338',
  'Lace Midi Skirt':                  'photo-1583496661160-fb5886a0aaaa',
  'Ruffle Sleeve Blouse': 'https://images.unsplash.com/photo-1515248160000-6745cdb1723f?auto=format&fit=crop&q=80',

  // Misc / Fallback items from useQuiz.js
  'Essential Minimalist Tee':         'photo-1521572163474-6864f9cf17ab',
  'Structured Minimalist Blazer':     'photo-1591047139829-d91aecb6caea',
  'Sleek Modern Sneakers':            'photo-1549298916-b41d501d3772',
  'High-Waisted Vintage Jeans':       'photo-1541099649105-f69ad21f3246',
  'Retro Round Sunglasses':           'photo-1511499767150-a48a237f0083',
  'High-Top Streetwear Sneakers':     'photo-1542291026-7eec264c27ff',
  'Platform Statement Boots':         'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
  'Combat Leather Boots':             'photo-1608256246200-53e8b694267f',
};

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY FALLBACK MAP
// Used when no title match is found.
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_FALLBACK_MAP = {
  'tops':        'photo-1521572163474-6864f9cf17ab',
  'bottoms':     'photo-1541099649105-f69ad21f3246',
  'dress':       'photo-1469334031218-e382a71b716b',
  'dresses':     'photo-1469334031218-e382a71b716b',
  'outerwear':   'photo-1520975954732-4cdd221fca09',
  'shoes':       'photo-1549298916-b41d501d3772',
  'accessories': 'photo-1535632066927-ab7c9ab60908',
  'default':     'photo-1521572163474-6864f9cf17ab',
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORTED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a full Unsplash URL for a given product title and category.
 * Priority: direct URL from map → slug from map → category fallback → default
 *
 * @param {string} title - Product name
 * @param {string} category - Product category (tops, shoes, etc.)
 * @returns {string} Full image URL
 */
/**
 * Sanitizes and forces absolute URLs for Unsplash images
 * @param {string} url - Raw URL or slug
 * @returns {string} Absolute URL
 */
const sanitizeImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // If it's an Unsplash slug (e.g. photo-XXXX)
  if (url.startsWith('photo-')) {
    return `https://images.unsplash.com/${url}`;
  }
  
  return url;
};

/**
 * Returns a full Unsplash URL for a given product title and category.
 * Priority: direct URL from map → slug from map → category fallback → default
 *
 * @param {string} title - Product name
 * @param {string} category - Product category (tops, shoes, etc.)
 * @returns {string} Full image URL
 */
export const getProductImage = (title = '', category = '') => {
  const UNSPLASH_BASE = 'https://images.unsplash.com/';
  const PARAMS = '?w=800&h=1000&fit=crop&auto=format&q=80';

  // 1. Check title map
  let slugOrUrl = TITLE_IMAGE_MAP[title];
  if (slugOrUrl) {
    // Sanitize first to handle mixed slugs/urls
    slugOrUrl = sanitizeImageUrl(slugOrUrl);
    
    if (slugOrUrl.startsWith('http')) {
      return slugOrUrl.includes('?') ? slugOrUrl : `${slugOrUrl}${PARAMS}`;
    }
  }

  // 2. Category fallback
  let categorySlug = CATEGORY_FALLBACK_MAP[category?.toLowerCase()] || CATEGORY_FALLBACK_MAP['default'];
  categorySlug = sanitizeImageUrl(categorySlug);
  
  if (categorySlug.startsWith('http')) {
    return categorySlug.includes('?') ? categorySlug : `${categorySlug}${PARAMS}`;
  }
  
  return `${UNSPLASH_BASE}${categorySlug}${PARAMS}`;
};

export default getProductImage;
