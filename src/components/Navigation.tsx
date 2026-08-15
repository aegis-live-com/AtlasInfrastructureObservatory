import type { View } from '../types'

const NAV_ITEMS: { id: View; label: string; sub: string }[] = [
  { id: 'observe', label: 'OBSERVE', sub: 'Intelligence' },
  { id: 'explore', label: 'EXPLORE', sub: 'Places & Systems' },
  { id: 'simulate', label: 'SIMULATE', sub: 'Futures' },
  { id: 'design', label: 'DESIGN', sub: 'Interventions' },
  { id: 'capital', label: 'CAPITAL', sub: 'Finance' },
  { id: 'projects', label: 'PROJECTS', sub: 'Active' },
  { id: 'impact', label: 'IMPACT', sub: 'Outcomes' },
  { id: 'atlas', label: 'ATLAS AI', sub: 'Intelligence' },
]

interface Props {
  currentView: View
  onNavigate: (v: View) => void
  onHome: () => void
}

export default function Navigation({ currentView, onNavigate, onHome }: Props) {
  return (
    <header className="flex-shrink-0 flex items-center gap-0 border-b" style={{ borderColor: '#1a3a5c', background: 'rgba(4,10,20,0.96)', backdropFilter: 'blur(12px)', height: 48 }}>
      {/* Logo */}
      <button
        onClick={onHome}
        className="flex items-center gap-3 px-5 border-r h-full flex-shrink-0 hover:bg-white/5 transition-colors"
        style={{ borderColor: '#1a3a5c' }}
      >
        <div className="relative w-6 h-6 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border" style={{ borderColor: '#00d4ff', opacity: 0.4 }} />
          <div className="absolute inset-1 rounded-full border" style={{ borderColor: '#00d4ff', opacity: 0.6 }} />
          <div className="absolute inset-2 rounded-full" style={{ background: '#00d4ff' }} />
        </div>
        <div>
          <div className="font-display text-xs font-700 tracking-widest" style={{ color: '#e2eaf4', letterSpacing: '0.18em', fontSize: 11 }}>
            ATLAS SANCTUM
          </div>
        </div>
      </button>

      {/* Nav items */}
      <nav className="flex items-center h-full overflow-x-auto flex-1">
        {NAV_ITEMS.map((item) => {
          const active = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col justify-center px-4 h-full border-r flex-shrink-0 transition-all relative group"
              style={{
                borderColor: '#1a3a5c',
                background: active ? 'rgba(0,212,255,0.06)' : 'transparent',
              }}
            >
              {active && (
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: '#00d4ff' }} />
              )}
              <span
                className="font-mono text-center block"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  color: active ? '#00d4ff' : '#6b8aaa',
                  fontWeight: active ? 600 : 400,
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Right status bar */}
      <div className="flex items-center gap-4 px-5 flex-shrink-0 border-l" style={{ borderColor: '#1a3a5c' }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-glow-pulse" style={{ background: '#10b981' }} />
          <span className="font-mono" style={{ fontSize: 9, color: '#6b8aaa', letterSpacing: '0.1em' }}>
            LIVE
          </span>
        </div>
        <div className="font-mono" style={{ fontSize: 9, color: '#3d5a78', letterSpacing: '0.08em' }}>
          RICI 52.4
        </div>
      </div>
    </header>
  )
}
