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
      columns: ["Peito", "Comprimento", "Manga"],
      rows: topSizes.map((size, i) => ({
        size,
        measurements: [chest + i * 2, length + i * 0.5, 32 + i * 0.5],
      })),
      note: "Estas são medidas da peça. Meça o peito ao redor da peça e a manga a partir do centro das costas; depois compare com uma peça que vista bem em você.",
    },
  };
}

export const categories: readonly Category[] = [
  topCategory(
    "outerwear",
    "Casacos",
    "Camadas resistentes para caminhadas molhadas até o moinho.",
    44,
    28,
  ),
  topCategory("shirts", "Camisas", "Colarinhos simples e espaço para trabalhar.", 40, 29),
  {
    id: "trousers",
    name: "Calças",
    intro: "Cortes retos, vendidos compridos para você ajustar a barra como preferir.",
    sizes: waistSizes,
    tileImage: "categories/trousers",
    sizeGuide: {
      unit: "inches",
      columns: ["Cintura", "Entreperna"],
      rows: waistSizes.map((size) => ({
        size,
        measurements: [Number(size), 34],
      })),
      note: "As calças têm entreperna de 34 pol. e chegam sem barra. A barra pode ser feita com ponto corrente no comprimento solicitado. Meça a cintura ao redor do cós.",
    },
  },
  topCategory(
    "knitwear",
    "Malhas",
    "Lã Shetland para o espaço entre a pele e o tempo.",
    40,
    26,
  ),
  {
    id: "boots",
    name: "Botas",
    intro: "Couro de flor integral com vira pronta para outra sola.",
    sizes: bootSizes,
    tileImage: "categories/boots",
    sizeGuide: {
      unit: "inches",
      columns: ["Comprimento do pé"],
      rows: bootSizes.map((size, i) => ({
        size,
        measurements: [9.875 + i * 0.3125],
      })),
      note: "Tamanhos inteiros dos EUA. Em pé, usando as meias que você usará, meça do calcanhar até o dedo mais longo.",
    },
  },
];

export const cloths: readonly Cloth[] = [
  {
    id: "waxed-cotton",
    name: "Algodão encerado",
    intro: "A chuva forma gotas no algodão acabado com cera de parafina.",
    facts: {
      weight: "10oz",
      composition: "100% cotton",
      finish: "paraffin wax finish",
    },
    image: "cloths/waxed-cotton",
  },
  {
    id: "selvedge-denim",
    name: "Denim selvedge",
    intro: "Uma borda tecida e índigo incorporado ao fio.",
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
    intro: "Algodão encorpado com face macia e escovada.",
    facts: {
      weight: "12oz",
      composition: "100% cotton",
      finish: "brushed face",
    },
    image: "cloths/moleskin",
  },
  {
    id: "brushed-flannel",
    name: "Flanela escovada",
    intro: "Algodão escovado dos dois lados para manhãs frias.",
    facts: {
      weight: "9oz",
      composition: "100% cotton",
      finish: "double-napped",
    },
    image: "cloths/brushed-flannel",
  },
  {
    id: "shetland-wool",
    name: "Lã Shetland",
    intro: "Lã de três fios que dispensa forro.",
    facts: {
      weight: "3-ply",
      composition: "100% Lã Shetland",
      finish: "natural wool face",
    },
    image: "cloths/shetland-wool",
  },
  {
    id: "full-grain-leather",
    name: "Couro de flor integral",
    intro: "A flor permanece visível, e o uso deixa sua marca.",
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
    name: "Jaqueta de trabalho",
    category: "outerwear",
    cloth: "selvedge-denim",
    price: 420,
    colors: ["Indigo", "Ecru"],
    story:
      "Quatro bolsos, barra reta e denim que se acomoda ao trabalho.",
    construction: [
      "Costuras de ombro rebatidas",
      "4 bolsos aplicados",
      "Cantos dos bolsos presos com travete",
    ],
    hardware: "Botões de pressão de latão",
    fit: "Corpo reto; espaço para uma camisa e uma malha",
    repair: "Cantos dos bolsos e costuras refeitos.",
  },
  {
    number: "027",
    name: "Jaqueta de campo",
    category: "outerwear",
    cloth: "waxed-cotton",
    price: 560,
    colors: ["Olive", "Tobacco", "Navy"],
    story: "Algodão encerado para a pedra molhada e a caminhada de volta.",
    construction: [
      "Costuras externas com pesponto duplo",
      "4 bolsos sanfonados com abas",
      "Corpo forrado de algodão",
      "Revel de gola de veludo cotelê",
    ],
    hardware: "Zíper de latão bidirecional; botões de pressão de latão",
    fit: "Corpo reto; cintura com cordão; espaço para camadas",
    repair: "Parte externa remendada e abas dos bolsos refeitas.",
  },
  {
    number: "031",
    name: "Jaqueta curta",
    category: "outerwear",
    cloth: "waxed-cotton",
    price: 520,
    colors: ["Tobacco", "Black"],
    story: "Uma camada encerada curta que fica acima do quadril.",
    construction: [
      "Costuras com pesponto duplo",
      "2 bolsos no peito e 2 bolsos para as mãos",
      "Pala traseira reforçada",
    ],
    hardware: "Botões de pressão de latão",
    fit: "Corpo quadrado; barra na altura do quadril",
    repair: "Costuras da pala e dos bolsos refeitas.",
  },
  {
    number: "046",
    name: "Casaco de trabalho",
    category: "outerwear",
    cloth: "moleskin",
    price: 480,
    colors: ["Slate", "Moss"],
    story: "Algodão encorpado, cortado longo o bastante para cobrir o quadril.",
    construction: [
      "Costuras laterais rebatidas",
      "3 bolsos aplicados",
      "Painéis de cotovelo reforçados",
    ],
    hardware: "Botões de corozo",
    fit: "Corpo confortável; comprimento abaixo do quadril",
    repair: "Cotovelo remendado e bolsos reforçados.",
  },
  {
    number: "052",
    name: "Jaqueta de montaria",
    category: "outerwear",
    cloth: "selvedge-denim",
    price: 440,
    colors: ["Indigo"],
    badge: "NOVA",
    story: "Uma jaqueta de denim ajustada, com espaço nos ombros.",
    construction: [
      "Costuras dos painéis com pesponto duplo",
      "Painéis frontais plissados",
      "Abas de ajuste na barra",
    ],
    hardware: "Botões de pressão de latão",
    fit: "Corpo ajustado; barra na altura da cintura",
    repair: "Costuras dos painéis refeitas e abas da barra substituídas.",
  },
  {
    number: "068",
    name: "Sobrecamisa do moinho",
    category: "outerwear",
    cloth: "brushed-flannel",
    price: 420,
    colors: ["Grey Check"],
    badge: "ÚLTIMAS DO TECIDO",
    story: "Peso de jaqueta com o colarinho simples de uma camisa.",
    construction: [
      "Costuras de ombro rebatidas",
      "2 bolsos no peito",
      "Barra reta com fendas laterais",
    ],
    hardware: "Botões de corozo",
    fit: "Corpo confortável; corte para usar sobre uma camisa",
    repair: "Punhos remendados e fendas laterais refeitas.",
  },
  {
    number: "073",
    name: "Jaqueta de trabalho de couro",
    category: "outerwear",
    cloth: "full-grain-leather",
    price: 620,
    colors: ["Saddle"],
    story: "Couro de flor integral que ganha as marcas de quem o veste.",
    construction: [
      "Painéis de couro com costura travada",
      "Corpo forrado de algodão",
      "Aberturas dos bolsos reforçadas",
    ],
    hardware: "Zíper de latão",
    fit: "Corpo reto; barra na altura do quadril",
    repair: "Forro remendado e costuras dos painéis refeitas.",
  },
  {
    number: "101",
    name: "Camisa de trabalho",
    category: "shirts",
    cloth: "selvedge-denim",
    price: 185,
    colors: ["Indigo", "Ecru"],
    story: "Denim leve como camisa, com borda tecida e frente sem adornos.",
    construction: [
      "Costuras laterais rebatidas",
      "2 bolsos no peito",
      "Barra com ponto corrente",
    ],
    hardware: "Botões de corozo",
    fit: "Straight body; curved hem",
    repair: "Colarinho e punhos remendados.",
  },
  {
    number: "104",
    name: "Camisa western",
    category: "shirts",
    cloth: "selvedge-denim",
    price: 195,
    colors: ["Indigo"],
    story: "Denim mais leve na pala pontuda, com botões de pressão na frente.",
    construction: [
      "Palas frontais e traseiras pontudas",
      "Costuras laterais rebatidas",
      "2 bolsos no peito com abas",
    ],
    hardware: "Botões de pressão com face perolada",
    fit: "Corpo ajustado; barra curva",
    repair: "Costuras das palas refeitas e abas dos bolsos remendadas.",
  },
  {
    number: "112",
    name: "Camisa de flanela",
    category: "shirts",
    cloth: "brushed-flannel",
    price: 175,
    colors: ["Grey Check", "Red Check", "Green Check"],
    story: "Algodão escovado dos dois lados para manhãs à beira da água.",
    construction: [
      "Costuras laterais rebatidas",
      "Xadrez alinhado nos bolsos",
      "Pala traseira dupla",
    ],
    hardware: "Botões de corozo",
    fit: "Corpo regular; barra curva",
    repair: "Punhos remendados e costuras da pala refeitas.",
  },
  {
    number: "118",
    name: "Camisa pulôver",
    category: "shirts",
    cloth: "brushed-flannel",
    price: 180,
    colors: ["Oat"],
    badge: "NOVA",
    story: "Uma carcela curta de algodão macio que se veste pela cabeça.",
    construction: [
      "Meia carcela reforçada",
      "Costuras laterais rebatidas",
      "Fendas laterais com reforço",
    ],
    hardware: "Botões de corozo",
    fit: "Corpo confortável; barra reta",
    repair: "Carcela e reforços laterais reforçados.",
  },
  {
    number: "125",
    name: "Camisa de moleskin",
    category: "shirts",
    cloth: "moleskin",
    price: 210,
    colors: ["Slate", "Tobacco"],
    story: "Uma camisa de algodão escovado encorpado para usar fechada ou aberta à porta do moinho.",
    construction: [
      "Costuras de ombro rebatidas",
      "2 bolsos no peito",
      "Punhos com pesponto duplo",
    ],
    hardware: "Botões de corozo",
    fit: "Straight body; curved hem",
    repair: "Bordas dos bolsos e punhos remendados.",
  },
  {
    number: "131",
    name: "Jeans reto",
    category: "trousers",
    cloth: "selvedge-denim",
    price: 240,
    colors: ["Indigo", "Rinsed"],
    story: "Perna reta desde o quadril, com selvedge na costura externa.",
    construction: [
      "Costuras externas selvedge",
      "Construção de 5 bolsos",
      "Cós com ponto corrente",
    ],
    hardware: "Rebites de latão; braguilha com botões",
    fit: "Cintura média; perna reta; entreperna de 34 pol., vendido sem barra; barra com ponto corrente no comprimento solicitado",
    repair: "Joelhos remendados e forros dos bolsos substituídos.",
  },
  {
    number: "137",
    name: "Calça de joelho duplo",
    category: "trousers",
    cloth: "waxed-cotton",
    price: 260,
    colors: ["Olive"],
    story: "Uma camada extra para o lugar onde seu joelho encontra o chão.",
    construction: [
      "Painéis duplos nos joelhos",
      "Entrepernas com pesponto triplo",
      "Bolso de ferramentas reforçado",
    ],
    hardware: "Rebites de latão; braguilha com botões",
    fit: "Cintura alta; perna reta confortável; entreperna de 34 pol., vendido sem barra; barra com ponto corrente no comprimento solicitado",
    repair: "Painéis dos joelhos substituídos e bolso de ferramentas remendado.",
  },
  {
    number: "140",
    name: "Calça de trabalho",
    category: "trousers",
    cloth: "moleskin",
    price: 230,
    colors: ["Slate", "Moss"],
    story: "Algodão escovado, perna reta e bolsos fundos.",
    construction: [
      "Entrepernas rebatidas",
      "Forros fundos de algodão para os bolsos",
      "Passantes presos com travete",
    ],
    hardware: "Botão de cós de corozo; braguilha com zíper de latão",
    fit: "Cintura média; perna reta; entreperna de 34 pol., vendido sem barra; barra com ponto corrente no comprimento solicitado",
    repair: "Forros dos bolsos substituídos e passantes refeitos.",
  },
  {
    number: "146",
    name: "Calça fatigue",
    category: "trousers",
    cloth: "moleskin",
    price: 220,
    colors: ["Oat"],
    story: "Bolsos aplicados e perna solta para caminhar pela trilha do campo.",
    construction: [
      "Grandes bolsos frontais aplicados",
      "Entrepernas rebatidas",
      "Abas de ajuste na cintura",
    ],
    hardware: "Botões de corozo",
    fit: "Cintura alta; perna confortável; entreperna de 34 pol., vendido sem barra; barra com ponto corrente no comprimento solicitado",
    repair: "Bolsos aplicados reforçados e abas da cintura substituídas.",
  },
  {
    number: "152",
    name: "Calça plissada",
    category: "trousers",
    cloth: "brushed-flannel",
    price: 250,
    colors: ["Charcoal"],
    badge: "ÚLTIMAS DO TECIDO",
    story: "Uma prega dá espaço para a flanela pesada cair.",
    construction: [
      "Pregas frontais simples",
      "Cós interno com acabamento",
      "Bolsos traseiros embutidos",
    ],
    hardware: "Botão de cós de corozo; braguilha com zíper de latão",
    fit: "Cintura alta; coxa ampla; perna reta; entreperna de 34 pol., vendido sem barra; barra com ponto corrente no comprimento solicitado",
    repair: "Bolsos embutidos e cós refeitos.",
  },
  {
    number: "160",
    name: "Suéter Shetland",
    category: "knitwear",
    cloth: "shetland-wool",
    price: 260,
    colors: ["Oat", "Navy", "Moss"],
    story: "Lã de três fios com gola simples e espaço para uma camisa por baixo.",
    construction: [
      "Corpo com modelagem integral",
      "Costuras de ombro unidas",
      "Gola, punhos e barra canelados",
    ],
    fit: "Corpo regular; barra na altura do quadril",
    repair: "Cotovelos e punhos cerzidos com lã combinando.",
  },
  {
    number: "163",
    name: "Cardigã Shetland",
    category: "knitwear",
    cloth: "shetland-wool",
    price: 320,
    colors: ["Charcoal"],
    story: "Uma camada aberta de lã Shetland para a primeira geada forte.",
    construction: [
      "Corpo com modelagem integral",
      "Vista de botões reforçada",
      "2 bolsos de tricô aplicados",
    ],
    hardware: "Botões de corozo",
    fit: "Corpo confortável; barra na altura do quadril",
    repair: "Vista de botões reforçada e áreas gastas cerzidas.",
  },
  {
    number: "169",
    name: "Gola alta",
    category: "knitwear",
    cloth: "shetland-wool",
    price: 290,
    colors: ["Ecru", "Navy"],
    badge: "NOVA",
    story: "Lã dobrada na gola para deixar menos espaço para o vento.",
    construction: [
      "Corpo com modelagem integral",
      "Costuras de ombro unidas",
      "Gola alta canelada profunda",
    ],
    fit: "Corpo regular; barra na altura do quadril",
    repair: "Gola canelada e punhos cerzidos com lã combinando.",
  },
  {
    number: "177",
    name: "Bota engineer",
    category: "boots",
    cloth: "full-grain-leather",
    price: 460,
    colors: ["Black", "Saddle"],
    story: "Uma bota de calçar, com bico largo e fivela no peito do pé.",
    construction: [
      "Cano forrado de couro",
      "Contraforte reforçado",
      "Painéis do cabedal com costura travada",
    ],
    hardware: "Fivelas sólidas de latão no peito do pé e no cano",
    fit: "Tamanhos inteiros dos EUA; espaço para meia de trabalho",
    repair: "Costuras do cabedal refeitas; solas gastas substituídas.",
    last: "Bico redondo; antepé largo; peito do pé médio",
    sole: "Borracha resistente a óleo; salto de couro empilhado",
  },
  {
    number: "182",
    name: "Bota service",
    category: "boots",
    cloth: "full-grain-leather",
    price: 400,
    colors: ["Oxblood"],
    story: "Couro de bico liso com cadarço fechado acima do tornozelo.",
    construction: [
      "Cabedal forrado de couro",
      "Contraforte reforçado",
      "Quartos com pesponto duplo",
    ],
    hardware: "Ilhoses e ganchos rápidos de latão",
    fit: "Tamanhos inteiros dos EUA; largura regular",
    repair: "Quartos refeitos; solas gastas substituídas.",
    last: "Bico redondo; antepé regular; peito do pé médio",
    sole: "Borracha com tachas; salto de couro empilhado",
  },
  {
    number: "188",
    name: "Bota moc toe",
    category: "boots",
    cloth: "full-grain-leather",
    price: 420,
    colors: ["Saddle"],
    story: "Bico costurado e sola cunha plana para o pátio de pedras.",
    construction: [
      "Costura do bico moc feita à mão",
      "Cabedal forrado de couro",
      "Contraforte reforçado",
    ],
    hardware: "Ilhoses de latão",
    fit: "Tamanhos inteiros dos EUA; antepé largo",
    repair: "Costura do bico refeita; solas cunha gastas substituídas.",
    last: "Bico moc; antepé largo; peito do pé médio",
    sole: "Cunha de borracha com desenho raso",
  },
  {
    number: "194",
    name: "Chukka",
    category: "boots",
    cloth: "full-grain-leather",
    price: 380,
    colors: ["Tobacco"],
    story: "Três ilhoses e uma bota baixa de couro para a entrada do moinho.",
    construction: [
      "Cabedal forrado de couro",
      "Quartos com pesponto duplo",
      "Contraforte reforçado",
    ],
    hardware: "Ilhoses de latão",
    fit: "Tamanhos inteiros dos EUA; largura regular",
    repair: "Costuras do cabedal refeitas; solas gastas substituídas.",
    last: "Bico redondo; antepé regular; peito do pé baixo",
    sole: "Borracha crepe; salto baixo de couro empilhado",
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

const pieceIds: Record<string, string> = {
  "014": "chore-jacket", "027": "field-jacket", "031": "cruiser-jacket",
  "046": "work-coat", "052": "rider-jacket", "068": "mill-overshirt",
  "073": "leather-work-jacket", "101": "work-shirt", "104": "western-shirt",
  "112": "flannel-shirt", "118": "popover-shirt", "125": "moleskin-shirt",
  "131": "straight-jean", "137": "double-knee-trouser", "140": "work-trouser",
  "146": "fatigue-trouser", "152": "pleated-trouser", "160": "shetland-crew",
  "163": "shetland-cardigan", "169": "roll-neck", "177": "engineer-boot",
  "182": "service-boot", "188": "moc-toe-boot", "194": "chukka",
};

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
  const id = pieceIds[number] ?? slug(name);
  const leather = clothId === "full-grain-leather";
  const care = leather
    ? "Remova a sujeira com uma escova; seque ao ar, longe do calor; hidrate com moderação."
    : clothId === "waxed-cotton"
      ? "Remova a sujeira com uma escova; passe uma esponja com água fria; não lave à máquina; reencere quando necessário."
      : clothId === "shetland-wool"
        ? "Lave à mão em água fria; remodele e seque na horizontal."
        : "Lave a frio do avesso; seque no varal; não use alvejante.";
  const proof: ProofRow[] = [
    { label: "TECIDO", value: `${cloth.name} · ${cloth.facts.finish}` },
    {
      label: "PESO",
      value:
        category === "shirts"
          ? (cloth.facts.shirtWeight ?? cloth.facts.weight)
          : cloth.facts.weight,
    },
    { label: "COMPOSIÇÃO", value: cloth.facts.composition },
    { label: "CONSTRUÇÃO", value: construction.join("\n") },
    ...(hardware ? [{ label: "AVIAMENTOS" as const, value: hardware }] : []),
    { label: "CAIMENTO", value: fit },
    {
      label: "FABRICADO EM",
      value:
        category === "boots"
          ? "Hollins Weir · vira Goodyear"
          : "Hollins Weir",
    },
    { label: "CUIDADOS", value: care },
    { label: "REPARO", value: `Consertos gratuitos por toda a vida\n${repair}` },
    ...(category === "boots"
      ? [
          { label: "FORMA" as const, value: last! },
          { label: "SOLA" as const, value: sole! },
          {
            label: "VIRA" as const,
            value: "360° Goodyear welt; vira de couro costurada",
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
  look("01", "A primeira luz sobre a represa. A névoa ainda paira sobre a água.", "4:5", [
    ["field-jacket", "olive"],
    ["shetland-crew", "navy"],
    ["flannel-shirt", "grey-check"],
    ["straight-jean", "indigo"],
    ["service-boot", "oxblood"],
  ]),
  look("02", "A chuva passou. Os campos a guardam por mais um tempo.", "4:5", [
    ["chore-jacket", "indigo"],
    ["shetland-crew", "oat"],
    ["work-trouser", "slate"],
    ["moc-toe-boot", "saddle"],
  ]),
  look(
    "03",
    "Nuvens baixas sobre o rio. Uma pausa à beira da água.",
    "3:2",
    [
      ["leather-work-jacket", "saddle"],
      ["western-shirt", "indigo"],
      ["straight-jean", "rinsed"],
      ["engineer-boot", "black"],
    ],
  ),
  look("04", "À porta aberta do moinho, uma barra é costurada no comprimento.", "4:5", [
    ["work-coat", "moss"],
    ["roll-neck", "ecru"],
    ["pleated-trouser", "charcoal"],
    ["chukka", "tobacco"],
  ]),
  look("05", "Gola levantada. As últimas folhas cobrem o caminho de madeira.", "3:2", [
    ["cruiser-jacket", "tobacco"],
    ["work-shirt", "ecru"],
    ["double-knee-trouser", "olive"],
    ["engineer-boot", "saddle"],
  ]),
  look("06", "A chuva abre no portão do campo. A luz quase se foi.", "4:5", [
    ["rider-jacket", "indigo"],
    ["popover-shirt", "oat"],
    ["fatigue-trouser", "oat"],
  ]),
  look("07", "Lenha rachada. Galhos nus. A primeira geada forte.", "4:5", [
    ["shetland-cardigan", "charcoal"],
    ["moleskin-shirt", "slate"],
    ["straight-jean", "indigo"],
    ["moc-toe-boot", "saddle"],
  ]),
  look(
    "08",
    "A água ainda corre abaixo da represa. Geada sobre as pedras.",
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
  season: "Outono/Inverno 2026",
  seasonLabel: "FW26",
  intro:
    "A estação vai das primeiras folhas à geada na represa, com tecidos pesados para os meses frios.",
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
      caption: "Carvalhos e bétulas ao longo de um caminho que entra na névoa.",
    },
    looks[3],
    looks[4],
    looks[5],
    {
      kind: "interstitial",
      id: "river",
      image: "editorial/interstitial-river",
      aspect: "3:2",
      caption: "A água se aquieta acima da represa.",
    },
    looks[6],
    looks[7],
  ],
};
