import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, Compass, GraduationCap, LayoutGrid, Map } from 'lucide-react'

const steps = [
  'Create a transition case with school and language context.',
  'Capture academic evidence and prior learning indicators.',
  'Compare source and destination curricula to find key gaps.',
  'Generate and review a focused 4-week bridge plan.'
]

const features = [
  { icon: BrainCircuit, title: 'Evidence-first decisions', text: 'Teacher observations, assessment notes and classroom progress are treated as real signals—not assumptions.' },
  { icon: Compass, title: 'Curriculum comparison', text: 'SETU maps destination topics against the source curriculum and flags unknown or likely gap areas.' },
  { icon: LayoutGrid, title: 'Four-week bridge planning', text: 'Plans are designed around priority concepts, language support and practical classroom routines.' },
]

export default function Landing() {
  return (
    <div className="page">
      <section className="hero-panel hero-grid">
        <div>
          <div className="page-kicker">Open-source prototype</div>
          <h1 className="hero-title">A New School.<br />Not a New Beginning.</h1>
          <p className="hero-subtitle">
            SETU helps teachers support migrant children when they move across Indian states, languages and school systems.
            It turns scattered evidence into a practical continuity plan for learning and classroom confidence.
          </p>
          <div className="hero-pills">
            <span className="pill">Curriculum continuity</span>
            <span className="pill">Teacher workflow</span>
            <span className="pill">Language-aware planning</span>
          </div>
          <div className="cta-row" style={{ marginTop: '1.5rem' }}>
            <Link to="/students" className="btn btn-primary">
              Explore demo
              <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Teacher dashboard
            </Link>
          </div>
        </div>

        <div className="section-card card-body" style={{ background: 'rgba(255,255,255,0.75)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <BookOpen size={18} color="#0a8f8d" />
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>How SETU works</h2>
          </div>
          <div className="timeline">
            {steps.map((step, index) => (
              <div key={step} className="timeline-step">
                <div style={{ fontWeight: 700 }}>Step {index + 1}</div>
                <div className="inline-note">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: '1.6rem' }}>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="section-card feature-card">
              <div className="feature-icon">
                <Icon size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
              <p className="hero-subtitle" style={{ marginTop: '0.7rem', fontSize: '0.92rem' }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '1.8rem' }} className="section-card card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Map size={18} color="#0a8f8d" />
          <h2 className="section-title">Example transition: Bihar to Gujarat</h2>
        </div>

        <div className="risk-grid">
          <div className="list-card">
            <div className="inline-note">Student context</div>
            <div style={{ fontWeight: 700, marginTop: '0.3rem' }}>A Grade 6 child moving from Bihar to Gujarat with Hindi as the previous language and Gujarati as the preferred medium.</div>
          </div>
          <div className="list-card">
            <div className="inline-note">What SETU does</div>
            <div style={{ fontWeight: 700, marginTop: '0.3rem' }}>Compiles prior evidence, identifies missing or weak topic areas, and produces a weekly bridge plan aligned to classroom demands.</div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '1.8rem' }} className="risk-grid">
        <div className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={18} color="#0a8f8d" />
            <h2 className="section-title">Impact goals</h2>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Reduce transition friction</div>
              <div className="inline-note">Help teachers quickly understand what a child already knows and what needs support.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Support continuity</div>
              <div className="inline-note">Keep learning momentum going even when curricula and language contexts change.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Focus on evidence</div>
              <div className="inline-note">Avoid wrongly marking missing information as a student’s lack of understanding.</div>
            </div>
          </div>
        </div>

        <div className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <GraduationCap size={18} color="#0a8f8d" />
            <h2 className="section-title">Prototype status</h2>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Deterministic demo</div>
              <div className="inline-note">This app uses synthetic school data and offline comparison logic.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Teacher-led review</div>
              <div className="inline-note">It is designed to support teaching decisions, not replace them.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Open-source</div>
              <div className="inline-note">Suitable for study, prototype review, and future extension.</div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '2rem', padding: '1.4rem 0 0.5rem', color: '#526176', textAlign: 'center', fontSize: '0.85rem' }}>
        SETU • Educational continuity for migrant learners • Synthetic demo data only
      </footer>
    </div>
  )
}
