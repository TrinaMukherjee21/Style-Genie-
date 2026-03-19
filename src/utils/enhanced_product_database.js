// Enhanced Product Database with Gender-Specific Items and Proper Image Matching
// This ensures product images match their descriptions and recommendations are gender-appropriate

export const ENHANCED_PRODUCT_DATABASE = {
  female: [
    // Dresses
    {
      id: 'f_dress_001',
      title: 'Silk Midi Dress',
      price: 145,
      category: 'dresses',
      productType: 'dress',
      color: 'navy',
      gender: 'female',
      aesthetic: 'minimalist',
      style: 'elegant professional',
      fabric: 'silk',
      occasion: 'work formal',
      description: 'Elegant silk dress perfect for professional settings',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['silk', 'elegant', 'professional', 'feminine']
    },
    {
      id: 'f_dress_002',
      title: 'Bohemian Maxi Dress',
      price: 89,
      category: 'dresses',
      productType: 'dress',
      color: 'floral',
      gender: 'female',
      aesthetic: 'boho',
      style: 'bohemian flowing',
      fabric: 'cotton',
      occasion: 'casual weekend',
      description: 'Free-spirited maxi dress with beautiful floral print',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['boho', 'flowing', 'feminine', 'artistic']
    },
    {
      id: 'f_dress_003',
      title: 'Sequin Mini Dress',
      price: 195,
      category: 'dresses',
      productType: 'dress',
      color: 'gold',
      gender: 'female',
      aesthetic: 'maximalist',
      style: 'party glamorous',
      fabric: 'sequin',
      occasion: 'party night-out',
      description: 'Show-stopping sequin dress that catches every light',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['sequins', 'glamorous', 'party', 'feminine']
    },

    // Tops
    {
      id: 'f_top_001',
      title: 'Silk Blouse',
      price: 78,
      category: 'tops',
      productType: 'blouse',
      color: 'white',
      gender: 'female',
      aesthetic: 'minimalist',
      style: 'elegant professional',
      fabric: 'silk',
      occasion: 'work professional',
      description: 'Classic silk blouse perfect for office wear',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['silk', 'professional', 'elegant', 'feminine']
    },
    {
      id: 'f_top_002',
      title: 'Vintage Band Tee',
      price: 35,
      category: 'tops',
      productType: 'tee',
      color: 'black',
      gender: 'female',
      aesthetic: 'vintage',
      style: 'casual vintage',
      fabric: 'cotton',
      occasion: 'casual weekend',
      description: 'Soft vintage-inspired band t-shirt for effortless cool',
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['vintage', 'casual', 'band', 'feminine']
    },

    // Bottoms
    {
      id: 'f_bottom_001',
      title: 'High-Waisted Mom Jeans',
      price: 85,
      category: 'bottoms',
      productType: 'jeans',
      color: 'blue',
      gender: 'female',
      aesthetic: 'vintage',
      style: 'casual vintage',
      fabric: 'denim',
      occasion: 'casual everyday',
      description: 'Comfortable high-rise denim with flattering vintage fit',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['denim', 'high-waisted', 'vintage', 'feminine']
    },
    {
      id: 'f_bottom_002',
      title: 'Floral Wrap Skirt',
      price: 65,
      category: 'bottoms',
      productType: 'skirt',
      color: 'floral',
      gender: 'female',
      aesthetic: 'boho',
      style: 'feminine romantic',
      fabric: 'chiffon',
      occasion: 'date romantic',
      description: 'Delicate floral wrap skirt perfect for romantic occasions',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['floral', 'wrap', 'feminine', 'romantic']
    },

    // Outerwear
    {
      id: 'f_outer_001',
      title: 'Tailored Blazer',
      price: 165,
      category: 'outerwear',
      productType: 'blazer',
      color: 'black',
      gender: 'female',
      aesthetic: 'minimalist',
      style: 'professional elegant',
      fabric: 'wool blend',
      occasion: 'work professional',
      description: 'Sophisticated blazer tailored for the modern woman',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['professional', 'tailored', 'elegant', 'feminine']
    },

    // Shoes
    {
      id: 'f_shoes_001',
      title: 'Platform Heels',
      price: 125,
      category: 'shoes',
      productType: 'heels',
      color: 'black',
      gender: 'female',
      aesthetic: 'gothic',
      style: 'edgy dramatic',
      fabric: 'leather',
      occasion: 'party night-out',
      description: 'Dramatic platform heels with bold silhouette',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['heels', 'platform', 'edgy', 'feminine']
    },
    {
      id: 'f_shoes_002',
      title: 'White Canvas Sneakers',
      price: 75,
      category: 'shoes',
      productType: 'sneakers',
      color: 'white',
      gender: 'female',
      aesthetic: 'minimalist',
      style: 'casual clean',
      fabric: 'canvas',
      occasion: 'casual everyday',
      description: 'Classic white sneakers for effortless chic style',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['sneakers', 'minimal', 'clean', 'feminine']
    },

    // Accessories
    {
      id: 'f_acc_001',
      title: 'Delicate Gold Jewelry',
      price: 45,
      category: 'accessories',
      productType: 'jewelry',
      color: 'gold',
      gender: 'female',
      aesthetic: 'minimalist',
      style: 'delicate elegant',
      fabric: 'gold-plated',
      occasion: 'everyday elegant',
      description: 'Elegant layered necklaces for sophisticated looks',
      image: 'https://images.unsplash.com/photo-1603145733146-ae562a55031e?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['jewelry', 'delicate', 'gold', 'feminine']
    },
    {
      id: 'f_acc_002',
      title: 'Statement Earrings',
      price: 38,
      category: 'accessories',
      productType: 'jewelry',
      color: 'gold',
      gender: 'female',
      aesthetic: 'boho',
      style: 'bold statement',
      fabric: 'metal',
      occasion: 'party evening',
      description: 'Bold chandelier earrings to complete your look',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop',
      tags: ['jewelry', 'statement', 'bold', 'feminine']
    }
  ],

  male: [
    // Tops
    {
      id: 'm_top_001',
      title: 'Classic Crew Neck Tee',
      price: 28,
      category: 'tops',
      productType: 'tee',
      color: 'white',
      gender: 'male',
      aesthetic: 'minimalist',
      style: 'casual basic',
      fabric: 'cotton',
      occasion: 'casual everyday',
      description: 'Essential cotton t-shirt for everyday comfort',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['basic', 'comfortable', 'versatile', 'menswear']
    },
    {
      id: 'm_top_002',
      title: 'Oxford Dress Shirt',
      price: 68,
      category: 'tops',
      productType: 'shirt',
      color: 'white',
      gender: 'male',
      aesthetic: 'preppy',
      style: 'professional classic',
      fabric: 'cotton oxford',
      occasion: 'work professional',
      description: 'Crisp cotton dress shirt for business occasions',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=400&h=500&fit=crop',
      tags: ['professional', 'classic', 'sophisticated', 'menswear']
    },
    {
      id: 'm_top_003',
      title: 'Pullover Hoodie',
      price: 85,
      category: 'tops',
      productType: 'hoodie',
      color: 'black',
      gender: 'male',
      aesthetic: 'streetwear',
      style: 'casual urban',
      fabric: 'cotton blend',
      occasion: 'casual weekend',
      description: 'Cozy hoodie perfect for casual urban style',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['streetwear', 'comfort', 'urban', 'menswear']
    },

    // Bottoms
    {
      id: 'm_bottom_001',
      title: 'Relaxed Fit Jeans',
      price: 78,
      category: 'bottoms',
      productType: 'jeans',
      color: 'blue',
      gender: 'male',
      aesthetic: 'casual',
      style: 'relaxed classic',
      fabric: 'denim',
      occasion: 'casual everyday',
      description: 'Comfortable straight-leg denim for everyday wear',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['denim', 'comfortable', 'classic', 'menswear']
    },
    {
      id: 'm_bottom_002',
      title: 'Formal Dress Pants',
      price: 125,
      category: 'bottoms',
      productType: 'pants',
      color: 'charcoal',
      gender: 'male',
      aesthetic: 'preppy',
      style: 'formal professional',
      fabric: 'wool blend',
      occasion: 'work formal',
      description: 'Sharp tailored pants for business occasions',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['formal', 'professional', 'tailored', 'menswear']
    },

    // Outerwear
    {
      id: 'm_outer_001',
      title: 'Tailored Blazer',
      price: 185,
      category: 'outerwear',
      productType: 'blazer',
      color: 'navy',
      gender: 'male',
      aesthetic: 'preppy',
      style: 'professional classic',
      fabric: 'wool',
      occasion: 'work formal',
      description: 'Structured navy blazer for polished professional looks',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['professional', 'elegant', 'versatile', 'menswear']
    },
    {
      id: 'm_outer_002',
      title: 'Knit Sweater',
      price: 95,
      category: 'outerwear',
      productType: 'sweater',
      color: 'beige',
      gender: 'male',
      aesthetic: 'minimalist',
      style: 'casual comfortable',
      fabric: 'knit wool',
      occasion: 'casual smart-casual',
      description: 'Soft knit sweater perfect for cool weather',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['sweater', 'cozy', 'warm', 'menswear']
    },

    // Shoes
    {
      id: 'm_shoes_001',
      title: 'Canvas Sneakers',
      price: 65,
      category: 'shoes',
      productType: 'sneakers',
      color: 'white',
      gender: 'male',
      aesthetic: 'minimalist',
      style: 'casual clean',
      fabric: 'canvas',
      occasion: 'casual everyday',
      description: 'Classic sneakers for everyday casual style',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['sneakers', 'casual', 'comfortable', 'menswear']
    },
    {
      id: 'm_shoes_002',
      title: 'Combat Boots',
      price: 145,
      category: 'shoes',
      productType: 'boots',
      color: 'black',
      gender: 'male',
      aesthetic: 'gothic',
      style: 'edgy rugged',
      fabric: 'leather',
      occasion: 'casual edgy',
      description: 'Sturdy boots with rebellious attitude',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['boots', 'edgy', 'rugged', 'menswear']
    },
    {
      id: 'm_shoes_003',
      title: 'Leather Dress Shoes',
      price: 165,
      category: 'shoes',
      productType: 'dress shoes',
      color: 'brown',
      gender: 'male',
      aesthetic: 'preppy',
      style: 'formal professional',
      fabric: 'leather',
      occasion: 'work formal',
      description: 'Classic leather oxfords for business attire',
      image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['leather', 'formal', 'professional', 'menswear']
    },

    // Accessories
    {
      id: 'm_acc_001',
      title: 'Statement Watch',
      price: 85,
      category: 'accessories',
      productType: 'watch',
      color: 'silver',
      gender: 'male',
      aesthetic: 'minimalist',
      style: 'clean modern',
      fabric: 'metal',
      occasion: 'everyday professional',
      description: 'Clean watch design for everyday professional wear',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['watch', 'accessories', 'minimal', 'menswear']
    }
  ],

  unisex: [
    {
      id: 'u_shoes_001',
      title: 'Classic White Sneakers',
      price: 89,
      category: 'shoes',
      productType: 'sneakers',
      color: 'white',
      gender: 'unisex',
      aesthetic: 'minimalist',
      style: 'casual clean',
      fabric: 'leather',
      occasion: 'casual everyday',
      description: 'Timeless white sneakers that work for everyone',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['sneakers', 'minimal', 'clean', 'unisex']
    },
    {
      id: 'u_top_001',
      title: 'Oversized Hoodie',
      price: 75,
      category: 'tops',
      productType: 'hoodie',
      color: 'gray',
      gender: 'unisex',
      aesthetic: 'streetwear',
      style: 'oversized comfort',
      fabric: 'cotton blend',
      occasion: 'casual weekend',
      description: 'Comfy oversized hoodie perfect for lounging',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop&auto=format&q=80',
      tags: ['oversized', 'comfort', 'streetwear', 'unisex']
    }
  ]
};

// Function to get products by gender
export const getProductsByGender = (gender) => {
  const lowerGender = gender?.toLowerCase();

  switch (lowerGender) {
    case 'male':
      return [...ENHANCED_PRODUCT_DATABASE.male, ...ENHANCED_PRODUCT_DATABASE.unisex];
    case 'female':
      return [...ENHANCED_PRODUCT_DATABASE.female, ...ENHANCED_PRODUCT_DATABASE.unisex];
    case 'non-binary':
    case 'prefer-not-to-say':
      return [
        ...ENHANCED_PRODUCT_DATABASE.male,
        ...ENHANCED_PRODUCT_DATABASE.female,
        ...ENHANCED_PRODUCT_DATABASE.unisex
      ];
    default:
      return [...ENHANCED_PRODUCT_DATABASE.female, ...ENHANCED_PRODUCT_DATABASE.unisex];
  }
};

// Function to get all products
export const getAllProducts = () => {
  return [
    ...ENHANCED_PRODUCT_DATABASE.male,
    ...ENHANCED_PRODUCT_DATABASE.female,
    ...ENHANCED_PRODUCT_DATABASE.unisex
  ];
};

// Function to search products by category and gender
export const searchProducts = (category, gender, aesthetic = null) => {
  const genderProducts = getProductsByGender(gender);

  let filtered = genderProducts;

  if (category) {
    filtered = filtered.filter(product =>
      product.category.toLowerCase().includes(category.toLowerCase()) ||
      product.productType.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (aesthetic) {
    filtered = filtered.filter(product =>
      product.aesthetic.toLowerCase().includes(aesthetic.toLowerCase()) ||
      product.style.toLowerCase().includes(aesthetic.toLowerCase())
    );
  }

  return filtered;
};

export default ENHANCED_PRODUCT_DATABASE;