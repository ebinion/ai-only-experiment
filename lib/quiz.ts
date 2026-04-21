export const QUIZ_STORAGE_KEY = "pet-quiz-v1";
const QUIZ_CHANGE_EVENT = "quiz-storage-changed";

export type QuizAnswers = Partial<{
  // US-006: Living situation
  livingType: "house" | "apartment" | "shared";
  yardAccess: "yes" | "no";
  ownershipType: "own" | "rent";

  // US-007: Activity level
  activityLevel: "sedentary" | "moderate" | "active";
  hoursAlone: string;
  petExperience: "first-time" | "some" | "experienced";

  // US-008: Household
  adults: number;
  hasChildren: boolean;
  childrenAges: string[];
  otherPets: "none" | "dogs" | "cats" | "both";

  // US-009: Pet preferences
  species: "dog" | "cat" | "small" | "any";
  sizePreference: "small" | "medium" | "large" | "any";
  agePreference: "puppy-kitten" | "young-adult" | "adult" | "senior" | "any";
  genderPreference: "male" | "female" | "any";
  sheddingTolerance: "low" | "any";
  allergies: "yes" | "no";

  // US-010: Temperament & needs
  energyLevel: "calm" | "moderate" | "energetic";
  affectionLevel: "independent" | "moderate" | "velcro";
  specialNeeds: "yes" | "no";

  // US-011: Location
  location: string;
}>;

// Module-level cache so useSyncExternalStore gets stable references
let _cachedRaw: string | null = null;
let _cachedParsed: QuizAnswers = {};

export function getAnswersSnapshot(): QuizAnswers {
  const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
  if (raw !== _cachedRaw) {
    _cachedRaw = raw;
    try {
      _cachedParsed = raw ? JSON.parse(raw) : {};
    } catch {
      _cachedParsed = {};
    }
  }
  return _cachedParsed;
}

export const getServerSnapshot = (): QuizAnswers => ({});

export function subscribeToAnswers(callback: () => void): () => void {
  window.addEventListener(QUIZ_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(QUIZ_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function saveQuizAnswers(answers: QuizAnswers): void {
  _cachedRaw = JSON.stringify(answers);
  _cachedParsed = answers;
  localStorage.setItem(QUIZ_STORAGE_KEY, _cachedRaw);
  window.dispatchEvent(new Event(QUIZ_CHANGE_EVENT));
}
