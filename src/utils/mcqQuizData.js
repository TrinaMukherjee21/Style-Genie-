// MCQ-based quiz items for gender-specific quizzes
// This replaces the image-based realQuizData.js to ensure appropriateness and accuracy

export const FEMALE_MCQ_QUIZ = [
  {
    id: "f_q1",
    question: "Which of these best describes your dream weekend outfit?",
    options: [
      { text: "A flowing floral dress and sandals", aesthetics: ["boho"], tags: ["dress", "feminine"] },
      { text: "A structured blazer and cigarette pants", aesthetics: ["preppy", "minimalist"], tags: ["formal", "tailored"] },
      { text: "An oversized hoodie and mom jeans", aesthetics: ["streetwear", "vintage"], tags: ["denim", "comfortable"] },
      { text: "A sleek black midi dress", aesthetics: ["gothic", "minimalist"], tags: ["dress", "elegant"] }
    ]
  },
  {
    id: "f_q2",
    question: "What's your preferred color palette?",
    options: [
      { text: "Earthy tones (browns, greens, terracotta)", aesthetics: ["boho", "vintage"], tags: ["earthy"] },
      { text: "Monochrome (black, white, grey)", aesthetics: ["minimalist", "gothic"], tags: ["neutral"] },
      { text: "Bold and vibrant (reds, yellows, blues)", aesthetics: ["maximalist", "party"], tags: ["bold"] },
      { text: "Soft pastels (pink, lavender, mint)", aesthetics: ["preppy", "feminine"], tags: ["pastel"] }
    ]
  },
  {
    id: "f_q3",
    question: "Which accessory could you never live without?",
    options: [
      { text: "A statement necklace", aesthetics: ["maximalist"], tags: ["jewelry"] },
      { text: "Simple hoop earrings", aesthetics: ["minimalist"], tags: ["jewelry"] },
      { text: "A vintage beret or silk scarf", aesthetics: ["vintage"], tags: ["accessories"] },
      { text: "Combat boots", aesthetics: ["gothic", "streetwear"], tags: ["shoes"] }
    ]
  },
  {
    id: "f_q4",
    question: "Where do you usually find your fashion inspiration?",
    options: [
      { text: "Art galleries and flea markets", aesthetics: ["boho", "vintage"], tags: ["creative"] },
      { text: "Fashion runways and classic cinema", aesthetics: ["preppy", "minimalist"], tags: ["classic"] },
      { text: "Instagram and urban street style", aesthetics: ["streetwear"], tags: ["modern"] },
      { text: "Dark romanticism and indie vibes", aesthetics: ["gothic"], tags: ["edgy"] }
    ]
  },
  {
    id: "f_q5",
    question: "How do you want people to perceive your style?",
    options: [
      { text: "Effortlessly chic and clean", aesthetics: ["minimalist"], tags: ["clean"] },
      { text: "Bold, creative, and unique", aesthetics: ["maximalist"], tags: ["artistic"] },
      { text: "Sophisticated and professional", aesthetics: ["preppy"], tags: ["smart"] },
      { text: "Edgy and rebellious", aesthetics: ["gothic", "streetwear"], tags: ["bold"] }
    ]
  },
  {
    id: "f_q6",
    question: "What's your ideal footwear for a night out?",
    options: [
      { text: "Strappy stiletto heels", aesthetics: ["party", "preppy"], tags: ["heels"] },
      { text: "Chunky platform boots", aesthetics: ["gothic", "streetwear"], tags: ["boots"] },
      { text: "Pointed-toe flats", aesthetics: ["minimalist", "preppy"], tags: ["flats"] },
      { text: "Embellished sandals", aesthetics: ["boho", "maximalist"], tags: ["sandals"] }
    ]
  },
  {
    id: "f_q7",
    question: "Choose a fabric that you love wearing most:",
    options: [
      { text: "Soft silk or satin", aesthetics: ["preppy", "minimalist"], tags: ["silk"] },
      { text: "Distressed denim or corduroy", aesthetics: ["vintage", "streetwear"], tags: ["denim"] },
      { text: "Breathable linen or cotton", aesthetics: ["boho", "minimalist"], tags: ["linen"] },
      { text: "Velvet or lace", aesthetics: ["gothic", "vintage"], tags: ["velvet"] }
    ]
  },
  {
    id: "f_q8",
    question: "What's your go-to jacket for cooler weather?",
    options: [
      { text: "A classic camel trench coat", aesthetics: ["preppy", "minimalist"], tags: ["outerwear"] },
      { text: "A oversized denim jacket", aesthetics: ["vintage", "streetwear"], tags: ["outerwear"] },
      { text: "A black leather biker jacket", aesthetics: ["gothic", "streetwear"], tags: ["outerwear"] },
      { text: "A colorful wool coat", aesthetics: ["maximalist"], tags: ["outerwear"] }
    ]
  },
  {
    id: "f_q9",
    question: "How do you feel about patterns?",
    options: [
      { text: "I love mixing bold prints (stripes, florals, checkers)", aesthetics: ["maximalist"], tags: ["prints"] },
      { text: "I prefer subtle, classic patterns like polka dots", aesthetics: ["preppy", "vintage"], tags: ["prints"] },
      { text: "I mostly stick to solid colors", aesthetics: ["minimalist"], tags: ["solid"] },
      { text: "I like moody, dark patterns or lace", aesthetics: ["gothic"], tags: ["prints"] }
    ]
  },
  {
    id: "f_q10",
    question: "What kind of fit do you prefer?",
    options: [
      { text: "Tailored and body-contouring", aesthetics: ["preppy", "minimalist"], tags: ["tailored"] },
      { text: "Oversized and relaxed", aesthetics: ["streetwear", "boho"], tags: ["oversized"] },
      { text: "A mix of tight and loose", aesthetics: ["vintage", "gothic"], tags: ["mixed"] },
      { text: "Anything that flows and moves", aesthetics: ["boho"], tags: ["flowing"] }
    ]
  },
  {
    id: "f_q11",
    question: "Which handbag style best matches your vibe?",
    options: [
      { text: "A minimalist leather tote", aesthetics: ["minimalist"], tags: ["handbag"] },
      { text: "A vintage beaded or embroidered bag", aesthetics: ["boho", "vintage"], tags: ["handbag"] },
      { text: "A luxury logo crossbody", aesthetics: ["preppy", "maximalist"], tags: ["handbag"] },
      { text: "A chunky belt bag or harness", aesthetics: ["streetwear", "gothic"], tags: ["accessories"] }
    ]
  },
  {
    id: "f_q12",
    question: "What's your favorite way to layer a look?",
    options: [
      { text: "A sleek turtleneck under a dress", aesthetics: ["minimalist", "preppy"], tags: ["layering"] },
      { text: "A chunky oversized cardigan", aesthetics: ["boho", "streetwear"], tags: ["layering"] },
      { text: "A sheer lace or mesh top", aesthetics: ["gothic", "vintage"], tags: ["layering"] },
      { text: "A tailored wool vest", aesthetics: ["preppy", "minimalist"], tags: ["layering"] }
    ]
  },
  {
    id: "f_q13",
    question: "Pick a style of sunglasses:",
    options: [
      { text: "Classic aviators or clubmasters", aesthetics: ["vintage", "preppy"], tags: ["eyewear"] },
      { text: "Sleek futuristic wrap-arounds", aesthetics: ["cyberpunk", "streetwear"], tags: ["eyewear"] },
      { text: "Classic cat-eye", aesthetics: ["vintage", "feminine"], tags: ["eyewear"] },
      { text: "Minimalist oval or rectangular frames", aesthetics: ["minimalist"], tags: ["eyewear"] }
    ]
  },
  {
    id: "f_q14",
    question: "What's your approach to jewelry?",
    options: [
      { text: "Fine, delicate gold or silver pieces", aesthetics: ["minimalist", "preppy"], tags: ["jewelry"] },
      { text: "Bold, chunky chains and layered metals", aesthetics: ["streetwear", "gothic"], tags: ["jewelry"] },
      { text: "Handcrafted, artisan, or layered beads", aesthetics: ["boho"], tags: ["jewelry"] },
      { text: "I prefer one large statement piece", aesthetics: ["maximalist"], tags: ["jewelry"] }
    ]
  },
  {
    id: "f_q15",
    question: "Which setting inspires your style most?",
    options: [
      { text: "A bustling tech-forward metropolis", aesthetics: ["cyberpunk", "streetwear"], tags: ["urban"] },
      { text: "A serene, artistic countryside retreat", aesthetics: ["boho"], tags: ["nature"] },
      { text: "A prestigious library or classic mansion", aesthetics: ["preppy", "vintage"], tags: ["heritage"] },
      { text: "A hip, underground music venue", aesthetics: ["gothic", "streetwear"], tags: ["edgy"] }
    ]
  }
];

export const MALE_MCQ_QUIZ = [
  {
    id: "m_q1",
    question: "What's your go-to weekend look?",
    options: [
      { text: "A crisp button-down shirt and chinos", aesthetics: ["preppy"], tags: ["shirt", "pants"] },
      { text: "A graphic tee and joggers", aesthetics: ["streetwear"], tags: ["tops", "activewear"] },
      { text: "A vintage denim jacket and boots", aesthetics: ["vintage"], tags: ["denim", "boots"] },
      { text: "A simple white tee and black trousers", aesthetics: ["minimalist"], tags: ["tops", "pants"] }
    ]
  },
  {
    id: "m_q2",
    question: "What's your primary color preference?",
    options: [
      { text: "Neutral tones (navy, grey, olive)", aesthetics: ["preppy", "minimalist"], tags: ["neutral"] },
      { text: "Classic black and white", aesthetics: ["minimalist", "gothic"], tags: ["monochrome"] },
      { text: "Bold primary colors (red, blue)", aesthetics: ["streetwear", "maximalist"], tags: ["bold"] },
      { text: "Warm earthy tones", aesthetics: ["vintage", "boho"], tags: ["earthy"] }
    ]
  },
  {
    id: "m_q3",
    question: "Which footwear do you wear most often?",
    options: [
      { text: "Clean white sneakers", aesthetics: ["minimalist", "preppy"], tags: ["sneakers"] },
      { text: "Rugged leather boots", aesthetics: ["vintage", "gothic"], tags: ["boots"] },
      { text: "Classic leather oxfords", aesthetics: ["preppy"], tags: ["dress shoes"] },
      { text: "High-top streetwear sneakers", aesthetics: ["streetwear"], tags: ["sneakers"] }
    ]
  },
  {
    id: "m_q4",
    question: "What's your ideal work-from-home attire?",
    options: [
      { text: "A comfortable knit sweater", aesthetics: ["minimalist"], tags: ["sweater"] },
      { text: "A cozy hoodie", aesthetics: ["streetwear"], tags: ["hoodie"] },
      { text: "A flannel shirt", aesthetics: ["vintage"], tags: ["shirt"] },
      { text: "A polo shirt", aesthetics: ["preppy"], tags: ["shirt"] }
    ]
  },
  {
    id: "m_q5",
    question: "Which vibe resonates with you most?",
    options: [
      { text: "Sharp and tailored", aesthetics: ["preppy"], tags: ["smart"] },
      { text: "Urban and contemporary", aesthetics: ["streetwear"], tags: ["modern"] },
      { text: "Rugged and authentic", aesthetics: ["vintage"], tags: ["rugged"] },
      { text: "Sleek and understated", aesthetics: ["minimalist"], tags: ["clean"] }
    ]
  },
  {
    id: "m_q6",
    question: "Choose a statement piece for your wardrobe:",
    options: [
      { text: "A designer watch", aesthetics: ["preppy", "minimalist"], tags: ["watch"] },
      { text: "A limited-edition baseball cap", aesthetics: ["streetwear"], tags: ["hat"] },
      { text: "A vintage leather belt with big buckle", aesthetics: ["vintage"], tags: ["accessories"] },
      { text: "A silver skull ring or heavy chain", aesthetics: ["gothic"], tags: ["jewelry"] }
    ]
  },
  {
    id: "m_q7",
    question: "How do you feel about form and function?",
    options: [
      { text: "Style is everything, comfort comes second", aesthetics: ["preppy", "gothic"], tags: ["style-first"] },
      { text: "I need technical fabrics and plenty of pockets", aesthetics: ["streetwear", "cyberpunk"], tags: ["functional"] },
      { text: "I like durable, heavy-duty materials", aesthetics: ["vintage"], tags: ["durable"] },
      { text: "I prefer breathable, natural materials", aesthetics: ["minimalist", "boho"], tags: ["comfort"] }
    ]
  },
  {
    id: "m_q8",
    question: "What's your favorite layering piece?",
    options: [
      { text: "A quilted vest", aesthetics: ["preppy"], tags: ["outerwear"] },
      { text: "An oversized flannel over a tee", aesthetics: ["vintage", "streetwear"], tags: ["shirt"] },
      { text: "A long wool topcoat", aesthetics: ["minimalist", "preppy"], tags: ["outerwear"] },
      { text: "A bomber jacket", aesthetics: ["streetwear", "minimalist"], tags: ["outerwear"] }
    ]
  },
  {
    id: "m_q9",
    question: "What's your attitude towards formal wear?",
    options: [
      { text: "I love wearing a full suit and tie", aesthetics: ["preppy"], tags: ["formal"] },
      { text: "I prefer 'broken' tailoring (blazer with jeans)", aesthetics: ["minimalist", "preppy"], tags: ["smart-casual"] },
      { text: "I avoid formal wear whenever possible", aesthetics: ["streetwear", "boho"], tags: ["casual"] },
      { text: "I like dark, unconventional formal looks", aesthetics: ["gothic"], tags: ["formal"] }
    ]
  },
  {
    id: "m_q10",
    question: "Pick a brand aesthetic that appeals to you:",
    options: [
      { text: "Clean, high-end luxury silhouettes", aesthetics: ["minimalist", "preppy"], tags: ["luxury"] },
      { text: "Limited-drop urban graphics", aesthetics: ["streetwear"], tags: ["trendy"] },
      { text: "Worn-in, heritage workwear", aesthetics: ["vintage"], tags: ["heritage"] },
      { text: "Dark, alternative independent labels", aesthetics: ["gothic"], tags: ["alt"] }
    ]
  },
  {
    id: "m_q11",
    question: "Which headwear do you prefer?",
    options: [
      { text: "A structured baseball cap", aesthetics: ["streetwear"], tags: ["hat"] },
      { text: "A classic wool beanie", aesthetics: ["minimalist"], tags: ["hat"] },
      { text: "A vintage flat cap or fedora", aesthetics: ["vintage", "preppy"], tags: ["hat"] },
      { text: "I prefer no headwear", aesthetics: ["minimalist"], tags: ["hat"] }
    ]
  },
  {
    id: "m_q12",
    question: "What's your preferred sleeve length for casual tops?",
    options: [
      { text: "Clean, fitted short sleeves", aesthetics: ["minimalist", "preppy"], tags: ["tops"] },
      { text: "Oversized, elbow-length sleeves", aesthetics: ["streetwear"], tags: ["tops"] },
      { text: "Rolled-up long sleeves", aesthetics: ["vintage", "preppy"], tags: ["tops"] },
      { text: "Sleeveless or tank tops", aesthetics: ["athletic", "streetwear"], tags: ["tops"] }
    ]
  },
  {
    id: "m_q13",
    question: "Pick a style of outerwear for a casual night out:",
    options: [
      { text: "A sleek harrington jacket", aesthetics: ["preppy", "minimalist"], tags: ["outerwear"] },
      { text: "A utility vest with many pockets", aesthetics: ["streetwear", "cyberpunk"], tags: ["outerwear"] },
      { text: "A worn-in denim vest or jacket", aesthetics: ["vintage", "gothic"], tags: ["outerwear"] },
      { text: "A structured overcoat", aesthetics: ["minimalist", "preppy"], tags: ["outerwear"] }
    ]
  },
  {
    id: "m_q14",
    question: "What's your go-to watch style?",
    options: [
      { text: "A classic leather-strap analog", aesthetics: ["preppy", "vintage"], tags: ["watch"] },
      { text: "A rugged digital sports watch", aesthetics: ["streetwear"], tags: ["watch"] },
      { text: "A sleek, minimalist metal timepiece", aesthetics: ["minimalist"], tags: ["watch"] },
      { text: "I use my phone for time", aesthetics: ["streetwear"], tags: ["watch"] }
    ]
  },
  {
    id: "m_q15",
    question: "Which weekend activity matches your style?",
    options: [
      { text: "Grabbing coffee in a sleek urban cafe", aesthetics: ["minimalist", "preppy"], tags: ["lifestyle"] },
      { text: "Attending a street-style event or concert", aesthetics: ["streetwear"], tags: ["lifestyle"] },
      { text: "Browsing a vintage record store or museum", aesthetics: ["vintage"], tags: ["lifestyle"] },
      { text: "A tech event or gaming convention", aesthetics: ["cyberpunk", "streetwear"], tags: ["lifestyle"] }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// UNISEX / SKIP Quiz
// For users who selected "Skip" or prefer not to specify their gender.
// Questions are deliberately gender-neutral — focused on aesthetic concepts,
// colour palettes, vibes and lifestyle rather than gendered garments.
// ─────────────────────────────────────────────────────────────────────────────
export const UNISEX_MCQ_QUIZ = [
  {
    id: "u_q1",
    question: "How would you describe your ideal everyday style?",
    options: [
      { text: "Clean, simple and well-fitting — less is more", aesthetics: ["minimalist"], tags: ["clean", "modern", "essential"] },
      { text: "Bold and expressive — I want to be noticed", aesthetics: ["maximalist", "streetwear"], tags: ["bold", "expressive"] },
      { text: "Vintage-inspired and full of character", aesthetics: ["vintage"], tags: ["retro", "heritage", "authentic"] },
      { text: "Dark, dramatic and unconventional", aesthetics: ["gothic"], tags: ["dark", "alternative", "dramatic"] }
    ]
  },
  {
    id: "u_q2",
    question: "Which colour palette speaks to your soul?",
    options: [
      { text: "Neutral tones — black, white, cream, grey", aesthetics: ["minimalist", "gothic"], tags: ["neutral", "monochrome"] },
      { text: "Earthy and organic — terracotta, olive, rust", aesthetics: ["boho", "vintage"], tags: ["earthy", "natural"] },
      { text: "Rich and saturated — jewel tones and bold brights", aesthetics: ["maximalist", "streetwear"], tags: ["bold", "vibrant"] },
      { text: "Muted pastels — sage, dusty lavender, soft beige", aesthetics: ["minimalist", "romantic"], tags: ["pastel", "soft"] }
    ]
  },
  {
    id: "u_q3",
    question: "Which texture or fabric do you most enjoy wearing?",
    options: [
      { text: "Crisp cotton or smooth tailored fabric", aesthetics: ["minimalist", "preppy"], tags: ["crisp", "tailored"] },
      { text: "Soft, distressed denim or worn-in leather", aesthetics: ["vintage", "streetwear"], tags: ["denim", "leather"] },
      { text: "Flowing linen or lightweight natural fibres", aesthetics: ["boho", "minimalist"], tags: ["linen", "natural", "flowing"] },
      { text: "Velvet, lace or bold textured statement pieces", aesthetics: ["gothic", "maximalist"], tags: ["velvet", "lace", "textured"] }
    ]
  },
  {
    id: "u_q4",
    question: "What kind of footwear do you gravitate toward?",
    options: [
      { text: "Clean, low-profile sneakers", aesthetics: ["minimalist"], tags: ["sneakers", "clean"] },
      { text: "Chunky boots — platform or combat style", aesthetics: ["gothic", "streetwear"], tags: ["boots", "bold", "edgy"] },
      { text: "Classic leather shoes or loafers", aesthetics: ["preppy", "vintage"], tags: ["shoes", "classic"] },
      { text: "Sandals, woven footwear or anything relaxed", aesthetics: ["boho"], tags: ["sandals", "casual", "earthy"] }
    ]
  },
  {
    id: "u_q5",
    question: "Which vibe do you want to project to the world?",
    options: [
      { text: "Effortlessly cool and understated", aesthetics: ["minimalist"], tags: ["cool", "subtle", "refined"] },
      { text: "Creative, free-spirited and artistic", aesthetics: ["boho", "maximalist"], tags: ["creative", "artistic"] },
      { text: "Edgy, rebellious and alternative", aesthetics: ["gothic", "streetwear"], tags: ["edgy", "rebellious", "dark"] },
      { text: "Polished, trustworthy and sophisticated", aesthetics: ["preppy", "minimalist"], tags: ["polished", "sophisticated"] }
    ]
  },
  {
    id: "u_q6",
    question: "Pick the outerwear that appeals to you most:",
    options: [
      { text: "A sleek moto or biker leather jacket", aesthetics: ["gothic", "vintage", "streetwear"], tags: ["leather", "jacket", "bold"] },
      { text: "An oversized puffer or bomber jacket", aesthetics: ["streetwear"], tags: ["bomber", "oversized", "urban"] },
      { text: "A long structured trench or wool coat", aesthetics: ["minimalist", "preppy"], tags: ["coat", "tailored", "classic"] },
      { text: "A relaxed kimono or lightweight open jacket", aesthetics: ["boho", "maximalist"], tags: ["kimono", "relaxed", "flowy"] }
    ]
  },
  {
    id: "u_q7",
    question: "Where do you draw most of your fashion inspiration?",
    options: [
      { text: "Architecture, art galleries and clean design", aesthetics: ["minimalist"], tags: ["design", "architectural"] },
      { text: "Vintage markets, old films and music history", aesthetics: ["vintage"], tags: ["retro", "nostalgia", "heritage"] },
      { text: "Street culture, social media and music videos", aesthetics: ["streetwear", "cyberpunk"], tags: ["urban", "modern", "trendy"] },
      { text: "Nature, travel, festivals and folk art", aesthetics: ["boho"], tags: ["earthy", "natural", "artistic"] }
    ]
  },
  {
    id: "u_q8",
    question: "How do you feel about patterns and prints?",
    options: [
      { text: "I mostly stick to solid colours", aesthetics: ["minimalist"], tags: ["solid", "clean"] },
      { text: "I love mixing bold prints and clashing patterns", aesthetics: ["maximalist", "boho"], tags: ["prints", "bold"] },
      { text: "I like subtle classics — stripes, checks, herringbone", aesthetics: ["preppy", "vintage"], tags: ["classic", "pattern"] },
      { text: "I prefer dark, moody or graphic prints", aesthetics: ["gothic", "streetwear"], tags: ["dark", "graphic"] }
    ]
  },
  {
    id: "u_q9",
    question: "What accessory do you never leave the house without?",
    options: [
      { text: "A sleek watch or minimal bracelet", aesthetics: ["minimalist", "preppy"], tags: ["watch", "bracelet", "minimal"] },
      { text: "Layered chains, rings or statement pieces", aesthetics: ["gothic", "streetwear", "maximalist"], tags: ["chain", "ring", "bold"] },
      { text: "A vintage scarf, hat or artisan bag", aesthetics: ["vintage", "boho"], tags: ["vintage", "artisan", "accessories"] },
      { text: "I keep accessories minimal or skip them", aesthetics: ["minimalist"], tags: ["minimal", "clean"] }
    ]
  },
  {
    id: "u_q10",
    question: "What's your approach to fit and silhouette?",
    options: [
      { text: "Tailored and precise — I like structure", aesthetics: ["preppy", "minimalist"], tags: ["tailored", "structured"] },
      { text: "Oversized and relaxed — comfort is key", aesthetics: ["streetwear", "boho"], tags: ["oversized", "relaxed"] },
      { text: "I mix fitted and loose for contrast", aesthetics: ["vintage", "gothic"], tags: ["mixed", "contrast"] },
      { text: "I like dramatic, exaggerated silhouettes", aesthetics: ["maximalist", "gothic"], tags: ["dramatic", "statement"] }
    ]
  },
  {
    id: "u_q11",
    question: "Which environment best matches your style energy?",
    options: [
      { text: "A minimal, sleek urban loft", aesthetics: ["minimalist"], tags: ["urban", "sleek"] },
      { text: "A gritty underground music venue", aesthetics: ["gothic", "streetwear"], tags: ["edgy", "alternative"] },
      { text: "A bohemian art studio or forest retreat", aesthetics: ["boho"], tags: ["earthy", "creative"] },
      { text: "A neon-lit city at night or tech expo", aesthetics: ["cyberpunk", "streetwear"], tags: ["futuristic", "digital"] }
    ]
  },
  {
    id: "u_q12",
    question: "If you could raid one type of wardrobe, it would be:",
    options: [
      { text: "A 90s thrift store full of denim, flannels and band tees", aesthetics: ["vintage", "streetwear"], tags: ["vintage", "denim", "retro"] },
      { text: "A minimalist designer's monochrome collection", aesthetics: ["minimalist", "gothic"], tags: ["monochrome", "clean", "designer"] },
      { text: "A maximalist artist's closet full of colour and texture", aesthetics: ["maximalist", "boho"], tags: ["bold", "colourful", "textured"] },
      { text: "A dystopian sci-fi film costume room", aesthetics: ["cyberpunk", "gothic"], tags: ["futuristic", "dark", "dramatic"] }
    ]
  },
  {
    id: "u_q13",
    question: "What's your relationship with colour in an outfit?",
    options: [
      { text: "One or two colours max — I love tonal dressing", aesthetics: ["minimalist"], tags: ["tonal", "clean"] },
      { text: "More colours = more fun", aesthetics: ["maximalist"], tags: ["colourful", "bold"] },
      { text: "Warm, desaturated tones only", aesthetics: ["vintage", "boho"], tags: ["earthy", "warm"] },
      { text: "Mostly dark tones — black, deep burgundy, forest grey", aesthetics: ["gothic", "minimalist"], tags: ["dark", "moody"] }
    ]
  },
  {
    id: "u_q14",
    question: "Which bag style would you most likely carry?",
    options: [
      { text: "A structured minimal tote or backpack", aesthetics: ["minimalist", "preppy"], tags: ["bag", "minimal", "tote"] },
      { text: "A studded, chain-strap or buckled bag", aesthetics: ["gothic", "streetwear"], tags: ["bag", "edgy", "dark"] },
      { text: "A woven, macrame or artisan fabric bag", aesthetics: ["boho", "vintage"], tags: ["bag", "artisan", "natural"] },
      { text: "A logo crossbody or techwear sling bag", aesthetics: ["streetwear", "cyberpunk"], tags: ["bag", "urban", "functional"] }
    ]
  },
  {
    id: "u_q15",
    question: "Which best describes a perfect outfit for you?",
    options: [
      { text: "Everything matches, nothing clashes — cohesive and clean", aesthetics: ["minimalist"], tags: ["cohesive", "clean", "refined"] },
      { text: "Layered, textured, lots of personality", aesthetics: ["boho", "maximalist"], tags: ["layered", "expressive"] },
      { text: "All-black or dark tonal — effortlessly cool", aesthetics: ["gothic", "minimalist"], tags: ["dark", "cool", "effortless"] },
      { text: "Statement outerwear + simple base — bold but balanced", aesthetics: ["streetwear", "vintage"], tags: ["statement", "balanced", "urban"] }
    ]
  }
];

// Unified function to get quiz data
export const getMCQQuizByGender = (gender) => {
  const g = (gender || '').toLowerCase();
  if (g === 'male') return MALE_MCQ_QUIZ;
  if (g === 'female') return FEMALE_MCQ_QUIZ;
  // 'unisex', 'prefer-not-to-say', 'other', '' -> Unisex quiz
  return UNISEX_MCQ_QUIZ;
};
