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
      note: "As medidas são da roupa, não do corpo. Compare com uma peça que você já usa: meça a circunferência do peito e a manga a partir do centro das costas.",
    },
  };
}

export const categories: readonly Category[] = [
  topCategory(
    "outerwear",
    "Casacos",
    "Jaquetas e casacos com espaço para uma camisa ou um suéter por baixo.",
    44,
    28,
  ),
  topCategory("shirts", "Camisas", "Camisas de algodão, do denim leve à flanela encorpada.", 40, 29),
  {
    id: "trousers",
    name: "Calças",
    intro: "Calças de corte reto, com comprimento para ajustar a barra à sua medida.",
    sizes: waistSizes,
    tileImage: "categories/trousers",
    sizeGuide: {
      unit: "inches",
      columns: ["Cintura", "Entreperna"],
      rows: waistSizes.map((size) => ({
        size,
        measurements: [Number(size), 34],
      })),
      note: "As calças vêm sem barra, com 34 pol. de entreperna. A barra pode ser feita com ponto corrente na medida que você pedir. Para conferir a cintura, meça toda a volta do cós.",
    },
  },
  topCategory(
    "knitwear",
    "Malhas",
    "Suéteres e cardigãs de lã Shetland para os dias frios.",
    40,
    26,
  ),
  {
    id: "boots",
    name: "Botas",
    intro: "Botas de couro com sola que pode ser trocada quando gastar.",
    sizes: bootSizes,
    tileImage: "categories/boots",
    sizeGuide: {
      unit: "inches",
      columns: ["Comprimento do pé"],
      rows: bootSizes.map((size, i) => ({
        size,
        measurements: [9.875 + i * 0.3125],
      })),
      note: "A numeração é americana, sem meios tamanhos. Calce as meias que pretende usar com a bota e, em pé, meça do calcanhar até o dedo mais longo.",
    },
  },
];

export const cloths: readonly Cloth[] = [
  {
    id: "waxed-cotton",
    name: "Algodão encerado",
    intro: "O acabamento com cera de parafina faz a água escorrer em gotas pela superfície do algodão.",
    facts: {
      weight: "10oz",
      composition: "100% algodão",
      finish: "acabamento com cera de parafina",
    },
    image: "cloths/waxed-cotton",
  },
  {
    id: "selvedge-denim",
    name: "Denim selvedge",
    intro: "Denim tingido com índigo, com a borda selvedge formada durante a tecelagem.",
    facts: {
      weight: "13.5oz",
      shirtWeight: "8oz",
      composition: "100% algodão",
      finish: "tingimento em corda com índigo",
    },
    image: "cloths/selvedge-denim",
  },
  {
    id: "moleskin",
    name: "Moleskin",
    intro: "Algodão encorpado, escovado na superfície para ficar macio ao toque.",
    facts: {
      weight: "12oz",
      composition: "100% algodão",
      finish: "superfície escovada",
    },
    image: "cloths/moleskin",
  },
  {
    id: "brushed-flannel",
    name: "Flanela escovada",
    intro: "Flanela de algodão escovada dos dois lados, para vestir nos dias frios.",
    facts: {
      weight: "9oz",
      composition: "100% algodão",
      finish: "escovado dos dois lados",
    },
    image: "cloths/brushed-flannel",
  },
  {
    id: "shetland-wool",
    name: "Lã Shetland",
    intro: "Lã de 3 fios, com a textura natural da fibra.",
    facts: {
      weight: "3 fios",
      composition: "100% lã Shetland",
      finish: "textura natural da lã",
    },
    image: "cloths/shetland-wool",
  },
  {
    id: "full-grain-leather",
    name: "Couro de flor integral",
    intro: "Couro que preserva a superfície natural e ganha marcas com o uso.",
    facts: {
      weight: "2mm",
      composition: "100% couro de flor integral",
      finish: "curtimento vegetal",
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

const colorNames: Record<string, string> = {
  "Indigo": "Índigo",
  "Ecru": "Cru",
  "Olive": "Verde-oliva",
  "Tobacco": "Tabaco",
  "Navy": "Azul-marinho",
  "Black": "Preto",
  "Slate": "Cinza-ardósia",
  "Moss": "Verde-musgo",
  "Grey Check": "Xadrez cinza",
  "Saddle": "Caramelo",
  "Red Check": "Xadrez vermelho",
  "Green Check": "Xadrez verde",
  "Oat": "Aveia",
  "Rinsed": "Índigo enxaguado",
  "Charcoal": "Chumbo",
  "Oxblood": "Bordô",
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
      "O denim vai amaciando com o uso. O corte é reto, com 4 bolsos para ter o essencial à mão.",
    construction: [
      "Costuras de ombro rebatidas",
      "4 bolsos aplicados",
      "Cantos dos bolsos presos com travete",
    ],
    hardware: "Botões de pressão de latão",
    fit: "Corte reto; espaço para uma camisa e uma malha",
    repair: "Reforço dos cantos dos bolsos e reparo das costuras.",
  },
  {
    number: "027",
    name: "Jaqueta de campo",
    category: "outerwear",
    cloth: "waxed-cotton",
    price: 560,
    colors: ["Olive", "Tobacco", "Navy"],
    story: "O algodão encerado ajuda a proteger da chuva. Os 4 bolsos têm abas, e o cordão ajusta a cintura.",
    construction: [
      "Costuras externas com pesponto duplo",
      "4 bolsos sanfonados com abas",
      "Corpo forrado de algodão",
      "Revel de gola de veludo cotelê",
    ],
    hardware: "Zíper de latão bidirecional; botões de pressão de latão",
    fit: "Corte reto; cintura com cordão; espaço para outras peças por baixo",
    repair: "Remendos no tecido externo e reparo das abas dos bolsos.",
  },
  {
    number: "031",
    name: "Jaqueta curta",
    category: "outerwear",
    cloth: "waxed-cotton",
    price: 520,
    colors: ["Tobacco", "Black"],
    story: "Curta, com corte amplo e barra na altura do quadril. O algodão encerado dá estrutura à jaqueta.",
    construction: [
      "Costuras com pesponto duplo",
      "2 bolsos no peito e 2 bolsos para as mãos",
      "Pala traseira reforçada",
    ],
    hardware: "Botões de pressão de latão",
    fit: "Corte amplo e reto; barra na altura do quadril",
    repair: "Reparo das costuras da pala e dos bolsos.",
  },
  {
    number: "046",
    name: "Casaco de trabalho",
    category: "outerwear",
    cloth: "moleskin",
    price: 480,
    colors: ["Slate", "Moss"],
    story: "O moleskin é encorpado e macio ao toque. O casaco cobre o quadril e tem reforços nos cotovelos.",
    construction: [
      "Costuras laterais rebatidas",
      "3 bolsos aplicados",
      "Painéis de cotovelo reforçados",
    ],
    hardware: "Botões de corozo",
    fit: "Corte solto; comprimento abaixo do quadril",
    repair: "Remendos nos cotovelos e reforço dos bolsos.",
  },
  {
    number: "052",
    name: "Jaqueta de montaria",
    category: "outerwear",
    cloth: "selvedge-denim",
    price: 440,
    colors: ["Indigo"],
    badge: "NOVA",
    story: "Mais ajustada no corpo, com espaço nos ombros. As abas na barra permitem acertar o caimento na cintura.",
    construction: [
      "Costuras dos painéis com pesponto duplo",
      "Painéis frontais plissados",
      "Abas de ajuste na barra",
    ],
    hardware: "Botões de pressão de latão",
    fit: "Corte ajustado; barra na altura da cintura",
    repair: "Reparo das costuras dos painéis e troca das abas da barra.",
  },
  {
    number: "068",
    name: "Sobrecamisa do moinho",
    category: "outerwear",
    cloth: "brushed-flannel",
    price: 420,
    colors: ["Grey Check"],
    badge: "ÚLTIMAS PEÇAS",
    story: "Flanela encorpada para usar por cima da camisa. A barra reta tem aberturas nas laterais.",
    construction: [
      "Costuras de ombro rebatidas",
      "2 bolsos no peito",
      "Barra reta com fendas laterais",
    ],
    hardware: "Botões de corozo",
    fit: "Corte solto; corte para usar sobre uma camisa",
    repair: "Remendos nos punhos e reparo das aberturas laterais.",
  },
  {
    number: "073",
    name: "Jaqueta de trabalho de couro",
    category: "outerwear",
    cloth: "full-grain-leather",
    price: 620,
    colors: ["Saddle"],
    story: "O couro ganha marcas com o uso, e cada jaqueta fica um pouco diferente. Por dentro, o forro é de algodão.",
    construction: [
      "Painéis de couro com costura travada",
      "Corpo forrado de algodão",
      "Aberturas dos bolsos reforçadas",
    ],
    hardware: "Zíper de latão",
    fit: "Corte reto; barra na altura do quadril",
    repair: "Remendos no forro e reparo das costuras dos painéis.",
  },
  {
    number: "101",
    name: "Camisa de trabalho",
    category: "shirts",
    cloth: "selvedge-denim",
    price: 185,
    colors: ["Indigo", "Ecru"],
    story: "Denim de 8oz, mais leve que o das jaquetas. Corte reto, barra curva e 2 bolsos no peito.",
    construction: [
      "Costuras laterais rebatidas",
      "2 bolsos no peito",
      "Barra com ponto corrente",
    ],
    hardware: "Botões de corozo",
    fit: "Corte reto; barra curva",
    repair: "Remendos no colarinho e nos punhos.",
  },
  {
    number: "104",
    name: "Camisa western",
    category: "shirts",
    cloth: "selvedge-denim",
    price: 195,
    colors: ["Indigo"],
    story: "As palas pontudas e os botões de pressão perolados dão o desenho western à camisa. O denim é de 8oz.",
    construction: [
      "Palas frontais e traseiras pontudas",
      "Costuras laterais rebatidas",
      "2 bolsos no peito com abas",
    ],
    hardware: "Botões de pressão com face perolada",
    fit: "Corte ajustado; barra curva",
    repair: "Reparo das costuras das palas e remendos nas abas dos bolsos.",
  },
  {
    number: "112",
    name: "Camisa de flanela",
    category: "shirts",
    cloth: "brushed-flannel",
    price: 175,
    colors: ["Grey Check", "Red Check", "Green Check"],
    story: "Flanela macia dos dois lados, com o xadrez alinhado nos bolsos. Para os dias em que a camisa precisa aquecer um pouco mais.",
    construction: [
      "Costuras laterais rebatidas",
      "Xadrez alinhado nos bolsos",
      "Pala traseira dupla",
    ],
    hardware: "Botões de corozo",
    fit: "Corte regular; barra curva",
    repair: "Remendos nos punhos e reparo das costuras da pala.",
  },
  {
    number: "118",
    name: "Camisa pulôver",
    category: "shirts",
    cloth: "brushed-flannel",
    price: 180,
    colors: ["Oat"],
    badge: "NOVA",
    story: "Veste pela cabeça, com uma abertura curta de botões. A flanela escovada é macia, e o corte deixa o corpo à vontade.",
    construction: [
      "Meia carcela reforçada",
      "Costuras laterais rebatidas",
      "Fendas laterais com reforço",
    ],
    hardware: "Botões de corozo",
    fit: "Corte solto; barra reta",
    repair: "Reforço na abertura de botões e nas fendas laterais.",
  },
  {
    number: "125",
    name: "Camisa de moleskin",
    category: "shirts",
    cloth: "moleskin",
    price: 210,
    colors: ["Slate", "Tobacco"],
    story: "O moleskin dá peso e um toque macio à camisa. Use fechada ou aberta sobre outra peça.",
    construction: [
      "Costuras de ombro rebatidas",
      "2 bolsos no peito",
      "Punhos com pesponto duplo",
    ],
    hardware: "Botões de corozo",
    fit: "Corte reto; barra curva",
    repair: "Remendos nas bordas dos bolsos e nos punhos.",
  },
  {
    number: "131",
    name: "Jeans reto",
    category: "trousers",
    cloth: "selvedge-denim",
    price: 240,
    colors: ["Indigo", "Rinsed"],
    story: "Reto do quadril à barra, com 5 bolsos. Ao dobrar a barra, a borda selvedge aparece na costura lateral.",
    construction: [
      "Costuras externas selvedge",
      "Construção de 5 bolsos",
      "Cós com ponto corrente",
    ],
    hardware: "Rebites de latão; braguilha com botões",
    fit: "Cintura média; perna reta; entreperna de 34 pol.; sem barra; barra com ponto corrente sob medida, a pedido",
    repair: "Remendos nos joelhos e troca dos forros dos bolsos.",
  },
  {
    number: "137",
    name: "Calça de joelho duplo",
    category: "trousers",
    cloth: "waxed-cotton",
    price: 260,
    colors: ["Olive"],
    story: "Os joelhos levam uma camada dupla de tecido. A perna reta tem folga, e o bolso de ferramentas é reforçado.",
    construction: [
      "Painéis duplos nos joelhos",
      "Entrepernas com pesponto triplo",
      "Bolso de ferramentas reforçado",
    ],
    hardware: "Rebites de latão; braguilha com botões",
    fit: "Cintura alta; perna reta com folga; entreperna de 34 pol.; sem barra; barra com ponto corrente sob medida, a pedido",
    repair: "Troca dos reforços dos joelhos e remendos no bolso de ferramentas.",
  },
  {
    number: "140",
    name: "Calça de trabalho",
    category: "trousers",
    cloth: "moleskin",
    price: 230,
    colors: ["Slate", "Moss"],
    story: "Moleskin macio, com corte reto e bolsos fundos. A cintura fica na altura média.",
    construction: [
      "Entrepernas rebatidas",
      "Forros fundos de algodão para os bolsos",
      "Passantes presos com travete",
    ],
    hardware: "Botão de cós de corozo; braguilha com zíper de latão",
    fit: "Cintura média; perna reta; entreperna de 34 pol.; sem barra; barra com ponto corrente sob medida, a pedido",
    repair: "Troca dos forros dos bolsos e reparo dos passantes.",
  },
  {
    number: "146",
    name: "Calça fatigue",
    category: "trousers",
    cloth: "moleskin",
    price: 220,
    colors: ["Oat"],
    story: "Cintura alta e pernas soltas, com bolsos grandes na frente. As abas laterais ajustam o cós.",
    construction: [
      "Grandes bolsos frontais aplicados",
      "Entrepernas rebatidas",
      "Abas de ajuste na cintura",
    ],
    hardware: "Botões de corozo",
    fit: "Cintura alta; perna solta; entreperna de 34 pol.; sem barra; barra com ponto corrente sob medida, a pedido",
    repair: "Reforço dos bolsos e troca das abas da cintura.",
  },
  {
    number: "152",
    name: "Calça com pregas",
    category: "trousers",
    cloth: "brushed-flannel",
    price: 250,
    colors: ["Charcoal"],
    badge: "ÚLTIMAS PEÇAS",
    story: "As pregas dão mais espaço nas coxas e deixam a flanela cair solta. A perna segue reta até a barra.",
    construction: [
      "Pregas frontais simples",
      "Cós interno com acabamento",
      "Bolsos traseiros embutidos",
    ],
    hardware: "Botão de cós de corozo; braguilha com zíper de latão",
    fit: "Cintura alta; coxa ampla; perna reta; entreperna de 34 pol.; sem barra; barra com ponto corrente sob medida, a pedido",
    repair: "Reparo dos bolsos embutidos e do cós.",
  },
  {
    number: "160",
    name: "Suéter Shetland",
    category: "knitwear",
    cloth: "shetland-wool",
    price: 260,
    colors: ["Oat", "Navy", "Moss"],
    story: "Tricô de lã Shetland com espaço para uma camisa por baixo. Gola, punhos e barra têm acabamento canelado.",
    construction: [
      "Corpo com modelagem integral",
      "Costuras de ombro unidas",
      "Gola, punhos e barra canelados",
    ],
    fit: "Corte regular; barra na altura do quadril",
    repair: "Cerzido nos cotovelos e nos punhos, com lã da mesma cor.",
  },
  {
    number: "163",
    name: "Cardigã Shetland",
    category: "knitwear",
    cloth: "shetland-wool",
    price: 320,
    colors: ["Charcoal"],
    story: "Lã Shetland com fechamento de botões e 2 bolsos de tricô. O corte tem folga para usar sobre a camisa.",
    construction: [
      "Corpo com modelagem integral",
      "Vista de botões reforçada",
      "2 bolsos de tricô aplicados",
    ],
    hardware: "Botões de corozo",
    fit: "Corte solto; barra na altura do quadril",
    repair: "Reforço da abertura de botões e cerzido nas áreas gastas.",
  },
  {
    number: "169",
    name: "Suéter de gola alta",
    category: "knitwear",
    cloth: "shetland-wool",
    price: 290,
    colors: ["Ecru", "Navy"],
    badge: "NOVA",
    story: "A gola alta dobra sobre si mesma e cobre o pescoço. O corpo tem corte regular, com barra na altura do quadril.",
    construction: [
      "Corpo com modelagem integral",
      "Costuras de ombro unidas",
      "Gola alta canelada e dobrável",
    ],
    fit: "Corte regular; barra na altura do quadril",
    repair: "Cerzido na gola e nos punhos, com lã da mesma cor.",
  },
  {
    number: "177",
    name: "Bota engineer",
    category: "boots",
    cloth: "full-grain-leather",
    price: 460,
    colors: ["Black", "Saddle"],
    story: "Sem cadarços, com bico largo e fivelas no cano e no peito do pé. Tem espaço para uma meia mais grossa.",
    construction: [
      "Cano forrado de couro",
      "Contraforte reforçado",
      "Painéis do cabedal com costura travada",
    ],
    hardware: "Fivelas sólidas de latão no peito do pé e no cano",
    fit: "Tamanhos inteiros dos EUA; espaço para meias grossas",
    repair: "Reparo das costuras do cabedal e troca das solas gastas.",
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
    story: "Bota de couro com bico liso e cano acima do tornozelo. Os ganchos de latão facilitam o ajuste dos cadarços.",
    construction: [
      "Cabedal forrado de couro",
      "Contraforte reforçado",
      "Quartos com pesponto duplo",
    ],
    hardware: "Ilhoses e ganchos rápidos de latão",
    fit: "Tamanhos inteiros dos EUA; largura regular",
    repair: "Reparo das laterais do cabedal e troca das solas gastas.",
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
    story: "A costura do bico é feita à mão. A sola de borracha em cunha acompanha toda a base da bota.",
    construction: [
      "Costura do bico moc feita à mão",
      "Cabedal forrado de couro",
      "Contraforte reforçado",
    ],
    hardware: "Ilhoses de latão",
    fit: "Tamanhos inteiros dos EUA; antepé largo",
    repair: "Reparo da costura do bico e troca das solas em cunha.",
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
    story: "Bota de cano baixo, com 3 ilhoses e sola de borracha crepe. O cabedal é forrado de couro.",
    construction: [
      "Cabedal forrado de couro",
      "Quartos com pesponto duplo",
      "Contraforte reforçado",
    ],
    hardware: "Ilhoses de latão",
    fit: "Tamanhos inteiros dos EUA; largura regular",
    repair: "Reparo das costuras do cabedal e troca das solas gastas.",
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
    ? "Tire a sujeira com uma escova. Deixe secar naturalmente, longe do calor. Hidrate o couro com moderação."
    : clothId === "waxed-cotton"
      ? "Tire a sujeira com uma escova e passe uma esponja com água fria. Não lave na máquina. Reaplique a cera quando necessário."
      : clothId === "shetland-wool"
        ? "Lave à mão em água fria. Acerte o formato da peça e deixe secar na horizontal."
        : "Lave do avesso em água fria e seque no varal. Não use alvejante.";
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
    { label: "REPARO", value: `Reparos gratuitos por toda a vida\n${repair}` },
    ...(category === "boots"
      ? [
          { label: "FORMA" as const, value: last! },
          { label: "SOLA" as const, value: sole! },
          {
            label: "VIRA" as const,
            value: "Vira de couro costurada em 360°, construção Goodyear",
          },
        ]
      : []),
  ];
  const colorways: Colorway[] = definition.colors.map((name) => {
    const colorId = slug(name);
    const key = `pieces/${number}-${id}/${colorId}`;
    return {
      id: colorId,
      name: colorNames[name],
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
  look("01", "Ainda há neblina sobre a água quando o dia começa em Hollins Weir.", "4:5", [
    ["field-jacket", "olive"],
    ["shetland-crew", "navy"],
    ["flannel-shirt", "grey-check"],
    ["straight-jean", "indigo"],
    ["service-boot", "oxblood"],
  ]),
  look("02", "Depois da chuva, o chão continua molhado no caminho pelo campo.", "4:5", [
    ["chore-jacket", "indigo"],
    ["shetland-crew", "oat"],
    ["work-trouser", "slate"],
    ["moc-toe-boot", "saddle"],
  ]),
  look(
    "03",
    "Uma pausa à beira do rio, sob o céu nublado.",
    "3:2",
    [
      ["leather-work-jacket", "saddle"],
      ["western-shirt", "indigo"],
      ["straight-jean", "rinsed"],
      ["engineer-boot", "black"],
    ],
  ),
  look("04", "À porta do moinho, uma calça recebe o ajuste da barra.", "4:5", [
    ["work-coat", "moss"],
    ["roll-neck", "ecru"],
    ["pleated-trouser", "charcoal"],
    ["chukka", "tobacco"],
  ]),
  look("05", "O frio pede a gola levantada no caminho de madeira coberto de folhas.", "3:2", [
    ["cruiser-jacket", "tobacco"],
    ["work-shirt", "ecru"],
    ["double-knee-trouser", "olive"],
    ["engineer-boot", "saddle"],
  ]),
  look("06", "A chuva dá uma trégua perto do portão, já no fim da tarde.", "4:5", [
    ["rider-jacket", "indigo"],
    ["popover-shirt", "oat"],
    ["fatigue-trouser", "oat"],
  ]),
  look("07", "A primeira geada chega com as árvores já sem folhas e a lenha cortada.", "4:5", [
    ["shetland-cardigan", "charcoal"],
    ["moleskin-shirt", "slate"],
    ["straight-jean", "indigo"],
    ["moc-toe-boot", "saddle"],
  ]),
  look(
    "08",
    "A água segue correndo abaixo da represa, entre as pedras cobertas de geada.",
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
    "O frio chega aos poucos em Hollins Weir. Entre o moinho e o rio, 8 looks mostram como vestir as peças nos meses mais frios.",
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
      caption: "O caminho entre carvalhos e bétulas desaparece na neblina.",
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
