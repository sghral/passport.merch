import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Plane, FileText, CheckCircle2, RefreshCw, Globe, MapPin } from 'lucide-react';
import { CartItem } from '../types';
import { COUNTRIES } from '../data';

export const COUNTRY_CITIES: Record<string, string[]> = {
  'Россия': ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Владивосток'],
  'Казахстан': ['Алматы', 'Астана', 'Шымкент', 'Караганда'],
  'Турция': ['Стамбул', 'Анкара', 'Измир', 'Анталья'],
  'ОАЭ': ['Дубай', 'Абу-Даби', 'Шарджа'],
  'Грузия': ['Тбилиси', 'Батуми', 'Кутаиси'],
  'Узбекистан': ['Ташкент', 'Самарканд', 'Бухара'],
  'Армения': ['Ереван', 'Гюмри', 'Ванадзор']
};

export const COUNTRY_FLAGS: Record<string, string> = {
  'Россия': '🇷🇺',
  'Казахстан': '🇰🇿',
  'Турция': '🇹🇷',
  'ОАЭ': '🇦🇪',
  'Грузия': '🇬🇪',
  'Узбекистан': '🇺🇿',
  'Армения': '🇦🇲'
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, size: string, change: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<string | null>(null);

  // Form states
  const [locationCountry, setLocationCountry] = useState('Россия');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Москва');
  const [address, setAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const handleCountryChange = (countryName: string) => {
    setLocationCountry(countryName);
    const citiesList = COUNTRY_CITIES[countryName] || [];
    if (citiesList.length > 0) {
      setCity(citiesList[0]);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'PASSPORT10') {
      setPromoDiscount(0.1); // 10% discount
    } else {
      setPromoDiscount(0);
      alert('Промокод не найден. Попробуйте PASSPORT10');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const calculateTotalWeight = () => {
    return parseFloat(
      cartItems.reduce((acc, item) => acc + item.product.weightKg * item.quantity, 0).toFixed(2)
    );
  };

  // Sourcing shipping fees depend on where the item originates from
  const calculateShippingFee = () => {
    return cartItems.reduce((acc, item) => {
      const countryConfig = COUNTRIES.find((c) => c.code === item.product.country);
      const rate = countryConfig ? countryConfig.shippingRateRub : 2000;
      return acc + rate * item.quantity;
    }, 0);
  };

  const getSourcingCountries = () => {
    const list = cartItems.map((item) => {
      const config = COUNTRIES.find((c) => c.code === item.product.country);
      return config ? `${config.flag} ${config.name}` : item.product.country;
    });
    return Array.from(new Set(list)).join(', ');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !address) {
      alert('Пожалуйста, заполните необходимые поля: ФИО, Телефон и Адрес');
      return;
    }

    setIsCheckingOut(true);

    // Simulate luxury logistics booking pipeline
    setTimeout(() => {
      const prefixMap: Record<string, string> = {
        'Россия': 'RUS',
        'Казахстан': 'KAZ',
        'Турция': 'TUR',
        'ОАЭ': 'ARE',
        'Грузия': 'GEO',
        'Узбекистан': 'UZB',
        'Армения': 'ARM'
      };
      const codePrefix = prefixMap[locationCountry] || 'RUS';
      const trackingNumber = `${codePrefix}-CARGO-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedReceipt(trackingNumber);
      setIsCheckingOut(false);
      setOrderCompleted(true);
    }, 2500);
  };

  const resetCheckout = () => {
    setOrderCompleted(false);
    setGeneratedReceipt(null);
    onClearCart();
    setFullName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPromoCode('');
    setPromoDiscount(0);
    onClose();
  };

  const subtotal = calculateSubtotal();
  const discountAmount = subtotal * promoDiscount;
  const shippingFee = calculateShippingFee();
  const totalAmount = subtotal - discountAmount + shippingFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop overlay */}
          <motion.div
            id="cart-backdrop"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer container (slides from right) */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              id="cart-panel-body"
              className="w-screen max-w-lg bg-white border-l-4 border-black flex flex-col shadow-2xl relative rounded-none"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b-2 border-black flex items-center justify-between bg-[#ffdd00]">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-black stroke-[2.5]" />
                  <h2 className="text-xs font-mono font-black uppercase tracking-widest text-black">
                    ТАМОЖЕННЫЙ ДЕКЛАРАНТ ({cartItems.length})
                  </h2>
                </div>
                <button
                  id="btn-close-cart-drawer"
                  onClick={onClose}
                  className="bg-black hover:bg-[#ff4d4d] text-white hover:text-black p-1.5 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none"
                >
                  <X size={15} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Central Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {orderCompleted ? (
                  /* ORDER COMPLETED STYLIZED DECAL RECEIPT */
                  <motion.div
                    id="checkout-decal-receipt"
                    className="space-y-6 text-center py-6"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="mx-auto w-14 h-14 bg-[#ffdd00] border-2 border-black text-black flex items-center justify-center rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                      <CheckCircle2 size={32} className="stroke-[2.5]" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase bg-[#eefaff] border border-black/10 px-2 py-0.5 text-black font-black tracking-widest inline-block">
                        ДЕКЛАРАЦИЯ КАРГО ОДОБРЕНА
                      </p>
                      <h3 className="text-xl font-black tracking-tight uppercase text-neutral-900">
                        Груз консолидирован под {locationCountry}
                      </h3>
                      <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed font-semibold">
                        Товары выкупаются в разных странах и досылаются на единый внутренний хаб в странe **{locationCountry}** {COUNTRY_FLAGS[locationCountry]}, откуда осуществляется финальная отправка на ваш адрес.
                      </p>
                    </div>

                    {/* Cargo Waybill card */}
                    <div className="bg-white border-2 border-black p-5 rounded-none text-left font-mono space-y-4 max-w-sm mx-auto shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                      <div className="flex justify-between items-center border-b border-dashed border-neutral-300 pb-3">
                        <span className="text-[10px] uppercase font-black text-black font-mono">PASSPORT CARGO</span>
                        <span className="text-[10px] text-emerald-600 font-bold font-mono">STATUS: EXPEDITED</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Номер накладной:</span>
                          <span className="font-extrabold text-black">{generatedReceipt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Получатель:</span>
                          <span className="font-extrabold text-black whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Хаб снабжения:</span>
                          <span className="font-extrabold text-black">{getSourcingCountries() || 'Транзит'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Регион нахождения:</span>
                          <span className="font-bold text-black">{locationCountry} {COUNTRY_FLAGS[locationCountry]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Общая масса груза:</span>
                          <span className="font-extrabold text-black">{calculateTotalWeight()} кг</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Пункт выдачи:</span>
                          <span className="font-extrabold text-black">{city}</span>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-neutral-300 pt-3 text-center">
                        <p className="text-[9px] text-[#555] font-semibold leading-tight">
                          * Ожидайте таможенный досмотр. Оплата доставки производится по факту прибытия или авиа-счета.
                        </p>
                        {/* Fake barcode block */}
                        <div className="mt-3 flex flex-col items-center">
                          <div className="h-8 bg-black w-full bg-[linear-gradient(90deg,transparent_2px,black_2px,black_4px,transparent_4px,transparent_8px,black_8px,black_12px,transparent_12px)] opacity-85" />
                          <span className="text-[8px] tracking-[6px] text-[#444] font-black mt-1">*{generatedReceipt}*</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id="btn-receipt-reset"
                      onClick={resetCheckout}
                      type="button"
                      className="w-full bg-[#ffdd00] hover:bg-yellow-400 border-2 border-black text-black py-4 text-xs font-mono font-black tracking-widest uppercase cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      Вернуться в каталог
                    </button>
                  </motion.div>
                ) : cartItems.length === 0 ? (
                  /* EMPTY STATE */
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                    <div className="p-5 bg-[#f4f4f4] border-2 border-dashed border-black rounded-none">
                      <ShoppingBag size={28} className="text-black" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono font-black uppercase tracking-wider text-black">Ваша декларация пуста</p>
                      <p className="text-xs text-neutral-400 max-w-xs leading-relaxed font-semibold">
                        Добавьте эксклюзивные лоты из Японии, Кореи или США, чтобы сформировать международную посылку.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* LIST ITEMS + FORM */
                  <div className="space-y-6">
                    {/* Items stack */}
                    <div className="space-y-3.5">
                      <p className="text-[9px] font-mono text-black font-black uppercase tracking-widest bg-[#f4f4f4] border border-black px-2.5 py-0.5 w-max">Выбранные лоты для импорта</p>
                      {cartItems.map((item) => (
                        <div
                          key={`${item.product.id}-${item.selectedSize}`}
                          className="flex gap-4 p-3 border-2 border-black bg-white rounded-none shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] text-left"
                        >
                          <img
                            referrerPolicy="no-referrer"
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 aspect-[3/4] object-cover bg-neutral-100 border border-black/15"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <span className="text-[9px] font-mono bg-[#ffdd00] text-black border border-black px-2 py-0.2 uppercase tracking-wide font-black">
                                  {item.product.countryFlag} {item.product.countryName} HUB
                                </span>
                                <button
                                  id={`btn-remove-cart-${item.product.id}-${item.selectedSize}`}
                                  onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                                  className="text-[#666] hover:text-[#ff4d4d] border border-black hover:bg-[#ff4d4d]/10 p-0.5 rounded-none cursor-pointer transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <h4 className="text-xs font-black text-black tracking-tight mt-1 uppercase">
                                {item.product.brand} {item.product.name}
                              </h4>
                              <p className="text-[10px] font-mono text-[#555] font-bold">
                                РАЗМЕР: <span className="font-extrabold text-black underline">{item.selectedSize}</span>
                              </p>
                            </div>

                            <div className="flex justify-between items-center mt-2 border-t border-dashed border-neutral-200 pt-2">
                              {/* Quantity Control Picker */}
                              <div className="flex items-center border border-black bg-white">
                                <button
                                  id={`btn-minus-qty-${item.product.id}-${item.selectedSize}`}
                                  onClick={() => onUpdateQty(item.product.id, item.selectedSize, -1)}
                                  className="px-2 py-0.5 text-xs font-mono font-black hover:bg-[#f4f4f4] text-black cursor-pointer border-r border-black"
                                >
                                  -
                                </button>
                                <span className="px-3.5 text-xs font-mono font-black text-black">{item.quantity}</span>
                                <button
                                  id={`btn-plus-qty-${item.product.id}-${item.selectedSize}`}
                                  onClick={() => onUpdateQty(item.product.id, item.selectedSize, 1)}
                                  className="px-2 py-0.5 text-xs font-mono font-black hover:bg-[#f4f4f4] text-black cursor-pointer border-l border-black"
                                >
                                  +
                                </button>
                              </div>

                              <span className="text-xs font-mono font-black text-black bg-[#ffdd00]/20 border border-black/10 px-1.5">
                                {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Weight & Origin Hub status banner */}
                    <div className="bg-[#eefaff] border-2 border-black p-4 flex items-start gap-2.5 rounded-none shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] text-left">
                      <Plane size={15} className="text-black stroke-[2.5] mt-0.5 shrink-0" />
                      <div className="text-xs font-sans text-black font-semibold">
                        <p className="font-black uppercase tracking-tight">Консолидированный рейс карго</p>
                        <p className="text-[11px] text-neutral-600 mt-1.5">
                          Посылки будут упакованы в единый фрахт. Вес отправления: <strong className="font-black text-black">{calculateTotalWeight()} кг</strong>. Страны выкупа: {getSourcingCountries()}.
                        </p>
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <div className="border-2 border-black p-4 bg-white space-y-2 rounded-none shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] text-left">
                      <label className="text-[9px] font-mono text-black uppercase tracking-widest font-black block">Промокод</label>
                      <div className="flex gap-2">
                        <input
                          id="input-promo-code"
                          type="text"
                          placeholder="PASSPORT10"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 bg-white border-2 border-black px-3 py-2 text-xs font-mono font-bold uppercase tracking-widest focus:outline-none focus:bg-[#eefaff] placeholder-neutral-400 rounded-none shadow-sm"
                        />
                        <button
                          id="btn-apply-promo"
                          type="button"
                          onClick={handleApplyPromo}
                          className="bg-[#1a1a1a] text-[#ffdd00] text-xs px-4 py-2 font-mono uppercase font-black hover:bg-neutral-800 border-2 border-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] active:scale-95 cursor-pointer"
                        >
                          Ввод
                        </button>
                      </div>
                      {promoDiscount > 0 && (
                        <p className="text-[10px] text-emerald-600 font-mono font-black border border-emerald-300 bg-emerald-50 px-2.5 py-1 w-max mt-1">
                          Активирована скидка 10% по промокоду PASSPORT10
                        </p>
                      )}
                    </div>

                    {/* Checkout Billing Form */}
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-4 border-t-2 border-black text-left">
                      <p className="text-[9px] font-mono text-black font-black uppercase tracking-widest bg-[#f4f4f4] border border-black px-2.5 py-0.5 w-max">Декларация получателя</p>
                      
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-black tracking-wider mb-1 font-black flex items-center gap-1">
                            <Globe size={11} className="text-black stroke-[2.5]" />
                            <span>Страна вашего нахождения (Консолидация) *</span>
                          </label>
                          <select
                            id="billing-country-select"
                            value={locationCountry}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            className="w-full bg-white border-2 border-black px-3.5 py-2.5 text-xs font-mono font-black focus:outline-none focus:bg-[#eefaff] text-black rounded-none shadow-sm cursor-pointer"
                          >
                            {Object.keys(COUNTRY_CITIES).map((cName) => (
                              <option key={cName} value={cName}>
                                {COUNTRY_FLAGS[cName]} {cName}
                              </option>
                            ))}
                          </select>
                          <p className="text-[9px] font-mono text-neutral-500 mt-1 leading-snug font-bold">
                            ⚠️ Покупки будут совершены в разных бутиках ({getSourcingCountries()}), но консолидированы в хабе **{locationCountry}** {COUNTRY_FLAGS[locationCountry]}. Финальное отправление поедет на ваш адрес из хаба в **{locationCountry}**.
                          </p>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-black tracking-wider mb-1 font-black">ФИО Декларанта *</label>
                          <input
                            id="billing-name"
                            type="text"
                            required
                            placeholder="Иванов Александр Сергеевич"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white border-2 border-black px-3.5 py-2.5 text-xs focus:outline-none focus:bg-[#eefaff] font-mono font-bold text-black rounded-none shadow-sm placeholder-neutral-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-black tracking-wider mb-1 font-black">Телефон *</label>
                            <input
                              id="billing-phone"
                              type="tel"
                              required
                              placeholder="+7 (999) 123-4567"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full bg-white border-2 border-black px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:bg-[#eefaff] text-black rounded-none shadow-sm placeholder-neutral-400"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-black tracking-wider mb-1 font-black">E-mail</label>
                            <input
                              id="billing-email"
                              type="email"
                              placeholder="alex@passport.io"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-white border-2 border-black px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:bg-[#eefaff] text-black rounded-none shadow-sm placeholder-neutral-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-black tracking-wider mb-1 font-black">Пункт Доставки (Город)</label>
                          <select
                            id="billing-city-select"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-white border-2 border-black px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:bg-[#eefaff] text-black rounded-none shadow-sm cursor-pointer"
                          >
                            {(COUNTRY_CITIES[locationCountry] || []).map((cityOpt) => (
                              <option key={cityOpt} value={cityOpt}>
                                {cityOpt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-black tracking-wider mb-1 font-black">Адрес доставки (СДЭК или Курьер) *</label>
                          <input
                            id="billing-address"
                            type="text"
                            required
                            placeholder="ул. Ленина, д. 24, кв. 104"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-white border-2 border-black px-3.5 py-2.5 text-xs focus:outline-none focus:bg-[#eefaff] font-mono font-bold text-black rounded-none shadow-sm placeholder-neutral-400"
                          />
                        </div>
                      </div>

                      {/* Display calculations list */}
                      <div className="border-2 border-black bg-neutral-50 p-4 space-y-2 text-xs font-mono shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between text-[#555] font-semibold">
                          <span>Стоимость вещей:</span>
                          <span className="text-black font-extrabold">{subtotal.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        {promoDiscount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-black">
                            <span>Скидка промо 10%:</span>
                            <span>-{discountAmount.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[#555] font-semibold border-b border-dashed border-black/10 pb-2">
                          <span>Авиа-доставка и пошлины:</span>
                          <span className="text-black font-extrabold">{shippingFee.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="flex justify-between text-sm text-black font-black pt-1">
                          <span>ИТОГО К ОПЛАТЕ:</span>
                          <span className="text-black bg-[#ffdd00] px-1">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </div>

                      {/* Submit declaration loader button */}
                      <button
                        id="btn-confirm-billing-declaration"
                        type="submit"
                        disabled={isCheckingOut}
                        className="w-full mt-3 bg-[#ffdd00] hover:bg-yellow-400 text-black py-4 border-2 border-black text-xs font-mono font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-100 disabled:border-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[1px]"
                      >
                        {isCheckingOut ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>РЕГИСТРАЦИЯ ФРАХТА И ТАМОЖНИ...</span>
                          </>
                        ) : (
                          <>
                            <FileText size={14} className="stroke-[2.5]" />
                            <span>ЗАРЕГИСТРИРОВАТЬ ДЕКЛАРАЦИЮ</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
