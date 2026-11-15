import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, Compass, Globe2, GraduationCap, LayoutGrid, Map, ShieldCheck } from 'lucide-react'

const steps = [
  'Capture student profile, board and language context.',
  'Record academic evidence and prior learning indicators.',
  'Compare source and destination curricula to find likely gaps.',
  'Approve a four-week bridge plan built for classroom continuity.'
]

const features = [
  { icon: BrainCircuit, title: 'Evidence-first decisions', text: 'Teacher observations and assessment notes are treated as real signals instead of assumptions.' },
  { icon: Compass, title: 'Curriculum comparison', text: 'SETU evaluates likely content continuity across states, boards and grade transitions.' },
  { icon: LayoutGrid, title: 'Four-week bridge plans', text: 'Each plan includes objectives, activities, resources, assessment checkpoints and review notes.' },
  { icon: ShieldCheck, title: 'Teacher-reviewed workflow', text: 'No unsupported mapping is silently accepted. Missing information prompts review.' },
  { icon: Globe2, title: 'National Indian coverage', text: 'The project preserves the full state and union territory metadata required for school movement analysis.' },
  { icon: BookOpen, title: 'Responsive classroom UX', text: 'Designed for teachers working from desktops, tablets or mobile devices while on site.' },
]

export default function Landing() {
  return (
    <div className="page">
      <section className="hero-panel hero-grid">
        <div>
          <div className="page-kicker">Open-source educational continuity</div>
          <h1 className="hero-title">A New School.<br />Not a New Beginning.</h1>
          <p className="hero-subtitle">
            SETU helps teachers support migrant students who move across Indian states, boards and language contexts.
            The platform turns incomplete academic records into a focused continuity plan for learning progress and classroom confidence.
          </p>
          <div className="hero-pills">
            <span className="pill">National coverage</span>
            <span className="pill">Teacher workflow</span>
            <span className="pill">Field-ready planning</span>
          </div>
          <div className="cta-row" style={{ marginTop: '1.5rem' }}>
            <Link to="/students" className="btn btn-primary">
              Explore live demo
              <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Open teacher dashboard
            </Link>
            <Link to="/students/new" className="btn btn-ghost">
              Create a transition
            </Link>
          </div>
        </div>

        <div className="section-card card-body" style={{ background: 'rgba(255,255,255,0.8)' }}>
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

      <section style={{ marginTop: '1.8rem' }}>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="section-card feature-card">
              <div className="feature-icon">
                <Icon size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.08rem' }}>{title}</h3>
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
            <div style={{ fontWeight: 700, marginTop: '0.3rem' }}>A Grade 6 learner moving from Bihar to Gujarat, using Hindi as the previous language and Gujarati as the preferred medium.</div>
          </div>
          <div className="list-card">
            <div className="inline-note">What SETU does</div>
            <div style={{ fontWeight: 700, marginTop: '0.3rem' }}>It compares curriculum coverage, records evidence, and produces a four-week bridge plan that supports both subject continuity and language confidence.</div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '1.8rem' }} className="risk-grid">
        <div className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={18} color="#0a8f8d" />
            <h2 className="section-title">Teacher and NGO value</h2>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Reduce transition friction</div>
              <div className="inline-note">Teachers can understand learner needs quickly when students move between schools and systems.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Support continuity</div>
              <div className="inline-note">The plan focuses on priority concepts, language scaffolds and classroom routines that work in real teaching time.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Keep evidence honest</div>
              <div className="inline-note">Missing information is treated as unknown rather than an automatic knowledge gap.</div>
            </div>
          </div>
        </div>

        <div className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <GraduationCap size={18} color="#0a8f8d" />
            <h2 className="section-title">Demo status</h2>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Deterministic demo workflow</div>
              <div className="inline-note">The app uses visible, local sample data and a rule-based comparison engine.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Teacher-led review</div>
              <div className="inline-note">It is designed to support classroom decisions and not replace them.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Open-source foundation</div>
              <div className="inline-note">The prototype can be extended with secure data storage and production-grade academic workflow tooling.</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-note">
        SETU • Learning continuity for migrant students • Demo data only • Open-source prototype
      </footer>
    </div>
  )
}
