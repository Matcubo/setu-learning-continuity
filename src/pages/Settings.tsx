import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Download, FileUp, RefreshCcw, ShieldAlert } from 'lucide-react'
import { exportCaseData, importCaseData, loadCases, loadSettings, saveCases, saveSettings, seedSampleCases } from '../services/storage'
import sampleCases from '../data/sampleCases'

const APP_VERSION = '0.1.0-demo'

export default function Settings() {
  const [demoLanguage, setDemoLanguage] = useState(() => loadSettings()['demoLanguage'] || 'English')
  const [caseCount, setCaseCount] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setCaseCount(loadCases().length)
  }, [])

  function saveLanguage() {
    const nextSettings = loadSettings()
    nextSettings.demoLanguage = demoLanguage
    saveSettings(nextSettings)
    setStatusMessage('Demo language preference saved.')
  }

  function resetDemo() {
    if (!confirm('Reset demo data to the initial sample cases? This will overwrite current local records.')) return
    localStorage.removeItem('setu_demo_cases_v1')
    saveCases(sampleCases)
    seedSampleCases(sampleCases)
    setCaseCount(loadCases().length)
    setStatusMessage('Demo data reset to the default sample cases.')
  }

  function exportData() {
    const blob = new Blob([exportCaseData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'setu-demo-export.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setStatusMessage('Exported demo data as JSON.')
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const response = importCaseData(result)
      setStatusMessage(response.message)
      setCaseCount(loadCases().length)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <div className="page-kicker">Settings</div>
          <h1 className="page-title">Application preferences</h1>
        </div>
      </header>

      <div className="risk-grid">
        <section className="section-card card-body">
          <h2 className="section-title">Demo preferences</h2>
          <div style={{ marginTop: '1rem' }}>
            <label className="label">Interface language</label>
            <select className="select" value={demoLanguage} onChange={(event) => setDemoLanguage(event.target.value)}>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Gujarati">Gujarati</option>
            </select>
          </div>
          <div className="cta-row" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={saveLanguage}>Save preference</button>
          </div>
        </section>

        <section className="section-card card-body">
          <h2 className="section-title">Data management</h2>
          <div className="timeline" style={{ marginTop: '1rem' }}>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Current records</div>
              <div className="inline-note">{caseCount} local case records are stored in this browser.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Storage mode</div>
              <div className="inline-note">Browser-local storage only. These records are not shared across devices and are not suitable for production student records.</div>
            </div>
          </div>
          <div className="cta-row" style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={exportData}>
              <Download size={16} />
              Export JSON
            </button>
            <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
              <FileUp size={16} />
              Import JSON
            </button>
            <button className="btn btn-danger" onClick={resetDemo}>
              <RefreshCcw size={16} />
              Reset demo data
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleImport} />
        </section>
      </div>

      <section className="section-card card-body" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <ShieldAlert size={18} color="#b45309" />
          <h2 className="section-title">Data disclosure</h2>
        </div>
        <div className="inline-note" style={{ marginTop: '0.8rem' }}>
          This application keeps records on the browser only for demonstration purposes. It does not collect sensitive real student data and should not be used to store live student records.
        </div>
        <div className="inline-note" style={{ marginTop: '0.6rem', fontWeight: 700 }}>Application version: {APP_VERSION}</div>
      </section>

      {statusMessage && (
        <div className="status-banner" style={{ marginTop: '1rem' }}>
          {statusMessage}
        </div>
      )}
    </div>
  )
}
