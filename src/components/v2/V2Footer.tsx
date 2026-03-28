import { EMAIL, TELEGRAM_URL, LINKEDIN_URL } from "@/lib/constants";

export default function V2Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-lg font-bold mb-2">
              AI <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Upskill</span>
            </p>
            <p className="text-sm text-white/30">Впровадження AI в бізнес</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <a href="#program" className="text-white/30 hover:text-white/60 transition-colors">Програма</a>
            <a href="#pricing" className="text-white/30 hover:text-white/60 transition-colors">Ціни</a>
            <a href="#faq" className="text-white/30 hover:text-white/60 transition-colors">FAQ</a>
            <a href="#author" className="text-white/30 hover:text-white/60 transition-colors">Про нас</a>
          </div>

          <div className="text-sm space-y-2">
            <a href={`mailto:${EMAIL}`} className="block text-white/30 hover:text-white/60 transition-colors">{EMAIL}</a>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="block text-white/30 hover:text-white/60 transition-colors">Telegram</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="block text-white/30 hover:text-white/60 transition-colors">LinkedIn</a>
          </div>
        </div>
        <div className="v2-divider my-8" />
        <p className="text-center text-xs text-white/20">&copy; 2026 AI Upskill. Всі права захищені.</p>
      </div>
    </footer>
  );
}
