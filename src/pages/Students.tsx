import React, { useEffect, useState } from 'react'
import { loadCases, saveCases } from '../services/storage'
import { Link } from 'react-router-dom'
import sampleCases from '../data/sampleCases'
import { TransitionCase } from '../types'

export default function Students(){
  const [cases, setCases] = useState<TransitionCase[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all'|'new'|'under_review'|'approved'>('all')

  useEffect(()=>{
    const loaded = loadCases()
    if(loaded.length===0){
      saveCases(sampleCases)
      setCases(sampleCases)
    }else setCases(loaded)
  },[])

  function deleteCase(id:string){
    if(!confirm('Delete this demo case?')) return
    const next = cases.filter(c=>c.id!==id)
    setCases(next)
    saveCases(next)
  }

  function filtered(){
    return cases.filter(c=>{
      if(statusFilter!=='all' && c.status!==statusFilter) return false
      if(query && !c.studentName.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Transitions</h1>
        <Link to="/students/new" className="px-3 py-2 bg-teal-500 text-white rounded">Create new transition</Link>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex gap-2">
          <input className="border p-2 flex-1" placeholder="Search by student name" value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="border p-2" value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}>
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="under_review">Under review</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <ul className="mt-4 divide-y">
          {filtered().map(c=> (
            <li key={c.id} className="py-3 flex justify-between items-center">
              <div>
                <Link to={`/students/${c.id}`} className="font-medium">{c.studentName}</Link>
                <div className="text-sm text-muted">{c.sourceState} → {c.destinationState} • {c.currentClass}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted">{c.status}</div>
                <button className="text-red-600" onClick={()=>deleteCase(c.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
