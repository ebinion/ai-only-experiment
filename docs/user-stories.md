# User Stories

Each story has a unique ID and a `dependencies` list referencing the IDs of stories that must be complete before work can begin.

---

## Infrastructure & Data

### US-001 — Seed mock pet data
**As a** developer,  
**I want** a seeded dataset of mock pets,  
**so that** the application has realistic inventory to match against.

**Acceptance Criteria:**
- At least 50 pets across dogs and cats (stretch: small animals)
- Each pet includes: name, species, breed, age, gender, weight, size category, energy level, affection level, temperament tags, shedding level, bio, health status (vaccinations, spayed/neutered, known conditions), special needs flag, adoption status (available / pending / adopted), and multiple photo URLs
- Each pet is associated with a shelter (US-002)

**Dependencies:** `US-002`

---

### US-002 — Seed mock shelter and rescue data
**As a** developer,  
**I want** a seeded dataset of mock shelters and rescues,  
**so that** pets can be associated with an organization and distance can be calculated.

**Acceptance Criteria:**
- At least 20 organizations across varied US cities
- Each record includes: name, type (shelter / rescue), city, state, lat/lng, contact email, phone
- Mix of urban, suburban, and rural locations to exercise distance filtering

**Dependencies:** none

---

### US-003 — Match scoring API endpoint
**As a** developer,  
**I want** a server-side API endpoint that accepts quiz answers and returns a ranked list of pets with scores,  
**so that** match logic lives server-side and can be replaced with ML scoring in the future.

**Acceptance Criteria:**
- Accepts structured quiz answers (see quiz stories) and adopter location
- Applies hard filters first: species, size vs. housing type, special needs opt-in
- Applies soft scoring: activity match, temperament match, household compatibility (children, other pets), adopter experience vs. pet difficulty, distance from adopter
- Returns pets sorted by descending match score, each with a numeric score and score breakdown by category
- Returns an empty array (not an error) when no pets pass hard filters

**Dependencies:** `US-001`, `US-002`

---

## Landing

### US-004 — Landing page
**As an** adopter,  
**I want** a clear, welcoming landing page,  
**so that** I understand what the product does and can begin my search.

**Acceptance Criteria:**
- Communicates the value proposition: finding the *right* pet, not just any pet
- Single prominent CTA that navigates to the quiz
- No login required

**Dependencies:** none

---

## Lifestyle Quiz

### US-005 — Quiz shell with progress and navigation
**As an** adopter,  
**I want** a multi-step quiz container with a progress indicator and back/forward navigation,  
**so that** I can move through questions at my own pace and correct earlier answers.

**Acceptance Criteria:**
- Progress indicator showing current step and total steps
- Back navigation returns to the previous step without clearing answers
- Answers persist across the session (localStorage or equivalent) so a page refresh does not lose progress
- Forward navigation is disabled until the current step has a valid answer (non-critical steps may be skipped)
- Final step has a "Find My Match" submit action that triggers US-003

**Dependencies:** none

---

### US-006 — Quiz step: Living situation
**As an** adopter,  
**I want** to answer questions about my living situation,  
**so that** pets incompatible with my home are filtered out.

**Acceptance Criteria:**
- Captures: housing type (house with yard / apartment / shared housing), yard access (yes / no), renting vs. owning
- Answers are stored in quiz state and submitted with the full quiz payload

**Dependencies:** `US-005`

---

### US-007 — Quiz step: Activity level
**As an** adopter,  
**I want** to describe my activity level and schedule,  
**so that** pets are matched to how active I am and how much alone time they'd have.

**Acceptance Criteria:**
- Captures: daily activity level (sedentary / moderate / highly active), hours per day pet would be alone, pet ownership experience (first-time / some experience / experienced)
- Answers are stored in quiz state

**Dependencies:** `US-005`

---

### US-008 — Quiz step: Household composition
**As an** adopter,  
**I want** to describe who lives in my home,  
**so that** pets are matched based on compatibility with children and other animals.

**Acceptance Criteria:**
- Captures: number of adults, presence and ages of children, other pets in home (none / dogs / cats / both)
- Answers are stored in quiz state

**Dependencies:** `US-005`

---

### US-009 — Quiz step: Pet preferences
**As an** adopter,  
**I want** to specify my preferences for a pet's physical characteristics,  
**so that** results reflect what I'm actually looking for.

**Acceptance Criteria:**
- Captures: species (dog / cat / small animal), size (small / medium / large / no preference), age range (puppy-kitten / young adult / adult / senior / no preference), gender (male / female / no preference), shedding tolerance (low-shedding preferred / no preference), allergy considerations (yes / no)
- Answers are stored in quiz state

**Dependencies:** `US-005`

---

### US-010 — Quiz step: Temperament and special needs
**As an** adopter,  
**I want** to describe the temperament I'm hoping for and whether I'm open to pets with special needs,  
**so that** match scoring reflects personality fit and health considerations.

**Acceptance Criteria:**
- Captures: desired energy level (calm / moderate / energetic), desired affection level (independent / moderate / velcro), openness to special needs or medical history (yes / no)
- Answers are stored in quiz state

**Dependencies:** `US-005`

---

### US-011 — Adopter location capture
**As an** adopter,  
**I want** to provide my location during the quiz,  
**so that** distance to the shelter or rescue is factored into my matches.

**Acceptance Criteria:**
- Captures zip code or city/state input
- Resolves to lat/lng for distance scoring (can use a mock lookup for the challenge)
- Included in the match scoring API payload (US-003)

**Dependencies:** `US-005`

---

## Match Results

### US-012 — Match results page
**As an** adopter,  
**I want** to see a ranked list of pets that match my quiz answers,  
**so that** I can browse the best candidates for my lifestyle.

**Acceptance Criteria:**
- Calls US-003 with quiz answers on load
- Displays each pet as a card: photo, name, species, breed, age, gender, temperament tags, match tier label (e.g. "Great Match" / "Good Match"), adoption status (available now / in foster)
- Paginated or infinite scroll — not all results at once
- Loading state while awaiting API response

**Dependencies:** `US-003`, `US-005`

---

### US-013 — Match results filter panel
**As an** adopter,  
**I want** to filter my match results after seeing them,  
**so that** I can narrow down candidates without retaking the quiz.

**Acceptance Criteria:**
- Filter options: age range, size, gender, max distance
- Filters apply client-side to the current result set
- Active filters are visually indicated and individually dismissible

**Dependencies:** `US-012`

---

### US-014 — Match results sort options
**As an** adopter,  
**I want** to sort my results by different criteria,  
**so that** I can prioritize what matters most to me.

**Acceptance Criteria:**
- Sort options: best match (default), newest, distance
- Sort applies client-side to the current result set

**Dependencies:** `US-012`

---

### US-015 — Match results empty state
**As an** adopter,  
**I want** to see helpful guidance when no strong matches are found,  
**so that** I know what to do next rather than hitting a dead end.

**Acceptance Criteria:**
- Displayed when the API returns an empty result or all results are filtered out
- Explains why there may be no matches (criteria too narrow)
- Provides a clear action to return to the quiz and adjust answers

**Dependencies:** `US-012`

---

## Pet Profile

### US-016 — Pet profile page
**As an** adopter,  
**I want** a detailed profile page for each pet,  
**so that** I can learn everything I need to decide whether to pursue adoption.

**Acceptance Criteria:**
- Photo gallery (multiple images)
- Displays: name, breed, age, gender, weight, adoption status, temperament tags, full bio, health status (vaccinations, spayed/neutered, known conditions), special needs explanation if applicable
- Shelter/rescue info: organization name, city/state, contact details
- Primary CTA: "Express Interest" (navigates to US-019)
- Secondary action: "Save for Later" (US-018)

**Dependencies:** `US-001`, `US-002`

---

### US-017 — Match breakdown on pet profile
**As an** adopter,  
**I want** to see why a specific pet was matched to me,  
**so that** I can make a more informed decision.

**Acceptance Criteria:**
- Visible on the pet profile only when the user arrived via match results (quiz answers are in session)
- Shows per-category score breakdown: activity, temperament, household, distance
- Plain-language explanation for each category (e.g. "High energy — matches your active lifestyle")

**Dependencies:** `US-016`, `US-003`

---

### US-018 — Save pet for later
**As an** adopter,  
**I want** to bookmark pets I'm interested in,  
**so that** I can compare them and return to them later.

**Acceptance Criteria:**
- Bookmark persists in localStorage (no account required)
- Bookmarked pets are accessible from a saved list view
- Toggle on/off from the pet profile page
- Bookmarked state is reflected on match result cards

**Dependencies:** `US-016`

---

## Contact / Application

### US-019 — Expression of interest form
**As an** adopter,  
**I want** to submit an expression of interest for a specific pet,  
**so that** the shelter or rescue can follow up with me.

**Acceptance Criteria:**
- Fields: name, email, phone, preferred contact method, free-text message
- Pet name and shelter pre-populated from context
- Relevant quiz answers pre-populated in the message field (e.g. household composition, experience level)
- Client-side validation before submission
- Submits to a server action or API route (mock response acceptable for the challenge)

**Dependencies:** `US-016`, `US-005`

---

### US-020 — Submission confirmation screen
**As an** adopter,  
**I want** a confirmation screen after submitting my expression of interest,  
**so that** I know what to expect next.

**Acceptance Criteria:**
- Confirms which pet and shelter the inquiry was sent to
- Sets expectations for shelter follow-up timeline
- Offers a path back to match results or to save the pet (US-018)
- Graceful error state if submission fails

**Dependencies:** `US-019`
