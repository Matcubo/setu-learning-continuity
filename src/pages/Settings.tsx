import React, { useEffect, useState } from 'react'
import { seedSampleCases, loadCases, saveCases } from '../services/storage'
import sampleCases from '../data/sampleCases'

export default function Settings(){
  const [demoLanguage, setDemoLanguage] = useState(() => localStorage.getItem('setu_demo_language') || 'English')
  const [caseCount, setCaseCount] = useState(0)

  useEffect(()=>{
    setCaseCount(loadCases().length)
  },[])

  function resetDemo(){
    if(!confirm('Reset demo data to initial sample cases? This will overwrite current demo cases.')) return
    localStorage.removeItem('setu_demo_cases_v1')
    saveCases(sampleCases)
    seedSampleCases(sampleCases)
    setCaseCount(loadCases().length)
    alert('Demo data reset.')
  }

  function saveLanguage(){
    localStorage.setItem('setu_demo_language', demoLanguage)
    alert('Saved')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold">Demo preferences</h2>
        <div className="mt-3">
          <label className="block text-sm">Demo language preference</label>
          <select className="border p-2 mt-2" value={demoLanguage} onChange={e=>setDemoLanguage(e.target.value)}>
            <option>English</option>
            <option>Hindi</option>
            <option>Gujarati</option>
          </select>
          <div className="mt-3">
            <button className="px-3 py-2 bg-teal-500 text-white rounded" onClick={saveLanguage}>Save</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold">Demo data</h2>
        <div className="mt-2 text-sm text-muted">Current demo case count: {caseCount}</div>
        <div className="mt-3">
          <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={resetDemo}>Reset demo data</button>
        </div>
      </div>

      <div className="text-sm text-muted">This application runs entirely in your browser for demo purposes. No real student data is used.</div>
    </div>
  )
}
