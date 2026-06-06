import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// We can load products directly to teach the AI what's in the catalog
import { PRODUCTS } from "./src/data";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const COUNTRY_MAP_EN: Record<string, string> = {
  "Япония": "Japan",
  "США": "USA",
  "Италия": "Italy",
  "Франция": "France",
  "Южная Корея": "South Korea"
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

// 1. API Route for styling and size advice
app.post("/api/style-assistant", async (req, res) => {
  try {
    const { messages, selectedProductContext, language } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Невалидный формат истории сообщений" });
    }

    if (!ai) {
      // Fallback response if API key is not configured yet
      if (language === "EN") {
        return res.json({
          text: "Hello! Apologies, I am currently running in showroom (simulation) mode because the GEMINI_API_KEY has not yet been declared in your container secrets.\n\nHowever, I can highly recommend our premier sourcing pieces: Japan's elusive **Kapital Kountry**, Italy's core **Stone Island**, or France's elegant **Maison Margiela**! Once your API key is configured, we can engage in deep interactive conversations about your perfect sizing and styling.",
        });
      }
      return res.json({
        text: "Привет! Извините, я нахожусь в демонстрационном режиме, так как ключ GEMINI_API_KEY пока не настроен в разделе Secrets. \n\nНо я могу порекомендовать вам наши топовые бренды: **Kapital Kountry** из Японии, **Stone Island** из Италии или **Maison Margiela** из Франции! Если вы настроите ключ, я смогу вести с вами полноценный интераквый диалог о стиле.",
      });
    }

    const isEn = language === "EN";

    // Format products catalog into a structured markdown text block for the system prompt
    const catalogSummary = PRODUCTS.map((p) => {
      if (isEn) {
        const en = PRODUCT_TRANSLATIONS[p.id];
        const name = en ? en.name : p.name;
        const desc = en ? en.description : p.description;
        const details = en ? en.details.join(", ") : p.details.join(", ");
        const countryEN = COUNTRY_MAP_EN[p.countryName] || p.countryName;
        return `- [ID: ${p.id}] ${p.brand} - ${name} (${p.category} from country ${countryEN} ${p.countryFlag}). Price: ${p.price.toLocaleString("ru-RU")} RUB. Original value: ${p.originalPrice}. In stock sizes: ${p.sizes.join(", ")}. Description: ${desc}. Key Details: ${details}`;
      }
      return `- [ID: ${p.id}] ${p.brand} - ${p.name} (${p.category} из страны ${p.countryName} ${p.countryFlag}). Цена: ${p.price.toLocaleString("ru-RU")} руб. Оригинальная стоимость: ${p.originalPrice}. Размеры в наличии: ${p.sizes.join(", ")}. Описание: ${p.description}`;
    }).join("\n\n");

    const systemInstruction = isEn ? `
You are the elite "PASSPORT Stylist", a high-end personal stylist, fit expert, and luxury buyer for the "PASSPORT" concept store.
Your goal is to guide clients in selecting streetwear, building perfect outfits, answering size queries, detailing fabric/material specifications, and explaining the modern culture of street fashion from our source regions: Japan, USA, Italy, France, and South Korea.

Communication Protocols:
1. Be extremely polite, professional, and speak fluent English. Provide high-end boutique customer service. Represent the brand with absolute authority.
2. Deliver deep, expert-level consulting. If the user asks about a brand (e.g. Kapital, Stone Island, ADER Error), share unique insights on their design philosophy, heritage, or aesthetic background.
3. Reference ONLY the items listed in the PRODUCT CATALOG below. Do not conjure items that are not in our list! Recommend specific options with their exact brand/name and sizes available.
4. Provide precise sizing help based on weight, height, and fit silhouette (e.g., recommend sizing up or down depending on the relaxed/oversized drape of ADER Error and Supreme, versus the slim profile of Palm Angels).
5. If the client asks about shipping, guarantee that we source directly from physical boutiques in Tokyo, Milan, Seoul, Paris, and Los Angeles. Items arrive in 5 to 14 days en route.
6. When referencing products, ALWAYS include their ID in square brackets, e.g., "[jp-kapital-denim]" or "[us-supreme-bogo]", so the client UI can automatically render matching card previews under your text! This is CRITICAL.

Available catalog of products to recommend (RECOMMEND ONLY FROM THIS LIST):
${catalogSummary}

${selectedProductContext ? `Context: The user is currently viewing the item: "${selectedProductContext}". Begin of address this item first where appropriate.` : ""}
    ` : `
Вы — "PASSPORT Stylist", ультра-премиальный личный стилист и байер для концепт-стора уличной моды "PASSPORT". 
Ваша задача — помогать клиентам подбирать одежду, собирать образы (outfits), детально отвечать на вопросы о размерах, брендах, качестве материалов и культуре стритвира различных стран (Японии, США, Италии, Франции, Южной Кореи).

Правила общения:
1. Будьте вежливы, воспитаны, говорите на грамотном русском языке. Представляйте высокий стандарт обслуживания бутиков.
2. Дайте экспертные советы. Если пользователь спрашивает про бренд (например Kapital, Stone Island, ADER Error), расскажите интересную деталь об их эстетике или происхождении.
3. Четко ориентируйтесь на имеющийся КАТАЛОГ ТОВАРОВ ниже. Не придумывайте вымышленные товары, которых нет в каталоге! Ссылайтесь именно на наши товары, предлагая их по именам.
4. Вы можете помогать подбирать размер по росту или комплекции, ориентируясь на описание кроя (например, оверсайз у ADER Error и Supreme, суженный приталенный силуэт у Palm Angels).
5. Если клиент интересуется доставкой, напоминайте, что товары везутся напрямую из оригинальных бутиков (Токио, Милана, Сеула, Парижа, Лос-Анджелеса) со скоростью от 5 до 14 дней в зависимости от удаленности хаба.
6. При упоминании товаров обязательно прикрепляйте их ID в квадратных скобках, например "[jp-kapital-denim]" или "[us-supreme-bogo]", чтобы интерфейс чата сгенерировал превью-карточки.

Доступный сейчас в бутике каталог товаров (строго рекомендуйте ТОЛЬКО ИХ):
${catalogSummary}

${selectedProductContext ? `Контекст: Пользователь в данный момент просматривает или выбрал товар: "${selectedProductContext}". Начните диалог или упомяните этот товар в первую очередь, если это уместно.` : ""}
    `;

    // Map message roles and compile chat history
    // Since the client uses 'user'/'model', we can convert that into standard contents structure.
    const formattedContents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    // Generate content using gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      },
    });

    const reply = response.text || "Извините, не удалось сформировать ответ.";
    res.json({ text: reply });
  } catch (error: any) {
    console.error("Style assistant API error:", error);
    res.status(500).json({ error: error.message || "Ошибка сервера при генерации ответа" });
  }
});

// 2. Serve Vite App inside the express container
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server setup with Vite
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware loaded.");
  } else {
    // Production statics
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static assets from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PASSPORT full-stack application is running on port ${PORT}`);
  });
}

startServer();
