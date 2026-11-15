# setu-learning-continuity
SETU — Student Education Transition & Upliftment.

SETU is an open-source learning-continuity prototype for migratory students in India. It helps teachers capture academic evidence, compare curricula across regions, and generate a focused four-week bridge plan for a student moving between schools.

## Purpose and impact
The platform supports national student transitions across Indian states and union territories, with a teacher-first workflow for reviewing academic records, identifying likely learning gaps, and preparing continuity support.

## Features
- Student transition case management
- State and union territory coverage for all Indian regions
- Grade coverage for Classes 1–12
- Board-aware curriculum selection and demo curriculum metadata
- Evidence capture and curriculum comparison
- Rule-based four-week transition plan generation
- Browser-local persistence for demo data
- Responsive dashboard and transition workflow

## Supported regions and grades
- 28 states and 8 union territories
- Classes 1–12
- Stage labels: Foundational, Preparatory, Middle, Secondary

## Real curriculum data coverage
This prototype keeps the existing Bihar and Gujarat Class 6 demo curricula and does not claim full official coverage for every state or board. Where curriculum mapping is unavailable, the UI surfaces the appropriate message rather than inventing unsupported data.

## Architecture
- React + Vite + TypeScript
- Local browser storage for demo case records
- Deterministic academic comparison and plan generation services
- Curriculum metadata and state/board coverage in typed data modules

## Setup
```bash
npm install
npm run dev
```

## Testing
```bash
npx vitest run
npm run build
```

## Demo workflow
1. Open the teacher dashboard.
2. Create a transition case.
3. Select source and destination states, grade, language preferences, and board.
4. Review evidence and generated curriculum comparison.
5. Generate and approve a bridge plan.

## Known limitations
- Demo data is intentionally limited to sample curricula and browser-local state.
- This is not a production-grade student records system or a live AI integration.
- Actual academic content for every Indian state and board is not fully represented in the prototype.

## Deployment
This app can be deployed as a static frontend to any lightweight hosting platform such as Vercel or Netlify. For production use, replace browser-local storage with a secure backend and identity-aware record management system.
