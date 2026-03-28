import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ====== TRANSLATIONS ====== */
const TR = {
  es: {
    tourWelcome: 'Bienvenido a Playwright Automation',
    tourWelcomeDesc: 'Scraping real de navegador, automatizacion de formularios y testing E2E.\nPermiteme mostrarte cada componente.',
    tourGithub: 'GitHub Scraper',
    tourGithubDesc: 'Extrae datos reales de perfiles GitHub: repositorios, estrellas y lenguajes de programacion.',
    tourProducts: 'Monitor de Productos',
    tourProductsDesc: 'Rastrea precios de productos en tiempo real con historial de cambios y alertas.',
    tourForms: 'Automatizacion de Formularios',
    tourFormsDesc: 'Automatiza flujos de login con capturas de pantalla y verificacion paso a paso.',
    tourArch: 'Arquitectura del Sistema',
    tourArchDesc: 'Pipeline completo: CLI Entry > Scrapers > Playwright Browser > Data Extraction > SQLite > Test Runner.',
    tourCli: 'Comandos CLI',
    tourCliDesc: 'Ejecuta scrapers y tests directamente desde la terminal con comandos simples.',
    tourComplete: 'Tour Completado',
    tourCompleteDesc: 'Has explorado la suite completa de automatizacion. Construido con Python + Playwright.',
    next: 'Siguiente', prev: 'Anterior', skip: 'Saltar Tour', finish: 'Finalizar',
    restartTour: 'Reiniciar Tour', explore: 'Explorar',
    watching: 'Observando...',
    scrapers: 'Scrapers', tests: 'Tests', sections: 'Secciones',
  },
  en: {
    tourWelcome: 'Welcome to Playwright Automation',
    tourWelcomeDesc: 'Real browser scraping, form automation & E2E testing.\nLet me walk you through each component.',
    tourGithub: 'GitHub Scraper',
    tourGithubDesc: 'Extracts real data from GitHub profiles: repositories, stars, and programming languages.',
    tourProducts: 'Product Monitor',
    tourProductsDesc: 'Tracks real product prices with change history and alerts.',
    tourForms: 'Form Automation',
    tourFormsDesc: 'Automates login flows with screenshots and step-by-step verification.',
    tourArch: 'System Architecture',
    tourArchDesc: 'Full pipeline: CLI Entry > Scrapers > Playwright Browser > Data Extraction > SQLite > Test Runner.',
    tourCli: 'CLI Commands',
    tourCliDesc: 'Run scrapers and tests directly from the terminal with simple commands.',
    tourComplete: 'Tour Complete!',
    tourCompleteDesc: 'You have explored the full automation suite. Built with Python + Playwright.',
    next: 'Next', prev: 'Back', skip: 'Skip Tour', finish: 'Finish',
    restartTour: 'Restart Tour', explore: 'Explore',
    watching: 'Watching...',
    scrapers: 'Scrapers', tests: 'Tests', sections: 'Sections',
  },
}

/* ====== DATA ====== */
const BADGES = ['54 Tests', '3 Scrapers', 'Python', 'Playwright', 'SQLite']

const GITHUB_REPOS = [
  { name: 'playwright-automation', stars: 12, lang: 'Python' },
  { name: 'portfolio-completo', stars: 8, lang: 'JavaScript' },
  { name: 'fine-tuning-demo', stars: 6, lang: 'Python' },
  { name: 'content-studio', stars: 5, lang: 'React' },
]

const PRODUCTS = [
  { title: 'MacBook Pro 14"', price: '$1,999', rating: '4.8', change: '-$100' },
  { title: 'Sony WH-1000XM5', price: '$348', rating: '4.7', change: '-$52' },
  { title: 'iPad Air M2', price: '$599', rating: '4.6', change: '+$0' },
  { title: 'Kindle Paperwhite', price: '$139', rating: '4.5', change: '-$10' },
]

const FORM_STEPS = [
  { step: 'Navigate to login page', done: true },
  { step: 'Fill username field', done: true },
  { step: 'Fill password field', done: true },
  { step: 'Click submit button', done: true },
  { step: 'Verify dashboard loaded', done: true },
  { step: 'Take confirmation screenshot', done: true },
]

const CLI_COMMANDS = [
  { cmd: 'python cli.py scrape github --user christianhxc', desc: 'Scrape a GitHub profile' },
  { cmd: 'python cli.py scrape products --url amazon.com/deals', desc: 'Monitor product prices' },
  { cmd: 'python cli.py automate login --config form.json', desc: 'Automate a login flow' },
  { cmd: 'pytest tests/ -v --tb=short', desc: 'Run all 54 tests' },
]

/* ====== TOUR STEPS ====== */
const TOUR_STEPS = [
  { id: 'welcome', target: null, action: null, wait: 0 },
  { id: 'github', target: '[data-tour="github-scraper"]', action: null, wait: 0 },
  { id: 'products', target: '[data-tour="product-monitor"]', action: null, wait: 0 },
  { id: 'forms', target: '[data-tour="form-automation"]', action: null, wait: 0 },
  { id: 'arch', target: '[data-tour="architecture"]', action: null, wait: 0 },
  { id: 'cli', target: '[data-tour="cli-commands"]', action: null, wait: 0 },
  { id: 'final', target: null, action: 'scrollTop', wait: 500 },
]

/* ====== TOUR KEYFRAMES ====== */
const tourKeyframes = `
@keyframes tourPulse {
  0%, 100% { border-color: rgba(34,211,238,0.6); box-shadow: 0 0 0 0 rgba(34,211,238,0.2); }
  50% { border-color: rgba(34,211,238,0.9); box-shadow: 0 0 20px 4px rgba(34,211,238,0.15); }
}
@keyframes tourTooltipIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes tourActionPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
@keyframes tourFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes tourScaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
`

/* ====== SPOTLIGHT ====== */
function TourSpotlight({ targetRect, padding = 12 }) {
  if (!targetRect) return null
  const { top, left, width, height } = targetRect
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)',
        clipPath: `polygon(
          0% 0%, 100% 0%, 100% 100%, 0% 100%,
          0% ${top - padding}px,
          ${left - padding}px ${top - padding}px,
          ${left - padding}px ${top + height + padding}px,
          ${left + width + padding}px ${top + height + padding}px,
          ${left + width + padding}px ${top - padding}px,
          0% ${top - padding}px
        )`,
      }} />
      <div style={{
        position: 'absolute', top: top - padding, left: left - padding,
        width: width + padding * 2, height: height + padding * 2,
        border: '2px solid rgba(34,211,238,0.6)', borderRadius: 12,
        animation: 'tourPulse 2s ease-in-out infinite', pointerEvents: 'none',
      }} />
    </div>
  )
}

/* ====== TOOLTIP ====== */
function TourTooltip({ step, stepIndex, totalSteps, targetRect, lang, actionRunning, onNext, onPrev, onSkip }) {
  const tr = TR[lang]
  const titles = { welcome:'tourWelcome', github:'tourGithub', products:'tourProducts', forms:'tourForms', arch:'tourArch', cli:'tourCli', final:'tourComplete' }
  const descs = { welcome:'tourWelcomeDesc', github:'tourGithubDesc', products:'tourProductsDesc', forms:'tourFormsDesc', arch:'tourArchDesc', cli:'tourCliDesc', final:'tourCompleteDesc' }

  let tooltipStyle = {
    position: 'fixed', zIndex: 9999, background: '#0F1B2E',
    border: '1px solid rgba(34,211,238,0.4)', borderRadius: 14,
    padding: '20px 22px', width: 360, maxWidth: 'calc(100vw - 32px)',
    boxShadow: '0 12px 48px rgba(0,0,0,0.6)', animation: 'tourTooltipIn 0.3s ease-out',
    pointerEvents: 'auto',
  }

  if (targetRect) {
    const spaceBelow = window.innerHeight - (targetRect.top + targetRect.height + 20)
    if (spaceBelow >= 200) {
      tooltipStyle.top = targetRect.top + targetRect.height + 16
      tooltipStyle.left = Math.max(16, Math.min(targetRect.left, window.innerWidth - 380))
    } else {
      tooltipStyle.bottom = window.innerHeight - targetRect.top + 16
      tooltipStyle.left = Math.max(16, Math.min(targetRect.left, window.innerWidth - 380))
    }
  } else {
    tooltipStyle.top = '50%'; tooltipStyle.left = '50%'
    tooltipStyle.transform = 'translate(-50%, -50%)'; tooltipStyle.width = 420
  }

  return (
    <div style={tooltipStyle}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
        borderRadius: 12, background: 'rgba(34,211,238,0.15)', color: '#67e8f9',
        fontSize: 11, fontWeight: 600, marginBottom: 10,
      }}>{stepIndex + 1} / {totalSteps}</div>

      {step.id === 'welcome' && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
          <button onClick={() => {}} style={{
            padding: '6px 18px', borderRadius: 8, border: lang === 'es' ? 'none' : '1px solid rgba(255,255,255,0.2)',
            background: lang === 'es' ? '#22d3ee' : 'transparent', color: lang === 'es' ? '#09090B' : '#9CA3AF',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }} data-lang-es>ES</button>
          <button onClick={() => {}} style={{
            padding: '6px 18px', borderRadius: 8, border: lang === 'en' ? 'none' : '1px solid rgba(255,255,255,0.2)',
            background: lang === 'en' ? '#22d3ee' : 'transparent', color: lang === 'en' ? '#09090B' : '#9CA3AF',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }} data-lang-en>EN</button>
        </div>
      )}

      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#E5E7EB', marginBottom: 6 }}>{tr[titles[step.id]]}</h3>
      <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.5, marginBottom: 16, whiteSpace: 'pre-wrap' }}>{tr[descs[step.id]]}</p>

      {actionRunning && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          borderRadius: 8, marginBottom: 14, background: 'rgba(34,211,238,0.1)',
          border: '1px solid rgba(34,211,238,0.2)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', animation: 'tourActionPulse 1s ease-in-out infinite' }} />
          <span style={{ fontSize: 12, color: '#67e8f9', fontWeight: 500 }}>{tr.watching}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 14, flexWrap: 'wrap' }}>
        {TOUR_STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === stepIndex ? 20 : 6, height: 6, borderRadius: 3,
            background: i < stepIndex ? '#22d3ee' : i === stepIndex ? '#67e8f9' : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {stepIndex > 0 && !actionRunning && (
          <button onClick={onPrev} style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>{tr.prev}</button>
        )}
        <div style={{ flex: 1 }} />
        {!actionRunning && (
          <button onClick={onSkip} style={{
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: 'transparent', color: '#6B7280', fontSize: 12, cursor: 'pointer',
          }}>{tr.skip}</button>
        )}
        {!actionRunning && (
          <button onClick={onNext} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', color: '#09090B',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>{stepIndex === totalSteps - 1 ? tr.finish : tr.next}</button>
        )}
      </div>
    </div>
  )
}

/* ====== COMPLETION MODAL ====== */
function CompletionModal({ lang, onRestart, onExplore }) {
  const tr = TR[lang]
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', animation: 'tourFadeIn 0.4s ease-out',
    }}>
      <div style={{
        background: '#0F1B2E', border: '1px solid rgba(34,211,238,0.4)',
        borderRadius: 20, padding: '36px 40px', maxWidth: 460, width: '90%',
        textAlign: 'center', animation: 'tourScaleIn 0.4s ease-out',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', boxShadow: '0 0 30px rgba(34,211,238,0.3)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#E5E7EB', marginBottom: 8 }}>{tr.tourComplete}</h2>
        <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 24 }}>{tr.tourCompleteDesc}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { value: '3', label: tr.scrapers, color: '#22d3ee' },
            { value: '54', label: tr.tests, color: '#4ade80' },
            { value: '6', label: tr.sections, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onRestart} style={{
            padding: '10px 24px', borderRadius: 10, border: '1px solid rgba(34,211,238,0.3)',
            background: 'transparent', color: '#67e8f9', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>{tr.restartTour}</button>
          <button onClick={onExplore} style={{
            padding: '10px 28px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', color: '#09090B',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>{tr.explore}</button>
        </div>
      </div>
    </div>
  )
}

/* ====== ONBOARDING TOUR ====== */
function OnboardingTour({ lang, setLang, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const [actionRunning, setActionRunning] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const timeoutsRef = useRef([])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t)); timeoutsRef.current = []
  }, [])
  const addTimeout = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms); timeoutsRef.current.push(id); return id
  }, [])

  useEffect(() => () => clearAllTimeouts(), [clearAllTimeouts])

  const currentStep = TOUR_STEPS[stepIndex]

  const measureTarget = useCallback(() => {
    if (!currentStep?.target) { setTargetRect(null); return }
    const el = document.querySelector(currentStep.target)
    if (el) {
      const rect = el.getBoundingClientRect()
      setTargetRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        addTimeout(() => {
          const r2 = el.getBoundingClientRect()
          setTargetRect({ top: r2.top, left: r2.left, width: r2.width, height: r2.height })
        }, 500)
      }
    } else { setTargetRect(null) }
  }, [currentStep, addTimeout])

  useEffect(() => {
    if (!currentStep) return
    clearAllTimeouts()
    addTimeout(() => measureTarget(), 300)
  }, [stepIndex, currentStep, measureTarget, clearAllTimeouts, addTimeout])

  useEffect(() => {
    const handler = () => measureTarget()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [measureTarget])

  const executeAction = useCallback(() => {
    if (!currentStep?.action) return
    setActionRunning(true)
    if (currentStep.action === 'scrollTop') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      addTimeout(() => setActionRunning(false), currentStep.wait)
    } else { setActionRunning(false) }
  }, [currentStep, addTimeout])

  const goToStep = useCallback((idx) => {
    if (idx < 0 || idx >= TOUR_STEPS.length) return
    clearAllTimeouts(); setActionRunning(false); setTargetRect(null); setStepIndex(idx)
  }, [clearAllTimeouts])

  const handleNext = useCallback(() => {
    if (actionRunning) return
    if (currentStep?.action) {
      executeAction()
      addTimeout(() => {
        if (stepIndex < TOUR_STEPS.length - 1) goToStep(stepIndex + 1)
        else { window.scrollTo({ top: 0, behavior: 'smooth' }); setShowCompletion(true) }
      }, (currentStep.wait || 0) + 200)
      return
    }
    if (stepIndex < TOUR_STEPS.length - 1) goToStep(stepIndex + 1)
    else { window.scrollTo({ top: 0, behavior: 'smooth' }); setShowCompletion(true) }
  }, [stepIndex, currentStep, actionRunning, executeAction, goToStep, addTimeout])

  const handlePrev = useCallback(() => { if (!actionRunning) goToStep(stepIndex - 1) }, [stepIndex, actionRunning, goToStep])
  const handleSkip = useCallback(() => {
    clearAllTimeouts(); setActionRunning(false)
    window.scrollTo({ top: 0, behavior: 'smooth' }); onComplete()
  }, [clearAllTimeouts, onComplete])
  const handleRestart = useCallback(() => {
    setShowCompletion(false); setTargetRect(null); setActionRunning(false)
    clearAllTimeouts(); setStepIndex(0)
  }, [clearAllTimeouts])
  const handleExplore = useCallback(() => { setShowCompletion(false); onComplete() }, [onComplete])

  useEffect(() => {
    const handleLangClick = (e) => {
      if (e.target.hasAttribute('data-lang-es')) setLang('es')
      if (e.target.hasAttribute('data-lang-en')) setLang('en')
    }
    document.addEventListener('click', handleLangClick)
    return () => document.removeEventListener('click', handleLangClick)
  }, [setLang])

  if (showCompletion) {
    return (<><style>{tourKeyframes}</style><CompletionModal lang={lang} onRestart={handleRestart} onExplore={handleExplore} /></>)
  }

  return (
    <>
      <style>{tourKeyframes}</style>
      {currentStep?.target && targetRect ? (
        <TourSpotlight targetRect={targetRect} />
      ) : (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.75)', pointerEvents: 'none' }} />
      )}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: actionRunning ? 'none' : 'auto', background: 'transparent' }}
        onClick={e => e.stopPropagation()}>
        <TourTooltip
          step={currentStep} stepIndex={stepIndex} totalSteps={TOUR_STEPS.length}
          targetRect={targetRect} lang={lang} actionRunning={actionRunning}
          onNext={handleNext} onPrev={handlePrev} onSkip={handleSkip}
        />
      </div>
    </>
  )
}

/* ====== UI COMPONENTS ====== */
function FilmGrain() {
  return <div style={{
    position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  }} />
}

function Badge({ text }) {
  return (
    <span style={{
      background: 'rgba(34,211,238,0.1)', color: '#22d3ee',
      border: '1px solid rgba(34,211,238,0.3)', borderRadius: 20,
      padding: '4px 14px', fontSize: 12, fontWeight: 600,
    }}>{text}</span>
  )
}

function Card({ title, children, delay = 0, tourAttr }) {
  const props = tourAttr ? { 'data-tour': tourAttr } : {}
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: 24, backdropFilter: 'blur(10px)',
      }}
    >
      <h3 style={{ color: '#fff', fontSize: 16, marginBottom: 16, fontWeight: 600 }}>{title}</h3>
      {children}
    </motion.div>
  )
}

function StatBox({ label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12, padding: '20px 24px', textAlign: 'center', flex: 1, minWidth: 120,
    }}>
      <div style={{ color: '#22d3ee', fontSize: 28, fontWeight: 700 }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{label}</div>
    </div>
  )
}

/* ====== APP ====== */
export default function App() {
  const [showTour, setShowTour] = useState(true)
  const [lang, setLang] = useState('es')

  return (
    <div style={{
      minHeight: '100vh', background: '#09090B', color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <FilmGrain />

      {showTour && (
        <OnboardingTour lang={lang} setLang={setLang} onComplete={() => setShowTour(false)} />
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, color: '#fff' }}>
            Playwright Automation Suite
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 16 }}>
            Real browser scraping, form automation & E2E testing with Python + Playwright
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BADGES.map(b => <Badge key={b} text={b} />)}
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <StatBox label="Tests" value="54" />
          <StatBox label="Scrapers" value="3" />
          <StatBox label="Storage" value="SQLite" />
          <StatBox label="Coverage" value="E2E" />
        </div>

        {/* Scraper Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 32 }}>
          <Card title="GitHub Scraper" delay={0.1} tourAttr="github-scraper">
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 16, fontFamily: 'monospace', fontSize: 13 }}>
              <div style={{ color: '#22d3ee', marginBottom: 8 }}>$ python cli.py scrape github --user christianhxc</div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                <div>Found <span style={{ color: '#4ade80' }}>27 repositories</span></div>
                <div style={{ marginTop: 8 }}>Pinned repos:</div>
                {GITHUB_REPOS.map(r => (
                  <div key={r.name} style={{ marginLeft: 16, marginTop: 4 }}>
                    <span style={{ color: '#f59e0b' }}>{r.name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>{r.stars} stars</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>{r.lang}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Product Monitor" delay={0.2} tourAttr="product-monitor">
            <div style={{ fontSize: 13 }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 80px 50px 60px', gap: 8,
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)', fontWeight: 600,
              }}>
                <span>Product</span><span>Price</span><span>Rating</span><span>Change</span>
              </div>
              {PRODUCTS.map(p => (
                <div key={p.title} style={{
                  display: 'grid', gridTemplateColumns: '1fr 80px 50px 60px', gap: 8,
                  padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.7)',
                }}>
                  <span>{p.title}</span>
                  <span style={{ color: '#4ade80' }}>{p.price}</span>
                  <span>{p.rating}</span>
                  <span style={{ color: p.change.startsWith('-') ? '#4ade80' : 'rgba(255,255,255,0.4)' }}>{p.change}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Form Automation" delay={0.3} tourAttr="form-automation">
            <div style={{ fontSize: 13 }}>
              {FORM_STEPS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
                  color: 'rgba(255,255,255,0.7)',
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: s.done ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)',
                    color: s.done ? '#4ade80' : 'rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, flexShrink: 0,
                  }}>
                    {s.done ? '\u2713' : (i + 1)}
                  </span>
                  <span>{s.step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Architecture */}
        <Card title="Architecture" delay={0.4} tourAttr="architecture">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, flexWrap: 'wrap', padding: '16px 0', fontSize: 13,
          }}>
            {['CLI Entry', 'Scrapers', 'Playwright Browser', 'Data Extraction', 'SQLite Storage', 'Test Runner'].map((node, i, arr) => (
              <div key={node} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)',
                  borderRadius: 8, padding: '8px 16px', color: '#22d3ee', whiteSpace: 'nowrap',
                }}>{node}</div>
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.3)' }}>{'\u2192'}</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* CLI Commands */}
        <div style={{ marginTop: 32 }}>
          <Card title="CLI Commands" delay={0.5} tourAttr="cli-commands">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CLI_COMMANDS.map(c => (
                <div key={c.cmd} style={{
                  background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 12,
                  fontFamily: 'monospace', fontSize: 13,
                }}>
                  <div style={{ color: '#22d3ee' }}>$ {c.cmd}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4, fontSize: 12 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center', marginTop: 48, paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.3)', fontSize: 13,
        }}>
          Built by Christian Hernandez — Python + Playwright
        </div>
      </div>
    </div>
  )
}
