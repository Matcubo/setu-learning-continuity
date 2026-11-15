import { beforeEach, describe, expect, it } from 'vitest'
import { allStateOptions, boardOptions, curricula, gradeOptions, languageOptions, schoolStageOptions, subjectSuggestions } from './curricula'
import { loadCases, saveCases } from '../services/storage'
import { TransitionCase } from '../types'

function setupLocalStorageMock() {
  const store = new Map<string, string>()

  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value)
      },
      removeItem: (key: string) => {
        store.delete(key)
      },
      clear: () => {
        store.clear()
      },
    },
    configurable: true,
  })
}

describe('national coverage and curriculum metadata', () => {
  beforeEach(() => {
    setupLocalStorageMock()
    saveCases([])
  })
  it('covers all 28 states and 8 union territories', () => {
    expect(allStateOptions).toHaveLength(36)
    expect(allStateOptions.filter((option) => option.regionType === 'state')).toHaveLength(28)
    expect(allStateOptions.filter((option) => option.regionType === 'union-territory')).toHaveLength(8)
  })

  it('supports grades 1 through 12 and stage labels', () => {
    expect(gradeOptions).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    expect(schoolStageOptions).toEqual(['Foundational', 'Preparatory', 'Middle', 'Secondary'])
  })

  it('includes national, regional and teacher-defined boards', () => {
    expect(boardOptions.map((board) => board.name)).toEqual([
      'CBSE',
      'CISCE (ICSE/ISC)',
      'NIOS',
      'State/UT board',
      'Other recognized board',
      'Teacher-defined curriculum',
    ])
  })

  it('keeps the existing Bihar and Gujarat Class 6 curriculum samples', () => {
    expect(curricula.map((curriculum) => curriculum.id)).toEqual(expect.arrayContaining(['bihar-class6-std', 'gujarat-class6-std']))
    expect(curricula.some((curriculum) => curriculum.state === 'Bihar' && curriculum.grade === '6')).toBe(true)
    expect(curricula.some((curriculum) => curriculum.state === 'Gujarat' && curriculum.grade === '6')).toBe(true)
  })

  it('offers subject and language choices for teaching support', () => {
    expect(subjectSuggestions).toContain('Mathematics')
    expect(subjectSuggestions).toContain('Computer Science')
    expect(languageOptions).toContain('English')
    expect(languageOptions).toContain('Gujarati')
    expect(languageOptions).toContain('Hindi')
    expect(languageOptions).toContain('Other')
  })

  it('allows creating a Madhya Pradesh to Gujarat case when no curriculum IDs exist', () => {
    const nextCase: TransitionCase = {
      id: 'case-mp-gujarat-8',
      studentName: 'Aanya Sharma',
      currentClass: '8',
      sourceState: 'Madhya Pradesh',
      destinationState: 'Gujarat',
      previousLanguage: 'Hindi',
      preferredLanguage: 'Gujarati',
      sourceCurriculumId: null,
      destinationCurriculumId: null,
      academicRecords: [{ subject: 'Mathematics', completedTopicIds: ['fractions'], observations: 'Baseline observed' }],
      evidence: [],
      teacherNotes: 'Teacher-led support plan required.',
      status: 'new',
      createdAt: new Date().toISOString(),
      schoolStage: 'Middle',
      board: 'state-board',
      grade: '8',
    }

    saveCases([nextCase])
    const stored = loadCases()

    expect(stored).toHaveLength(1)
    expect(stored[0].studentName).toBe('Aanya Sharma')
    expect(stored[0].sourceState).toBe('Madhya Pradesh')
    expect(stored[0].destinationState).toBe('Gujarat')
    expect(stored[0].currentClass).toBe('8')
    expect(stored[0].sourceCurriculumId).toBeNull()
    expect(stored[0].destinationCurriculumId).toBeNull()
  })

  it('allows a Gujarat to Gujarat transfer using the same curriculum', () => {
    const sameStateCase: TransitionCase = {
      id: 'case-gujarat-same-state',
      studentName: 'Harsh Patel',
      currentClass: '6',
      sourceState: 'Gujarat',
      destinationState: 'Gujarat',
      previousLanguage: 'Gujarati',
      preferredLanguage: 'Gujarati',
      sourceCurriculumId: 'gujarat-class6-std',
      destinationCurriculumId: 'gujarat-class6-std',
      academicRecords: [{ subject: 'Science', completedTopicIds: ['s-life-cells'], observations: 'Strong baseline' }],
      evidence: [],
      teacherNotes: 'Within-state transfer configured.',
      status: 'new',
      createdAt: new Date().toISOString(),
      schoolStage: 'Middle',
      board: 'state-board',
      grade: '6',
    }

    saveCases([sameStateCase])
    const stored = loadCases()

    expect(stored).toHaveLength(1)
    expect(stored[0].sourceCurriculumId).toBe('gujarat-class6-std')
    expect(stored[0].destinationCurriculumId).toBe('gujarat-class6-std')
  })
})
