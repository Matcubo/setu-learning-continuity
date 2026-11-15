import { Board, Curriculum, SchoolStage, StateOption } from '../types'

export const indianStates: StateOption[] = [
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', regionType: 'state' },
  { id: 'arunachal-pradesh', name: 'Arunachal Pradesh', regionType: 'state' },
  { id: 'assam', name: 'Assam', regionType: 'state' },
  { id: 'bihar', name: 'Bihar', regionType: 'state' },
  { id: 'chhattisgarh', name: 'Chhattisgarh', regionType: 'state' },
  { id: 'goa', name: 'Goa', regionType: 'state' },
  { id: 'gujarat', name: 'Gujarat', regionType: 'state' },
  { id: 'haryana', name: 'Haryana', regionType: 'state' },
  { id: 'himachal-pradesh', name: 'Himachal Pradesh', regionType: 'state' },
  { id: 'jharkhand', name: 'Jharkhand', regionType: 'state' },
  { id: 'karnataka', name: 'Karnataka', regionType: 'state' },
  { id: 'kerala', name: 'Kerala', regionType: 'state' },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh', regionType: 'state' },
  { id: 'maharashtra', name: 'Maharashtra', regionType: 'state' },
  { id: 'manipur', name: 'Manipur', regionType: 'state' },
  { id: 'meghalaya', name: 'Meghalaya', regionType: 'state' },
  { id: 'mizoram', name: 'Mizoram', regionType: 'state' },
  { id: 'nagaland', name: 'Nagaland', regionType: 'state' },
  { id: 'odisha', name: 'Odisha', regionType: 'state' },
  { id: 'punjab', name: 'Punjab', regionType: 'state' },
  { id: 'rajasthan', name: 'Rajasthan', regionType: 'state' },
  { id: 'sikkim', name: 'Sikkim', regionType: 'state' },
  { id: 'tamil-nadu', name: 'Tamil Nadu', regionType: 'state' },
  { id: 'telangana', name: 'Telangana', regionType: 'state' },
  { id: 'tripura', name: 'Tripura', regionType: 'state' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', regionType: 'state' },
  { id: 'uttarakhand', name: 'Uttarakhand', regionType: 'state' },
  { id: 'west-bengal', name: 'West Bengal', regionType: 'state' },
]

export const unionTerritories: StateOption[] = [
  { id: 'andaman-nicobar-islands', name: 'Andaman and Nicobar Islands', regionType: 'union-territory' },
  { id: 'chandigarh', name: 'Chandigarh', regionType: 'union-territory' },
  { id: 'dadra-nagar-haveli-daman-diu', name: 'Dadra and Nagar Haveli and Daman and Diu', regionType: 'union-territory' },
  { id: 'delhi', name: 'Delhi', regionType: 'union-territory' },
  { id: 'jammu-kashmir', name: 'Jammu and Kashmir', regionType: 'union-territory' },
  { id: 'ladakh', name: 'Ladakh', regionType: 'union-territory' },
  { id: 'lakshadweep', name: 'Lakshadweep', regionType: 'union-territory' },
  { id: 'puducherry', name: 'Puducherry', regionType: 'union-territory' },
]

export const allStateOptions: StateOption[] = [...indianStates, ...unionTerritories]
export const INDIAN_STATES = indianStates
export const UNION_TERRITORIES = unionTerritories
export const NATIONAL_STATE_OPTIONS = allStateOptions

export const gradeOptions = Array.from({ length: 12 }, (_, index) => String(index + 1))

export const schoolStageOptions: SchoolStage[] = ['Foundational', 'Preparatory', 'Middle', 'Secondary']

export const boardOptions: Board[] = [
  { id: 'cbse', name: 'CBSE', type: 'national', region: 'National' },
  { id: 'cisce', name: 'CISCE (ICSE/ISC)', type: 'national', region: 'National' },
  { id: 'nios', name: 'NIOS', type: 'national', region: 'National' },
  { id: 'state-board', name: 'State/UT board', type: 'regional', region: 'Regional' },
  { id: 'other-board', name: 'Other recognized board', type: 'other', region: 'Regional' },
  { id: 'teacher-defined', name: 'Teacher-defined curriculum', type: 'teacher-defined', region: 'Custom' },
]

export const subjectSuggestions = [
  'Mathematics',
  'Science',
  'Environmental Studies',
  'English',
  'Hindi',
  'Regional Language',
  'Social Science',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Accountancy',
  'Business Studies',
  'Economics',
  'Other / custom subject',
]

export const languageOptions = [
  'English',
  'Hindi',
  'Assamese',
  'Bengali',
  'Bodo',
  'Dogri',
  'Gujarati',
  'Kannada',
  'Kashmiri',
  'Konkani',
  'Maithili',
  'Malayalam',
  'Manipuri',
  'Marathi',
  'Nepali',
  'Oriya',
  'Punjabi',
  'Sanskrit',
  'Santali',
  'Sindhi',
  'Tamil',
  'Telugu',
  'Urdu',
  'Other',
]

export function getCurriculumOptionsForState(state: string, grade: string, board?: string): Curriculum[] {
  const exact = curricula.filter((curriculum) => {
    const matchesState = curriculum.state === state
    const matchesGrade = curriculum.grade === grade
    const matchesBoard = !board || !curriculum.board || curriculum.board === board
    return matchesState && matchesGrade && matchesBoard
  })

  if (exact.length > 0) return exact

  return curricula.filter((curriculum) => curriculum.state === state && curriculum.grade === grade)
}

export function getDefaultCurriculumForState(state: string, grade: string, board?: string): string {
  return getCurriculumOptionsForState(state, grade, board)[0]?.id ?? ''
}

export const curricula: Curriculum[] = [
  {
    id: 'bihar-class6-std',
    title: 'Bihar Class 6 Demonstration Curriculum',
    grade: '6',
    state: 'Bihar',
    board: 'state-board',
    note: 'Demonstration dataset — illustrative only.',
    subjects: {
      Mathematics: [
        { id: 'm-num-fractions', title: 'Numbers & Fractions', description: 'Basic fractions, equivalence and operations' },
        { id: 'm-geom-basic', title: 'Basic Geometry', description: 'Shapes, perimeter, area basics' },
        { id: 'm-data-intro', title: 'Data Handling', description: 'Simple graphs and tables' }
      ],
      Science: [
        { id: 's-life-cells', title: 'Life Processes: Cells', description: 'Plant and animal cells overview' },
        { id: 's-chem-matter', title: 'Matter & Materials', description: 'States of matter and mixtures' },
        { id: 's-energy-basic', title: 'Energy', description: 'Types of energy and simple experiments' }
      ]
    }
  },
  {
    id: 'gujarat-class6-std',
    title: 'Gujarat Class 6 Demonstration Curriculum',
    grade: '6',
    state: 'Gujarat',
    board: 'state-board',
    note: 'Demonstration dataset — illustrative only.',
    subjects: {
      Mathematics: [
        { id: 'm-num-fractions', title: 'Numbers & Fractions', description: 'Fractions, equivalence, comparison' },
        { id: 'm-geom-angles', title: 'Geometry: Angles & Lines', description: 'Angles, types of lines' },
        { id: 'm-data-intro', title: 'Data and Graphs', description: 'Bar graphs and simple interpretation' }
      ],
      Science: [
        { id: 's-life-cells', title: 'Life: Cells & Organisms', description: 'Cells and functions' },
        { id: 's-chem-matter', title: 'Matter', description: 'States and properties of matter' },
        { id: 's-earth', title: 'Earth & Environment', description: 'Basic environmental studies' }
      ]
    }
  }
]
