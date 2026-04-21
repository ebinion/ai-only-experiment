"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ArrowRight, PawPrint } from "lucide-react";
import {
  getAnswersSnapshot,
  getServerSnapshot,
  subscribeToAnswers,
  saveQuizAnswers,
  type QuizAnswers,
} from "@/lib/quiz";

// ─── Step configuration ───────────────────────────────────────────────────────

type StepConfig = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  optional?: boolean;
  validate: (a: QuizAnswers) => boolean;
};

const STEPS: StepConfig[] = [
  {
    id: "living",
    label: "Living Situation",
    title: "Where do you call home?",
    subtitle:
      "Your home environment helps us find pets that will genuinely thrive there.",
    validate: (a) => !!a.livingType,
  },
  {
    id: "activity",
    label: "Activity Level",
    title: "How would you describe your lifestyle?",
    subtitle:
      "We'll match you with a pet whose energy fits naturally into your daily rhythm.",
    validate: (a) => !!a.activityLevel,
  },
  {
    id: "household",
    label: "Household",
    title: "Who shares your home?",
    subtitle:
      "Other family members and pets play a big role in long-term compatibility.",
    validate: (a) => !!a.otherPets,
  },
  {
    id: "preferences",
    label: "Pet Preferences",
    title: "What kind of companion are you looking for?",
    subtitle:
      "We'll use this to narrow your results to animals that match what you have in mind.",
    validate: (a) => !!a.species,
  },
  {
    id: "temperament",
    label: "Temperament",
    title: "What personality fits your life best?",
    subtitle:
      "The right temperament makes all the difference in a lasting, happy match.",
    validate: (a) => !!a.energyLevel,
  },
  {
    id: "location",
    label: "Location",
    title: "Where are you located?",
    subtitle:
      "We'll factor distance to shelters and rescues into your match results.",
    optional: true,
    validate: (a) => !!(a.location?.trim()),
  },
];

// ─── Shared option grid ───────────────────────────────────────────────────────

type Option = { id: string; label: string; description?: string };

function OptionGrid({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150",
            "hover:border-primary/50 hover:bg-primary/5",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            value === opt.id
              ? "border-primary bg-primary/10"
              : "border-border bg-card"
          )}
        >
          <div
            className={cn(
              "font-medium text-sm transition-colors",
              value === opt.id ? "text-foreground" : "text-foreground/80"
            )}
          >
            {opt.label}
          </div>
          {opt.description && (
            <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {opt.description}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Step content components (placeholders for US-006 through US-011) ─────────

type StepProps = {
  answers: QuizAnswers;
  onChange: (updates: Partial<QuizAnswers>) => void;
};

function LivingStep({ answers, onChange }: StepProps) {
  return (
    <OptionGrid
      options={[
        {
          id: "house",
          label: "House with yard",
          description: "Private outdoor space available",
        },
        {
          id: "apartment",
          label: "Apartment",
          description: "Indoor living, shared building",
        },
        {
          id: "shared",
          label: "Shared housing",
          description: "Roommates or multi-family home",
        },
      ]}
      value={answers.livingType}
      onChange={(v) => onChange({ livingType: v as QuizAnswers["livingType"] })}
    />
  );
}

function ActivityStep({ answers, onChange }: StepProps) {
  return (
    <OptionGrid
      options={[
        {
          id: "sedentary",
          label: "Relaxed",
          description: "Quiet days, couch time, slow walks",
        },
        {
          id: "moderate",
          label: "Moderately active",
          description: "Daily walks, occasional hikes",
        },
        {
          id: "active",
          label: "Very active",
          description: "Running, outdoor adventures, high energy",
        },
      ]}
      value={answers.activityLevel}
      onChange={(v) =>
        onChange({ activityLevel: v as QuizAnswers["activityLevel"] })
      }
    />
  );
}

function HouseholdStep({ answers, onChange }: StepProps) {
  return (
    <OptionGrid
      options={[
        {
          id: "none",
          label: "No other pets",
          description: "Only humans at home",
        },
        { id: "dogs", label: "Dogs", description: "One or more dogs already" },
        { id: "cats", label: "Cats", description: "One or more cats already" },
        {
          id: "both",
          label: "Dogs and cats",
          description: "A mixed pet household",
        },
      ]}
      value={answers.otherPets}
      onChange={(v) => onChange({ otherPets: v as QuizAnswers["otherPets"] })}
    />
  );
}

function PreferencesStep({ answers, onChange }: StepProps) {
  return (
    <OptionGrid
      options={[
        {
          id: "dog",
          label: "Dog",
          description: "Loyal, social, and active",
        },
        {
          id: "cat",
          label: "Cat",
          description: "Independent, calm, curious",
        },
        {
          id: "small",
          label: "Small animal",
          description: "Rabbit, guinea pig, and more",
        },
        {
          id: "any",
          label: "Open to anything",
          description: "Let the best match decide",
        },
      ]}
      value={answers.species}
      onChange={(v) => onChange({ species: v as QuizAnswers["species"] })}
    />
  );
}

function TemperamentStep({ answers, onChange }: StepProps) {
  return (
    <OptionGrid
      options={[
        {
          id: "calm",
          label: "Calm & gentle",
          description: "Easygoing, low-key, restful",
        },
        {
          id: "moderate",
          label: "Balanced",
          description: "Playful but able to settle down",
        },
        {
          id: "energetic",
          label: "Spirited & energetic",
          description: "Always ready for the next adventure",
        },
      ]}
      value={answers.energyLevel}
      onChange={(v) =>
        onChange({ energyLevel: v as QuizAnswers["energyLevel"] })
      }
    />
  );
}

function LocationStep({ answers, onChange }: StepProps) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Zip code or city, state"
        value={answers.location ?? ""}
        onChange={(e) => onChange({ location: e.target.value })}
        className={cn(
          "w-full px-4 py-3 rounded-xl border-2 border-border bg-card",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "transition-colors duration-150",
          "focus:outline-none focus:border-primary focus:bg-primary/5",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50"
        )}
      />
      <p className="text-xs text-muted-foreground leading-relaxed">
        Used only to calculate distance to shelters and rescues near you.
      </p>
    </div>
  );
}

const STEP_COMPONENTS: React.ComponentType<StepProps>[] = [
  LivingStep,
  ActivityStep,
  HouseholdStep,
  PreferencesStep,
  TemperamentStep,
  LocationStep,
];

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="space-y-2.5">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-[3px] flex-1 rounded-full transition-all duration-500 ease-out",
              i < step
                ? "bg-primary"
                : i === step
                  ? "bg-primary/60"
                  : "bg-border"
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-primary">
          {STEPS[step].label}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {step + 1} of {total}
        </span>
      </div>
    </div>
  );
}

// ─── Quiz shell ───────────────────────────────────────────────────────────────

export default function QuizPage() {
  const answers = useSyncExternalStore(
    subscribeToAnswers,
    getAnswersSnapshot,
    getServerSnapshot
  );

  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const updateAnswers = useCallback(
    (updates: Partial<QuizAnswers>) => {
      saveQuizAnswers({ ...answers, ...updates });
    },
    [answers]
  );

  const config = STEPS[step];
  const isValid = config.validate(answers);
  const canProceed = isValid || !!config.optional;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  function navigate(delta: 1 | -1) {
    setDirection(delta === 1 ? "forward" : "backward");
    setAnimKey((k) => k + 1);
    setStep((s) => s + delta);
  }

  function handleSubmit() {
    // Triggers US-003 match scoring API
    console.log("Quiz submitted:", answers);
  }

  const StepContent = STEP_COMPONENTS[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-5 sm:px-8 h-14 border-b border-border/60">
        <div className="flex items-center gap-2 text-foreground">
          <PawPrint className="size-4 text-primary" strokeWidth={2.5} />
          <span className="text-sm font-semibold tracking-tight">
            PetMatch
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="flex-none px-5 sm:px-8 pt-6 pb-4">
        <div className="max-w-xl mx-auto">
          <ProgressBar step={step} total={STEPS.length} />
        </div>
      </div>

      {/* Step content */}
      <main className="flex-1 flex flex-col justify-center px-5 sm:px-8 py-6">
        <div className="max-w-xl mx-auto w-full">
          <div
            key={animKey}
            style={{
              animation: `${
                direction === "forward"
                  ? "quizSlideInRight"
                  : "quizSlideInLeft"
              } 260ms cubic-bezier(0.22, 0.61, 0.36, 1) both`,
            }}
          >
            {/* Step header */}
            <div className="mb-7">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
                {config.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {config.subtitle}
              </p>
              {config.optional && (
                <span className="inline-block mt-2 text-[11px] text-muted-foreground/70 bg-muted rounded-full px-2.5 py-0.5">
                  Optional — you can skip this step
                </span>
              )}
            </div>

            {/* Step input */}
            <StepContent answers={answers} onChange={updateAnswers} />
          </div>
        </div>
      </main>

      {/* Navigation */}
      <footer className="flex-none border-t border-border/60 px-5 sm:px-8 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            disabled={isFirst}
            className={cn(
              "gap-1 text-muted-foreground",
              isFirst && "invisible"
            )}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>

          {isLast ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!canProceed}
              className="gap-2 px-7 font-semibold"
            >
              Find My Match
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              size="default"
              onClick={() => navigate(1)}
              disabled={!canProceed}
              className="gap-1.5"
            >
              {config.optional && !isValid ? "Skip" : "Continue"}
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </footer>

      <style>{`
        @keyframes quizSlideInRight {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes quizSlideInLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
