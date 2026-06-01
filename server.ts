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

// 1. API Route for styling and size advice
app.post("/api/style-assistant", async (req, res) => {
  try {
    const { messages, selectedProductContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Невалидный формат истории сообщений" });
    }

    if (!ai) {
      // Fallback response if API key is not configured yet
      return res.json({
        text: "Привет! Извините, я нахожусь в демонстрационном режиме, так как ключ GEMINI_API_KEY пока не настроен в разделе Secrets. \n\nНо я могу порекомендовать вам наши топовые бренды: **Kapital Kountry** из Японии, **Stone Island** из Италии или **Maison Margiela** из Франции! Если вы настроите ключ, я смогу вести с вами полноценный интераквый диалог о стиле.",
      });
    }

    // Format products catalog into a structured markdown text block for the system prompt
    const catalogSummary = PRODUCTS.map((p) => {
      return `- [ID: ${p.id}] ${p.brand} - ${p.name} (${p.category} из страны ${p.countryName} ${p.countryFlag}). Цена: ${p.price.toLocaleString("ru-RU")} руб. Оригинальная стоимость: ${p.originalPrice}. Размеры в наличии: ${p.sizes.join(", ")}. Описание: ${p.description}`;
    }).join("\n\n");

    const systemInstruction = `
Вы — "PASSPORT Stylist", ультра-премиальный личный стилист и байер для концепт-стора уличной моды "PASSPORT". 
Ваша задача — помогать клиентам подбирать одежду, собирать образы (outfits), детально отвечать на вопросы о размерах, брендах, качестве материалов и культуре стритвира различных стран (Японии, США, Италии, Франции, Южной Кореи).

Правила общения:
1. Будьте вежливы, воспитаны, говорите на грамотном русском языке. Представляйте высокий стандарт обслуживания бутиков.
2. Дайте экспертные советы. Если пользователь спрашивает про бренд (например Kapital, Stone Island, ADER Error), расскажите интересную деталь об их эстетике или происхождении.
3. Четко ориентируйтесь на имеющийся КАТАЛОГ ТОВАРОВ ниже. Не придумывайте вымышленные товары, которых нет в каталоге! Ссылайтесь именно на наши товары, предлагая их по именам.
4. Вы можете помогать подбирать размер по росту или комплекции, ориентируясь на описание кроя (например, оверсайз у ADER Error и Supreme, суженный приталенный силуэт у Palm Angels).
5. Если клиент интересуется доставкой, напоминайте, что товары везутся напрямую из оригинальных бутиков (Токио, Милана, Сеула, Парижа, Лос-Анджелеса) со скоростью от 5 до 14 дней в зависимости от удаленности хаба.

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
