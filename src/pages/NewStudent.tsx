import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransitionCase } from '../types'
import { loadCases, saveCases } from '../services/storage'
import { curricula } from '../data/curricula'

export default function NewStudent(){
  const navigate = useNavigate()
  const [form, setForm] = useState<Partial<TransitionCase>>({
    studentName: '', currentClass: '6', sourceState: 'Bihar', destinationState: 'Gujarat', previousLanguage: 'Hindi', preferredLanguage: 'Gujarati', sourceCurriculumId: 'bihar-class6-std', destinationCurriculumId: 'gujarat-class6-std'
  })

  function create(){
    const all = loadCases()
    const id = `case-${Date.now()}`
    const next: TransitionCase = {
      id,
      studentName: form.studentName || 'Unnamed (demo)',
      currentClass: form.currentClass || '6',
      sourceState: form.sourceState || 'Bihar',
      destinationState: form.destinationState || 'Gujarat',
      previousLanguage: form.previousLanguage || 'Hindi',
      preferredLanguage: form.preferredLanguage || 'Gujarati',
      sourceCurriculumId: form.sourceCurriculumId || 'bihar-class6-std',
      destinationCurriculumId: form.destinationCurriculumId || 'gujarat-class6-std',
      academicRecords: [
        { subject: 'Mathematics', completedTopicIds: [], observations: '' },
        { subject: 'Science', completedTopicIds: [], observations: '' }
      ],
      evidence: [],
      teacherNotes: '',
      status: 'new',
      plan: undefined,
      createdAt: new Date().toISOString()
    }
    saveCases([next, ...all])
    navigate(`/students/${id}`)
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold">Create new transition case</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold">Student name</span>
          <input className="border p-2 w-full mt-1" placeholder="e.g. Asha" value={form.studentName} onChange={e=>setForm({...form, studentName: e.target.value})} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Class</span>
          <input className="border p-2 w-full mt-1" value={form.currentClass} onChange={e=>setForm({...form, currentClass: e.target.value})} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Source state</span>
          <select className="border p-2 w-full mt-1" value={form.sourceState} onChange={e=>setForm({...form, sourceState: e.target.value})}>
            <option>Bihar</option>
            <option>Gujarat</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Destination state</span>
          <select className="border p-2 w-full mt-1" value={form.destinationState} onChange={e=>setForm({...form, destinationState: e.target.value})}>
            <option>Gujarat</option>
            <option>Bihar</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Source curriculum</span>
          <select className="border p-2 w-full mt-1" value={form.sourceCurriculumId} onChange={e=>setForm({...form, sourceCurriculumId: e.target.value})}>
            {curricula.map(c=> <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Destination curriculum</span>
          <select className="border p-2 w-full mt-1" value={form.destinationCurriculumId} onChange={e=>setForm({...form, destinationCurriculumId: e.target.value})}>
            {curricula.map(c=> <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-teal-500 text-white rounded" onClick={create}>Create case</button>
      </div>
    </div>
  )
}
