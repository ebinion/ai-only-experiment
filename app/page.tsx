import Link from "next/link";
import { Button } from "@/components/ui/button";

function PawPrint({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="50" cy="68" rx="21" ry="16" />
      <circle cx="25" cy="40" r="10" />
      <circle cx="42" cy="30" r="10" />
      <circle cx="60" cy="30" r="10" />
      <circle cx="76" cy="42" r="10" />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    title: "Tell us about yourself",
    description:
      "Answer a short quiz about your living situation, activity level, household, and what you're hoping for in a pet.",
  },
  {
    number: "02",
    title: "We score your matches",
    description:
      "Our engine applies hard filters first, then scores every available pet on personality, temperament, and household compatibility.",
  },
  {
    number: "03",
    title: "Meet your match",
    description:
      "Browse ranked results with per-category score breakdowns, read full profiles, and reach out to the shelter when ready.",
  },
];

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40%       { transform: translateY(-14px) rotate(2deg); }
          70%       { transform: translateY(-6px) rotate(-1.5deg); }
        }
        @keyframes drift-alt {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          30%       { transform: translateY(-10px) rotate(-2deg); }
          65%       { transform: translateY(-18px) rotate(1deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .drift     { animation: drift     9s  ease-in-out infinite; }
        .drift-alt { animation: drift-alt 11s ease-in-out infinite; }
        .reveal-0  { animation: fade-up 0.6s 0s    ease both; }
        .reveal-1  { animation: fade-up 0.6s 0.12s ease both; }
        .reveal-2  { animation: fade-up 0.6s 0.25s ease both; }
        .reveal-3  { animation: fade-up 0.6s 0.38s ease both; }
      `}</style>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="max-w-7xl mx-auto px-8 py-6 flex items-center">
          <div className="flex items-center gap-2.5">
            <PawPrint className="size-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">PetMatch</span>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-8 pt-8 pb-24 md:pt-16 md:pb-32 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="reveal-0 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Personalized pet matching
            </div>

            <h1 className="reveal-1 text-5xl md:text-6xl lg:text-[5.25rem] font-extrabold leading-[1.04] tracking-tight">
              Not just any pet.
              <br />
              <span className="text-primary">The right one.</span>
            </h1>

            <p className="reveal-2 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[500px]">
              Answer a short quiz about your lifestyle and we match you with
              pets that genuinely fit — energy, temperament, household
              compatibility, and proximity all considered.
            </p>

            <div className="reveal-3 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base rounded-2xl"
              >
                <Link href="/quiz">Find My Match →</Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Free · No account required · ~3 minutes
              </p>
            </div>
          </div>

          {/* Decorative illustration */}
          <div className="hidden md:flex relative items-center justify-center h-[440px]">
            <div className="drift absolute size-[380px] rounded-full border-2 border-dashed border-primary/20" />
            <div className="drift-alt absolute size-[290px] rounded-full bg-primary/[0.08]" />
            <div className="absolute size-[200px] rounded-full bg-primary/[0.15] flex items-center justify-center">
              <div className="size-[142px] rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
                <PawPrint className="size-[68px] text-primary-foreground" />
              </div>
            </div>

            {/* Floating context badges */}
            <div
              className="drift absolute top-10 right-2 bg-card border border-border rounded-2xl shadow-sm px-4 py-2.5"
              style={{ animationDelay: "-2s" }}
            >
              <p className="text-xs text-muted-foreground">Match score</p>
              <p className="text-sm font-semibold text-foreground">
                96% compatibility
              </p>
            </div>
            <div className="drift-alt absolute bottom-20 left-0 bg-card border border-border rounded-2xl shadow-sm px-4 py-2.5">
              <p className="text-xs text-muted-foreground">Coverage</p>
              <p className="text-sm font-semibold text-foreground">
                20+ shelters nearby
              </p>
            </div>
            <div
              className="drift absolute bottom-6 right-10 bg-card border border-border rounded-2xl shadow-sm px-4 py-2.5"
              style={{ animationDelay: "-5s" }}
            >
              <p className="text-xs text-muted-foreground">Available now</p>
              <p className="text-sm font-semibold text-foreground">
                150+ pets ready
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/50">
          <div className="max-w-7xl mx-auto px-8 py-20 md:py-28">
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
              <p className="text-muted-foreground text-lg">
                Your perfect match in three steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-background rounded-3xl p-8 space-y-5 border border-border/50"
                >
                  <span className="block text-5xl font-black text-primary/20 leading-none">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-7xl mx-auto px-8 py-24 md:py-32 flex flex-col items-center text-center gap-6">
          <PawPrint className="size-10 text-primary/25" />
          <h2 className="text-4xl md:text-5xl font-bold max-w-xl leading-tight">
            Your perfect companion is out there.
          </h2>
          <p className="text-muted-foreground text-xl">
            Takes about 3 minutes to find them.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-2 h-12 px-10 text-base rounded-2xl"
          >
            <Link href="/quiz">Start the Quiz →</Link>
          </Button>
        </section>
      </div>
    </>
  );
}
