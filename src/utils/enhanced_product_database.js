// enhanced_product_database.js
// Used as a fallback product database when the curated_products.json catalog
// is unavailable. Organized by gender and style with verified Unsplash image IDs.

const UNSPLASH = (id) => `https://images.unsplash.com/${id}?w=400&h=500&fit=crop&auto=format&q=80`;

// ─────────────────────────────────────────────────────────────────────────────
// FEMALE PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
const femaleProducts = [
  {
    id: 'fe_001', title: 'Bohemian Floral Maxi Dress',
    description: 'Free-spirited boho maxi dress with artistic floral patterns.',
    image: UNSPLASH('photo-1469334031218-e382a71b716b'),
    category: 'dress', price: 68, gender: 'female',
    aesthetic: 'boho', style: ['boho', 'romantic'],
    tags: ['bohemian', 'floral', 'maxi', 'dress', 'flowing', 'artistic']
  },
  {
    id: 'fe_002', title: 'Lace Corset Dress',
    description: 'Dark romantic elegance in black lace. Gothic femininity.',
    image: UNSPLASH('photo-1595777457583-95e059d581b8'),
    category: 'dress', price: 95, gender: 'female',
    aesthetic: 'gothic', style: ['gothic', 'romantic'],
    tags: ['lace', 'corset', 'dress', 'gothic', 'dark', 'romantic', 'black']
  },
  {
    id: 'fe_003', title: 'Retro High-Waisted Jeans',
    description: 'Classic vintage-fit high-waisted jeans in premium denim.',
    image: UNSPLASH('photo-1541099649105-f69ad21f3246'),
    category: 'bottoms', price: 65, gender: 'female',
    aesthetic: 'vintage', style: ['vintage'],
    tags: ['high-waisted', 'jeans', 'denim', 'retro', 'vintage', 'classic']
  },
  {
    id: 'fe_004', title: 'Navy Tailored Blazer',
    description: 'Sophisticated navy blazer for the modern professional.',
    image: UNSPLASH('photo-1548126032-079a0fb0099d'),
    category: 'outerwear', price: 145, gender: 'female',
    aesthetic: 'preppy', style: ['preppy', 'minimalist'],
    tags: ['blazer', 'navy', 'tailored', 'sophisticated', 'elegant', 'preppy']
  },
  {
    id: 'fe_005', title: 'Striped Breton Top',
    description: 'Nautical-inspired Breton stripe top. Preppy with French flair.',
    image: UNSPLASH('photo-1434389677669-e08b4cac3105'),
    category: 'tops', price: 52, gender: 'female',
    aesthetic: 'preppy', style: ['preppy', 'minimalist'],
    tags: ['stripe', 'breton', 'nautical', 'preppy', 'chic']
  },
  {
    id: 'fe_006', title: 'Rainbow Sequin Dress',
    description: 'A bold multicolor sequin statement dress. Fearless maximalism.',
    image: 'https://images.pexels.com/photos/4006143/pexels-photo-4006143.jpeg',
    category: 'dress', price: 145, gender: 'female',
    aesthetic: 'maximalist', style: ['maximalist'],
    tags: ['sequin', 'rainbow', 'dress', 'bold', 'colorful', 'statement', 'maximalist']
  },
  {
    id: 'fe_007', title: 'Gold Chain Necklace',
    description: 'Elegant layered gold chain necklace for sophisticated looks.',
    image: UNSPLASH('photo-1535632066927-ab7c9ab60908'),
    category: 'accessories', price: 85, gender: 'female',
    aesthetic: 'preppy', style: ['preppy', 'maximalist'],
    tags: ['gold', 'chain', 'necklace', 'elegant', 'jewelry']
  },
  {
    id: 'fe_008', title: 'Patterned Wrap Skirt',
    description: 'Vibrant patterned wrap skirt with ethnic art-inspired print.',
    image: UNSPLASH('photo-1583496661160-fb5886a0aaaa'),
    category: 'bottoms', price: 55, gender: 'female',
    aesthetic: 'boho', style: ['boho', 'maximalist'],
    tags: ['wrap', 'skirt', 'patterned', 'ethnic', 'artistic', 'bohemian']
  },
  {
    id: 'fe_009', title: 'Designer Leather Handbag',
    description: 'Sophisticated structured leather handbag with timeless silhouette.',
    image: UNSPLASH('photo-1553062407-98eeb64c6a62'),
    category: 'accessories', price: 185, gender: 'female',
    aesthetic: 'preppy', style: ['preppy', 'minimalist'],
    tags: ['handbag', 'leather', 'designer', 'sophisticated', 'elegant']
  },
  {
    id: 'fe_010', title: 'Velvet Choker Necklace',
    description: 'Elegant black velvet choker with gothic lace detailing.',
    image: UNSPLASH('photo-1535632066927-ab7c9ab60908'),
    category: 'accessories', price: 28, gender: 'female',
    aesthetic: 'gothic', style: ['gothic', 'romantic'],
    tags: ['choker', 'velvet', 'gothic', 'dark', 'lace', 'romantic', 'necklace']
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MALE PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
const maleProducts = [
  {
    id: 'ma_001', title: 'Classic Leather Moto Jacket',
    description: 'Timeless moto leather jacket with vintage biker appeal.',
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    category: 'outerwear', price: 195, gender: 'male',
    aesthetic: 'vintage', style: ['vintage', 'streetwear', 'gothic'],
    tags: ['leather', 'moto', 'jacket', 'biker', 'vintage', 'classic']
  },
  {
    id: 'ma_002', title: 'Classic Polo Shirt',
    description: 'Timeless premium cotton polo. Foundation of preppy sophistication.',
    image: UNSPLASH('photo-1598033129183-c4f50c7176c8'),
    category: 'tops', price: 58, gender: 'male',
    aesthetic: 'preppy', style: ['preppy', 'minimalist'],
    tags: ['polo', 'preppy', 'classic', 'tailored', 'elegant']
  },
  {
    id: 'ma_003', title: 'Premium Cargo Pants',
    description: 'Functional multi-pocket cargo pants with street style silhouette.',
    image: UNSPLASH('photo-1552902865-b72c031ac5ea'),
    category: 'bottoms', price: 68, gender: 'male',
    aesthetic: 'streetwear', style: ['streetwear', 'cyberpunk'],
    tags: ['cargo', 'pants', 'functional', 'street', 'urban']
  },
  {
    id: 'ma_004', title: 'Reflective Track Pants',
    description: 'Sleek reflective track pants with future-forward tech aesthetic.',
    image: UNSPLASH('photo-1552902865-b72c031ac5ea'),
    category: 'bottoms', price: 85, gender: 'male',
    aesthetic: 'cyberpunk', style: ['cyberpunk', 'streetwear'],
    tags: ['track', 'pants', 'reflective', 'tech', 'futuristic', 'cyberpunk']
  },
  {
    id: 'ma_005', title: 'Slim Fit Chino Trousers',
    description: 'Versatile slim-cut chinos in warm sand. Classic minimalist bottom.',
    image: UNSPLASH('photo-1541099649105-f69ad21f3246'),
    category: 'bottoms', price: 72, gender: 'male',
    aesthetic: 'minimalist', style: ['minimalist', 'preppy'],
    tags: ['chino', 'slim', 'trousers', 'neutral', 'clean']
  },
  {
    id: 'ma_006', title: 'Digital LED Watch',
    description: 'Futuristic LED timepiece with chrome finish. Cyberpunk wristwear.',
    image: UNSPLASH('photo-1509198397868-475647b2a1e5'),
    category: 'accessories', price: 165, gender: 'male',
    aesthetic: 'cyberpunk', style: ['cyberpunk', 'minimalist'],
    tags: ['led', 'watch', 'digital', 'futuristic', 'chrome', 'tech', 'cyberpunk']
  },
  {
    id: 'ma_007', title: 'Sleek Wristwatch',
    description: 'Minimalist timepiece with clean dial and slim silhouette.',
    image: UNSPLASH('photo-1523275335684-37898b6baf30'),
    category: 'accessories', price: 198, gender: 'male',
    aesthetic: 'minimalist', style: ['minimalist'],
    tags: ['watch', 'minimal', 'sleek', 'timeless', 'refined']
  },
  {
    id: 'ma_008', title: 'Streetwear Bucket Hat',
    description: 'Versatile bucket hat for an authentic urban streetwear aesthetic.',
    image: UNSPLASH('photo-1576828831022-ae41d437a78e'),
    category: 'accessories', price: 25, gender: 'male',
    aesthetic: 'streetwear', style: ['streetwear', 'vintage'],
    tags: ['bucket', 'hat', 'urban', 'street', 'accessories']
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// UNISEX PRODUCTS  
// ─────────────────────────────────────────────────────────────────────────────
const unisexProducts = [
  {
    id: 'un_001', title: 'Essential White Cotton Tee',
    description: 'Premium minimalist t-shirt in pure white cotton.',
    image: UNSPLASH('photo-1521572163474-6864f9cf17ab'),
    category: 'tops', price: 42, gender: 'unisex',
    aesthetic: 'minimalist', style: ['minimalist'],
    tags: ['essential', 'clean', 'white', 'modern', 'basic']
  },
  {
    id: 'un_002', title: 'Structured Modern Blazer',
    description: 'Sharp architectural blazer in neutral charcoal tones.',
    image: UNSPLASH('photo-1591047139829-d91aecb6caea'),
    category: 'outerwear', price: 135, gender: 'unisex',
    aesthetic: 'minimalist', style: ['minimalist', 'preppy'],
    tags: ['blazer', 'tailored', 'neutral', 'clean', 'structured']
  },
  {
    id: 'un_003', title: 'Minimalist White Sneakers',
    description: 'Clean leather sneakers with sleek low-profile design.',
    image: UNSPLASH('photo-1549298916-b41d501d3772'),
    category: 'shoes', price: 95, gender: 'unisex',
    aesthetic: 'minimalist', style: ['minimalist', 'streetwear'],
    tags: ['sneakers', 'white', 'clean', 'leather', 'minimal']
  },
  {
    id: 'un_004', title: 'Heritage Denim Jacket',
    description: 'Authentic vintage wash denim jacket with heritage detailing.',
    image: UNSPLASH('photo-1551028719-00167b16eac5'),
    category: 'outerwear', price: 78, gender: 'unisex',
    aesthetic: 'vintage', style: ['vintage', 'streetwear'],
    tags: ['denim', 'jacket', 'heritage', 'vintage', 'authentic']
  },
  {
    id: 'un_005', title: 'Vintage Band Tee',
    description: 'Authentic retro concert tee with worn-in vintage graphic print.',
    image: UNSPLASH('photo-1583743814966-8936f5b7be1a'),
    category: 'tops', price: 45, gender: 'unisex',
    aesthetic: 'vintage', style: ['vintage', 'streetwear'],
    tags: ['band', 'tee', 'graphic', 'retro', 'vintage', 'concert']
  },
  {
    id: 'un_006', title: 'Urban Oversized Hoodie',
    description: 'Street-ready oversized hoodie with modern urban edge.',
    image: UNSPLASH('photo-1556821840-3a63f95609a7'),
    category: 'tops', price: 72, gender: 'unisex',
    aesthetic: 'streetwear', style: ['streetwear'],
    tags: ['hoodie', 'oversized', 'urban', 'street', 'comfort', 'bold']
  },
  {
    id: 'un_007', title: 'High-Top Street Sneakers',
    description: 'Classic high-top sneakers with contemporary streetwear updates.',
    image: UNSPLASH('photo-1542291026-7eec264c27ff'),
    category: 'shoes', price: 95, gender: 'unisex',
    aesthetic: 'streetwear', style: ['streetwear', 'cyberpunk'],
    tags: ['sneakers', 'high-top', 'street', 'urban', 'bold']
  },
  {
    id: 'un_008', title: 'Graphic Street Tee',
    description: 'Bold street-culture graphic tee. Authentic expression meets modern style.',
    image: UNSPLASH('photo-1583743814966-8936f5b7be1a'),
    category: 'tops', price: 38, gender: 'unisex',
    aesthetic: 'streetwear', style: ['streetwear'],
    tags: ['graphic', 'tee', 'bold', 'street', 'urban', 'expressive']
  },
  {
    id: 'un_009', title: 'Classic Bomber Jacket',
    description: 'Authentic nylon bomber with ribbed cuffs and varsity energy.',
    image: UNSPLASH('photo-1520975954732-4cdd221fca09'),
    category: 'outerwear', price: 98, gender: 'unisex',
    aesthetic: 'streetwear', style: ['streetwear', 'vintage'],
    tags: ['bomber', 'jacket', 'nylon', 'varsity', 'street']
  },
  {
    id: 'un_010', title: 'Gothic Leather Jacket',
    description: 'Dark elegance meets gothic edge in this premium black leather jacket.',
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    category: 'outerwear', price: 185, gender: 'unisex',
    aesthetic: 'gothic', style: ['gothic', 'streetwear'],
    tags: ['leather', 'jacket', 'gothic', 'dark', 'edgy', 'black', 'alternative']
  },
  {
    id: 'un_011', title: 'Leather Combat Boots',
    description: 'Rugged leather combat boots with rebellious gothic spirit.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    category: 'shoes', price: 98, gender: 'unisex',
    aesthetic: 'gothic', style: ['gothic', 'streetwear', 'vintage'],
    tags: ['combat', 'boots', 'leather', 'gothic', 'rebellious', 'dark', 'rugged']
  },
  {
    id: 'un_012', title: 'Silver Skull Ring',
    description: 'Bold sterling silver skull ring — a gothic symbolism statement piece.',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=500&fit=crop&auto=format&q=80',
    category: 'accessories', price: 45, gender: 'unisex',
    aesthetic: 'gothic', style: ['gothic'],
    tags: ['skull', 'ring', 'silver', 'gothic', 'dark', 'statement', 'bold', 'alternative']
  },
  {
    id: 'un_013', title: 'Vintage Inspired Sunglasses',
    description: 'Classic round frames with warm amber lenses and golden details.',
    image: UNSPLASH('photo-1511499767150-a48a237f0083'),
    category: 'accessories', price: 42, gender: 'unisex',
    aesthetic: 'vintage', style: ['vintage', 'boho'],
    tags: ['sunglasses', 'round', 'vintage', 'retro', 'accessories']
  },
  {
    id: 'un_014', title: 'Retro Leather Satchel',
    description: 'Handcrafted leather satchel bag with vintage charm and brass hardware.',
    image: UNSPLASH('photo-1548036328-c9fa89d128fa'),
    category: 'accessories', price: 110, gender: 'unisex',
    aesthetic: 'vintage', style: ['vintage', 'preppy'],
    tags: ['satchel', 'leather', 'bag', 'vintage', 'handcrafted']
  },
  {
    id: 'un_015', title: 'Techwear Utility Jacket',
    description: 'Futuristic multi-pocket techwear jacket. Functional cyberpunk innovation.',
    image: UNSPLASH('photo-1525450824786-227cbef70703'),
    category: 'outerwear', price: 145, gender: 'unisex',
    aesthetic: 'cyberpunk', style: ['cyberpunk', 'streetwear'],
    tags: ['techwear', 'utility', 'jacket', 'futuristic', 'cyberpunk', 'tech', 'functional']
  },
  {
    id: 'un_016', title: 'Artisanal Statement Jewelry',
    description: 'Unique handcrafted pieces for expressive boho layering.',
    image: UNSPLASH('photo-1606760227091-3dd870d97f1d'),
    category: 'accessories', price: 34, gender: 'unisex',
    aesthetic: 'boho', style: ['boho', 'vintage', 'maximalist'],
    tags: ['artisan', 'jewelry', 'handcrafted', 'bohemian', 'expressive']
  },
  {
    id: 'un_017', title: 'Woven Leather Sandals',
    description: 'Handcrafted leather sandals with bohemian woven charm.',
    image: UNSPLASH('photo-1544966503-7cc5ac882d5b'),
    category: 'shoes', price: 48, gender: 'unisex',
    aesthetic: 'boho', style: ['boho', 'vintage'],
    tags: ['sandals', 'woven', 'leather', 'handcrafted', 'bohemian', 'natural']
  },
  {
    id: 'un_018', title: 'Relaxed Linen Shirt',
    description: 'Breezy linen shirt in warm natural tones. Effortless boho ease.',
    image: UNSPLASH('photo-1523381210434-271e8be1f52b'),
    category: 'tops', price: 54, gender: 'unisex',
    aesthetic: 'boho', style: ['boho', 'minimalist'],
    tags: ['linen', 'shirt', 'relaxed', 'natural', 'earthy', 'boho']
  },
  {
    id: 'un_019', title: 'Bold Floral Kimono',
    description: 'Vibrant kimono with fearless large-scale floral patterns.',
    image: 'https://images.unsplash.com/photo-1599426344588-w4gN2AE9xuE?auto=format&fit=crop&q=80',
    category: 'outerwear', price: 78, gender: 'unisex',
    aesthetic: 'maximalist', style: ['maximalist', 'boho'],
    tags: ['kimono', 'floral', 'vibrant', 'bold', 'maximalist', 'expressive', 'colorful']
  },
  {
    id: 'un_020', title: 'Black Platform Boots',
    description: 'Dramatic black platform boots with bold gothic silhouette.',
    image: 'https://images.unsplash.com/photo-1605106130026-bpAZR__U1Ic?auto=format&fit=crop&q=80',
    category: 'shoes', price: 125, gender: 'unisex',
    aesthetic: 'gothic', style: ['gothic'],
    tags: ['platform', 'boots', 'black', 'gothic', 'dramatic', 'bold', 'dark']
  },
  {
    id: 'un_021', title: 'Cyber Neon Sneakers',
    description: 'Next-gen footwear with electric neon details. Cyberpunk streets.',
    image: UNSPLASH('photo-1542291026-7eec264c27ff'),
    category: 'shoes', price: 125, gender: 'unisex',
    aesthetic: 'cyberpunk', style: ['cyberpunk', 'streetwear'],
    tags: ['sneakers', 'neon', 'cyber', 'futuristic', 'digital', 'bold']
  },
  {
    id: 'un_022', title: 'Neon Accent Graphic Tee',
    description: 'Cutting-edge graphic tee with electric neon accent details.',
    image: UNSPLASH('photo-1503341504253-dff4815485f1'),
    category: 'tops', price: 48, gender: 'unisex',
    aesthetic: 'cyberpunk', style: ['cyberpunk', 'streetwear'],
    tags: ['neon', 'graphic', 'tee', 'digital', 'cyber', 'futuristic', 'electric']
  },
  {
    id: 'un_023', title: 'Macrame Shoulder Bag',
    description: 'Boho-chic macrame bag with authentic woven natural textures.',
    image: UNSPLASH('photo-1584917865442-de89df76afd3'),
    category: 'accessories', price: 52, gender: 'unisex',
    aesthetic: 'boho', style: ['boho'],
    tags: ['macrame', 'woven', 'bag', 'bohemian', 'natural', 'artisan']
  },
  {
    id: 'un_024', title: 'Vibrant Geometric Shirt',
    description: 'Bold geometric print shirt with maximalist energy.',
    image: 'https://images.unsplash.com/photo-1558223933-f14988574341?auto=format&fit=crop&q=80',
    category: 'tops', price: 58, gender: 'unisex',
    aesthetic: 'maximalist', style: ['maximalist'],
    tags: ['geometric', 'shirt', 'bold', 'vibrant', 'maximalist', 'pattern', 'colorful']
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns products filtered for a specific gender.
 * - 'female' returns female + unisex products
 * - 'male'   returns male + unisex products
 * - 'unisex' / anything else returns all products
 */
export const getProductsByGender = (gender = 'unisex') => {
  const g = (gender || 'unisex').toLowerCase();
  if (['men', 'man', 'male', 'boy'].some(t => g.includes(t))) {
    return [...maleProducts, ...unisexProducts];
  }
  if (['women', 'woman', 'female', 'girl'].some(t => g.includes(t))) {
    return [...femaleProducts, ...unisexProducts];
  }
  // unisex / prefer-not-to-say → all products
  return [...femaleProducts, ...maleProducts, ...unisexProducts];
};

/**
 * Returns all products regardless of gender.
 */
export const getAllProducts = () => [...femaleProducts, ...maleProducts, ...unisexProducts];

export default { getProductsByGender, getAllProducts };
