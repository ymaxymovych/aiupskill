"use client";

import { useState, useEffect, useCallback } from "react";

interface PricingTier {
  minPeople: number;
  maxPeople: number | null;
  pricePerPerson: number;
}

interface PricingConfig {
  durationDays: number;
  durationHours: number;
  modulesCount: number;
  firstWinMinutes: number;
  supportWeeks: number;
  accessMonths: number;
}

interface DynamicPriceProps {
  people?: number;
  showSlider?: boolean;
  showPayback?: boolean;
  monthlySaving?: number;
  variant?: "inline" | "block" | "hero";
  className?: string;
}

function getPriceForPeople(
  tiers: PricingTier[],
  people: number
): number | null {
  for (const tier of tiers) {
    if (
      people >= tier.minPeople &&
      (tier.maxPeople === null || people <= tier.maxPeople)
    ) {
      return tier.pricePerPerson;
    }
  }
  return null;
}

function getMinMaxPrice(tiers: PricingTier[]): { min: number; max: number } {
  const prices = tiers
    .filter((t) => t.pricePerPerson > 0)
    .map((t) => t.pricePerPerson);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function formatUAH(amount: number): string {
  return amount.toLocaleString("uk-UA") + " грн";
}

export default function DynamicPrice({
  people: initialPeople = 10,
  showSlider = false,
  showPayback = true,
  monthlySaving,
  variant = "inline",
  className = "",
}: DynamicPriceProps) {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [people, setPeople] = useState(initialPeople);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((data) => {
        setTiers(data.tiers || []);
        setConfig(data.config || null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const pricePerPerson = tiers.length > 0 ? getPriceForPeople(tiers, people) : null;
  const isConsultation = pricePerPerson === 0 || pricePerPerson === null;
  const totalPrice = isConsultation ? 0 : (pricePerPerson ?? 0) * people;

  // B2.16: 25% від рутини (10 год/тижд дефолт), зарплата 35000 грн
  // hourlyRate = 35000/168 ≈ 208, saved = 10*0.25*4.3*208 ≈ 2236 грн/люд/міс
  const avgSalary = 35000;
  const routineHoursWeek = 10;
  const hourlyRate = avgSalary / 168;
  const savedPerPersonMonth = routineHoursWeek * 0.25 * 4.3 * hourlyRate;
  const estimatedMonthlySaving = monthlySaving || Math.round(savedPerPersonMonth * people);
  const paybackDays =
    totalPrice > 0 && estimatedMonthlySaving > 0
      ? Math.round((totalPrice / estimatedMonthlySaving) * 30)
      : 0;

  const { min: minPrice, max: maxPrice } =
    tiers.length > 0 ? getMinMaxPrice(tiers) : { min: 1999, max: 4999 };

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPeople(Number(e.target.value));
  }, []);

  if (!loaded) {
    return (
      <span className={`inline-block animate-pulse bg-gray-200 rounded h-5 w-20 ${className}`} />
    );
  }

  // --- INLINE variant ---
  if (variant === "inline") {
    return (
      <span className={className}>
        від {formatUAH(minPrice)} до {formatUAH(maxPrice)} за людину
      </span>
    );
  }

  // --- BLOCK variant (ROI table) ---
  if (variant === "block") {
    return (
      <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Вартість за людину</span>
            <p className="text-lg font-semibold text-gray-900">
              {isConsultation ? "Індивідуально" : formatUAH(pricePerPerson!)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Загальна вартість</span>
            <p className="text-lg font-semibold text-gray-900">
              {isConsultation ? "За запитом" : formatUAH(totalPrice)}
            </p>
          </div>
          {showPayback && !isConsultation && (
            <>
              <div>
                <span className="text-gray-500">Середня економія</span>
                <p className="text-lg font-semibold text-green-600">
                  {formatUAH(estimatedMonthlySaving)}/міс
                </p>
              </div>
              <div>
                <span className="text-gray-500">Окупність</span>
                <p className="text-lg font-semibold text-[#1a56db]">
                  {paybackDays} днів
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- HERO variant (full slider) ---
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 md:p-8 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-1">
        Прозоро. Без підписок. Разовий платіж.
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        Доступ на {config?.accessMonths || 12} місяців. Перший модуль — безкоштовно.
      </p>

      {/* Slider */}
      {showSlider && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Кількість співробітників
            </label>
            <span className="text-2xl font-bold text-[#1a56db]">{people}</span>
          </div>
          <input
            type="range"
            min={1}
            max={120}
            value={people}
            onChange={handleSlider}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a56db]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>25</span>
            <span>50</span>
            <span>100+</span>
          </div>
        </div>
      )}

      {/* Price display */}
      {isConsultation ? (
        <div className="text-center py-4">
          <p className="text-lg text-gray-600 mb-2">
            Для {people}+ людей — індивідуальна пропозиція
          </p>
          <p className="text-sm text-gray-500">
            Напишіть: ceo@aiadvisoryboard.me
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">За людину</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatUAH(pricePerPerson!)}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Загалом</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatUAH(totalPrice)}
            </p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg relative group">
            <p className="text-sm text-gray-500 inline-flex items-center gap-1">
              Економія/міс
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold cursor-help" title="Якщо кожен співробітник заощадить 2.5 години рутини на тиждень при зарплаті 35 000 грн/міс. Це консервативна оцінка (25% від рутинного часу).">?</span>
            </p>
            <p className="text-2xl font-bold text-green-600">
              {formatUAH(estimatedMonthlySaving)}
            </p>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 leading-relaxed">
              Якщо кожен співробітник заощадить 2.5 години рутини на тиждень при зарплаті 35 000 грн/міс. Це консервативна оцінка (25% від рутинного часу).
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-500">Окупність</p>
            <p className="text-2xl font-bold text-[#1a56db]">
              {paybackDays} днів
            </p>
          </div>
        </div>
      )}

      {/* Formula explanation */}
      {!isConsultation && (
        <p className="text-xs text-gray-400 text-center mb-6">
          Розрахунок: зарплата 35 000 грн → 208 грн/год × 2.5 год економії/тижд = ~2 240 грн/міс на людину.{" "}
          <a href="#calculator" className="text-[#1a56db] hover:underline">
            Змінити параметри в калькуляторі ↓
          </a>
        </p>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="#consultation"
          className="flex-1 text-center px-6 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          Замовити консультацію
        </a>
        <a
          href="https://accelerator.aiadvisoryboard.me/register?plan=trial"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-6 py-3.5 border-2 border-[#1a56db] text-[#1a56db] hover:bg-[#1a56db] hover:text-white font-semibold rounded-lg transition-all"
        >
          Спробувати безкоштовно
        </a>
      </div>

      {/* Trial note */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Перший модуль — безкоштовно, без картки.
        {people >= 100 && " Більше 100 людей? Напишіть: ceo@aiadvisoryboard.me"}
      </p>
    </div>
  );
}
