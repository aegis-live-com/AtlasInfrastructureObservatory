import { useState, useEffect, useRef } from 'react'
import type { View } from '../types'
import { GLOBAL_STATS } from '../data/mockData'

const CATEGORY_CARDS = [
  {
    id: 'places',
    label: 'PLACES',
    sub: 'Explore infrastructure systems geographically',
    icon: '⬡',
    color: '#00d4ff',
    view: 'explore' as View,
  },
  {
    id: 'systems',
    label: 'SYSTEMS',
    sub: 'Energy, water, compute, mobility, health, food, nature',
    icon: '◎',
    color: '#8b5cf6',
    view: 'observe' as View,
  },
  {
    id: 'opportunities',
    label: 'OPPORTUNITIES',
    sub: 'Discover infrastructure gaps and investment opportunities',
    icon: '◈',
    color: '#f59e0b',
    view: 'explore' as View,
  },
  {
    id: 'futures',
    label: 'FUTURES',
    sub: 'Simulate alternative infrastructure futures',
    icon: '⟳',
    color: '#10b981',
    view: 'simulate' as View,
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    sub: 'Explore proposed and active infrastructure projects',
    icon: '◐',
    color: '#38bdf8',
    view: 'projects' as View,
  },
  {
    id: 'capital',
    label: 'CAPITAL',
    sub: 'Understand where capital is moving',
    icon: '◉',
    color: '#ec4899',
    view: 'capital' as View,
  },
]

const SEARCH_EXAMPLES = [
  'Nairobi energy infrastructure',
  'East Africa Power Grid',
  'Data center opportunities',
  'Water security Kenya',
  'Renewable energy West Africa',
  'AI compute demand Africa',
  'Congo Basin ecosystem',
  'Grand Inga hydropower',
]

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  delay: Math.random() * 8,
  dur: Math.random() * 4 + 3,
}))

interface Props {
  onSearch: (q: string) => void
  onNavigate: (v: View) => void
}

export default function HomeScreen({ onSearch, onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [placeholder, setPlaceholder] = useState(SEARCH_EXAMPLES[0])
  const [phIndex, setPhIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [typingState, setTypingState] = useState<'typing' | 'pausing' | 'deleting'>('typing')
  const [displayedText, setDisplayedText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const target = SEARCH_EXAMPLES[phIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (typingState === 'typing') {
      if (displayedText.length < target.length) {
        timeout = setTimeout(() => setDisplayedText(target.slice(0, displayedText.length + 1)), 60)
      } else {
        timeout = setTimeout(() => setTypingState('pausing'), 2400)
      }
    } else if (typingState === 'pausing') {
      timeout = setTimeout(() => setTypingState('deleting'), 0)
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => setDisplayedText(displayedText.slice(0, -1)), 28)
      } else {
        const nextIdx = (phIndex + 1) % SEARCH_EXAMPLES.length
        setPhIndex(nextIdx)
        setTypingState('typing')
      }
    }
    return () => clearTimeout(timeout)
  }, [displayedText, typingState, phIndex])

  useEffect(() => {
    const t = setInterval(() => setShowCursor((v) => !v), 530)
    return () => clearInterval(t)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full overflow-hidden topo-bg" style={{ background: '#040a14' }}>
      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }}>
        {STARS.map((s) => (
          <circle
            key={s.id}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.size}
            fill="white"
            style={{
              animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </svg>

      {/* Ambient glow orbs */}
      <div className="absolute pointer-events-none" style={{ top: '15%', left: '12%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      {/* Top coordinates display */}
      <div className="absolute top-6 left-6 font-mono" style={{ fontSize: 10, color: '#1a3a5c', letterSpacing: '0.12em' }}>
        00°00'00"N 000°00'00"E · ATLAS GLOBAL OBSERVATORY
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
        <span className="font-mono" style={{ fontSize: 10, color: '#1a3a5c', letterSpacing: '0.12em' }}>SYSTEMS NOMINAL</span>
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8 w-full max-w-3xl px-6">
        {/* Orb mark */}
        <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: 'rgba(0,212,255,0.15)' }} />
          <div className="absolute rounded-full border" style={{ inset: 8, borderColor: 'rgba(0,212,255,0.25)' }} />
          <div className="absolute rounded-full border" style={{ inset: 18, borderColor: 'rgba(0,212,255,0.4)' }} />
          <div className="absolute rounded-full" style={{ inset: 26, background: '#00d4ff', boxShadow: '0 0 20px rgba(0,212,255,0.6)' }} />
          {/* Orbiting dot */}
          <div className="absolute" style={{ width: 72, height: 72, animation: 'radar-sweep 8s linear infinite' }}>
            <div className="absolute w-2 h-2 rounded-full" style={{ top: 0, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center animate-float-up">
          <h1
            className="font-display font-800 tracking-widest mb-1"
            style={{
              fontSize: 'clamp(28px, 5vw, 52px)',
              letterSpacing: '0.22em',
              color: '#e2eaf4',
              textShadow: '0 0 40px rgba(0,212,255,0.2)',
            }}
          >
            ATLAS SANCTUM
          </h1>
          <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: '#3d5a78' }}>
            REGENERATIVE INFRASTRUCTURE INTELLIGENCE
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="w-full animate-float-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <div
              className="flex items-center gap-4 px-5 py-4 transition-all"
              style={{
                background: 'rgba(7,15,32,0.8)',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: 4,
                backdropFilter: 'blur(12px)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                <circle cx="6.5" cy="6.5" r="5" stroke="#00d4ff" strokeWidth="1.2" />
                <path d="M10.5 10.5L14 14" stroke="#00d4ff" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none font-body"
                style={{ fontSize: 14, color: '#e2eaf4', caretColor: '#00d4ff' }}
                placeholder=""
              />
              {!query && (
                <span className="absolute pointer-events-none font-body" style={{ fontSize: 14, color: '#3d5a78', left: 56, top: '50%', transform: 'translateY(-50%)' }}>
                  {displayedText}
                  <span style={{ opacity: showCursor ? 1 : 0, color: '#00d4ff' }}>|</span>
                </span>
              )}
              {query && (
                <button
                  type="submit"
                  className="font-mono px-4 py-1.5 transition-all"
                  style={{ fontSize: 10, letterSpacing: '0.12em', color: '#040a14', background: '#00d4ff', borderRadius: 2 }}
                >
                  EXPLORE →
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-center font-mono" style={{ fontSize: 9, color: '#2a4a6a', letterSpacing: '0.1em' }}>
            SEARCH A PLACE · INFRASTRUCTURE SYSTEM · OPPORTUNITY · OR FUTURE
          </p>
        </form>

        {/* Explore label */}
        <div className="animate-float-up" style={{ animationDelay: '0.2s' }}>
          <p className="font-mono text-center mb-6" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#3d5a78' }}>
            WHAT DO YOU WANT TO EXPLORE?
          </p>

          {/* Category cards */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {CATEGORY_CARDS.map((card, i) => (
              <button
                key={card.id}
                onClick={() => onNavigate(card.view)}
                className="flex flex-col gap-2 p-4 text-left transition-all group animate-float-up"
                style={{
                  animationDelay: `${0.2 + i * 0.06}s`,
                  background: 'rgba(7,15,32,0.7)',
                  border: '1px solid rgba(26,58,92,0.6)',
                  borderRadius: 4,
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${card.color}40`
                  e.currentTarget.style.background = `rgba(7,15,32,0.9)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(26,58,92,0.6)'
                  e.currentTarget.style.background = 'rgba(7,15,32,0.7)'
                }}
              >
                <span style={{ fontSize: 20, color: card.color, lineHeight: 1 }}>{card.icon}</span>
                <div>
                  <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.15em', color: card.color }}>
                    {card.label}
                  </div>
                  <div className="font-body" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.4 }}>
                    {card.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom global stats ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t" style={{ borderColor: '#1a3a5c', background: 'rgba(4,10,20,0.9)' }}>
        <div className="flex items-center overflow-hidden" style={{ height: 36 }}>
          <div className="flex-shrink-0 flex items-center px-4 border-r h-full" style={{ borderColor: '#1a3a5c' }}>
            <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.15em', color: '#3d5a78' }}>GLOBAL INTELLIGENCE</span>
          </div>
          <div className="flex items-center gap-8 px-6 overflow-x-auto">
            {GLOBAL_STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 flex-shrink-0">
                <span className="font-mono font-600" style={{ fontSize: 13, color: stat.color }}>
                  {stat.value}
                </span>
                <span className="font-body" style={{ fontSize: 10, color: '#3d5a78' }}>
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
