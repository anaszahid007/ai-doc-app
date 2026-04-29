import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-zinc-950">
      {/* Immersive Hero Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero_bg.png" 
          alt="Background" 
          className="h-full w-full object-cover opacity-20 mix-blend-lighten"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/80 to-zinc-950"></div>
      </div>

      {/* Falling Light Beams (Digital Stream Effect) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[150px] w-[1px] bg-gradient-to-b from-transparent via-blue-400/20 to-white/40 animate-beam-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-150px`,
              animationDuration: `${4 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: 0.1 + Math.random() * 0.3,
            }}
          />
        ))}
        
        {/* Subtle glowing dots at the bottom of some beams */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute h-[2px] w-[2px] rounded-full bg-blue-300 blur-[1px] animate-beam-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              animationDuration: `${6 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 12}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <section className="relative z-10 container mx-auto px-6 flex flex-1 flex-col items-center justify-center text-center py-10">
        <div className="mx-auto max-w-5xl space-y-16">
          {/* Heading */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-5xl font-black tracking-tighter text-white sm:text-8xl lg:text-[120px] leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              Understand <br /> 
              <span className="bg-gradient-to-br from-white via-white to-zinc-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">everything</span> instantly.
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl font-medium text-zinc-500 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              Transform static documents into dynamic conversations. <br className="hidden md:block" />
              Intelligence that feels like second nature.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            <Link
              href="/upload"
              className="group relative flex h-14 md:h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 md:px-10 text-base md:text-lg font-bold text-zinc-950 transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              Get Started Free
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/chat"
              className="flex h-14 md:h-16 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 md:px-10 text-base md:text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 sm:w-auto"
            >
              Open Workspace
            </Link>
          </div>

          {/* Bottom Indicators */}
          <div className="pt-16 md:pt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 border-t border-white/5 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-700">
            {[
              { label: "Processing", val: "Real-time" },
              { label: "AI Stack", val: "Gemini 1.5" },
              { label: "Privacy", val: "End-to-End" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1 md:gap-1.5 text-center">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{stat.label}</span>
                <span className="text-sm md:text-base font-bold text-zinc-300 tracking-tight">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="relative z-10 container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-6 rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-md transition-all hover:bg-white/[0.04]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Instant Summaries</h3>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed">
              Upload hundreds of pages and get a comprehensive summary in seconds. Identify key points, action items, and core themes without reading every line.
            </p>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-md transition-all hover:bg-white/[0.04]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Interactive Q&A</h3>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed">
              Ask your document anything. Whether it's complex legal clauses or technical specs, get clear, concise answers as if you're chatting with the author.
            </p>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-md transition-all hover:bg-white/[0.04]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Grounded Logic</h3>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed">
              Every answer is strictly tied to your uploaded content. Our RAG pipeline ensures that the AI doesn't hallucinate outside of your document's context.
            </p>
          </div>
        </div>

        {/* AI Disclaimer */}
        <div className="mt-24 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-700">
            Doc Chat is powered by AI and can make mistakes. Please verify important information.
          </p>
        </div>
      </section>
    </div>
  );
}
