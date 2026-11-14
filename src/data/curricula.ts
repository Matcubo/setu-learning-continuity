import { Curriculum } from '../types'

export const curricula: Curriculum[] = [
  {
    id: 'bihar-class6-std',
    title: 'Bihar Class 6 Demonstration Curriculum',
    grade: '6',
    state: 'Bihar',
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
