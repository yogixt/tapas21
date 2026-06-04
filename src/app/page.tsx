import Link from "next/link";

export default function Welcome() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#FAFAFA]">
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#FF6B35]" />
          <span className="text-lg font-semibold tracking-tight text-[#1F2937]">
            tapas21
          </span>
        </div>
        <Link
          href="/login"
          className="rounded-full border border-[#E5E7EB] bg-white px-5 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#1F2937] hover:text-[#1F2937]"
        >
          sign in
        </Link>
      </header>

      <main className="flex flex-1 flex-col justify-center px-6 py-10">
        <div className="mx-auto w-full max-w-sm lg:max-w-lg">
          <div className="mb-10 flex justify-center">
            <div className="relative flex h-44 w-44 items-center justify-center lg:h-52 lg:w-52">
              {/* Minimal concentric circles */}
              <div className="absolute h-44 w-44 rounded-full border-2 border-[#E5E7EB] lg:h-52 lg:w-52" />
              <div className="absolute h-32 w-32 rounded-full border-2 border-[#FF6B35]/20 lg:h-38 lg:w-38" />
              <div className="absolute h-20 w-20 rounded-full bg-[#FF6B35]/10 lg:h-24 lg:w-24" />
              <div className="absolute h-10 w-10 rounded-full bg-[#FF6B35] lg:h-12 lg:w-12" />
              {/* Small orbiting dots */}
              <div className="absolute right-2 top-6 h-2.5 w-2.5 rounded-full bg-[#22C55E] lg:right-3 lg:top-8" />
              <div className="absolute bottom-8 left-4 h-2 w-2 rounded-full bg-[#FF6B35] lg:bottom-10 lg:left-6" />
              <div className="absolute right-4 bottom-6 h-1.5 w-1.5 rounded-full bg-[#1F2937] lg:right-6 lg:bottom-8" />
            </div>
          </div>

          <h1 className="text-center text-4xl font-bold leading-tight tracking-tight text-[#1F2937] lg:text-5xl">
            Transform Yourself
            <br />
            <span className="text-[#FF6B35]">In 21 Days.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xs text-center text-[#6B7280] leading-relaxed">
            Build discipline. Lose weight. Study consistently. Become stronger every day.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#FF6B35] px-8 font-semibold text-white transition-all hover:bg-[#E55A2B] hover:-translate-y-0.5"
            >
              Start Challenge
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-8 font-medium text-[#6B7280] transition-all hover:border-[#1F2937] hover:text-[#1F2937]"
            >
              Learn More
            </Link>
          </div>
        </div>

        <section
          id="features"
          className="mx-auto mt-24 w-full max-w-lg pb-10"
        >
          <div className="card">
            <div className="flex flex-wrap gap-2">
              {[
                "Wake Up 5AM",
                "Yoga",
                "Study 3H",
                "Walk 45m",
                "1500 Cal",
                "Protein 90g",
                "Sleep 10:30PM",
              ].map((text) => (
                <span
                  key={text}
                  className="inline-block rounded-full border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-1.5 text-sm text-[#4B5563]"
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 text-center">
          <p className="text-sm text-[#6B7280]">
            21 days. One new you.
          </p>
        </footer>
      </main>
    </div>
  );
}
