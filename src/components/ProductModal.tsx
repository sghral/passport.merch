import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Globe, Scale, ShieldCheck, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
  onConsultStylist: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onAddToCart, onConsultStylist }: ProductModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  // Reset states on product change
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(null);
    setIsAdded(false);
  }, [product]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCartSubmit = () => {
    if (!selectedSize) {
      // Pick first size as convenience or trigger visual bounce
      return;
    }
    onAddToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          id="modal-backdrop"
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          id={`expanded-product-modal-${product.id}`}
          className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] overflow-y-auto flex flex-col md:grid md:grid-cols-12 rounded-none z-10"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        >
          {/* Close Button */}
          <button
            id="close-modal-x"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 bg-[#ffdd00] hover:bg-[#1a1a1a] text-black hover:text-white p-2.5 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>

          {/* Left Column: Media Stage (Grid cols 12 spans 6 on desktop) */}
          <div className="md:col-span-6 lg:col-span-7 bg-neutral-100 relative flex flex-col justify-center h-[350px] sm:h-[450px] md:h-full min-h-[350px] border-b-2 md:border-b-0 md:border-r-2 border-black">
            {/* Carousel display */}
            <div className="relative w-full h-full overflow-hidden">
              <img
                id="modal-active-image animate-fade"
                referrerPolicy="no-referrer"
                src={product.images[activeImageIndex]}
                alt={`${product.name} active`}
                className="w-full h-full object-cover select-none"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    id="btn-carousel-prev"
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#ffdd00] hover:bg-black text-black hover:text-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
                  >
                    <ChevronLeft size={18} className="stroke-[2.5]" />
                  </button>
                  <button
                    id="btn-carousel-next"
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#ffdd00] hover:bg-black text-black hover:text-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
                  >
                    <ChevronRight size={18} className="stroke-[2.5]" />
                  </button>
                </>
              )}
            </div>

            {/* Pagination Indicators */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-white/90 px-3 py-1.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-3.5 h-3.5 border border-black transition-all rounded-none ${
                      activeImageIndex === i ? 'bg-[#ffdd00] scale-110' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Spec Sheet / Details (Spans 6 on desktop) */}
          <div className="md:col-span-6 lg:col-span-15 p-6 sm:p-8 flex flex-col justify-between h-full bg-white font-sans max-h-full overflow-y-auto">
            <div className="mt-2 text-left">
              {/* HUB & Country Stamp */}
              <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{product.countryFlag}</span>
                  <div>
                    <p className="text-[10px] font-mono leading-none text-neutral-400 uppercase tracking-widest font-extrabold">Страна импорта</p>
                    <p className="text-xs font-mono font-black uppercase text-[#1a1a1a] mt-1">{product.countryName} HUB</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono leading-none text-neutral-400 uppercase tracking-widest font-extrabold">Ориг. Ретейл</p>
                  <p className="text-xs font-mono text-black font-black mt-1 bg-[#f4f4f4] border border-black px-2 py-0.5">{product.originalPrice}</p>
                </div>
              </div>

              {/* Brand and Item Title */}
              <p className="text-xs font-mono text-neutral-500 tracking-widest uppercase font-black">
                {product.brand}
              </p>
              <h2 id="modal-product-title" className="text-xl sm:text-2xl font-black tracking-tight uppercase text-neutral-900 mt-1.5">
                {product.name}
              </h2>

              {/* Price Container */}
              <div className="flex items-baseline gap-2 mt-3 mb-5">
                <span className="text-2xl font-mono font-black text-neutral-900 bg-[#ffdd00] px-3 py-1 border-2 border-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-xs font-mono text-neutral-500 font-extrabold">Все тарифы включены</span>
              </div>

              {/* Description */}
              <div className="text-sm text-neutral-700 leading-relaxed space-y-2 mb-6">
                <p>{product.description}</p>
              </div>

              {/* Sizeguide Grid */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-gray-900 uppercase tracking-widest font-black">Доступные размеры:</span>
                  <button
                    id="btn-ai-consult-inline"
                    onClick={() => onConsultStylist(product)}
                    className="flex items-center gap-1 text-[11px] font-mono text-black underline underline-offset-2 hover:bg-[#ffdd00] px-1.5 py-0.5 border border-black font-bold tracking-wider transition-colors"
                  >
                    <Sparkles size={12} className="text-indigo-600" />
                    <span>Подобрать размер через ИИ</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      id={`modal-size-select-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-xs font-mono border-2 transition-all font-black rounded-none ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-black text-gray-800 bg-[#f4f4f4] hover:bg-[#ffdd00] hover:text-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom specs checklist */}
              <div className="bg-[#f4f4f4] border-2 border-black p-4 mb-6 rounded-none">
                <p className="text-[10px] font-mono text-[#1a1a1a] uppercase tracking-widest font-black mb-3 border-b border-black/10 pb-1.5">Спецификация выкупаемого лота:</p>
                <div className="space-y-2.5 text-left">
                  {product.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-800 font-medium">
                      <span className="text-[#1a1a1a] font-bold mt-0.5 animate-pulse">■</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Foot parameters */}
            <div className="space-y-4">
              {/* Import specifications */}
              <div className="grid grid-cols-3 gap-2 border-t-2 border-b-2 border-black py-4 text-center bg-[#f4f4f4]">
                <div className="bg-white border-2 border-black p-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center">
                  <p className="text-[8px] font-mono uppercase text-neutral-400 font-extrabold leading-tight">Вес отправления</p>
                  <div className="flex items-center justify-center gap-1 text-xs font-mono font-black text-neutral-950 mt-1">
                    <Scale size={11} />
                    <span>{product.weightKg} кг</span>
                  </div>
                </div>
                <div className="bg-white border-2 border-black p-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center">
                  <p className="text-[8px] font-mono uppercase text-neutral-400 font-extrabold leading-tight">ЭТАЛОН</p>
                  <div className="flex items-center justify-center gap-0.5 text-xs font-mono font-black text-neutral-950 mt-1">
                    <ShieldCheck size={11} className="text-emerald-500" />
                    <span>Original</span>
                  </div>
                </div>
                <div className="bg-white border-2 border-black p-2 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center">
                  <p className="text-[8px] font-mono uppercase text-neutral-400 font-extrabold leading-tight">СТАТУС ТАРИФА</p>
                  <div className="flex items-center justify-center gap-0.5 text-xs font-mono font-black text-neutral-950 mt-1">
                    <Globe size={11} className="text-sky-500" />
                    <span>Air Priority</span>
                  </div>
                </div>
              </div>

              {/* Core CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="btn-modal-add-to-cart"
                  type="button"
                  disabled={!selectedSize}
                  onClick={handleAddToCartSubmit}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-mono uppercase tracking-widest font-black border-2 transition-all rounded-none ${
                    !selectedSize
                      ? 'bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-600 border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-[#ffdd00] border-black text-black hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[1px] cursor-pointer'
                  }`}
                >
                  <ShoppingCart size={14} />
                  <span>{isAdded ? 'ДОБАВЛЕНО В КОРП!' : selectedSize ? 'В ГРУЗ КОРЗИНУ' : 'УКАЖИТЕ ВАШ РАЗМЕР'}</span>
                </button>

                <button
                  id="btn-modal-chat-sty"
                  type="button"
                  onClick={() => onConsultStylist(product)}
                  className="bg-white border-2 border-black hover:bg-[#ffdd00]/10 text-black py-4 px-5 text-xs font-mono uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[1px]"
                >
                  <Sparkles size={14} className="text-indigo-600" />
                  <span>ИИ совет</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
