"use client";

import { useState } from "react";

interface ShareProps {
  pageUrl: string;
  roleName?: string;
  industryName?: string;
  paybackDays?: number;
  pricePerPerson?: number;
  durationDays?: number;
  className?: string;
}

export default function ShareWithManager({
  pageUrl,
  roleName,
  industryName,
  paybackDays,
  pricePerPerson,
  durationDays = 5,
  className = "",
}: ShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const roleContext = roleName && industryName
      ? `\nДеталі для нашої ролі (${roleName} в ${industryName}): ${pageUrl}`
      : `\nДеталі: ${pageUrl}`;

    const text = `Привіт!

Знайшов курс з AI-автоматизацій, який може бути корисний нашій команді.

Що це: ${durationDays}-денний курс, де кожен учасник будує працюючу автоматизацію для своєї роботи. Не теорія — реальний інструмент, який працює 24/7.

Ціна: від $${pricePerPerson || 49}/людину (залежить від кількості).
Перший модуль — безкоштовно, можна спробувати.${paybackDays ? `\nОкупність: ${paybackDays} днів на основі типових кейсів.` : ""}
${roleContext}

Подивись приклади автоматизацій — там конкретні ланцюжки з цифрами.`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 hover:border-[#1a56db] hover:text-[#1a56db] rounded-lg font-medium transition-all text-sm"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {copied ? "Скопійовано!" : "Надіслати керівнику"}
      </button>

      {copied && (
        <div className="mt-2 text-sm text-green-600 animate-in fade-in">
          ✅ Скопійовано! Відправте в месенджер або email.
        </div>
      )}
    </div>
  );
}
