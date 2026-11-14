import { TransitionCase } from '../types'

const STORAGE_KEY = 'setu_demo_cases_v1'

export function loadCases(): TransitionCase[]{
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(!raw) return []
    return JSON.parse(raw) as TransitionCase[]
  }catch(e){
    console.error('Failed loading cases', e)
    return []
  }
}

export function saveCases(cases: TransitionCase[]){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases))
}

export function seedSampleCases(sampleCases: TransitionCase[]){
  const existing = loadCases()
  if(existing.length ===0){
    saveCases(sampleCases)
  }
}
