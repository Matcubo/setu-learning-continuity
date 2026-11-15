import { TransitionCase } from '../types'

const STORAGE_KEY = 'setu_demo_cases_v1'
const SETTINGS_KEY = 'setu_demo_settings_v1'

export function normalizeCaseRecord(caseRecord: Partial<TransitionCase>): TransitionCase {
  const normalized: TransitionCase = {
    id: caseRecord.id ?? `case-${Date.now()}`,
    studentName: caseRecord.studentName ?? 'Student',
    currentClass: caseRecord.currentClass ?? '6',
    sourceState: caseRecord.sourceState ?? 'Unknown state',
    destinationState: caseRecord.destinationState ?? 'Unknown state',
    previousLanguage: caseRecord.previousLanguage ?? 'English',
    preferredLanguage: caseRecord.preferredLanguage ?? 'English',
    sourceCurriculumId: caseRecord.sourceCurriculumId ?? null,
    destinationCurriculumId: caseRecord.destinationCurriculumId ?? null,
    academicRecords: caseRecord.academicRecords ?? [],
    evidence: caseRecord.evidence ?? [],
    teacherNotes: caseRecord.teacherNotes ?? '',
    status: caseRecord.status ?? 'new',
    createdAt: caseRecord.createdAt ?? new Date().toISOString(),
    schoolStage: caseRecord.schoolStage,
    board: caseRecord.board,
    grade: caseRecord.grade,
    plan: caseRecord.plan,
  }

  return normalized
}

export function loadCases(): TransitionCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as TransitionCase[]
    return Array.isArray(parsed) ? parsed.map((item) => normalizeCaseRecord(item)) : []
  } catch (error) {
    console.error('Failed loading cases', error)
    return []
  }
}

export function saveCases(cases: TransitionCase[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases.map((item) => normalizeCaseRecord(item))))
}

export function seedSampleCases(sampleCases: TransitionCase[]) {
  const existing = loadCases()
  if (existing.length === 0) {
    saveCases(sampleCases)
  }
}

export function loadSettings(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, string>
  } catch (error) {
    console.error('Failed loading settings', error)
    return {}
  }
}

export function saveSettings(settings: Record<string, string>) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function exportCaseData() {
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    cases: loadCases(),
    settings: loadSettings(),
  }

  return JSON.stringify(payload, null, 2)
}

export function importCaseData(raw: string): { ok: boolean; message: string; count?: number } {
  try {
    const parsed = JSON.parse(raw)
    const items = Array.isArray(parsed?.cases) ? parsed.cases : []
    if (!Array.isArray(parsed?.cases)) {
      return { ok: false, message: 'Imported JSON must contain a "cases" array.' }
    }

    items.forEach((item) => {
      if (!item?.id || !item?.studentName) {
        throw new Error('One or more case records are invalid.')
      }
    })

    saveCases(items)
    if (parsed?.settings && typeof parsed.settings === 'object') {
      saveSettings(parsed.settings)
    }

    return { ok: true, message: 'Import successful.', count: items.length }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Could not import the selected JSON file.',
    }
  }
}
