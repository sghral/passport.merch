import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PlaneTakeoff, Clock, Compass, Search, CheckCircle2, ShieldAlert, ArrowRight, Globe, Package, Layers, Truck } from 'lucide-react';
import { COUNTRIES } from '../data';
import { useLanguage } from './LanguageContext';

interface LogisticsHubProps {
  initialSearchCode?: string;
  onSelectCountryCode: (code: 'JAPAN' | 'USA' | 'ITALY' | 'FRANCE' | 'KOREA') => void;
}

export default function LogisticsHub({ initialSearchCode = '', onSelectCountryCode }: LogisticsHubProps) {
  const { language, t, tCountry, tCity, tCargoStatus, tDelivery } = useLanguage();
  const [searchCode, setSearchCode] = useState(initialSearchCode);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Interactive Consolidation states
  const [simLocation, setSimLocation] = useState('Казахстан');
  const [simSourced, setSimSourced] = useState<string[]>(['JAPAN', 'ITALY', 'USA']);

  // Update clocks every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update when initial search code changes (e.g., from checkout)
  useEffect(() => {
    if (initialSearchCode) {
      setSearchCode(initialSearchCode);
      handleSearchTrack(initialSearchCode);
    }
  }, [initialSearchCode]);

  const getTimeInZone = (timeZone: string) => {
    try {
      return currentTime.toLocaleTimeString('ru-RU', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return currentTime.toLocaleTimeString('ru-RU');
    }
  };

  const handleSearchTrack = (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      // Simulate retrieval
      const parsed = codeToSearch.toUpperCase().trim();
      const numPattern = parsed.match(/\d+/);
      const seed = numPattern ? parseInt(numPattern[0]) : 4519;

      const steps = [
        { 
          title: language === 'EN' ? 'Declaration Cleared by Customs' : 'Заявка одобрена таможней', 
          desc: language === 'EN' ? 'Recipient passed automatic e-clearing validation metrics' : 'Декларант прошел электронный учет Шереметьево-Карго', 
          done: true 
        },
        { 
          title: language === 'EN' ? 'Flight Reserved & Manifested' : 'Рейс забронирован', 
          desc: language === 'EN' ? 'Consolidated priority freight cargo flight via Boeing 747-800' : 'Консолидированный рейс грузового борта Boeing 747-800', 
          done: seed % 2 !== 0 
        },
        { 
          title: language === 'EN' ? 'Export Compliance Certified' : 'Экспортный контроль пройден', 
          desc: language === 'EN' ? 'Authorized pristine packing invoice checked by regional hub directors' : 'Оригинальный упаковочный лист согласован в стране отправления', 
          done: seed % 3 !== 0 
        },
        { 
          title: language === 'EN' ? 'In Direct Airborne Transit' : 'Транспортировка в РФ', 
          desc: language === 'EN' ? 'Direct flight inbound to consolidated regional custom line' : 'Рейс в транзите или готовится к погрузке', 
          done: seed % 4 !== 0 
        },
        { 
          title: language === 'EN' ? 'Hub Distribution & Sorting' : 'Сортировка Moscow Hub', 
          desc: language === 'EN' ? 'Final barcode label scanning and courier agent routing' : 'Проверка штрих-кодов и подготовка к выдаче', 
          done: false 
        },
      ];

      setSearchResult({
        trackingCode: parsed,
        carrier: 'Siberia Cargo & Priority Express',
        weight: `${(1.2 + (seed % 10) / 4).toFixed(2)} ${language === 'EN' ? 'kg' : 'кг'}`,
        origin: seed % 2 === 0 ? 'Tokyo (NRT)' : 'Milan (MXP)',
        eta: seed % 2 === 0 
          ? (language === 'EN' ? 'Expected within 6 days' : 'Ожидается в течение 6 дней') 
          : (language === 'EN' ? 'Expected within 4 days' : 'Ожидается в течение 4 дней'),
        steps,
      });
      setSearching(false);
    }, 1200);
  };

  return (
    <div id="logistics-board" className="bg-white border-4 border-[#1a1a1a] p-6 sm:p-8 space-y-8 rounded-none shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] text-left">
      
      {/* Flight corridors dashboard header */}
      <div className="border-b-2 border-black pb-5">
        <span className="text-[9px] font-mono bg-[#ffdd00] text-black border border-black px-2 py-0.5 uppercase tracking-widest font-black inline-block shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mb-2">
          {t('log.badge')}
        </span>
        <h2 className="text-xl font-black text-[#1a1a1a] tracking-tight uppercase">
          {language === 'EN' ? 'Direct Air Cargo Flight Logistics' : 'Карго-Логистика Прямых Рейсов'}
        </h2>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
          {language === 'EN' ? (
            'Each premium order is physically acquired locally at official flagships, passes multi-factor customs consolidators, and enters rapid direct air transport.'
          ) : (
            'Каждое отправление выкупается на местах во флагманских бутиках, проходит консолидационную проверку и отправляется прямым грузовым бортом.'
          )}
        </p>
      </div>

      {/* Grid of country sourcing flights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {COUNTRIES.map((c) => {
          return (
            <div
              key={c.code}
              id={`flight-card-${c.code}`}
              onClick={() => onSelectCountryCode(c.code)}
              className="group border-2 border-black p-4 bg-white hover:bg-[#eefaff] flex flex-col justify-between transition-all cursor-pointer h-full rounded-none shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:shadow-[5px_5px_0px_0px_rgba(26,26,26,1)] hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-neutral-100 pb-2">
                  <span className="text-xl">{c.flag}</span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#000] font-black">
                    <Clock size={10} />
                    <span>{getTimeInZone(c.timeZone).substring(0, 5)}</span>
                  </div>
                </div>
                
                <h3 className="text-xs font-mono font-black text-black tracking-widest uppercase">
                  {c.city} HUB
                </h3>
                <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">
                  {language === 'EN' ? 'Region: ' : 'Регион: '}{tCountry(c.name)}
                </p>
              </div>

              <div className="mt-5 border-t-2 border-dashed border-black pt-3">
                <p className="text-[10px] font-mono text-[#1a1a1a] uppercase font-black leading-none flex items-center gap-1 bg-[#ffdd00]/45 p-1 border border-black/10">
                  <PlaneTakeoff size={11} className="transform rotate-45 text-black" />
                  <span>{tDelivery(c.estimatedDeliveryDays)}</span>
                </p>
                <p className="text-[9px] text-[#444] font-mono mt-1.5 leading-tight font-bold">
                  {tCargoStatus(c.cargoStatus)}
                </p>
                
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-black mt-3 font-extrabold uppercase bg-white border border-black px-2 py-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#ffdd00]">
                  {language === 'EN' ? 'Browse items' : 'Смотреть вещи'} <ArrowRight size={8} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Cargo Tracking Console */}
      <div className="bg-[#f4f4f4] border-2 border-black p-5 sm:p-6 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <h3 className="text-xs font-mono font-black text-black uppercase tracking-widest mb-3 flex items-center gap-2">
          <Compass size={14} className="text-black stroke-[2.5]" />
          <span>{t('log.tracking_manifest')}</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="input-cargo-tracking"
            type="text"
            placeholder={language === 'EN' ? 'e.g. RUS-CARGO-451901' : 'Пример: RUS-CARGO-451901'}
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="flex-1 bg-white border-2 border-black px-4 py-3 text-xs font-mono font-bold uppercase focus:outline-none focus:bg-[#eefaff] placeholder-neutral-400 rounded-none shadow-sm"
          />
          <button
            id="btn-search-cargo-tracking"
            type="button"
            onClick={() => handleSearchTrack(searchCode)}
            className="bg-[#ffdd00] hover:bg-yellow-400 text-black text-xs font-mono font-black px-6 py-3 border-2 border-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] active:shadow-none active:translate-y-0.5 transition-all"
          >
            {searching ? (language === 'EN' ? 'QUERYING DB...' : 'Запрос БД...') : (language === 'EN' ? 'FIND DECLARATION' : 'ПОИСК ДЕКЛАРАЦИИ')}
          </button>
        </div>

        {/* Live status panel output */}
        {searchResult && (
          <motion.div
            id="tracking-output-box"
            className="mt-5 pt-5 border-t-2 border-dashed border-black grid grid-cols-1 md:grid-cols-12 gap-5"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Short specs */}
            <div className="md:col-span-5 bg-white border-2 border-black p-4 rounded-none font-mono space-y-2.5 text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left">
              <div className="flex justify-between border-b pb-1.5 border-neutral-100">
                <span className="text-[#888] font-bold">{language === 'EN' ? 'Declaration Code:' : 'Код декларации:'}</span>
                <span className="font-extrabold text-black bg-[#ffdd00] px-1">{searchResult.trackingCode}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 border-neutral-100">
                <span className="text-[#888] font-bold">{language === 'EN' ? 'Air Carrier:' : 'Авиаперевозчик:'}</span>
                <span className="font-extrabold text-black">{searchResult.carrier}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 border-neutral-100">
                <span className="text-[#888] font-bold">{language === 'EN' ? 'Customs Weight:' : 'Таможенный вес:'}</span>
                <span className="font-extrabold text-black">{searchResult.weight}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-black pt-2 font-black text-black mt-2 bg-[#ffdd00]/20 px-2 py-1 border">
                <span>{language === 'EN' ? 'ETA Forecast:' : 'Прогноз на хаб:'}</span>
                <span>{searchResult.eta}</span>
              </div>
            </div>

            {/* Visual step pipeline */}
            <div className="md:col-span-1" />
            <div className="md:col-span-6 bg-white border-2 border-black p-4 rounded-none shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] space-y-3.5 text-left">
              <span className="text-[9px] font-mono text-black bg-[#f4f4f4] px-2 py-0.5 border border-black uppercase tracking-widest block font-black w-max">
                {language === 'EN' ? 'SATELLITE DOWNLINK BEACON ACTIVE' : 'Радар Таможенного Учета РФ'}
              </span>
              
              <div className="space-y-3">
                {searchResult.steps.map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-3.5 h-3.5 rounded-none border-2 flex items-center justify-center ${
                        step.done 
                          ? 'border-black bg-emerald-500' 
                          : idx === 3 
                          ? 'border-black bg-orange-400 animate-pulse' 
                          : 'border-black bg-white'
                      }`}>
                        {step.done && <div className="w-1.5 h-1.5 bg-black" />}
                        {!step.done && idx === 3 && <div className="w-1.5 h-1.5 bg-black" />}
                      </div>
                      {idx < searchResult.steps.length - 1 && (
                        <div className={`w-0.5 h-5 bg-black`} />
                      )}
                    </div>
                    <div className="text-left font-sans">
                      <p className={`text-xs font-black uppercase tracking-tight leading-tight ${step.done ? 'text-black' : 'text-neutral-400'}`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Dynamic Consolidation Flow Simulator */}
      <div className="bg-white border-2 border-black p-5 sm:p-6 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-5">
        <div>
          <span className="text-[9px] font-mono bg-[#1a1a1a] text-[#ffdd00] border border-black px-2 py-0.5 uppercase tracking-widest font-black inline-block mb-1.5">
            {t('log.sim_laboratory')}
          </span>
          <h3 className="text-sm font-black text-black tracking-tight uppercase flex items-center gap-2">
            <Layers size={14} className="stroke-[2.5]" />
            <span>{t('log.sim_title')}</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            {t('log.sim_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 border-t border-dashed border-neutral-200 pt-4">
          
          {/* Controls: Target location + sourcing sources */}
          <div className="md:col-span-5 space-y-4">
            {/* Step 1: Destination location */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-black font-black block tracking-wider">
                {t('log.sim_step1')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Россия', flag: '🇷🇺' },
                  { name: 'Казахстан', flag: '🇰🇿' },
                  { name: 'Турция', flag: '🇹🇷' },
                  { name: 'ОАЭ', flag: '🇦🇪' },
                  { name: 'Грузия', flag: '🇬🇪' },
                  { name: 'Узбекистан', flag: '🇺🇿' },
                  { name: 'Армения', flag: '🇦🇲' }
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSimLocation(item.name)}
                    className={`px-2.5 py-1.5 border border-black font-mono text-[11px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                      simLocation === item.name
                        ? 'bg-[#ffdd00] text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-neutral-500 hover:text-black hover:bg-[#f4f4f4]'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{tCountry(item.name)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Sourcing boutiques */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-black font-black block tracking-wider">
                {t('log.sim_step2')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: 'JAPAN', name: 'Япония', flag: '🇯🇵', city: 'Tokyo Hub' },
                  { code: 'USA', name: 'США', flag: '🇺🇸', city: 'New York Hub' },
                  { code: 'ITALY', name: 'Италия', flag: '🇮🇹', city: 'Milan Hub' },
                  { code: 'FRANCE', name: 'Франция', flag: '🇫🇷', city: 'Paris Hub' },
                  { code: 'KOREA', name: 'Корея', flag: '🇰🇷', city: 'Seoul Hub' }
                ].map((item) => {
                  const active = simSourced.includes(item.code);
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        if (active) {
                          if (simSourced.length > 1) {
                            setSimSourced(simSourced.filter((code) => code !== item.code));
                          }
                        } else {
                          setSimSourced([...simSourced, item.code]);
                        }
                      }}
                      className={`p-2 border-2 text-left transition-all cursor-pointer flex flex-col justify-between rounded-none ${
                        active
                          ? 'border-black bg-[#eefaff] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
                          : 'border-neutral-300 bg-white opacity-60 hover:opacity-100 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-mono font-black text-black">{item.city}</span>
                        <span className="text-xs">{item.flag}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-semibold">{tCountry(item.name)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visualizing dynamic flow pipeline map */}
          <div className="md:col-span-7 bg-[#neutral-50] border-2 border-dashed border-black/35 p-4 sm:p-5 text-left flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono bg-emerald-500 text-white border border-black px-1.5 uppercase font-medium">
                  {t('log.sim_scheme')}
                </span>
                <span className="text-[11px] font-mono font-black text-black">
                  {t('log.sim_location_label')} {tCountry(simLocation).toUpperCase()}
                </span>
              </div>

              {/* Dynamic steps showing real routing */}
              <div className="space-y-4">
                {/* 1. Sourcing source countries list */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-100 text-[#1a1a1a] border border-black flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs font-sans">
                    <p className="font-extrabold text-[#1a1a1a] uppercase">{t('log.sim_step1_title')}</p>
                    <p className="text-neutral-500 text-[10px] mt-0.5 leading-snug">
                      {language === 'EN' ? (
                        <>Our buyers acquire items simultaneously across physical boutiques in <strong>{simSourced.map(code => {
                          const found = COUNTRIES.find(c => c.code === code);
                          return found ? `${found.flag} ${tCountry(found.name)}` : code;
                        }).join(', ')}</strong>. Parcels are secured with immediate transport.</>
                      ) : (
                        <>Наши байеры одновременно скупают позиции в бутиках:{' '}
                        <strong>
                          {simSourced
                            .map((code) => {
                              const found = COUNTRIES.find((c) => c.code === code);
                              return found ? `${found.flag} ${found.name}` : code;
                            })
                            .join(', ')}
                        </strong>
                        . Вещи страхуются и отправляются местным авиафрахтом.</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Arrow spacer */}
                <div className="pl-3 h-2 border-l border-neutral-300 ml-3 md:block hidden" />

                {/* 2. Consolidation Hub */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-100 text-[#1a1a1a] border border-black flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs font-sans">
                    <p className="font-extrabold text-[#1a1a1a] uppercase">{t('log.sim_step2_title', { country: tCountry(simLocation).toUpperCase() })}</p>
                    <p className="text-neutral-500 text-[10px] mt-0.5 leading-snug">
                      {language === 'EN' ? (
                        <>All consignments fly to our unified sorting and staging hub in <strong>{tCountry(simLocation)}</strong>. Over-packing is completed, combining parcels into one cargo invoice which <strong>completely bypasses multiple customs duties</strong>.</>
                      ) : (
                        <>Все коробки поступают на наш единый логистический терминал в **{simLocation}**. Проводится переупаковка в общую защитную тару, формируется одна накладная, что **исключает начисление раздельных пошлин**.</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Arrow spacer */}
                <div className="pl-3 h-2 border-l border-neutral-300 ml-3 md:block hidden" />

                {/* 3. Single despatch from your current location country */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#ffdd00] text-black border border-black flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-xs font-sans">
                    <p className="font-extrabold text-[#1a1a1a] uppercase bg-[#ffdd00]/20 w-max px-1">
                      {t('log.sim_step3_title', { country: tCountry(simLocation).toUpperCase() })}
                    </p>
                    <p className="text-neutral-500 text-[10px] mt-0.5 leading-snug font-semibold">
                      {language === 'EN' ? (
                        <>A single compiled parcel travels <strong>from {tCountry(simLocation)}</strong> straight to your home address via CDEK/Express courier. Delivery within your region takes only 1-3 days from hub arrival!</>
                      ) : (
                        <>Единая посылка отправляется **из {simLocation}** прямо к вам домой курьерской службой СДЭК/Express. Время в пути по вашей стране составит всего 1-3 дня с момента прибытия на внутренний склад!</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations Simulation status bar */}
            <div className="mt-5 border border-black bg-black text-white p-3 font-mono text-left space-y-1 rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <div className="flex justify-between text-[11px]">
                <span className="text-neutral-400">{t('log.sim_fee_separate')}</span>
                <span className="line-through text-[#ff4d4d]">{(3500 * simSourced.length).toLocaleString('ru-RU')} ₽ {t('log.sim_fee_separate_sub')}</span>
              </div>
              <div className="flex justify-between text-[11px] font-extrabold text-[#ffdd00] border-t border-[#333] pt-1">
                <span>{t('log.sim_fee_consolidated')}</span>
                <span>{t('log.sim_fee_consolidated_val', { country: tCountry(simLocation) })}</span>
              </div>
              <p className="text-[9px] text-neutral-400 leading-tight mt-1.5 uppercase tracking-wide">
                {t('log.sim_disclaim')}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
