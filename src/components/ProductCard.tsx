import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Eye, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from './LanguageContext';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export default function ProductCard({ product, onOpenDetails, onAddToCart }: ProductCardProps) {
  const { language, tCountry, t, tProduct } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSizeQuick, setSelectedSizeQuick] = useState<string | null>(null);

  const localized = tProduct(product);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      className="group relative bg-[#ffffff] border-2 border-[#1a1a1a] rounded-none overflow-hidden flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] hover:-translate-y-1 transition-all duration-200"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSelectedSizeQuick(null);
      }}
    >
      {/* Country of Sourcing Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#1a1a1a] text-white text-[10px] md:text-xs font-mono font-bold px-2.5 py-1 tracking-widest uppercase border border-white">
        <span>{product.countryFlag}</span>
        <span>{tCountry(product.countryName)}</span>
      </div>

      {/* Stock Warning Badge */}
      {product.stock <= 2 && (
        <div className="absolute top-3 right-3 z-10 bg-[#ffdd00] text-[#1a1a1a] text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-1 border border-[#1a1a1a] shadow-[1px_1px_0px_0px_rgba(26,26,26,1)]">
          Limit {product.stock}
        </div>
      )}

      {/* Product Image Stage */}
      <div 
        id={`product-image-container-${product.id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f4f4] cursor-pointer border-b-2 border-[#1a1a1a]"
        onClick={() => onOpenDetails(product)}
      >
        {/* Primary Image */}
        <motion.img
          referrerPolicy="no-referrer"
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out"
          style={{ scale: isHovered && product.images[1] ? 1.03 : 1 }}
          animate={{ opacity: isHovered && product.images[1] ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Secondary Image (Fades in on hover) */}
        {product.images[1] && (
          <motion.img
            referrerPolicy="no-referrer"
            src={product.images[1]}
            alt={`${product.name} alternate`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ scale: isHovered ? 1 : 0.97 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Dark mask on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick actions overlay */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out z-10 hidden sm:block">
          <div className="flex flex-col gap-1.5 bg-white p-2 border-2 border-[#1a1a1a] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]">
            <span className="text-[9px] font-mono text-[#888] uppercase tracking-widest font-black text-center">{language === 'EN' ? 'QUICK BUY' : 'Быстрый выкуп'}</span>
            <div className="grid grid-cols-4 gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  id={`btn-quick-size-${product.id}-${size}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSizeQuick(size);
                    onAddToCart(product, size);
                  }}
                  className={`text-[10px] font-mono py-1 border font-bold transition-all duration-150 rounded-none ${
                    selectedSizeQuick === size 
                      ? 'bg-[#ffdd00] text-black border-[#1a1a1a]' 
                      : 'border-neutral-300 hover:border-[#1a1a1a] hover:bg-[#f4f4f4] text-neutral-800'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Block */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div>
          {/* Brand Tag */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-mono text-[#888] tracking-widest uppercase font-black">
              {product.brand}
            </p>
            <span className="text-[9px] font-mono bg-[#f4f4f4] border border-[#1a1a1a] px-2 py-0.5 text-[#1a1a1a] font-bold uppercase rounded-none">
              {t('cat.' + product.category)}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            id={`product-name-${product.id}`}
            className="text-xs sm:text-sm font-sans font-black text-[#1a1a1a] uppercase tracking-tight mt-2 line-clamp-2 hover:underline underline-offset-2 cursor-pointer transition-colors"
            onClick={() => onOpenDetails(product)}
          >
            {localized.name}
          </h3>
        </div>

        {/* Pricing & Interaction drawer */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-neutral-100">
          {/* Prices */}
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-mono text-neutral-400 font-bold line-through">
              {product.originalPrice}
            </span>
            <span className="text-sm font-mono font-black text-[#1a1a1a] tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* CTA View Button */}
          <button
            id={`btn-view-details-${product.id}`}
            type="button"
            onClick={() => onOpenDetails(product)}
            className="flex items-center gap-1 text-[10px] bg-[#1a1a1a] hover:bg-[#ffdd00] text-white hover:text-black border border-[#1a1a1a] font-mono uppercase tracking-widest transition-colors font-bold px-3 py-1.5 rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:shadow-none group/btn cursor-pointer"
          >
            <span>{language === 'EN' ? 'INFO' : 'ИНФО'}</span>
            <ArrowUpRight size={11} className="transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
