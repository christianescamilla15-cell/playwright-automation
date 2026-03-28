import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ONBOARDING_STEPS = [
  { title: 'Welcome', desc: 'Playwright Automation \u2014 Real Browser Scraping + E2E Testing', icon: '\u25B6' },
  { title: 'GitHub Scraper', desc: 'Extracts real data from GitHub profiles: repos, followers, pinned repos', icon: '\u2692' },
  { title: 'Product Monitor', desc: 'Tracks real product prices from e-commerce sites with history', icon: '\u0024' },
  { title: 'Form Automation', desc: 'Automates login flows with screenshots and step verification', icon: '\u2611' },
  { title: 'Scheduler', desc: 'Runs scrapers on intervals with SQLite persistence and run tracking', icon: '\u23F0' },
  { title: 'E2E Tests', desc: 'Tests your live portfolio sites \u2014 verifies 12 deployed projects', icon: '\u2714' },
  { title: 'Ready', desc: 'Built with Python + Playwright. 54 tests. Zero mocks.', icon: '\u2605' },
]

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

function FilmGrain() {
  return <div style={{
    position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  }} />
}

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const current = ONBOARDING_STEPS[step]
  const isLast = step === ONBOARDING_STEPS.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '48px 56px', maxWidth: 520, width: '90%',
            textAlign: 'center', backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16, color: '#22d3ee' }}>{current.icon}</div>
          <h2 style={{ color: '#fff', fontSize: 22, marginBottom: 12, fontWeight: 600 }}>{current.title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>{current.desc}</p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
            {ONBOARDING_STEPS.map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i === step ? '#22d3ee' : 'rgba(255,255,255,0.2)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
          <div>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                background: 'transparent', color: 'rgba(255,255,255,0.4)',
                border: 'none', padding: '10px 16px', cursor: 'pointer', fontSize: 13, marginRight: 8,
              }}>Back</button>
            )}
            <button
              onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
              style={{
                background: isLast ? '#22d3ee' : 'rgba(255,255,255,0.1)',
                color: isLast ? '#09090B' : '#fff',
                border: isLast ? 'none' : '1px solid rgba(255,255,255,0.2)',
                padding: '10px 32px', borderRadius: 8, cursor: 'pointer',
                fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
              }}
            >{isLast ? 'Explore Dashboard' : 'Next'}</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
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

function Card({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true)

  return (
    <div style={{
      minHeight: '100vh', background: '#09090B', color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <FilmGrain />

      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      </AnimatePresence>

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
          <Card title="GitHub Scraper" delay={0.1}>
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

          <Card title="Product Monitor" delay={0.2}>
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

          <Card title="Form Automation" delay={0.3}>
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
        <Card title="Architecture" delay={0.4}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, flexWrap: 'wrap', padding: '16px 0', fontSize: 13,
          }}>
            {['CLI Entry', 'Scrapers', 'Playwright Browser', 'Data Extraction', 'SQLite Storage', 'Test Runner'].map((node, i, arr) => (
              <div key={node} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)',
                  borderRadius: 8, padding: '8px 16px', color: '#22d3ee', whiteSpace: 'nowrap',
                }}>
                  {node}
                </div>
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.3)' }}>{'\u2192'}</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* CLI Commands */}
        <div style={{ marginTop: 32 }}>
          <Card title="CLI Commands" delay={0.5}>
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
          Built by Christian Hernandez \u2014 Python + Playwright
        </div>
      </div>
    </div>
  )
}
