import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="py-12">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-navy">SETU</h1>
            <div className="text-teal-600 font-semibold mt-1">A New School. Not a New Beginning.</div>
            <p className="mt-4 text-lg text-muted">SETU helps teachers rapidly understand a transferring student's prior learning across states, identify curriculum gaps, and create a short, actionable transition plan. This is a deterministic demo — synthetic data only.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/dashboard" className="px-5 py-3 rounded bg-teal-500 text-white font-semibold">Open Teacher Dashboard</Link>
              <a className="px-5 py-3 rounded border text-teal-600">How it works</a>
            </div>
          </div>
          <div className="bg-ivory p-4 rounded">
            <h3 className="font-semibold">Student transition workflow</h3>
            <ol className="mt-3 list-decimal ml-6 text-sm space-y-2">
              <li>Select or create a transition case.</li>
              <li>Enter academic evidence and curricula.</li>
              <li>SETU compares topics and highlights gaps.</li>
              <li>Generate, review and approve a 4-week plan.</li>
            </ol>
            <div className="mt-4 text-xs text-muted">Demo mode: deterministic rule-based processing. No external AI calls.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
