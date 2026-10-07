import type {
  Category,
  CategoryId,
  Cloth,
  ClothId,
  Colorway,
  Look,
  Lookbook,
  Piece,
  ProofRow,
  Size,
} from "./types";

const topSizes = ["S", "M", "L", "XL", "XXL"] as const;
const waistSizes = ["28", "30", "32", "34", "36", "38"] as const;
const bootSizes = ["7", "8", "9", "10", "11", "12", "13"] as const;

function topCategory(
  id: CategoryId,
  name: string,
  intro: string,
  chest: number,
  length: number,
): Category {
  return {
    id,
    name,
    intro,
    sizes: topSizes,
    tileImage: `categories/${id}`,
    sizeGuide: {
      unit: "inches",
      columns: ["Chest", "Length", "Sleeve"],
      rows: topSizes.map((size, i) => ({
        size,
        measurements: [chest + i * 2, length + i * 0.5, 32 + i * 0.5],
      })),
      note: "Garment measurements. Chest measured around the garment; sleeve from center back. Compare with a Piece that fits.",
    },
  };
}

export const categories: readonly Category[] = [
  topCategory(
    "outerwear",
    "Outerwear",
    "Heavy shells for the walk to the mill.",
    44,
    28,
  ),
  topCategory("shirts", "Shirts", "Plain collars. Room to work.", 40, 29),
  {
    id: "trousers",
    name: "Trousers",
    intro: "Straight cuts, sold long. Hemmed to suit.",
    sizes: waistSizes,
    tileImage: "categories/trousers",
    sizeGuide: {
      unit: "inches",
      columns: ["Waist", "Inseam"],
      rows: waistSizes.map((size) => ({
        size,
        measurements: [Number(size), 34],
      })),
      note: "34in inseam, sold unhemmed; chain-stitched to length on request. Waist measured around the waistband.",
    },
  },
  topCategory(
    "knitwear",
    "Knitwear",
    "Shetland wool between skin and weather.",
    40,
    26,
  ),
  {
    id: "boots",
    name: "Boots",
    intro: "Full-grain leather. A welt that can be worked again.",
    sizes: bootSizes,
    tileImage: "categories/boots",
    sizeGuide: {
      unit: "inches",
      columns: ["Foot length"],
      rows: bootSizes.map((size, i) => ({
        size,
        measurements: [9.875 + i * 0.3125],
      })),
      note: "US whole sizes. Measure heel to longest toe while standing, wearing the socks used with the boot.",
    },
  },
];

export const cloths: readonly Cloth[] = [
  {
    id: "waxed-cotton",
    name: "Waxed cotton",
    intro: "Rain beads on a paraffin-waxed face.",
    facts: {
      weight: "10oz",
      composition: "100% cotton",
      finish: "paraffin wax finish",
    },
    image: "cloths/waxed-cotton",
  },
  {
    id: "selvedge-denim",
    name: "Selvedge denim",
    intro: "A woven edge. Indigo worked into the yarn.",
    facts: {
      weight: "13.5oz",
      shirtWeight: "8oz",
      composition: "100% cotton",
      finish: "rope-dyed indigo",
    },
    image: "cloths/selvedge-denim",
  },
  {
    id: "moleskin",
    name: "Moleskin",
    intro: "Dense cotton with a quiet, brushed face.",
    facts: {
      weight: "12oz",
      composition: "100% cotton",
      finish: "brushed face",
    },
    image: "cloths/moleskin",
  },
  {
    id: "brushed-flannel",
    name: "Brushed flannel",
    intro: "Cotton napped on both sides for the colder mornings.",
    facts: {
      weight: "9oz",
      composition: "100% cotton",
      finish: "double-napped",
    },
    image: "cloths/brushed-flannel",
  },
  {
    id: "shetland-wool",
    name: "Shetland wool",
    intro: "3-ply wool. Warmth without a lining.",
    facts: {
      weight: "3-ply",
      composition: "100% Shetland wool",
      finish: "natural wool face",
    },
    image: "cloths/shetland-wool",
  },
  {
    id: "full-grain-leather",
    name: "Full-grain leather",
    intro: "The grain stays. Wear leaves its own record.",
    facts: {
      weight: "2mm",
      composition: "100% full-grain leather",
      finish: "vegetable-tanned",
    },
    image: "cloths/full-grain-leather",
  },
];

const swatches: Record<string, string> = {
  Indigo: "#334567",
  Ecru: "#DFD8C5",
  Olive: "#62694A",
  Tobacco: "#886346",
  Navy: "#29364B",
  Black: "#292827",
  Slate: "#646A6D",
  Moss: "#697253",
  "Grey Check": "#777671",
  Saddle: "#A16F49",
  "Red Check": "#854A43",
  "Green Check": "#57634F",
  Oat: "#C4B697",
  Rinsed: "#26344F",
  Charcoal: "#464744",
  Oxblood: "#603438",
};

type PieceDefinition = {
  number: string;
  name: string;
  category: CategoryId;
  cloth: ClothId;
  price: number;
  colors: readonly string[];
  badge?: Piece["badge"];
  story: string;
  construction: readonly [string, string, string, ...string[]];
  hardware?: string;
  fit: string;
  repair: string;
  last?: string;
  sole?: string;
};

const definitions: readonly PieceDefinition[] = [
  {
    number: "014",
    name: "Chore Jacket",
    category: "outerwear",
    cloth: "selvedge-denim",
    price: 420,
    colors: ["Indigo", "Ecru"],
    story:
      "Four pockets. A straight hem. Cloth that takes the shape of the work.",
    construction: [
      "Felled shoulder seams",
      "4 patch pockets",
      "Bar-tacked pocket corners",
    ],
    hardware: "Tack buttons in brass",
    fit: "Straight body; room for a shirt and knit",
    repair: "Pocket corners and seams restitched.",
  },
  {
    number: "027",
    name: "Field Jacket",
    category: "outerwear",
    cloth: "waxed-cotton",
    price: 560,
    colors: ["Olive", "Tobacco", "Navy"],
    story: "Waxed cotton for wet stone and the long way home.",
    construction: [
      "Double-stitched shell seams",
      "4 bellows pockets with flaps",
      "Cotton-lined body",
      "Corduroy collar facing",
    ],
    hardware: "Two-way brass zipper; brass snaps",
    fit: "Straight body; drawcord waist; room for layers",
    repair: "Shell patched and pocket flaps restitched.",
  },
  {
    number: "031",
    name: "Cruiser Jacket",
    category: "outerwear",
    cloth: "waxed-cotton",
    price: 520,
    colors: ["Tobacco", "Black"],
    story: "A short waxed shell. Cut clear of the hip.",
    construction: [
      "Double-stitched seams",
      "2 chest pockets and 2 hand pockets",
      "Reinforced back yoke",
    ],
    hardware: "Brass snaps",
    fit: "Boxy body; hip-length hem",
    repair: "Yoke and pocket seams restitched.",
  },
  {
    number: "046",
    name: "Work Coat",
    category: "outerwear",
    cloth: "moleskin",
    price: 480,
    colors: ["Slate", "Moss"],
    story: "Dense cotton, cut long enough to cover the seat.",
    construction: [
      "Felled side seams",
      "3 patch pockets",
      "Reinforced elbow panels",
    ],
    hardware: "Corozo buttons",
    fit: "Relaxed body; below-hip length",
    repair: "Elbows patched and pockets reinforced.",
  },
  {
    number: "052",
    name: "Rider Jacket",
    category: "outerwear",
    cloth: "selvedge-denim",
    price: 440,
    colors: ["Indigo"],
    badge: "NEW",
    story: "A close denim jacket with room across the shoulders.",
    construction: [
      "Double-stitched panel seams",
      "Pleated front panels",
      "Adjustable hem tabs",
    ],
    hardware: "Brass tack buttons",
    fit: "Trim body; waist-length hem",
    repair: "Panel seams restitched and hem tabs replaced.",
  },
  {
    number: "068",
    name: "Mill Overshirt",
    category: "outerwear",
    cloth: "brushed-flannel",
    price: 420,
    colors: ["Grey Check"],
    badge: "LAST OF THE CLOTH",
    story: "The weight of a jacket with the plain collar of a shirt.",
    construction: [
      "Felled shoulder seams",
      "2 chest pockets",
      "Square hem with side vents",
    ],
    hardware: "Corozo buttons",
    fit: "Relaxed body; cut to wear over a shirt",
    repair: "Cuffs patched and side vents restitched.",
  },
  {
    number: "073",
    name: "Leather Work Jacket",
    category: "outerwear",
    cloth: "full-grain-leather",
    price: 620,
    colors: ["Saddle"],
    story: "Full-grain hide. The creases belong to the wearer.",
    construction: [
      "Lock-stitched leather panels",
      "Cotton-lined body",
      "Reinforced pocket openings",
    ],
    hardware: "Brass zipper",
    fit: "Straight body; hip-length hem",
    repair: "Lining patched and panel seams restitched.",
  },
  {
    number: "101",
    name: "Work Shirt",
    category: "shirts",
    cloth: "selvedge-denim",
    price: 185,
    colors: ["Indigo", "Ecru"],
    story: "Shirt-weight denim with a woven edge and a plain front.",
    construction: [
      "Felled side seams",
      "2 chest pockets",
      "Chain-stitched hem",
    ],
    hardware: "Corozo buttons",
    fit: "Straight body; curved hem",
    repair: "Collar and cuffs patched.",
  },
  {
    number: "104",
    name: "Western Shirt",
    category: "shirts",
    cloth: "selvedge-denim",
    price: 195,
    colors: ["Indigo"],
    story: "A pointed yoke in lighter denim. Snaps down the front.",
    construction: [
      "Pointed front and back yokes",
      "Felled side seams",
      "2 flap chest pockets",
    ],
    hardware: "Pearl-faced snaps",
    fit: "Trim body; curved hem",
    repair: "Yoke seams restitched and pocket flaps patched.",
  },
  {
    number: "112",
    name: "Flannel Shirt",
    category: "shirts",
    cloth: "brushed-flannel",
    price: 175,
    colors: ["Grey Check", "Red Check", "Green Check"],
    story: "Cotton brushed on both faces, for mornings by the water.",
    construction: [
      "Felled side seams",
      "Matched checks at the pockets",
      "Double-layer back yoke",
    ],
    hardware: "Corozo buttons",
    fit: "Regular body; curved hem",
    repair: "Cuffs patched and yoke seams restitched.",
  },
  {
    number: "118",
    name: "Popover Shirt",
    category: "shirts",
    cloth: "brushed-flannel",
    price: 180,
    colors: ["Oat"],
    badge: "NEW",
    story: "A short placket. Soft cotton pulled on over the head.",
    construction: [
      "Reinforced half placket",
      "Felled side seams",
      "Gusseted side vents",
    ],
    hardware: "Corozo buttons",
    fit: "Relaxed body; straight hem",
    repair: "Placket and side gussets reinforced.",
  },
  {
    number: "125",
    name: "Moleskin Shirt",
    category: "shirts",
    cloth: "moleskin",
    price: 210,
    colors: ["Slate", "Tobacco"],
    story: "A dense brushed shirt, worn alone or open at the mill door.",
    construction: [
      "Felled shoulder seams",
      "2 chest pockets",
      "Double-stitched cuffs",
    ],
    hardware: "Corozo buttons",
    fit: "Straight body; curved hem",
    repair: "Pocket edges and cuffs patched.",
  },
  {
    number: "131",
    name: "Straight Jean",
    category: "trousers",
    cloth: "selvedge-denim",
    price: 240,
    colors: ["Indigo", "Rinsed"],
    story: "A straight leg from the hip. Selvedge at the outseam.",
    construction: [
      "Selvedge outseams",
      "5-pocket construction",
      "Chain-stitched waistband",
    ],
    hardware: "Brass rivets; button fly",
    fit: "Mid rise; straight leg; 34in inseam, sold unhemmed; chain-stitched to length on request",
    repair: "Knees patched and pocket bags replaced.",
  },
  {
    number: "137",
    name: "Double-Knee Trouser",
    category: "trousers",
    cloth: "waxed-cotton",
    price: 260,
    colors: ["Olive"],
    story: "An extra layer where the knee meets the ground.",
    construction: [
      "Double knee panels",
      "Triple-stitched inseams",
      "Reinforced tool pocket",
    ],
    hardware: "Brass rivets; button fly",
    fit: "High rise; relaxed straight leg; 34in inseam, sold unhemmed; chain-stitched to length on request",
    repair: "Knee panels replaced and tool pocket patched.",
  },
  {
    number: "140",
    name: "Work Trouser",
    category: "trousers",
    cloth: "moleskin",
    price: 230,
    colors: ["Slate", "Moss"],
    story: "Brushed cotton with a straight leg and deep pockets.",
    construction: [
      "Felled inseams",
      "Deep cotton pocket bags",
      "Bar-tacked belt loops",
    ],
    hardware: "Corozo waist button; brass zipper fly",
    fit: "Mid rise; straight leg; 34in inseam, sold unhemmed; chain-stitched to length on request",
    repair: "Pocket bags replaced and belt loops restitched.",
  },
  {
    number: "146",
    name: "Fatigue Trouser",
    category: "trousers",
    cloth: "moleskin",
    price: 220,
    colors: ["Oat"],
    story: "Patch pockets and a loose leg for the field path.",
    construction: [
      "Large front patch pockets",
      "Felled inseams",
      "Adjustable waist tabs",
    ],
    hardware: "Corozo buttons",
    fit: "High rise; relaxed leg; 34in inseam, sold unhemmed; chain-stitched to length on request",
    repair: "Patch pockets reinforced and waist tabs replaced.",
  },
  {
    number: "152",
    name: "Pleated Trouser",
    category: "trousers",
    cloth: "brushed-flannel",
    price: 250,
    colors: ["Charcoal"],
    badge: "LAST OF THE CLOTH",
    story: "A single pleat gives the heavy flannel room to fall.",
    construction: [
      "Single front pleats",
      "Bound inner waistband",
      "Welted back pockets",
    ],
    hardware: "Corozo waist button; brass zipper fly",
    fit: "High rise; full thigh; straight leg; 34in inseam, sold unhemmed; chain-stitched to length on request",
    repair: "Pocket welts and waistband restitched.",
  },
  {
    number: "160",
    name: "Shetland Crew",
    category: "knitwear",
    cloth: "shetland-wool",
    price: 260,
    colors: ["Oat", "Navy", "Moss"],
    story: "3-ply wool with a plain neck and a little room beneath.",
    construction: [
      "Fully fashioned body",
      "Linked shoulder seams",
      "Ribbed neck, cuffs and hem",
    ],
    fit: "Regular body; hip-length hem",
    repair: "Elbows and cuffs darned in matching wool.",
  },
  {
    number: "163",
    name: "Shetland Cardigan",
    category: "knitwear",
    cloth: "shetland-wool",
    price: 320,
    colors: ["Charcoal"],
    story: "An open layer of Shetland wool for the first hard frost.",
    construction: [
      "Fully fashioned body",
      "Reinforced button band",
      "2 knitted patch pockets",
    ],
    hardware: "Corozo buttons",
    fit: "Relaxed body; hip-length hem",
    repair: "Button band reinforced and worn areas darned.",
  },
  {
    number: "169",
    name: "Roll-Neck",
    category: "knitwear",
    cloth: "shetland-wool",
    price: 290,
    colors: ["Ecru", "Navy"],
    badge: "NEW",
    story: "Wool turned at the neck. One less gap for the wind.",
    construction: [
      "Fully fashioned body",
      "Linked shoulder seams",
      "Deep ribbed roll neck",
    ],
    fit: "Regular body; hip-length hem",
    repair: "Neck rib and cuffs darned in matching wool.",
  },
  {
    number: "177",
    name: "Engineer Boot",
    category: "boots",
    cloth: "full-grain-leather",
    price: 460,
    colors: ["Black", "Saddle"],
    story: "A pull-on boot with a broad toe and a buckled instep.",
    construction: [
      "Leather-lined shaft",
      "Reinforced heel counter",
      "Lock-stitched upper panels",
    ],
    hardware: "Solid brass instep and shaft buckles",
    fit: "US whole sizes; room for a work sock",
    repair: "Upper seams restitched; worn soles replaced.",
    last: "Round toe; broad forefoot; medium instep",
    sole: "Oil-resistant rubber; stacked leather heel",
  },
  {
    number: "182",
    name: "Service Boot",
    category: "boots",
    cloth: "full-grain-leather",
    price: 400,
    colors: ["Oxblood"],
    story: "Plain-toe leather, laced close above the ankle.",
    construction: [
      "Leather-lined upper",
      "Reinforced heel counter",
      "Double-stitched quarters",
    ],
    hardware: "Brass eyelets and speed hooks",
    fit: "US whole sizes; regular width",
    repair: "Quarters restitched; worn soles replaced.",
    last: "Round toe; regular forefoot; medium instep",
    sole: "Studded rubber; stacked leather heel",
  },
  {
    number: "188",
    name: "Moc-Toe Boot",
    category: "boots",
    cloth: "full-grain-leather",
    price: 420,
    colors: ["Saddle"],
    story: "A stitched toe and a flat wedge for the cobbled yard.",
    construction: [
      "Hand-stitched moc toe seam",
      "Leather-lined upper",
      "Reinforced heel counter",
    ],
    hardware: "Brass eyelets",
    fit: "US whole sizes; broad forefoot",
    repair: "Toe seam restitched; worn wedge soles replaced.",
    last: "Moc toe; broad forefoot; medium instep",
    sole: "Rubber wedge with shallow tread",
  },
  {
    number: "194",
    name: "Chukka",
    category: "boots",
    cloth: "full-grain-leather",
    price: 380,
    colors: ["Tobacco"],
    story: "Three eyelets. A low leather boot at the mill threshold.",
    construction: [
      "Leather-lined upper",
      "Double-stitched quarters",
      "Reinforced heel counter",
    ],
    hardware: "Brass eyelets",
    fit: "US whole sizes; regular width",
    repair: "Upper seams restitched; worn soles replaced.",
    last: "Round toe; regular forefoot; low instep",
    sole: "Crepe rubber; low stacked leather heel",
  },
];

const soldOut: Record<string, readonly Size[]> = {
  "027/olive": ["XL"],
  "014/indigo": ["S"],
  "112/red-check": ["M", "L"],
  "131/indigo": ["30"],
  "160/oat": ["XXL"],
  "152/charcoal": ["34"],
  "177/black": ["9", "10"],
  "188/saddle": ["11"],
};

function slug(value: string): string {
  return value.toLowerCase().replaceAll(" ", "-");
}

function makePiece(definition: PieceDefinition, index: number): Piece {
  const {
    number,
    name,
    category,
    cloth: clothId,
    price,
    badge,
    story,
    construction,
    hardware,
    fit,
    repair,
    last,
    sole,
  } = definition;
  const cloth = cloths.find((entry) => entry.id === clothId)!;
  const id = slug(name);
  const leather = clothId === "full-grain-leather";
  const care = leather
    ? "Brush off dirt; air dry away from heat; condition sparingly."
    : clothId === "waxed-cotton"
      ? "Brush off dirt; sponge with cold water; do not machine wash; rewax as needed."
      : clothId === "shetland-wool"
        ? "Hand wash cool; reshape and dry flat."
        : "Wash cold inside out; line dry; do not bleach.";
  const proof: ProofRow[] = [
    { label: "CLOTH", value: `${cloth.name} · ${cloth.facts.finish}` },
    {
      label: "WEIGHT",
      value:
        category === "shirts"
          ? (cloth.facts.shirtWeight ?? cloth.facts.weight)
          : cloth.facts.weight,
    },
    { label: "COMPOSITION", value: cloth.facts.composition },
    { label: "CONSTRUCTION", value: construction.join("\n") },
    ...(hardware ? [{ label: "HARDWARE" as const, value: hardware }] : []),
    { label: "FIT", value: fit },
    {
      label: "MADE IN",
      value:
        category === "boots"
          ? "Hollins Weir · Goodyear welted"
          : "Hollins Weir",
    },
    { label: "CARE", value: care },
    { label: "REPAIR", value: `Mended free for life\n${repair}` },
    ...(category === "boots"
      ? [
          { label: "LAST" as const, value: last! },
          { label: "SOLE" as const, value: sole! },
          {
            label: "WELT" as const,
            value: "360° Goodyear welt; stitched leather welt",
          },
        ]
      : []),
  ];
  const colorways: Colorway[] = definition.colors.map((name) => {
    const colorId = slug(name);
    const key = `pieces/${number}-${id}/${colorId}`;
    return {
      id: colorId,
      name,
      swatch: swatches[name],
      images: {
        still: `${key}-still`,
        front: `${key}-front`,
        back: `${key}-back`,
        detail: `${key}-detail`,
      },
      soldOutSizes: soldOut[`${number}/${colorId}`] ?? [],
    };
  });
  return {
    id,
    number,
    name,
    category,
    cloth: clothId,
    price,
    ...(badge ? { badge } : {}),
    story,
    proof,
    featuredRank: number === "027" ? 0 : index + 1,
    colorways,
  };
}

export const pieces: readonly Piece[] = definitions.map(makePiece);

function look(
  number: string,
  caption: string,
  aspect: Look["aspect"],
  items: readonly (readonly [string, string])[],
): Look {
  return {
    kind: "look",
    id: `look-${number}`,
    number,
    caption,
    aspect,
    image: `looks/look-${number}`,
    squareImage: `looks/look-${number}-square`,
    items: items.map(([piece, colorway]) => ({ piece, colorway })),
  };
}

const looks = [
  look("01", "First light on the weir. Mist still on the water.", "4:5", [
    ["field-jacket", "olive"],
    ["shetland-crew", "navy"],
    ["flannel-shirt", "grey-check"],
    ["straight-jean", "indigo"],
    ["service-boot", "oxblood"],
  ]),
  look("02", "Rain has passed. The yard holds it a little longer.", "4:5", [
    ["chore-jacket", "indigo"],
    ["shetland-crew", "oat"],
    ["work-trouser", "slate"],
    ["moc-toe-boot", "saddle"],
  ]),
  look(
    "03",
    "Low cloud over the wall. A steady walk across the fields.",
    "3:2",
    [
      ["leather-work-jacket", "saddle"],
      ["western-shirt", "indigo"],
      ["straight-jean", "rinsed"],
      ["engineer-boot", "black"],
    ],
  ),
  look("04", "At the open mill door, a hem is stitched to length.", "4:5", [
    ["work-coat", "moss"],
    ["roll-neck", "ecru"],
    ["pleated-trouser", "charcoal"],
    ["chukka", "tobacco"],
  ]),
  look("05", "Collar up. The last leaves lie on the wood track.", "3:2", [
    ["cruiser-jacket", "tobacco"],
    ["work-shirt", "ecru"],
    ["double-knee-trouser", "olive"],
    ["engineer-boot", "saddle"],
  ]),
  look("06", "Rain clearing at the field gate. Light nearly gone.", "4:5", [
    ["rider-jacket", "indigo"],
    ["popover-shirt", "oat"],
    ["fatigue-trouser", "oat"],
  ]),
  look("07", "Split logs. Bare branches. The first hard frost.", "4:5", [
    ["shetland-cardigan", "charcoal"],
    ["moleskin-shirt", "slate"],
    ["straight-jean", "indigo"],
    ["moc-toe-boot", "saddle"],
  ]),
  look(
    "08",
    "Water still running below the weir. Frost on the stones.",
    "3:2",
    [
      ["mill-overshirt", "grey-check"],
      ["roll-neck", "navy"],
      ["work-trouser", "moss"],
      ["engineer-boot", "black"],
    ],
  ),
] as const;

export const lookbook: Lookbook = {
  season: "Fall/Winter 2026",
  seasonLabel: "FW26",
  intro:
    "From the first leaves to frost on the weir. Heavy cloth through the colder months.",
  frames: [
    { kind: "cover", title: "FW26 · Hollins Weir" },
    looks[0],
    looks[1],
    looks[2],
    {
      kind: "interstitial",
      id: "woods",
      image: "editorial/interstitial-woods",
      aspect: "4:5",
      caption: "Oak and birch. The path runs into mist.",
    },
    looks[3],
    looks[4],
    looks[5],
    {
      kind: "interstitial",
      id: "river",
      image: "editorial/interstitial-river",
      aspect: "3:2",
      caption: "Still water above the weir.",
    },
    looks[6],
    looks[7],
  ],
};
