import { NAV_ITEMS, TELEGRAM_URL, LINKEDIN_URL, EMAIL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-surface-dark text-text-on-dark py-12">
      <div className="container-main">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="text-xl font-bold mb-2">AI Upskill</p>
            <p className="text-gray-400 text-sm">Впровадження AI в бізнес</p>
          </div>

          {/* Navigation */}
          <div>
            <div className="flex flex-wrap gap-4 text-sm">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#author"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Про нас
              </a>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Також від нас:</p>
              <a
                href="https://aiadvisoryboard.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors block"
              >
                &rarr; AI Advisory Board — щоденний AI-помічник для керівника
              </a>
              <p className="text-gray-600 text-xs mt-1">
                Крок 3 вашої трансформації. Перший місяць безкоштовно для випускників.
              </p>
            </div>
          </div>

          {/* Contacts */}
          <div className="text-sm space-y-2">
            <a
              href={`mailto:${EMAIL}`}
              className="block text-gray-400 hover:text-white transition-colors"
            >
              {EMAIL}
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 hover:text-white transition-colors"
            >
              t.me/YaroslavMaxymovych
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn: /in/yaroslavmaxymovych
            </a>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />
        <p className="text-center text-sm text-gray-500">
          &copy; 2026 AI Upskill. Всі права захищені.
        </p>
      </div>
    </footer>
  );
}
