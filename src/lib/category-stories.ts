export interface CategoryTasteProfile {
  aroma: string;
  body: string;
  flavor: string;
  finish: string;
}

export interface CategoryStory {
  howWeMake: string;
  tasteHeadline: string;
  taste: CategoryTasteProfile;
}

export const CATEGORY_STORIES: Record<string, CategoryStory> = {
  popular: {
    howWeMake:
      "These are the drinks and bites our guests come back for — prepared fresh throughout the day with the same care as opening hour.",
    tasteHeadline: "Bold. Balanced. Beloved.",
    taste: {
      aroma: "Warm, inviting fragrance",
      body: "Smooth and satisfying",
      flavor: "Crowd-pleasing classics",
      finish: "Clean, memorable aftertaste",
    },
  },
  coffee: {
    howWeMake:
      "We pull every shot from freshly ground beans, dial in the grind daily, and steam milk to silky microfoam for a perfectly balanced cup.",
    tasteHeadline: "Rich. Smooth. Unforgettable.",
    taste: {
      aroma: "Deep roasted fragrance",
      body: "Velvety, full-bodied",
      flavor: "Chocolate & nut notes",
      finish: "Long, warm finish",
    },
  },
  "hot-drinks": {
    howWeMake:
      "Steamed fresh to order — layered with spices, chocolate, or seasonal syrups and finished at the perfect sipping temperature.",
    tasteHeadline: "Warm. Comforting. Cosy.",
    taste: {
      aroma: "Spiced & steamy",
      body: "Creamy, rounded mouthfeel",
      flavor: "Sweet & mellow layers",
      finish: "Soft, lingering warmth",
    },
  },
  "iced-coffee": {
    howWeMake:
      "Brewed strong, chilled quickly, and poured over crystal ice so every sip stays bold without watering down.",
    tasteHeadline: "Chilled. Bold. Refreshing.",
    taste: {
      aroma: "Bright coffee lift",
      body: "Light yet punchy",
      flavor: "Crisp caramel notes",
      finish: "Cool, clean exit",
    },
  },
  "non-coffee": {
    howWeMake:
      "Crafted with premium teas, matcha, and botanicals — whisked, steeped, or blended for a caffeine-free treat.",
    tasteHeadline: "Fresh. Gentle. Uplifting.",
    taste: {
      aroma: "Floral & earthy",
      body: "Silky, light body",
      flavor: "Naturally sweet notes",
      finish: "Fresh, calming finish",
    },
  },
  specials: {
    howWeMake:
      "Limited-run recipes developed by our baristas — small batches, seasonal ingredients, and a little extra flair.",
    tasteHeadline: "Unique. Playful. Limited.",
    taste: {
      aroma: "Unexpected & vivid",
      body: "Layered & expressive",
      flavor: "Seasonal surprises",
      finish: "Distinctive last note",
    },
  },
  pastries: {
    howWeMake:
      "Baked in-house each morning with real butter, fresh eggs, and slow-proofed dough for that golden, flaky crumb.",
    tasteHeadline: "Buttery. Golden. Fresh.",
    taste: {
      aroma: "Oven-warm sweetness",
      body: "Flaky, tender crumb",
      flavor: "Rich butter & vanilla",
      finish: "Light, satisfying bite",
    },
  },
  sandwiches: {
    howWeMake:
      "Built to order on toasted artisan bread with fresh greens, house sauces, and proteins grilled at peak temperature.",
    tasteHeadline: "Hearty. Fresh. Filling.",
    taste: {
      aroma: "Toasted bread & herbs",
      body: "Substantial & juicy",
      flavor: "Savory, balanced layers",
      finish: "Satisfying, clean bite",
    },
  },
  snacks: {
    howWeMake:
      "Light bites portioned for sharing — crisped, seasoned, and paired perfectly with your favourite drink.",
    tasteHeadline: "Crunchy. Light. Moreish.",
    taste: {
      aroma: "Toasted & savoury",
      body: "Crisp, airy texture",
      flavor: "Subtle spice & salt",
      finish: "Easy, snackable finish",
    },
  },
  merchandise: {
    howWeMake:
      "Curated Brewed-branded goods and take-home beans — selected to extend the café experience beyond your visit.",
    tasteHeadline: "Quality. Lasting. Brewed.",
    taste: {
      aroma: "Freshly packed beans",
      body: "Premium materials",
      flavor: "Signature Brewed style",
      finish: "Enjoy at home",
    },
  },
};

export const DEFAULT_CATEGORY_STORY: CategoryStory = {
  howWeMake:
    "Every item is prepared fresh to order using quality ingredients and the same care we put into our signature drinks.",
  tasteHeadline: "Crafted. Considered. Delicious.",
  taste: {
    aroma: "Inviting & fresh",
    body: "Balanced texture",
    flavor: "Thoughtfully layered",
    finish: "Clean, satisfying",
  },
};

export function getCategoryStory(categoryId: string): CategoryStory {
  return CATEGORY_STORIES[categoryId] ?? DEFAULT_CATEGORY_STORY;
}
