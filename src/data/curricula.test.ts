import { describe, expect, it } from 'vitest'
import { allStateOptions, boardOptions, curricula, gradeOptions, languageOptions, schoolStageOptions, subjectSuggestions } from './curricula'

describe('national coverage and curriculum metadata', () => {
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
})
