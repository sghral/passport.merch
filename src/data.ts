import { Product, CountryInfo } from './types';

export const COUNTRIES: CountryInfo[] = [
  {
    code: 'JAPAN',
    name: 'Япония',
    flag: '🇯🇵',
    city: 'Tokyo (NRT)',
    timeZone: 'Asia/Tokyo',
    estimatedDeliveryDays: '7-10 дней',
    cargoStatus: 'Вылетел из Нарита. Сортировка',
    shippingRateRub: 2100,
  },
  {
    code: 'USA',
    name: 'США',
    flag: '🇺🇸',
    city: 'Los Angeles (LAX)',
    timeZone: 'America/Los_Angeles',
    estimatedDeliveryDays: '10-14 дней',
    cargoStatus: 'Прибыл в транзитный хаб JFK',
    shippingRateRub: 2800,
  },
  {
    code: 'ITALY',
    name: 'Италия',
    flag: '🇮🇹',
    city: 'Milan (MXP)',
    timeZone: 'Europe/Rome',
    estimatedDeliveryDays: '5-8 дней',
    cargoStatus: 'Таможенное оформление в ЕС',
    shippingRateRub: 1900,
  },
  {
    code: 'FRANCE',
    name: 'Франция',
    flag: '🇫🇷',
    city: 'Paris (CDG)',
    timeZone: 'Europe/Paris',
    estimatedDeliveryDays: '5-8 дней',
    cargoStatus: 'Готовится к отправке. Офис CDG',
    shippingRateRub: 1800,
  },
  {
    code: 'KOREA',
    name: 'Южная Корея',
    flag: '🇰🇷',
    city: 'Seoul (ICN)',
    timeZone: 'Asia/Seoul',
    estimatedDeliveryDays: '6-9 дней',
    cargoStatus: 'Пройден экспортный контроль Инчхон',
    shippingRateRub: 2000,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'jp-kapital-denim',
    name: 'Patchwork Bandana Denim Jacket',
    brand: 'Kapital Kountry',
    category: 'Outerwear',
    country: 'JAPAN',
    countryName: 'Япония',
    countryFlag: '🇯🇵',
    price: 114000,
    originalPrice: '¥185,000',
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Жемчужина японского стритвира премиальной линейки Kapital Kountry. Выполнена вручную в Кодзиме методом традиционного окрашивания индиго с использованием старинных заплаток банданы в технике Сашико. Каждое изделие уникально и имеет собственный номерной штамп мастерской.',
    details: [
      '100% японский селвидж-деним (14.2 oz)',
      'Уникальные элементы хлопковых бандан Indigo Patchwork',
      'Медные винтажные пуговицы с гравировкой бренда',
      'Сделано вручную в городе Кодзима, префектура Окаяма, Япония',
      'Ограниченный лимитированный тираж коллекции Drop #41'
    ],
    weightKg: 1.4,
    slug: 'kapital-patchwork-denim-jacket',
    stock: 2,
    featured: true
  },
  {
    id: 'us-supreme-bogo',
    name: 'Box Logo Heavyweight Hoodie',
    brand: 'Supreme NY',
    category: 'Hoodies',
    country: 'USA',
    countryName: 'США',
    countryFlag: '🇺🇸',
    price: 68000,
    originalPrice: '$480',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Классическая икона уличной моды с оригинального дропа Supreme в Нью-Йорке. Выполнена из сверхплотного флисового хлопка с перекрестным плетением нити, устойчивого к растяжению. Высококачественная трехмерная вышивка культового логотипа Box Logo на груди.',
    details: [
      'Плотный канадский хлопок Crossgrain Fleece (450 gsm)',
      'Усиленные ребристые манжеты и боковые вставки',
      'Фирменная жаккардовая бирка под горлом',
      'Куплено в оригинальном магазине Supreme на Lafayette St, New York',
      'Свободный оверсайз крой (Relaxed fit)'
    ],
    weightKg: 1.1,
    slug: 'supreme-box-logo-hoodie-black',
    stock: 5,
    featured: true
  },
  {
    id: 'it-stone-island-crinkle',
    name: 'Garment Dyed Crinkle Reps NY',
    brand: 'Stone Island',
    category: 'Outerwear',
    country: 'ITALY',
    countryName: 'Италия',
    countryFlag: '🇮🇹',
    price: 94500,
    originalPrice: '€950',
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Легкая куртка-ветровка из ультраплотного переработанного нейлона репс с водонепроницаемым полимерным покрытием с внутренней стороны. Окрашена по запатентованной технологии Garment Dyed с добавлением специального водоотталкивающего агента без содержания фтора.',
    details: [
      'Материал: Econyl® Crinkle Reps (100% регенерированный нейлон)',
      'Съемный патч с компасом Stone Island на левом рукаве',
      'Скрытый в воротник ветрозащитный регулируемый капюшон',
      'Два нагрудных кармана на защищенной молнии YKK Vislon',
      'Привезено лично из миланского флагмана на Corso Venezia'
    ],
    weightKg: 0.8,
    slug: 'stone-island-crinkle-reps-jacket',
    stock: 3,
    featured: true
  },
  {
    id: 'fr-margiela-stitch',
    name: 'Four-Stitch Heavy Cotton Tee',
    brand: 'Maison Margiela',
    category: 'T-Shirts',
    country: 'FRANCE',
    countryName: 'Франция',
    countryFlag: '🇫🇷',
    price: 34000,
    originalPrice: '€310',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Футболка из премиального тяжелого трикотажа сложного песочного оттенка от парижского авангардного дома. На спинке расположены знаковые четыре белых стежка, заменяющие традиционный логотип бренда. Круглый вырез в рубчик и слегка спущенная линия плеча.',
    details: [
      '100% длинноволокнистый хлопок сорта Mako (240 gsm)',
      'Фирменная неопознанная сетка стежков Maison Margiela на спине',
      'Усадочная предварительная стирка для винтажной текстуры ткани',
      'Приобретено во флагманском бутике на Rue Saint-Honoré, Paris',
      'Унисекс силуэт с расслабленной посадкой в плечах'
    ],
    weightKg: 0.35,
    slug: 'maison-margiela-four-stitch-tee',
    stock: 6,
    featured: true
  },
  {
    id: 'kr-gentle-monster',
    name: 'Heizer Avant-Garde Runway Sunglasses',
    brand: 'Gentle Monster',
    category: 'Accessories',
    country: 'KOREA',
    countryName: 'Южная Корея',
    countryFlag: '🇰🇷',
    price: 41000,
    originalPrice: '₩420,000',
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Футуристичные солнечные очки Heizer от самого хайпового сеульского бренда Gentle Monster. Модель отличается выразительной оправой формы flat-top из полированного глянцевого ацетата и безопасными линзами Zeiss, обеспечивающими 100% УФ-защиту.',
    details: [
      'Оправа: Безопасный натуральный ацетат целлюлозы',
      'Высокоточные немецкие линзы Carl Zeiss (Black Gradient)',
      'Металлические декоративные пули-заклепки на дужках',
      'Куплено в фантастическом концепт-сторе в районе Хапчон, Сеул',
      'В комплекте кожаный формованный кейс-кобура и паспорт подлинности'
    ],
    weightKg: 0.25,
    slug: 'gentle-monster-heizer-sunglasses',
    stock: 4,
    featured: true
  },
  {
    id: 'jp-cdg-play',
    name: 'Red Heart Play Knit Cardigan',
    brand: 'Comme des Garçons',
    category: 'Outerwear',
    country: 'JAPAN',
    countryName: 'Япония',
    countryFlag: '🇯🇵',
    price: 39500,
    originalPrice: '¥48,000',
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1608063615781-e5ef7bf04186?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Знаменитый кардиган из мягкой натуральной шерсти от Рей Кавакубо. На груди вышит культовый красный логотип-сердце с глазами, созданный польским нью-йоркским художником Филипом Паговски. Перламутровые пуговицы и деликатная трикотажная вязка.',
    details: [
      '100% нежнейшая натуральная шерсть овец мериносов',
      'Оригинальная нашивка в виде двойного сердца CDG Play',
      'Рант по краю и застежка на натуральных ракушечных пуговицах',
      'Выкуплено в торговом центре Dover Street Market в квартале Гинза, Токио',
      'Допускается исключительно бережная сухая чистка'
    ],
    weightKg: 0.6,
    slug: 'cdg-play-red-heart-cardigan',
    stock: 3,
    featured: false
  },
  {
    id: 'us-stussy-8ball',
    name: '8-Ball Mohair Blend Cardigan',
    brand: 'Stussy',
    category: 'Outerwear',
    country: 'USA',
    countryName: 'США',
    countryFlag: '🇺🇸',
    price: 42000,
    originalPrice: '$230',
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Ворсистый кардиган из смесового мохера с акцентным жаккардовым узором бильярдной «восьмерки» на спине от калифорнийского бренда Stussy. Сквозная планка на пуговицах, мягкая текстурная вязка средней плотности.',
    details: [
      'Состав: 30% мохер, 30% натуральная шерсть, 40% износостойкий нейлон',
      'Огромный графический элемент "8-Ball" рельефного плетения на спине',
      'Ребристый V-образный подол, манжеты и нижняя кайма',
      'Привезено напрямую из лос-анджелесского магазина Stussy на La Brea Ave',
      'Отличный дышащий свитер для прохладных летних вечеров'
    ],
    weightKg: 0.7,
    slug: 'stussy-8-ball-mohair-cardigan',
    stock: 3,
    featured: false
  },
  {
    id: 'fr-jacquemus-shirt',
    name: 'Le Chemise Bahia Overshirt',
    brand: 'Jacquemus',
    category: 'Outerwear',
    country: 'FRANCE',
    countryName: 'Франция',
    countryFlag: '🇫🇷',
    price: 49000,
    originalPrice: '€490',
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Стильная рубашка-куртка расслабленного кроя из дышащего льна и плотного премиум хлопка от восходящей звезды французского шика Симона Порта Жакмюса. Лаконичный крой с асимметричной утяжкой под застежкой и перламутровой фурнитурой.',
    details: [
      'Смесовый купра-лен благородной жатой фактуры (60% лен, 40% хлопок)',
      'Тонкая металлическая фурнитура с гравировкой Jacquemus Париж',
      'Накладной скошенный нагрудный карман в минималистичном стиле',
      'Выкуплено лично из бутика на Avenue Montaigne в Париже',
      'Прекрасно сочетается с широкими костюмными брюками'
    ],
    weightKg: 0.45,
    slug: 'jacquemus-le-chemise-bahia',
    stock: 4,
    featured: false
  },
  {
    id: 'kr-ader-piping',
    name: 'Contrast Stitch Distressed Hoodie',
    brand: 'ADER Error',
    category: 'Hoodies',
    country: 'KOREA',
    countryName: 'Южная Корея',
    countryFlag: '🇰🇷',
    price: 45000,
    originalPrice: '₩470,000',
    sizes: ['A1', 'A2', 'A3'],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Оверсайз толстовка с контрастной неоновой синей строчкой и винтажными декоративными потертостями от деконструктивистского сеульского объединения ADER Error. Фирменный силиконовый полупрозрачный тетрадный патч Blue Tetris на спине под капюшоном.',
    details: [
      'Плотный сеульский футер с начесом премиальной очистки (480 gsm)',
      'Знаковые брендовые необработанные строчки с торчащими нитями (Concept Art)',
      'Металлическая плакетка ADER с лазерной гравировкой даты запуска бренда',
      'Приобретено в знаменитом флагмане с космическим дизайном ADER Space Sinsa, Сеул',
      'Фирменная корейская посадка со спадающими рукавами и широким низом'
    ],
    weightKg: 1.25,
    slug: 'ader-error-contrast-piping-hoodie',
    stock: 3,
    featured: false
  },
  {
    id: 'it-palm-angels',
    name: 'Classic Gothic Logo Track Jacket',
    brand: 'Palm Angels',
    category: 'Outerwear',
    country: 'ITALY',
    countryName: 'Италия',
    countryFlag: '🇮🇹',
    price: 38000,
    originalPrice: '€390',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Оригинальная спортивная олимпийка с контрастными полосами на рукавах и готическим шрифтом-логотипом на левой стороне груди. Изделие сочетает дух скейт-культуры Лос-Анджелеса с непревзойденным итальянским качеством пошива.',
    details: [
      'Легкий итальянский гладкий трикотаж (100% полиэфирное волокно)',
      'Контрастные спортивные лампасы на рукавах молочно-белого цвета',
      'Высокий воротник-стойка с металлической молнией и бегунком-пацификом',
      'Выкуплено из закрытого склада-дистрибьютора в пригороде Вероны, Италия',
      'Классический зауженный уличный силуэт (Slim-Relaxed hybrid)'
    ],
    weightKg: 0.55,
    slug: 'palm-angels-gothic-track-jacket',
    stock: 5,
    featured: false
  },
  {
    id: 'kr-thisisneverthat',
    name: 'Sherpa Fleece Utility Tech-Parka',
    brand: 'thisisneverthat',
    category: 'Outerwear',
    country: 'KOREA',
    countryName: 'Южная Корея',
    countryFlag: '🇰🇷',
    price: 36000,
    originalPrice: '₩280,000',
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Сверхтеплая мягкая ветрозащитная парка из пушистого шерстяного флиса типа "шерпа" со вставками из износостойкого нейлона таслан на воротнике и локтях. Идеально защищает в ветреные демисезонные дни благодаря внутренней мембране Windstopper.',
    details: [
      'Экстремально плотный ворсистый флис плотностью 510 gsm',
      'Высокотехнологичный тактический нейлоновый нагрудный карман на молнии',
      'Эластичные затяжки с карабинами в подоле для сохранения тепла',
      'Закуплено в модном молодежном квартале Хондэ, Сеул',
      'Вышитый классический логотип по технологии высокой плотности глади'
    ],
    weightKg: 0.95,
    slug: 'thisisneverthat-sherpa-utility-parka',
    stock: 2,
    featured: false
  },
  {
    id: 'jp-evisu-selvedge',
    name: 'Daicock Multi-Pocket Selvedge Jeans',
    brand: 'Evisu Heritage',
    category: 'Outerwear',
    country: 'JAPAN',
    countryName: 'Япония',
    countryFlag: '🇯🇵',
    price: 89000,
    originalPrice: '¥110,000',
    sizes: ['30', '32', '34', '36'],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=700'
    ],
    description: 'Знаменитые тяжелые джинсы культового премиум-бренда Evisu, основанного в Осаке Хидехико Ямане. Сзади нанесен гигантский принт Daicock с легендарной росписью «чайки» на множестве функциональных скрытых карманов из нестираного сухого денима.',
    details: [
      '14.5 oz Raw Japanese Selvedge Denim (сухой жесткий деним перед усадкой)',
      'Знаковая цветная кромка ткани Selvedge ID окраса Indigo/White/Blue',
      'Трафаретные разноцветные ручные принты в форме каллиграфической чайки',
      'Оригинальный кожаный патч из шкуры буйвола с тиснением бога Эбису',
      'Привезено напрямую из флагмана в районе Ниппонбаши, Осака, Япония'
    ],
    weightKg: 1.15,
    slug: 'evisu-heritage-daicock-selvedge-jeans',
    stock: 2,
    featured: false
  }
];

export const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
export const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort();
export const COUNTRIES_LIST = Array.from(new Set(PRODUCTS.map((p) => p.country)));
