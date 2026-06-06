/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  ShoppingBag, 
  Sparkles, 
  Search, 
  MapPin, 
  TrendingUp, 
  SlidersHorizontal,
  ChevronDown,
  Globe2,
  RefreshCw,
  Award,
  Globe
} from 'lucide-react';

// Data and types
import { Product, CartItem } from './types';
import { PRODUCTS, BRANDS, CATEGORIES, COUNTRIES } from './data';

// Custom subcomponents
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import LogisticsHub from './components/LogisticsHub';
import AiStylist from './components/AiStylist';
import { useLanguage } from './components/LanguageContext.tsx';

export default function App() {
  const { language, setLanguage, t, tCountry, tCargoStatus, tDelivery, tCity } = useLanguage();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'catalog' | 'logistics' | 'stylist'>('catalog');
  
  // Sourcing and Filters
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Cart and Sizing States
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const cached = localStorage.getItem('passport_cart_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Expanded Product details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // AI assistant redirect item
  const [stylistContextItem, setStylistContextItem] = useState<Product | null>(null);

  // Logistics Tracking Pre-fill
  const [activeTrackingCode, setActiveTrackingCode] = useState('');

  // Cache cart value
  useEffect(() => {
    localStorage.setItem('passport_cart_cache', JSON.stringify(cart));
  }, [cart]);

  // Scroll to top on tab change
  const handleTabChange = (tab: 'catalog' | 'logistics' | 'stylist') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Item
  const handleAddToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      } else {
        return [...prev, { product, selectedSize: size, quantity: 1 }];
      }
    });
  };

  // Update Qty
  const handleUpdateQty = (productId: string, size: string, change: number) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === productId && item.selectedSize === size
      );
      if (idx === -1) return prev;
      const next = [...prev];
      const nextQty = next[idx].quantity + change;
      if (nextQty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx].quantity = nextQty;
      }
      return next;
    });
  };

  // Remove Item
  const handleRemoveItem = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Total Quantity badge
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Direct modal transition to stylist with preloaded piece context
  const handleConsultFromModal = (product: Product) => {
    setSelectedProduct(null); // close modal
    setStylistContextItem(product); // load item
    handleTabChange('stylist'); // switch tab
  };

  // When clicking matching card inside Chat
  const handleOpenProductFromChat = (product: Product) => {
    setSelectedProduct(product);
  };

  // Trigger from Logistics Card Country Select
  const handleSelectCountryFromLogistics = (code: 'JAPAN' | 'USA' | 'ITALY' | 'FRANCE' | 'KOREA') => {
    setSelectedCountry(code);
    handleTabChange('catalog');
  };

  // Filter Catalog
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCountry = !selectedCountry || p.country === selectedCountry;
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesBrand = !selectedBrand || p.brand === selectedBrand;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCountry && matchesCategory && matchesBrand && matchesSearch;
  });

  const getActiveCountryInfo = () => {
    if (!selectedCountry) return null;
    return COUNTRIES.find((c) => c.code === selectedCountry);
  };

  const activeCountryMeta = getActiveCountryInfo();

  return (
    <div id="passport-applet-root" className="min-h-screen bg-[#fdfdfd] text-[#1a1a1a] selection:bg-[#ffdd00] selection:text-black flex flex-col justify-between antialiased">
      
      {/* 1. TOP UTILITY STRIP / BRAND LABELS */}
      <div className="bg-[#1a1a1a] text-white py-2 px-4 sm:px-8 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase border-b-2 border-black shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-neutral-400 hidden sm:inline">{t('top.import')}</span>
          <span className="text-gray-300">{t('top.drop')}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neutral-400 hidden lg:inline">{t('top.free')}</span>
          <span className="text-[#ffdd00] font-black hidden sm:inline">{t('top.synchronized')}</span>
          
          {/* Elite Premium Language Selector Pill */}
          <div className="flex items-center border border-neutral-700 bg-neutral-900 overflow-hidden font-black font-mono shrink-0">
            <button 
              onClick={() => setLanguage('RU')} 
              className={`px-2 py-0.5 text-[9px] cursor-pointer transition-colors ${language === 'RU' ? 'bg-[#ffdd00] text-black' : 'text-neutral-400 hover:text-white'}`}
            >RU</button>
            <button 
              onClick={() => setLanguage('EN')} 
              className={`px-2 py-0.5 text-[9px] cursor-pointer transition-colors ${language === 'EN' ? 'bg-[#ffdd00] text-black' : 'text-neutral-400 hover:text-white'}`}
            >EN</button>
          </div>
        </div>
      </div>

      {/* 2. CUSTOM MAIN BRAND HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-[#1a1a1a] py-4 px-4 sm:px-8 shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange('catalog')}>
            <div className="w-9 h-9 bg-[#1a1a1a] flex items-center justify-center border-2 border-black">
              <span className="text-white font-black text-lg italic">P</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-[#1a1a1a] uppercase leading-none">
                {t('header.logo')}
              </h1>
              <span className="text-[10px] font-mono bg-[#ffdd00] border-2 border-[#1a1a1a] px-2 py-0.5 text-black font-black uppercase tracking-widest hidden sm:inline shadow-[1px_1px_0px_0px_rgba(26,26,26,1)]">
                {t('header.curr_region')}
              </span>
            </div>
          </div>

          {/* Primary View Segment Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-3">
            <button
              id="tab-btn-catalog"
              onClick={() => handleTabChange('catalog')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border-2 font-black rounded-none ${
                activeTab === 'catalog' 
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]' 
                  : 'text-[#1a1a1a] border-transparent hover:border-[#1a1a1a] hover:bg-[#f4f4f4]'
              }`}
            >
              {t('header.tab.catalog')}
            </button>
            <button
              id="tab-btn-logistics"
              onClick={() => handleTabChange('logistics')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border-2 font-black rounded-none ${
                activeTab === 'logistics' 
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]' 
                  : 'text-[#1a1a1a] border-transparent hover:border-[#1a1a1a] hover:bg-[#f4f4f4]'
              }`}
            >
              {t('header.tab.logistics')}
            </button>
            <button
              id="tab-btn-stylist"
              onClick={() => handleTabChange('stylist')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border-2 font-black rounded-none ${
                activeTab === 'stylist' 
                  ? 'bg-[#ffdd00] text-black border-[#1a1a1a] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] animate-pulse' 
                  : 'text-[#1a1a1a] border-transparent hover:border-[#1a1a1a] hover:bg-[#ffdd00]/10'
              }`}
            >
              <Sparkles size={12} className="text-black" />
              <span>{t('header.tab.stylist')}</span>
            </button>
          </nav>

          {/* Right Sourcing Cart button with quantities */}
          <button
            id="btn-trigger-cart-drawer"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#ffdd00] hover:text-black hover:border-black text-white font-mono text-xs px-4 py-2 border-2 border-black uppercase tracking-widest font-black rounded-none cursor-pointer transition-all shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">{t('header.cart_btn')}</span>
            <span className="bg-[#ffdd00] text-black font-black text-[10px] px-1.5 py-0.2 ml-1 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              {totalCartCount}
            </span>
          </button>
        </div>
      </header>

      {/* 3. CORE SUBSTANCE SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        
        {/* Banner introduction with brand and origin countries */}
        {activeTab === 'catalog' && (
          <motion.div
            id="catalog-intro-banner"
            className="relative bg-[#1a1a1a] text-white p-6 md:p-10 border-4 border-[#1a1a1a] rounded-none flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Background design elements */}
            <div className="absolute right-[-40px] top-[-20px] text-[130px] font-black opacity-10 leading-none select-none italic pointer-events-none tracking-tighter">
              DROP_41
            </div>
            
            <div className="space-y-3 max-w-2xl text-left z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-[#ffdd00] border border-black px-2.5 py-0.5 text-black font-extrabold uppercase tracking-widest shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  {t('banner.badge')}
                </span>
                <span className="text-xs font-mono text-neutral-300">{t('banner.sub')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-none uppercase text-white">
                {t('banner.title')}
              </h2>
              <p className="text-xs sm:text-xs text-neutral-300 max-w-xl leading-relaxed">
                {t('banner.description')}
              </p>
            </div>

            {/* Quick stats board */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 md:gap-3 font-mono text-xs border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-8 shrink-0 text-left z-10 w-full md:w-auto">
              <div>
                <span className="text-neutral-500 uppercase block text-[8px] tracking-wider font-extrabold">{t('banner.stat.verif')}</span>
                <span className="font-bold text-gray-200">100% Guaranteed</span>
              </div>
              <div>
                <span className="text-neutral-500 uppercase block text-[8px] tracking-wider font-extrabold">{t('banner.stat.speed')}</span>
                <span className="font-bold text-[#ffdd00]">{t('banner.stat.speed_val')}</span>
              </div>
              <div className="hidden md:block">
                <span className="text-neutral-500 uppercase block text-[8px] tracking-wider font-extrabold">{t('banner.stat.curated')}</span>
                <span className="font-bold text-white">Supreme, Kapital, Margiela</span>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          
          {/* ======================= CATALOG ZONE ======================= */}
          {activeTab === 'catalog' && (
            <motion.div
              key="catalog-tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              
              {/* 3.1. GEOGRAPHIC CORRIDOR TABS (SORT BY COUNTRY) */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-[#1a1a1a] uppercase tracking-widest font-black block text-left">
                  {t('cat.filter_by_country')}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    id="country-tab-all"
                    onClick={() => setSelectedCountry(null)}
                    className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 border-2 cursor-pointer rounded-none ${
                      selectedCountry === null
                        ? 'bg-[#ffdd00] text-black border-black font-black shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]'
                        : 'bg-white border-black text-[#1a1a1a] font-bold hover:bg-[#f4f4f4] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-y-[-1px]'
                    }`}
                  >
                    <Globe2 size={13} />
                    <span>{t('cat.all_countries')}</span>
                  </button>

                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      id={`country-tab-${c.code}`}
                      onClick={() => setSelectedCountry(c.code)}
                      className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 border-2 cursor-pointer rounded-none ${
                        selectedCountry === c.code
                          ? 'bg-[#ffdd00] text-black border-black font-black shadow-[3px_3px_0px_0px_rgba(26,26,26,1)]'
                          : 'bg-white border-black text-[#1a1a1a] font-bold hover:bg-[#f4f4f4] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-y-[-1px]'
                      }`}
                    >
                      <span className="text-sm">{c.flag}</span>
                      <span>{tCountry(c.name)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific country info stamp when focused */}
              {activeCountryMeta && (
                <motion.div
                  id="active-country-banner-info"
                  className="bg-[#eefaff] border-2 border-black p-5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left font-sans shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-mono uppercase font-black text-black tracking-wide flex items-center gap-1.5">
                      <span>{activeCountryMeta.flag}</span>
                      <span>{language === 'EN' ? 'Air corridor:' : 'Воздушный коридор:'} {tCity(activeCountryMeta.city)} // {activeCountryMeta.code}</span>
                    </p>
                    <p className="text-xs text-[#555] leading-relaxed">
                      {language === 'EN'
                        ? 'All custom-curated lots are directly sourced by our localized buyers in physical retail flagships, consolidated, and cleared at our terminal hub.'
                        : 'Все эксклюзивные лоты выкупаются нашими байерами непосредственно в официальных розничных сторах, бережно сортируются и загружаются в грузовое отделение аэропорта.'}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 font-mono text-[11px] shrink-0">
                    <div className="bg-white border-2 border-black p-2.5 text-center min-w-[105px] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-neutral-500 uppercase block text-[8px] font-extrabold">{language === 'EN' ? 'ETA TERMINAL' : 'ДОСТАВКА ДО РФ'}</span>
                      <strong className="text-black font-black block">{tDelivery(activeCountryMeta.estimatedDeliveryDays)}</strong>
                    </div>
                    <div className="bg-white border-2 border-black p-2.5 text-center min-w-[155px] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-neutral-500 uppercase block text-[8px] font-extrabold">{language === 'EN' ? 'LIVE STATUS' : 'ТЕКУЩИЙ СТАТУС'}</span>
                      <strong className="text-black font-black truncate block max-w-[140px]">{tCargoStatus(activeCountryMeta.cargoStatus)}</strong>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3.2. MULTI-FILTER BAR (BRANDS & CATEGORIES & SEARCH) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#f4f4f4] border-2 border-black p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                
                {/* Search query input */}
                <div className="lg:col-span-4 relative flex items-center">
                  <Search size={15} className="absolute left-3.5 text-black" />
                  <input
                    id="search-input-catalog"
                    type="text"
                    placeholder={t('cat.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-2 border-black pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:bg-[#eefaff] font-mono uppercase font-bold text-black placeholder-neutral-400 rounded-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-xs font-mono text-[#888] hover:text-black cursor-pointer font-black"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Brand Dropdown filter (Select style) */}
                <div className="lg:col-span-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#1a1a1a] uppercase shrink-0 font-extrabold">{t('cat.brand_label')}</span>
                  <select
                    id="brand-filter-select"
                    value={selectedBrand || ''}
                    onChange={(e) => setSelectedBrand(e.target.value || null)}
                    className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:bg-[#eefaff] text-black cursor-pointer rounded-none"
                  >
                    <option value="">{t('cat.all_brands')}</option>
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Dropdown filter */}
                <div className="lg:col-span-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#1a1a1a] uppercase shrink-0 font-extrabold">{t('cat.category_label')}</span>
                  <select
                    id="category-filter-select"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full bg-white border-2 border-black px-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:bg-[#eefaff] text-black cursor-pointer rounded-none"
                  >
                    <option value="">{t('cat.all_categories')}</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {t('cat.' + c)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters CTA */}
                <div className="lg:col-span-2 flex items-center">
                  {(selectedCountry || selectedBrand || selectedCategory || searchQuery) ? (
                    <button
                      id="btn-reset-all-filters"
                      onClick={() => {
                        setSelectedCountry(null);
                        setSelectedBrand(null);
                        setSelectedCategory(null);
                        setSearchQuery('');
                      }}
                      className="w-full bg-[#ffdd00] text-black hover:bg-yellow-400 border-2 border-black py-2.5 text-xs font-mono uppercase tracking-wider font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:shadow-none active:translate-y-0.5"
                    >
                      <RefreshCw size={12} />
                      <span>{t('cat.reset_btn')} ({
                        (selectedCountry ? 1 : 0) + (selectedBrand ? 1 : 0) + (selectedCategory ? 1 : 0) + (searchQuery ? 1 : 0)
                      })</span>
                    </button>
                  ) : (
                    <div className="w-full text-center text-[10px] font-mono text-[#888] py-3 border-2 border-dashed border-gray-400 rounded-none bg-white">
                      {t('cat.filters_active')}
                    </div>
                  )}
                </div>
              </div>

              {/* 3.3. PRODUCTS GRID */}
              {filteredProducts.length === 0 ? (
                /* No items found state */
                <div className="bg-white border-4 border-[#1a1a1a] py-16 px-4 text-center space-y-4 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-sm font-mono font-black uppercase tracking-wider text-[#1a1a1a]">{t('cat.no_items')}</p>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                    {t('cat.no_items_desc')}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCountry(null);
                      setSelectedBrand(null);
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                    className="bg-[#1a1a1a] hover:bg-[#ffdd00] hover:text-black text-white text-xs font-mono font-black px-6 py-3 border-2 border-black uppercase tracking-widest cursor-pointer rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {t('cat.back_to_catalog')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOpenDetails={setSelectedProduct}
                      onAddToCart={(prod, size) => handleAddToCart(prod, size)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ======================= ACTIVE FLIGHTS & LOGISTICS HUB ======================= */}
          {activeTab === 'logistics' && (
            <motion.div
              key="logistics-tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LogisticsHub
                initialSearchCode={activeTrackingCode}
                onSelectCountryCode={handleSelectCountryFromLogistics}
              />
            </motion.div>
          )}

          {/* ======================= AI PERSONAL SHOPPER CONCIERGE ======================= */}
          {activeTab === 'stylist' && (
            <motion.div
              key="stylist-tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AiStylist
                selectedProductContext={stylistContextItem}
                onClearContext={() => setStylistContextItem(null)}
                onOpenProduct={handleOpenProductFromChat}
                onQuickAddToCart={handleAddToCart}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 4. PREMIUM BRAND VALUES BANNER SHELF */}
      <footer className="mt-12 bg-white border-t-4 border-[#1a1a1a] py-12 px-4 sm:px-8 shrink-0">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Sourcing badges & declarations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="border-2 border-[#1a1a1a] p-5 rounded-none bg-[#fdfdfd] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] space-y-2">
              <div className="text-black font-black flex items-center gap-2 text-xs font-mono">
                <div className="w-5 h-5 bg-[#ffdd00] flex items-center justify-center border border-black rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <Globe size={11} className="text-black" />
                </div>
                <span>{t('foot.import_title')}</span>
              </div>
              <p className="text-xs text-neutral-600 leading-normal">
                {t('foot.import_desc')}
              </p>
            </div>

            <div className="border-2 border-[#1a1a1a] p-5 rounded-none bg-[#fdfdfd] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] space-y-2">
              <div className="text-black font-black flex items-center gap-2 text-xs font-mono">
                <div className="w-5 h-5 bg-[#ffdd00] flex items-center justify-center border border-black rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <Award size={11} className="text-black" />
                </div>
                <span>{t('foot.warranty_title')}</span>
              </div>
              <p className="text-xs text-neutral-600 leading-normal">
                {t('foot.warranty_desc')}
              </p>
            </div>

            <div className="border-2 border-[#1a1a1a] p-5 rounded-none bg-[#fdfdfd] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] space-y-2">
              <div className="text-black font-black flex items-center gap-2 text-xs font-mono">
                <div className="w-5 h-5 bg-[#ffdd00] flex items-center justify-center border border-black rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <SlidersHorizontal size={11} className="text-black" />
                </div>
                <span>{t('foot.markup_title')}</span>
              </div>
              <p className="text-xs text-neutral-600 leading-normal">
                {t('foot.markup_desc')}
              </p>
            </div>

            <div className="border-2 border-[#1a1a1a] p-5 rounded-none bg-[#fdfdfd] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] space-y-2">
              <div className="text-black font-black flex items-center gap-2 text-xs font-mono">
                <div className="w-5 h-5 bg-[#ffdd00] flex items-center justify-center border border-black rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles size={11} className="text-black" />
                </div>
                <span>{t('foot.stylist_title')}</span>
              </div>
              <p className="text-xs text-neutral-600 leading-normal">
                {t('foot.stylist_desc')}
              </p>
            </div>
          </div>

          <div className="border-t-2 border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#555] font-bold">
            <div>
              <span>{t('foot.rights')}</span>
            </div>
            <div className="flex gap-4">
              <span className="hover:text-black hover:underline cursor-pointer">{t('foot.links.tariffs')}</span>
              <span className="hover:text-black hover:underline cursor-pointer">{t('foot.links.import')}</span>
              <span className="hover:text-black hover:underline cursor-pointer">{t('foot.links.protection')}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. MULTI-MEDIA CAROUSEL PRODUCT MODAL WINDOW */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onConsultStylist={handleConsultFromModal}
      />

      {/* 6. RIGHT ALIGNED EXCISE TAX SLIDEOUT CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        
      />

    </div>
  );
}
