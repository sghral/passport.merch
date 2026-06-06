import React, { createContext, useState, useContext, useEffect } from 'react';

export type Language = 'RU' | 'EN';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
  tCountry: (name: string) => string;
  tCity: (name: string) => string;
  tCargoStatus: (status: string) => string;
  tDelivery: (days: string) => string;
  tProduct: (product: any) => { name: string; description: string; details: string[] };
}

const COUNTRY_MAP: Record<string, Record<Language, string>> = {
  'Япония': { RU: 'Япония', EN: 'Japan' },
  'США': { RU: 'США', EN: 'USA' },
  'Италия': { RU: 'Италия', EN: 'Italy' },
  'Франция': { RU: 'Франция', EN: 'France' },
  'Южная Корея': { RU: 'Южная Корея', EN: 'South Korea' },
  'Россия': { RU: 'Россия', EN: 'Russia' },
  'Казахстан': { RU: 'Казахстан', EN: 'Kazakhstan' },
  'Турция': { RU: 'Турция', EN: 'Turkey' },
  'ОАЭ': { RU: 'ОАЭ', EN: 'UAE' },
  'Грузия': { RU: 'Грузия', EN: 'Georgia' },
  'Узбекистан': { RU: 'Узбекистан', EN: 'Uzbekistan' },
  'Армения': { RU: 'Армения', EN: 'Armenia' },
};

const CITY_MAP: Record<string, Record<Language, string>> = {
  'Москва': { RU: 'Москва', EN: 'Moscow' },
  'Санкт-Петербург': { RU: 'Санкт-Петербург', EN: 'St. Petersburg' },
  'Новосибирск': { RU: 'Новосибирск', EN: 'Novosibirsk' },
  'Екатеринбург': { RU: 'Екатеринбург', EN: 'Yekaterinburg' },
  'Казань': { RU: 'Казань', EN: 'Kazan' },
  'Владивосток': { RU: 'Владивосток', EN: 'Vladivostok' },
  'Алматы': { RU: 'Алматы', EN: 'Almaty' },
  'Астана': { RU: 'Астана', EN: 'Astana' },
  'Шымкент': { RU: 'Шымкент', EN: 'Shymkent' },
  'Караганда': { RU: 'Караганда', EN: 'Karaganda' },
  'Стамбул': { RU: 'Стамбул', EN: 'Istanbul' },
  'Анкара': { RU: 'Анкара', EN: 'Ankara' },
  'Измир': { RU: 'Измир', EN: 'Izmir' },
  'Анталья': { RU: 'Анталья', EN: 'Antalya' },
  'Дубай': { RU: 'Дубай', EN: 'Dubai' },
  'Абу-Даби': { RU: 'Абу-Даби', EN: 'Abu Dhabi' },
  'Шарджа': { RU: 'Шарджа', EN: 'Sharjah' },
  'Тбилиси': { RU: 'Тбилиси', EN: 'Tbilisi' },
  'Батуми': { RU: 'Батуми', EN: 'Batumi' },
  'Кутаиси': { RU: 'Кутаиси', EN: 'Kutaisi' },
  'Ташкент': { RU: 'Ташкент', EN: 'Tashkent' },
  'Самарканд': { RU: 'Самарканд', EN: 'Samarkand' },
  'Бухара': { RU: 'Бухара', EN: 'Bukhara' },
  'Ереван': { RU: 'Ереван', EN: 'Yerevan' },
  'Гюмри': { RU: 'Гюмри', EN: 'Gyumri' },
  'Ванадзор': { RU: 'Ванадзор', EN: 'Vanadzor' },
};

const CARGO_STATUS_MAP: Record<string, Record<Language, string>> = {
  'Вылетел из Нарита. Сортировка': {
    RU: 'Вылетел из Нарита. Сортировка',
    EN: 'Departed Narita. Customs sorting en-route'
  },
  'Прибыл в транзитный хаб JFK': {
    RU: 'Прибыл в транзитный хаб JFK',
    EN: 'Arrived at JFK international transit hub'
  },
  'Таможенное оформление в ЕС': {
    RU: 'Таможенное оформление в ЕС',
    EN: 'EU Customs clearing state'
  },
  'Готовится к отправке. Офис CDG': {
    RU: 'Готовится к отправке. Офис CDG',
    EN: 'Priority staging. CDG Express Office'
  },
  'Пройден экспортный контроль Инчхон': {
    RU: 'Пройден экспортный контроль Инчхон',
    EN: 'Export clearance completed at Incheon'
  },
};

const PRODUCT_TRANSLATIONS: Record<string, { name: string; description: string; details: string[] }> = {
  'jp-kapital-denim': {
    name: 'Patchwork Bandana Denim Jacket',
    description: 'A masterpiece of Japanese streetwear from the premium Kapital Kountry line. Handcrafted in Kojima using traditional indigo dyeing with historic bandana patches in the Sashiko technique. Each item is unique and stamped with a serial number.',
    details: [
      '100% Japanese selvedge denim (14.2 oz)',
      'Unique custom indigo bandana patchwork elements',
      'Collectible vintage engraved copper buttons',
      'Handcrafted in Kojima, Okayama Prefecture, Japan',
      'Extreme limited edition drop #41'
    ]
  },
  'us-supreme-bogo': {
    name: 'Box Logo Heavyweight Hoodie',
    description: 'A timeless staple of street clothing from Supreme New York. Made from heavyweight crossgrain cotton fleece. Features high-density 3D embroidery of the iconic Box Logo on the center of the chest.',
    details: [
      'Heavyweight Canadian crossgrain fleece (450 gsm)',
      'Sturdy ribbed cuffs and side panels',
      'Signature jacquard Supreme neck label',
      'Acquired directly from the Supreme flagship on Lafayette St, NY',
      'Classic relaxed streetwear fit'
    ]
  },
  'it-stone-island-crinkle': {
    name: 'Garment Dyed Crinkle Reps NY',
    description: 'Lightweight water-resistant windbreaker jacket made from ultra-dense recycled nylon reps with a resin coating inside. Dyed using Stone Island\'s patented Garment Dyed formula with a PFC-free water repellent agent.',
    details: [
      'Econyl® Crinkle Reps (100% regenerated nylon)',
      'Detachable Stone Island compass badge on left sleeve',
      'Packable protective hood inside mock neck collar',
      'Two angled chest pockets with waterproof zippers',
      'Sourced from the Milanese flagship on Corso Venezia'
    ]
  },
  'fr-margiela-stitch': {
    name: 'Four-Stitch Heavy Cotton Tee',
    description: 'Heavy knit cotton tee in a signature sand dye from the Paris avant-garde house. The back features Margiela’s iconic four white stitches holding the brand label, replacing standard logos with anonymity.',
    details: [
      '100% long-staple Mako cotton (240 gsm)',
      'Signature four white stitches on the upper back',
      'Pre-washed for custom soft vintage texture',
      'Sourced from the Rue Saint-Honoré boutique in Paris',
      'Classic genderless silhouette with relaxed shoulders'
    ]
  },
  'kr-gentle-monster': {
    name: 'Heizer Avant-Garde Runway Sunglasses',
    description: 'Futuristic Heizer sunglasses from Seoul\'s most famous luxury eyeware label, Gentle Monster. This style boasts a flat-top silhouette with a thick premium acetate frame and Carl Zeiss protective lenses.',
    details: [
      'Premium natural cellulose acetate flat frame',
      'High-precision German Carl Zeiss lenses (Black Gradient)',
      'Collectible gold bullet temple rivets',
      'Acquired from the Hapjeong concept space in Seoul, Korea',
      'Includes custom leather holster case and card of authenticity'
    ]
  },
  'jp-cdg-play': {
    name: 'Red Heart Play Knit Cardigan',
    description: 'An iconic knitted cardigan of soft genuine wool designed by Rei Kawakubo. Features the iconic red heart applique on the chest designed by Polish artist Filip Pagowski. Finished with genuine mother-of-pearl buttons.',
    details: [
      '100% extrafine merino wool yarn',
      'Embroidered CDG Play double heart crest on chest',
      'Ribbed knit hem, collar, and genuine shell closures',
      'Sourced from Dover Street Market in Ginza, Tokyo',
      'Dry clean only to maintain premium luster'
    ]
  },
  'us-stussy-8ball': {
    name: '8-Ball Mohair Blend Cardigan',
    description: 'Heavy woven mohair blend cardigan featuring Stussy\'s iconic retro billiard \'8-Ball\' graphic jacquard knit on the back. Plush texture finished with custom tonal button closures.',
    details: [
      '30% mohair wool, 30% fine wool, 40% durable nylon backing',
      'Oversized jacquard 8-ball graphics on the back',
      'V-neck design with sturdy rib-knit collar and cuffs',
      'Sourced from the Stussy flagship boutique on La Brea, LA',
      'Highly breathable and plush silhouette'
    ]
  },
  'fr-jacquemus-shirt': {
    name: 'Le Chemise Bahia Overshirt',
    description: 'An elegant drape overshirt from French designer Simon Porte Jacquemus. Boasts a crinkle-linen blend texture with asymmetric wrap detail and fine pearloid hardware.',
    details: [
      '60% premium linen, 40% high-grade organic cotton weave',
      'Branded silver hardware with Jacquemus Paris engraving',
      'Minimalist angled front patch pocket details',
      'Sourced directly from the Avenue Montaigne flagship in Paris',
      'Perfect relaxed fit for tailoring combinations'
    ]
  },
  'kr-ader-piping': {
    name: 'Contrast Stitch Distressed Hoodie',
    description: 'Oversized hoodie with bright contrast stitching and raw edge distressing from Seoul\'s creative collective ADER Error. Features the signature blue block detail on back neck.',
    details: [
      'High-density Seoul crossgrain loopback cotton (480 gsm)',
      'Deconstructed stitch lines with raw-edge detailing',
      'Metal ADER plaque with brand foundation engraving',
      'Acquired at ADER Space flagship in Sinsa-dong, Seoul',
      'Distinctive Korean drop-shoulder silhouette'
    ]
  },
  'it-palm-angels': {
    name: 'Classic Gothic Logo Track Jacket',
    description: 'Fitted sporty track jacket with contrast side stripes on the sleeves and gothic Palm Angels text branding on the chest. Merges the West Coast street skater spirit with Italian luxury sportswear.',
    details: [
      '100% fine Italian performance knit polyester',
      'Contrast side striping details in cream white',
      'High-neck collar with silver lock zipper',
      'Sourced from verified distributor channels in Verona, Italy',
      'Classic street athletic slim-fit silhouette'
    ]
  },
  'kr-thisisneverthat': {
    name: 'Sherpa Fleece Utility Tech-Parka',
    description: 'Ultra-warm windproof technical parka styled in thick sherpa wool fleece. Features high-wear taslan nylon overlays on elbows and zip-collar for durability. Built-in windstopping backer.',
    details: [
      'Premium heavyweight high-pile sherpa fleece (510 gsm)',
      'Contrast nylon utility chest compartment with zip closures',
      'Tonal drawstring toggle closures at waist for heat trapping',
      'Sourced from high-street boutiques in Hongdae, Seoul',
      'High-density embroidered logo detailing'
    ]
  },
  'jp-evisu-selvedge': {
    name: 'Daicock Multi-Pocket Selvedge Jeans',
    description: 'Rare Japanese raw selvedge denim jeans designed by Hidehiko Yamane in Osaka. Features the iconic oversized Daicock print painted across multiple rear pockets in genuine indigo.',
    details: [
      '14.5 oz Osaka raw selvedge denim (unwashed rigid indigo)',
      'Signature colored selvedge ID stitch',
      'Individually hand-screened calligraphy seagull branding',
      'Premium buffalo leather patch with embossed God Ebisu',
      'Sourced from the Nipponbashi flagship, Osaka, Japan'
    ]
  }
};

const LANG_MAP: Record<string, Record<Language, string>> = {
  // top utility
  'top.import': { RU: 'WORLDWIDE DIRECT IMPORT / СЕЛЕКТИВНЫЙ БАЙИНГ', EN: 'WORLDWIDE DIRECT IMPORT / SELECTIVE SOURCING' },
  'top.drop': { RU: 'CURATED SELECTION DROP #41', EN: 'CURATED SELECTION DROP #41' },
  'top.free': { RU: 'FREE AIR-FREIGHT SHIPPING VIA PASSPORT10', EN: 'FREE AIR-FREIGHT SHIPPING VIA PASSPORT10' },
  'top.synchronized': { RU: '● FAST STOCK SYNCHRONIZED', EN: '● FAST STOCK SYNCHRONIZED' },

  // header
  'header.logo': { RU: 'PASSPORT // MERCH', EN: 'PASSPORT // MERCH' },
  'header.curr_region': { RU: 'SELECTIVE', EN: 'SELECTIVE' },
  'header.tab.catalog': { RU: 'Коллекция', EN: 'Collection' },
  'header.tab.logistics': { RU: 'Рейсы & Карго', EN: 'Flights & Cargo' },
  'header.tab.stylist': { RU: 'ИИ Стилист', EN: 'AI Stylist' },
  'header.cart_btn': { RU: 'Груз', EN: 'Cargo' },

  // banner
  'banner.badge': { RU: 'ПОСТАВКА ВОЗДУХОМ', EN: 'AIR-FREIGHT IMPORT' },
  'banner.sub': { RU: '• Напрямую из магазинов мира', EN: '• Direct from global boutiques' },
  'banner.title': { RU: 'Премиальный стритвир и одежда без наценок', EN: 'Premium streetwear and clothing without markups' },
  'banner.description': { RU: 'Выбирайте оригинальные лимитированные коллекции из главных модных хабов: Японии, США, Италии, Франции и Южной Кореи. Удобный таможенный учет, полное страхование груза и ИИ-стилист в вашем распоряжении.', EN: 'Browse authentic, highly limited drop files directly from leading fashion hubs: Japan, USA, Italy, France, and South Korea. Structured customs clearing, full cargo protection, and an advanced AI style model are fully integrated.' },
  'banner.stat.verif': { RU: 'ВЕРИФИКАЦИЯ', EN: 'VERIFICATION' },
  'banner.stat.speed': { RU: 'СКОРОСТЬ ДОСТАВКИ', EN: 'SHIPPING SPEED' },
  'banner.stat.speed_val': { RU: 'от 5 суток авиарейсом', EN: 'from 5 days via air flight' },
  'banner.stat.curated': { RU: 'КУРАТОРСКАЯ СЕЛЕКЦИЯ', EN: 'CURATED SELECTION' },

  // catalog
  'cat.filter_by_country': { RU: 'Разделение по странам импорта:', EN: 'Filter by import origin:' },
  'cat.all_countries': { RU: 'Весь мир', EN: 'Worldwide' },
  'cat.search_placeholder': { RU: 'Найти вещи или бренд...', EN: 'Search items or brand...' },
  'cat.brand_label': { RU: 'Бренд:', EN: 'Brand:' },
  'cat.all_brands': { RU: 'Все бренды', EN: 'All brands' },
  'cat.category_label': { RU: 'Категория:', EN: 'Category:' },
  'cat.all_categories': { RU: 'Все категории', EN: 'All categories' },
  'cat.reset_btn': { RU: 'Сбросить', EN: 'Reset' },
  'cat.filters_active': { RU: 'ФИЛЬТРЫ НЕ АКТИВНЫ', EN: 'FILTERS NOT ACTIVE' },
  'cat.no_items': { RU: 'Лоты не обнаружены', EN: 'No collection lots matched' },
  'cat.no_items_desc': { RU: 'К сожалению, у нас нет активных лотов, соответствующих этим жестким баинговым фильтрам. Измените параметры или напишите вашему ИИ-стилисту в боковой вкладке.', EN: 'Apologies, no matching cargo items found under the selected filters. Please adjust parameters or seek assistance from the AI style concierge.' },
  'cat.back_to_catalog': { RU: 'Вернуться ко всей коллекции', EN: 'Back to full collection' },

  // categories
  'cat.Outerwear': { RU: 'Верхняя одежда / Куртки', EN: 'Outerwear & Jackets' },
  'cat.Hoodies': { RU: 'Толстовки / Худи', EN: 'Hoodies & Sweatshirts' },
  'cat.T-Shirts': { RU: 'Футболки', EN: 'T-Shirts & Tops' },
  'cat.Accessories': { RU: 'Аксессуары', EN: 'Accessories' },
  'cat.Sneakers': { RU: 'Обувь', EN: 'Footwear & Sneakers' },

  // product card
  'card.quick_buy': { RU: 'Быстрый выкуп', EN: 'Quick Sourcing' },
  'card.info': { RU: 'ИНФО', EN: 'INFO' },

  // product modal
  'modal.import_country': { RU: 'Страна импорта', EN: 'Sourcing Hub' },
  'modal.orig_retail': { RU: 'Ориг. Ретейл', EN: 'Original Retail' },
  'modal.all_tariffs': { RU: 'Все тарифы включены', EN: 'All duties & fees included' },
  'modal.available_sizes': { RU: 'Доступные размеры:', EN: 'Available sizes:' },
  'modal.ai_fitting': { RU: 'Подобрать размер через ИИ', EN: 'Find size via AI' },
  'modal.specs_title': { RU: 'Спецификация выкупаемого лота:', EN: 'Sourced slot specification:' },
  'modal.pack_weight': { RU: 'Вес отправления', EN: 'Package mass' },
  'modal.standard': { RU: 'ЭТАЛОН', EN: 'STANDARD' },
  'modal.tariff_status': { RU: 'СТАТУС ТАРИФА', EN: 'TARIFF STATUS' },
  'modal.add_success': { RU: 'ДОБАВЛЕНО В КОРЗИНУ!', EN: 'ADDED TO CARGO!' },
  'modal.add_cta': { RU: 'В ГРУЗ КОРЗИНУ', EN: 'ADD TO CARGO' },
  'modal.select_size_cta': { RU: 'УКАЖИТЕ ВАШ РАЗМЕР', EN: 'CHOOSE YOUR SIZE' },
  'modal.ai_advice_btn': { RU: 'ИИ совет', EN: 'AI Council' },

  // AI stylist
  'stylist.preset_queries': { RU: 'Варианты запроса:', EN: 'Preset queries:' },
  'stylist.input_placeholder': { RU: 'Спросите стилиста (оверсайз худи, подбор размера, бренды Италии...)', EN: 'Ask the stylist (oversize hoodies, style concepts, Italian brands...)' },
  'stylist.loading': { RU: 'Поиск селекционных лотов, замер веса отправления...', EN: 'Locating curated pieces, computing package weight...' },
  'stylist.buy_size': { RU: 'КУПИТЬ', EN: 'BUY' },
  'stylist.terminal_desc': { RU: 'PASSPORT // BUYING & STYLE ASSISTANT', EN: 'PASSPORT // BUYING & STYLE ASSISTANT' },
  'stylist.terminal_badge': { RU: 'LIVE CUSTOMS COGNITIVE SELECTION', EN: 'LIVE CUSTOMS COGNITIVE SELECTION' },
  'stylist.greeting': {
    RU: 'Приветствуем в премиальном импорт-сервисе **PASSPORT**. Я ваш персональный ИИ-стилист и байер.\n\nЯ знаю каждый шов вещей из нашего селективного каталога (Япония, Корея, Италия, Франция, США). Расскажите о ваших предпочтениях по брендам, стилю или вашему росту/размерам — и я соберу для вас идеальный образ.',
    EN: 'Welcome to the **PASSPORT** premium sourcing system. I am your AI Style Assistant & Buyer.\n\nI am deeply familiar with every detailed specification of our select catalog drops (Japan, South Korea, Italy, France, USA). Tell me about your preferences regarding brands, silhouettes, or your height/body frame, and I will draft a custom curated look.'
  },
  'stylist.error': {
    RU: 'Извините, не удалось подключиться к таможенному ИИ-серверу для обработки запроса. Проверьте соединение или наличие ключа API в настройках Secrets компьютера.',
    EN: 'Apologies, we were unable to connect to our cognitive customs server to process this request. Please check your connectivity or secrets configuration.'
  },

  // Cart Drawer
  'cart.declarant_title': { RU: 'ТАМОЖЕННЫЙ ДЕКЛАРАНТ', EN: 'CUSTOMS DECLARANT' },
  'cart.empty_title': { RU: 'У вас нет задекларированных грузов', EN: 'No cargo items declared yet' },
  'cart.empty_desc': { RU: 'Каталог полон редчайших находок из стритвир-хабов Японии, США и Европы. Добавьте понравившиеся позиции в корзину для прохождения таможенного консолидатора.', EN: 'Our list is stacked with rare finds from Japanese, US, and EU street hubs. Add items to assemble your virtual shipping batch.' },
  'cart.keep_shopping': { RU: 'Продолжить шопинг', EN: 'Continue Shopping' },
  'cart.summary': { RU: 'СВОДНЫЙ МАНИФЕСТ КАРГО', EN: 'CARGO MANIFEST SUMMARY' },
  'cart.total_weight': { RU: 'Общая масса:', EN: 'Total weight:' },
  'cart.sourcing_hubs': { RU: 'Хабы выкупа:', EN: 'Sourcing hubs:' },
  'cart.billing_country': { RU: 'Страна вашего нахождения (Консолидация) *', EN: 'Shipping Destination (Consolidation) *' },
  'cart.consolidation_warning': { RU: 'Покупки будут совершены в разных бутиках ({sourcing}), но консолидированы в хабе **{country}**. Финальное отправление поедет на ваш адрес из хаба в **{country}**.', EN: 'Items will be sourced from different boutiques ({sourcing}) and consolidated at the main global hub in **{country}**. Your final parcel ships directly from **{country}** to your home.' },
  'cart.declarant_fio': { RU: 'ФИО Декларанта *', EN: 'Declarant Full Name *' },
  'cart.fio_placeholder': { RU: 'Иванов Иван Иванович', EN: 'John Doe' },
  'cart.phone': { RU: 'Контактный телефон (для СДЭК/Express) *', EN: 'Contact Phone Number (for delivery) *' },
  'cart.email': { RU: 'Электронная почта (фискальный чек) *', EN: 'Email Address (customs receipt) *' },
  'cart.city': { RU: 'Город получения *', EN: 'Destination City *' },
  'cart.address': { RU: 'Точный адрес доставки *', EN: 'Full Street Address *' },
  'cart.address_placeholder': { RU: 'Улица, дом, квартира / офис', EN: 'Street, building, apt / office' },
  'cart.promo': { RU: 'Секретный дипломатический промокод:', EN: 'Secret diplomatic promo code:' },
  'cart.promo_placeholder': { RU: 'Введите промокод', EN: 'Enter promo code' },
  'cart.promo_apply': { RU: 'Принять', EN: 'Apply' },
  'cart.subtotal': { RU: 'Стоимость вещей:', EN: 'Subtotal:' },
  'cart.promo_discount': { RU: 'Дипломатическая скидка:', EN: 'Promo Discount:' },
  'cart.freight_fee': { RU: 'Авиафрахт и сборы хабов:', EN: 'Air-freight & customs fees:' },
  'cart.total_pay': { RU: 'Итого к выкупу:', EN: 'Total to settle:' },
  'cart.processing': { RU: 'РЕГИСТРАЦИЯ ДЕКЛАРАЦИИ...', EN: 'DECLARING CARGO PIPELINE...' },
  'cart.submit_order': { RU: 'ПОДПИСАТЬ ТАМОЖЕННУЮ ДЕКЛАРАЦИЮ К ВЫКУПУ', EN: 'SUBMIT OFFICIAL CARGO DECLARATION' },
  'cart.order_success_badge': { RU: 'ДЕКЛАРАЦИЯ КАРГО ОДОБРЕНА', EN: 'CARGO DECLARATION APPROVED' },
  'cart.order_success_title': { RU: 'Груз консолидирован под {country}', EN: 'Cargo consolidated under {country}' },
  'cart.order_success_desc': { RU: 'Товары выкупаются в разных странах и досылаются на единый внутренний хаб в странe **{country}**, откуда осуществляется финальная отправка на ваш адрес.', EN: 'Your curated items are sourced from local boutiques and sent to a single international processing hub in **{country}**, before being dispatched straight to you.' },
  'cart.order_details': { RU: 'СПЕЦИФИКАЦИЯ ТАМОЖЕННОГО ОФОРМЛЕНИЯ', EN: 'CUSTOMS DETAILED SPECIFICATION' },
  'cart.order_region': { RU: 'Регион нахождения:', EN: 'Region context:' },
  'cart.order_mass': { RU: 'Общая масса груза:', EN: 'Total shipment mass:' },
  'cart.order_total_value': { RU: 'Финальная декларация:', EN: 'Declared valuation:' },
  'cart.tracking_num': { RU: 'ТАМОЖЕННЫЙ ТРЕК-НОМЕР КАРГО:', EN: 'CUSTOMS CARGO TRACKING NUMBER:' },
  'cart.tracking_desc': { RU: 'Вы можете вставить этот трек-номер в раздел «Рейсы & Карго» для проверки стадий авиафрахта в реальном времени.', EN: 'You can insert this unique tracking number in the "Flights & Cargo" tab to monitor transit flight stages in real time.' },
  'cart.receipt_btn': { RU: 'СКАЧАТЬ ФИСКАЛЬНЫЙ ЧЕК ТРАНЗИТА', EN: 'DOWNLOAD CUSTOMS INVOICE' },
  'cart.new_order_btn': { RU: 'СФОРМИРОВАТЬ НОВУЮ ДЕКЛАРАЦИЮ', EN: 'DECLARE ANOTHER BATCH' },
  'cart.required_fields_alert': { RU: 'Пожалуйста, заполните необходимые поля: ФИО, Телефон и Адрес', EN: 'Please complete all required cargo forms: Full Name, Phone, and Street Address.' },
  'cart.promo_alert': { RU: 'Промокод не найден. Попробуйте PASSPORT10', EN: 'Promo code not recognized. Try PASSPORT10' },

  // Logistics Hub
  'log.badge': { RU: 'ЦЕНТРАЛЬНЫЙ ОФИС ЛОГИСТИКИ PASSPORT-CARGO', EN: 'PASSPORT-CARGO GENERAL TRANSIT CONTROLLER' },
  'log.hubs_status': { RU: 'Текущий статус консолидационных хабов:', EN: 'Live Status of Consolidation Hubs:' },
  'log.status_terminal': { RU: 'ТЕРМИНАЛ', EN: 'TERMINAL' },
  'log.status_live_time': { RU: 'МЕСТНОЕ ВРЕМЯ ХАБА', EN: 'LOCAL HUB TIME' },
  'log.status_eta': { RU: 'СРОКИ ДОСТАВКИ', EN: 'ESTIMATED ETA' },
  'log.status_shipping_base': { RU: 'БАЗОВЫЙ ФРАХТ', EN: 'BASE RATE' },
  'log.view_goods_btn': { RU: 'Смотреть лоты', EN: 'Browse Lots' },
  'log.tracking_manifest': { RU: 'МОНИТОРИНГ МЕЖДУНАРОДНОГО ФРАХТА', EN: 'INTERNATIONAL CARGO TRACKING' },
  'log.tracking_desc': { RU: 'Введите ваш 12-значный таможенный номер декларации (например: KAZ-CARGO-548102) для визуализации радарных точек полета.', EN: 'Enter your custom 12-digit transit receipt number (e.g. KAZ-CARGO-548102) to overlay flight path data onto our telemetry radar.' },
  'log.tracking_placeholder': { RU: 'KAZ-CARGO-XXXXXX или RUS-CARGO-XXXXXX', EN: 'KAZ-CARGO-XXXXXX or RUS-CARGO-XXXXXX' },
  'log.tracking_btn': { RU: 'Найти рейс', EN: 'Query Flight' },
  'log.radar_offline': { RU: 'СПУТНИКОВОЕ ПОДКЛЮЧЕНИЕ НЕ АКТИВНО', EN: 'SATELLITE DOWNLINK STANDBY' },
  'log.radar_offline_desc': { RU: 'Введите действующий номер декларации выкупа выше. Поисковый маяк свяжется со службами Внуково-Карго и Шереметьево-Карго для трансляции геолокации.', EN: 'Provide a valid invoice lookup tag above. Our transponder beacon will connect with global air controllers to intercept live flight vectors.' },
  'log.radar_active': { RU: 'ТЕЛЕМЕТРИЯ ПОЛУЧЕНА • РЕЙС', EN: 'TELEMETRY SECURED • CARGO FLIGHT' },
  'log.radar_weight': { RU: 'ВЕС ГРУЗА', EN: 'CARGO NET MASS' },
  'log.radar_route': { RU: 'ТРАНЗИТНЫЙ МАРШРУТ', EN: 'TRANSIT CORRIDOR' },
  'log.status_cleared': { RU: 'ВЫПУСК РАЗРЕШЕН (ТАМОЖНЯ РФ)', EN: 'RELEASE AUTHORIZED (CUSTOMS)' },
  'log.status_cleared_sub': { RU: 'Все пошлины уплачены компанией. Передано курьеру.', EN: 'Duties pre-cleared by store. Dispatched to local courier.' },
  'log.status_sorting': { RU: 'СОРТИРОВКА В ХАБЕ', EN: 'SORTING IN EN-ROUTE HUB' },
  'log.status_sorting_sub': { RU: 'Посылка прибыла на консолидационную ленту.', EN: 'Parcel has loaded onto processing distribution lines.' },
  'log.status_inflight': { RU: 'В ВОЗДУХЕ (АВИА-ФРАХТ)', EN: 'IN DIRECT AIR TRANSIT' },
  'log.status_inflight_sub': { RU: 'Рейс летит над транзитными зонами.', EN: 'Transit cargo aircraft currently in deep air corridors.' },
  'log.status_sourcing': { RU: 'ВЫКУПЛЕН И СТРАХУЕТСЯ', EN: 'SOURCED & INSURED' },
  'log.status_sourcing_sub': { RU: 'Байер выкупил вещи в бутике, формируется накладная.', EN: 'Local buyer acquired items in country boutique. Packing.' },
  'log.route_map_title': { RU: 'ЛОГИСТИЧЕСКИЕ ТОЧКИ ПО МАРШРУТУ:', EN: 'TRANSIT SEQUENCE WAYPOINTS:' },
  'log.route_arrival': { RU: 'ВАШ ДОМ • АДРЕС ПОЛУЧЕНИЯ', EN: 'YOUR DESTINATION HOME ADDRESS' },
  'log.sim_laboratory': { RU: 'ЛАБОРАТОРИЯ ТРАНЗИТА ПАСПОРТ-КАРГО', EN: 'PASSPORT-CARGO TRANSIT LABORATORY' },
  'log.sim_title': { RU: 'Симулятор консолидированного импорта', EN: 'Consolidated Import Simulator' },
  'log.sim_desc': { RU: 'Как работает доставка, если вы заказываете брендированные вещи из разных стран одновременно? Выберите параметры ниже, чтобы увидеть карту физических перемещений и снижения пошлин.', EN: 'How does global routing work when ordering from multiple luxury boutiques simultaneously? Select parameters below to simulate flight vectors and duty calculations.' },
  'log.sim_step1': { RU: '1. Страна вашего нахождения (Точка доставки и финального вылета):', EN: '1. Shipping Destination Country (Consolidation Point):' },
  'log.sim_step2': { RU: '2. Бутики выкупа (Выберите откуда заказываете вещи):', EN: '2. Sourcing Boutiques (Select target origins):' },
  'log.sim_scheme': { RU: 'СХЕМА ОДНОВРЕМЕННОЙ КОНСОЛИДАЦИИ', EN: 'CONSOLIDATED SOURCING PIPELINE' },
  'log.sim_location_label': { RU: 'ЛОКАЦИЯ:', EN: 'DESTINATION:' },
  'log.sim_step1_title': { RU: 'ВЫКУП В СТРАНАХ ТРАНЗИТА', EN: 'BOUTIQUE ACQUISITION' },
  'log.sim_step1_desc': { RU: 'Наши байеры одновременно скупают позиции в бутиках: <strong>{sourcing}</strong>. Вещи страхуются и отправляются местным авиафрахтом.', EN: 'Our buyers acquire items simultaneously across physical boutiques in <strong>{sourcing}</strong>. Parcels are secured with immediate transport.' },
  'log.sim_step2_title': { RU: 'HAБ КОНСОЛИДАЦИИ В {country}', EN: 'CONSOLIDATION Processing HUB in {country}' },
  'log.sim_step2_desc': { RU: 'Все коробки поступают на наш единый логистический терминал в **{country}**. Проводится переупаковка в общую защитную тару, формируется одна накладная, что **исключает начисление раздельных пошлин**.', EN: 'All consignments fly to our unified sorting and staging hub in **{country}**. Over-packing is completed, combining parcels into one cargo invoice which **completely bypasses multiple customs duties**.' },
  'log.sim_step3_title': { RU: 'ЕДИНАЯ ОТПРАВКА ИЗ {country}', EN: 'INTEGRATED SHIPPING DISPATCH FROM {country}' },
  'log.sim_step3_desc': { RU: 'Единая посылка отправляется **из {country}** прямо к вам домой курьерской службой СДЭК/Express. Время в пути по вашей стране составит всего 1-3 дня с момента прибытия на внутренний склад!', EN: 'A single compiled parcel travels **from {country}** straight to your home address via CDEK/Express courier. Delivery within your region takes only 1-3 days from hub arrival!' },
  'log.sim_fee_separate': { RU: 'ПОШЛИНА ЗА ОТДЕЛЬНЫЙ ИМПОРТ:', EN: 'DUTIES WITHOUT CONSOLIDATION:' },
  'log.sim_fee_separate_sub': { RU: ' (за каждую страну)', EN: ' (per country)' },
  'log.sim_fee_consolidated': { RU: 'ПОШЛИНА ПРИ КОНСОЛИДАЦИИ:', EN: 'CONSOLIDATION PROMO PRICE:' },
  'log.sim_fee_consolidated_val': { RU: '0 ₽ (Доставка из {country} как внутренний вылет!)', EN: '0 ₽ (Shipped within {country} as domestic cargo!)' },
  'log.sim_disclaim': { RU: '* Наш метод снижает расходы на доставку до 45% по сравнению с раздельными посылками от разных курьеров.', EN: '* Our custom logic reduces shipping fees by up to 45% compared to separate third-party priority shipments.' },

  // Footer Values
  'foot.import_title': { RU: 'ИМПОРТ ИЗ БУТИКОВ', EN: 'DIRECTORY SOURCING' },
  'foot.import_desc': { RU: 'Наши сотрудники лично выкупают лоты в оригинальных магазинах Токио, Сеула, Милана, Парижа и Нью-Йорка, обеспечивая идеальное качество.', EN: 'Our localized agents physically source drops in Tokyo, Seoul, Milan, Paris, and NY boutiques for pristine quality.' },
  'foot.warranty_title': { RU: 'ГАРАНТИЯ ОРИГИНАЛЬНОСТИ', EN: 'GUARANTEED AUTHENTICITY' },
  'foot.warranty_desc': { RU: 'Каждый предмет проходит двухфакторную экспертизу подлинности. Посылка поставляется со всеми заводскими бирками и чеками выкупа.', EN: 'Every item passes double-factor verification metrics. Parcels include original store labels and buy-receipt proof.' },
  'foot.markup_title': { RU: 'ПРОЗРАЧНАЯ НАЦЕНКА', EN: 'TRANSPARENT MARKUP' },
  'foot.markup_desc': { RU: 'Никаких скрытых платежей. Курс обмена фиксируется на момент регистрации вашей таможенной декларации в корзине.', EN: 'No hidden surcharges. Exchange rates lock exactly upon checking out your custom cargo declaration list.' },
  'foot.stylist_title': { RU: 'ИИ-СТИЛИСТ', EN: 'AI COGNITIVE CONCIERGE' },
  'foot.stylist_desc': { RU: 'Принимайте решения с помощью нашей экспертной модели, знающей специфику посадки оверсайз кроя и особенности ухода за премиальной шерстью.', EN: 'Enlist advanced intelligence to select proper oversize cuts or research heritage textile care protocols.' },
  'foot.rights': { RU: '© 2026 PASSPORT // IMPORTED CLOTHING STORE. ALL RIGHTS RESERVED.', EN: '© 2026 PASSPORT // IMPORTED CLOTHING STORE. ALL RIGHTS RESERVED.' },
  'foot.links.tariffs': { RU: 'КОНБИНИ-ТАРИФЫ', EN: 'CONBINI RATES' },
  'foot.links.import': { RU: 'ДОГОВОР ИМПОРТА', EN: 'IMPORT TREATY' },
  'foot.links.protection': { RU: 'ЗАЩИТА ГРУЗА', EN: 'CARGO PROTECTION' }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('passport_language_preference');
      return (saved === 'EN' || saved === 'RU') ? (saved as Language) : 'RU';
    } catch {
      return 'RU';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('passport_language_preference', lang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: string, variables?: Record<string, string>): string => {
    const entry = LANG_MAP[key];
    if (!entry) {
      return key; // fallback
    }
    let val = entry[language] || entry['RU'] || key;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }

    return val;
  };

  const tCountry = (name: string): string => {
    const entry = COUNTRY_MAP[name];
    if (!entry) return name;
    return entry[language] || entry['RU'] || name;
  };

  const tCity = (name: string): string => {
    const entry = CITY_MAP[name];
    if (!entry) return name;
    return entry[language] || entry['RU'] || name;
  };

  const tCargoStatus = (status: string): string => {
    const entry = CARGO_STATUS_MAP[status];
    if (!entry) return status;
    return entry[language] || entry['RU'] || status;
  };

  const tDelivery = (days: string): string => {
    if (language === 'EN') {
      return days.replace(/дней/g, 'days').replace(/суток/g, 'days');
    }
    return days;
  };

  const tProduct = (product: any) => {
    if (language === 'EN' && PRODUCT_TRANSLATIONS[product.id]) {
      return {
        name: PRODUCT_TRANSLATIONS[product.id].name,
        description: PRODUCT_TRANSLATIONS[product.id].description,
        details: PRODUCT_TRANSLATIONS[product.id].details,
      };
    }
    return {
      name: product.name,
      description: product.description,
      details: product.details,
    };
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tCountry, tCity, tCargoStatus, tDelivery, tProduct }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
