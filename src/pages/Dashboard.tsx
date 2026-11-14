import React, { useEffect, useState } from 'react'
import { loadCases, seedSampleCases } from '../services/storage'
import sampleCases from '../data/sampleCases'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const [cases, setCases] = useState(()=>loadCases())

  useEffect(()=>{
    seedSampleCases(sampleCases)
    setTimeout(()=>setCases(loadCases()),100)
  },[])

  const total = cases.length
  const toReview = cases.filter(c=>c.status==='new' || c.status==='under_review').length
  const approved = cases.filter(c=>c.status==='approved').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-muted">Total demo transition cases</h3>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-muted">Cases requiring review</h3>
          <p className="text-2xl font-bold">{toReview}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-muted">Approved plans</h3>
          <p className="text-2xl font-bold">{approved}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Recent student transitions</h2>
          <ul className="mt-4 space-y-2">
            {cases.slice(0,5).map(c=> (
              <li key={c.id} className="flex justify-between items-start bg-ivory p-3 rounded">
                <div>
                  <Link to={`/students/${c.id}`} className="font-medium">{c.studentName}</Link>
                  <div className="text-sm text-muted">{c.sourceState} → {c.destinationState} • {c.currentClass}</div>
                </div>
                <div className="text-sm">
                  <span className={`badge ${c.status==='approved' ? 'bg-teal-100 text-teal-700' : c.status==='under_review' ? 'bg-yellow-100 text-[#b45309]' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/students/new" className="px-3 py-2 bg-teal-500 text-white rounded">Create new transition</Link>
            <Link to="/students" className="px-3 py-2 border rounded">Manage transitions</Link>
          </div>
        </div>
      </div>

    </div>
  )
}
