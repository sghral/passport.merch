import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Bot, User, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, Message } from '../types';
import { PRODUCTS } from '../data';
import { useLanguage } from './LanguageContext';

interface AiStylistProps {
  selectedProductContext: Product | null;
  onClearContext: () => void;
  onOpenProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product, size: string) => void;
}

const PRESETS = [
  { label: '🎌 Японская эстетика', query: 'Что у вас есть из премиальной Японии и какая у этих брендов философия?' },
  { label: '📐 Помощь с размерами', query: 'Как выбрать размер у оверсайз худи ADER Error и Supreme? На рост 180 см какой подойдет?' },
  { label: '🧥 Эксклюзивная Италия', query: 'Расскажи про технологичные куртки Stone Island, которые есть в наличии' },
  { label: '🔥 Собери полноценный образ', query: 'Собери мне стильный летний стритвир-лук из вещей разных стран в каталоге' },
];

export default function AiStylist({
  selectedProductContext,
  onClearContext,
  onOpenProduct,
  onQuickAddToCart,
}: AiStylistProps) {
  const { language, tCountry, tProduct } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: '',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync greeting when language changes or initializes
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          role: 'model',
          content: language === 'EN'
            ? 'Welcome to the premium **PASSPORT** sourcing concierge. I am your personal AI Stylist and boutique advisor.\n\nI know every single thread of our curations from Japan, South Korea, Italy, France, and the USA. Tell me about your brand interests, sizing questions, or desired fits — and I will suggest the ultimate localized streetwear combination for you.'
            : 'Приветствуем в премиальном импорт-сервисе **PASSPORT**. Я ваш персональный ИИ-стилист и байер.\n\nЯ знаю каждый шов вещей из нашего селективного каталога (Япония, Корея, Италия, Франция, США). Расскажите о ваших предпочтениях по брендам, стилю или вашему росту/размерам — и я соберу для вас идеальный образ.',
        }
      ]);
    }
  }, [language]);

  const activePresets = language === 'EN' ? [
    { label: '🎌 Japanese Aesthetic', query: 'What items do we have from premium Japan and what is their brand philosophy?' },
    { label: '📐 Size Guidance', query: 'How should I choose sizing for oversized hoodies like ADER Error and Supreme? What fits height 180cm?' },
    { label: '🧥 Tech-Wear Italy', query: 'Tell me about the high-performance Stone Island jackets available in stock' },
    { label: '🔥 Assemble Outfit', query: 'Build me a styling multi-country streetwear outfit from our catalog' },
  ] : PRESETS;

  // Trigger inquiry automatically if a context product is injected
  useEffect(() => {
    if (selectedProductContext) {
      const initQuery = language === 'EN'
        ? `Hello! Tell me in detail about ${selectedProductContext.brand} "${selectedProductContext.name}". How does this item fit, what is the textile craftsmanship like, and what would you recommend pairing it with from our collection?`
        : `Привет! Расскажи подробнее про ${selectedProductContext.brand} "${selectedProductContext.name}". Как сидит эта вещь, каково качество материалов и с чем ее посоветуешь носить из нашего каталога?`;
      setInputValue('');
      handleSendMessage(initQuery);
      onClearContext(); // clear so we don't repeat loop if user changes tab
    }
  }, [selectedProductContext, language]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputValue;
    if (!prompt.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/style-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].filter(m => m.content), // filter empty greetings
          selectedProductContext: selectedProductContext?.name || null,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сервера при генерации ответа');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: language === 'EN'
            ? 'Apologies, we could not connect to the global sourcing AI server to process your request. Please confirm your internet connection and verify that your GEMINI_API_KEY has been declared in container secrets.'
            : 'Извините, не удалось подключиться к таможенному ИИ-серверу для обработки запроса. Проверьте соединение или наличие ключа API в настройках Secrets компьютера.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Extract bracket products [id-name] or [id]
  const parseReferencedProducts = (text: string) => {
    const referenced: Product[] = [];
    const matches = text.match(/\[([A-Za-z0-9\-]+)\]/g);
    
    if (matches) {
      matches.forEach((m) => {
        const id = m.replace(/[\[\]]/g, '');
        const prod = PRODUCTS.find((p) => p.id === id);
        if (prod && !referenced.some((r) => r.id === prod.id)) {
          referenced.push(prod);
        }
      });
    }
    return referenced;
  };

  return (
    <div id="ai-stylist-terminal" className="bg-white text-black border-4 border-[#1a1a1a] p-4 sm:p-6 flex flex-col h-[550px] sm:h-[650px] font-sans rounded-none shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] text-left">
      
      {/* Terminal Title */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-black mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#ff4d4d] border border-black rounded-none animate-pulse" />
          <span className="text-xs font-mono font-black tracking-widest uppercase text-black">PASSPORT // BUYING & STYLE ASSISTANT</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono bg-[#ffdd00] border-2 border-black px-2.5 py-1 text-black font-extrabold shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
          <Bot size={11} className="stroke-[2.5]" />
          <span>LIVE CUSTOMS COGNITIVE SELECTION</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 scrollbar-thin">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const referencedProds = !isUser ? parseReferencedProducts(msg.content) : [];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Icon avatar */}
              {!isUser && (
                <div className="p-2 bg-[#ffdd00] border-2 border-black text-black shrink-0 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                  <Bot size={15} className="stroke-[2.5]" />
                </div>
              )}

              {/* Message box */}
              <div className="max-w-[85%] flex flex-col space-y-3">
                <div className={`p-4 text-xs sm:text-sm leading-relaxed border-2 border-black shadow-[3px_3px_0px_rgba(26,26,26,1)] ${
                  isUser 
                    ? 'bg-[#eefaff] text-black rounded-none ml-auto' 
                    : 'bg-white text-black rounded-none'
                }`}>
                  {/* Process basic custom styling tags for display */}
                  <div className="space-y-1.5 whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, lidx) => {
                      return (
                        <p key={lidx} className="leading-relaxed">
                          {line.startsWith('- ') ? (
                            <span className="inline-flex gap-1.5 items-start">
                              <span className="text-black font-black mt-1">■</span>
                              <span>{line.substring(2)}</span>
                            </span>
                          ) : (
                            line
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Grounded Rich Product Recommendations inside the Chat! */}
                {referencedProds.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 self-start w-full">
                    {referencedProds.map((prod) => (
                      <div
                        key={prod.id}
                        id={`chat-ref-card-${prod.id}`}
                        className="bg-white border-2 border-black p-3 flex gap-3 transition-all hover:bg-[#fafaf9] rounded-none shadow-[3px_3px_0px_rgba(26,26,26,1)]"
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={prod.images[0]}
                          alt={tProduct(prod).name}
                          className="w-12 h-16 object-cover bg-neutral-100 border border-black/10 shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block truncate max-w-[80px] font-bold">
                                {prod.brand}
                              </span>
                              <span className="text-[10px] shrink-0 font-mono font-black bg-[#ffdd00] px-1 border border-black">
                                {prod.price.toLocaleString('ru-RU')} ₽
                              </span>
                            </div>
                            <h4 className="text-[11px] font-black text-black tracking-tight mt-1 truncate uppercase">
                              {tProduct(prod).name}
                            </h4>
                            <p className="text-[9px] font-mono text-neutral-600 font-bold mt-0.5">
                              {prod.countryFlag} {tCountry(prod.countryName)} HUB
                            </p>
                          </div>

                          <div className="flex gap-2 mt-2 border-t border-dashed border-black pt-2">
                            <button
                              id={`btn-chat-view-${prod.id}`}
                              onClick={() => onOpenProduct(prod)}
                              className="text-[9px] font-mono uppercase font-black text-black underline hover:text-[#ffdd00] flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>{language === 'EN' ? 'INFO' : 'ИНФО'}</span>
                              <ArrowRight size={8} />
                            </button>
                            <span className="text-neutral-300 text-[10px]">|</span>
                            <button
                              id={`btn-chat-add-${prod.id}`}
                              onClick={() => onQuickAddToCart(prod, prod.sizes[0])}
                              className="text-[9px] font-mono uppercase font-black text-black hover:bg-[#ffdd00] border border-black px-1.5 py-0.5 bg-neutral-50 flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_rgba(0,0,0,1)] active:shadow-none"
                            >
                              <ShoppingBag size={8} />
                              <span>{language === 'EN' ? `BUY (${prod.sizes[0]})` : `КУПИТЬ (${prod.sizes[0]})`}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User avatar */}
              {isUser && (
                <div className="p-2 bg-black border-2 border-black text-white shrink-0 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                  <User size={15} />
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            id="chat-loading-bubble"
            className="flex gap-3 items-start justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="p-2 bg-[#ffdd00] border-2 border-black text-black shrink-0">
              <Bot size={15} className="stroke-[2.5]" />
            </div>
            <div className="bg-white text-black border-2 border-black p-4 text-xs font-mono font-bold flex items-center gap-2 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <RefreshCw size={12} className="animate-spin text-black" />
              <span>{language === 'EN' ? 'Searching selective lots, checking shipment weights...' : 'Поиск селекционных лотов, замер веса отправления...'}</span>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Preset Suggestions Row */}
      {messages.length === 1 && (
        <div className="mt-4 shrink-0">
          <p className="text-[10px] font-mono text-black uppercase tracking-widest font-black mb-2 flex items-center gap-1">
            <Sparkles size={11} className="text-[#ff9900]" />
            <span>{language === 'EN' ? 'Suggested Queries:' : 'Варианты запроса:'}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {activePresets.map((p, idx) => (
              <button
                key={idx}
                id={`btn-preset-query-${idx}`}
                onClick={() => handleSendMessage(p.query)}
                className="text-[11px] bg-white hover:bg-[#ffdd00] border-2 border-black text-black font-mono font-bold px-3 py-2 rounded-none transition-colors text-left cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[1px]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form area */}
      <div className="mt-4 border-t-2 border-black pt-4 flex gap-2 shrink-0">
        <input
          id="input-ai-stylist-chat"
          type="text"
          placeholder={language === 'EN' ? 'Ask the boutique stylist (sizing fit, brand origins, outfit pairings...)' : 'Спросите стилиста (оверсайз худи, подбор размера, бренды Италии...)'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          disabled={loading}
          className="flex-1 bg-white border-2 border-black focus:bg-[#eefaff] px-4 py-3 text-xs sm:text-sm text-black font-bold font-mono focus:outline-none placeholder-neutral-400 rounded-none shadow-sm"
        />
        <button
          id="btn-send-ai-stylist-chat"
          onClick={() => handleSendMessage()}
          disabled={loading || !inputValue.trim()}
          className="bg-[#ffdd00] hover:bg-yellow-400 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-300 disabled:shadow-none border-2 border-black text-black font-mono font-black px-5 py-3 flex items-center justify-center transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
