import { useState } from 'react'

const CAPITAL_SOURCES = [
  { id: 'govt', label: 'Government', desc: 'Public infrastructure budgets and national development plans', value: 20, color: '#3b82f6', total: '$24B' },
  { id: 'dfi', label: 'Development Finance', desc: 'AfDB, World Bank, IFC, AIIB, Proparco, DEG, BII', value: 28, color: '#8b5cf6', total: '$33.6B' },
  { id: 'private', label: 'Private Infrastructure', desc: 'Global infrastructure funds, pension capital, sovereign wealth', value: 32, color: '#00d4ff', total: '$38.4B' },
  { id: 'climate', label: 'Climate Finance', desc: 'GCF, GEF, climate bonds, JETP, Just Transition funds', value: 10, color: '#10b981', total: '$12B' },
  { id: 'community', label: 'Community Capital', desc: 'Cooperatives, community bonds, microfinance, diaspora', value: 5, color: '#f59e0b', total: '$6B' },
  { id: 'philanthropic', label: 'Philanthropic', desc: 'Foundations, impact-first capital, catalytic grants', value: 5, color: '#ec4899', total: '$6B' },
]

const FLOWS = [
  { from: 'Development Finance', to: 'Kenya Energy', amount: '$2.4B', status: 'Active', color: '#8b5cf6' },
  { from: 'Private Infrastructure', to: 'SA Renewables', amount: '$8.1B', status: 'Active', color: '#00d4ff' },
  { from: 'Climate Finance', to: 'Congo Forest', amount: '$1.8B', status: 'Mobilizing', color: '#10b981' },
  { from: 'Government', to: 'Nigeria Grid', amount: '$3.2B', status: 'Active', color: '#3b82f6' },
  { from: 'Private Infrastructure', to: 'EAF Data Centers', amount: '$4.6B', status: 'Pipeline', color: '#00d4ff' },
  { from: 'Development Finance', to: 'LAPSSET Corridor', amount: '$2.1B', status: 'Active', color: '#8b5cf6' },
  { from: 'Climate Finance', to: 'Morocco Hydrogen', amount: '$3.8B', status: 'Pipeline', color: '#10b981' },
  { from: 'Community Capital', to: 'Micro-Solar Kenya', amount: '$0.4B', status: 'Active', color: '#f59e0b' },
]

const TOTAL_PIPELINE = 120
const statusColor = (s: string) => s === 'Active' ? '#10b981' : s === 'Mobilizing' ? '#f59e0b' : '#3d5a78'

export default function CapitalView() {
  const [stack, setStack] = useState(CAPITAL_SOURCES.map((s) => ({ ...s })))
  const total = stack.reduce((a, b) => a + b.value, 0)

  const adjust = (id: string, delta: number) => {
    setStack((prev) => prev.map((s) => s.id === id ? { ...s, value: Math.max(0, Math.min(80, s.value + delta)) } : s))
  }

  const feasibility = Math.min(100, Math.round((stack.find((s) => s.id === 'dfi')!.value + stack.find((s) => s.id === 'private')!.value) * 1.8))

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#040a14' }}>
      {/* Left — capital stack builder */}
      <div className="flex flex-col border-r overflow-y-auto" style={{ width: 340, borderColor: '#1a3a5c', flexShrink: 0 }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.15em', color: '#3d5a78' }}>CAPITAL INTELLIGENCE</div>
          <h2 className="font-display font-700" style={{ fontSize: 18, color: '#e2eaf4' }}>Finance This Future</h2>
          <p className="font-body mt-1" style={{ fontSize: 11, color: '#4a6a8a' }}>Adjust the capital stack and see the effect on feasibility.</p>
        </div>

        {/* Stack bar */}
        <div className="px-5 py-5 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>CAPITAL STACK · ${TOTAL_PIPELINE}B TOTAL PIPELINE</div>
          <div className="flex h-6 rounded overflow-hidden mb-4">
            {stack.map((s) => (
              <div
                key={s.id}
                style={{ width: `${(s.value / total) * 100}%`, background: s.color, transition: 'width 0.4s ease' }}
                title={`${s.label}: ${Math.round((s.value / total) * 100)}%`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {stack.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="font-body" style={{ fontSize: 11, color: '#8aacca' }}>{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjust(s.id, -5)} className="font-mono w-5 h-5 flex items-center justify-center" style={{ fontSize: 12, color: '#3d5a78', border: '1px solid #1a3a5c', borderRadius: 2 }}>−</button>
                    <span className="font-mono w-8 text-center" style={{ fontSize: 11, color: s.color }}>{Math.round((s.value / total) * 100)}%</span>
                    <button onClick={() => adjust(s.id, 5)} className="font-mono w-5 h-5 flex items-center justify-center" style={{ fontSize: 12, color: '#3d5a78', border: '1px solid #1a3a5c', borderRadius: 2 }}>+</button>
                  </div>
                </div>
                <div className="h-px" style={{ background: '#1a3a5c' }}>
                  <div className="h-px transition-all duration-400" style={{ width: `${(s.value / total) * 100}%`, background: s.color, boxShadow: `0 0 4px ${s.color}60` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feasibility */}
        <div className="px-5 py-5">
          <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>PROJECT FEASIBILITY SCORE</div>
          <div className="font-display font-800 mb-2" style={{ fontSize: 48, color: feasibility > 70 ? '#10b981' : feasibility > 50 ? '#f59e0b' : '#f43f5e', letterSpacing: '-0.03em' }}>
            {feasibility}
          </div>
          <div className="h-1 rounded" style={{ background: '#1a3a5c' }}>
            <div className="h-1 rounded transition-all" style={{ width: `${feasibility}%`, background: feasibility > 70 ? '#10b981' : feasibility > 50 ? '#f59e0b' : '#f43f5e' }} />
          </div>
          <p className="font-body mt-3" style={{ fontSize: 10, color: '#3d5a78', lineHeight: 1.5 }}>
            {feasibility > 70 ? 'Strong capital structure. DFI + private blend creates bankable risk profile.' : feasibility > 50 ? 'Moderate feasibility. Consider increasing DFI first-loss capital to crowd in private.' : 'Low feasibility. Insufficient concessional capital to de-risk private investment.'}
          </p>
        </div>
      </div>

      {/* Right — flows + intelligence */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 py-4 border-b flex-shrink-0" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>GLOBAL CAPITAL INTELLIGENCE · ACTIVE FLOWS</div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Summary stats */}
          <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { label: 'Total Pipeline', value: '$120B', sub: 'Tracked infrastructure', color: '#00d4ff' },
              { label: 'Active Deployment', value: '$68B', sub: 'Currently investing', color: '#10b981' },
              { label: 'Capital Gap', value: '$15T', sub: 'Annual global deficit', color: '#f43f5e' },
            ].map((s) => (
              <div key={s.label} className="p-5" style={{ background: 'rgba(7,15,32,0.8)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
                <div className="font-mono mb-1" style={{ fontSize: 9, color: '#3d5a78', letterSpacing: '0.08em' }}>{s.label}</div>
                <div className="font-display font-700" style={{ fontSize: 28, color: s.color }}>{s.value}</div>
                <div className="font-body" style={{ fontSize: 10, color: '#3d5a78' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Capital sources detail */}
          <div className="mb-8">
            <div className="font-mono mb-4" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>CAPITAL SOURCE INTELLIGENCE</div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {CAPITAL_SOURCES.map((s) => (
                <div key={s.id} className="p-4" style={{ background: 'rgba(7,15,32,0.7)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="font-mono" style={{ fontSize: 9, color: s.color, letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</span>
                    <span className="font-mono ml-auto" style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.total}</span>
                  </div>
                  <p className="font-body" style={{ fontSize: 10, color: '#3d5a78', lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active flows */}
          <div>
            <div className="font-mono mb-4" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>ACTIVE CAPITAL FLOWS</div>
            <div className="flex flex-col gap-0">
              {/* Header row */}
              <div className="grid px-4 py-2" style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr', borderBottom: '1px solid #1a3a5c' }}>
                {['SOURCE', 'DESTINATION', 'AMOUNT', 'STATUS'].map((h) => (
                  <span key={h} className="font-mono" style={{ fontSize: 8, letterSpacing: '0.12em', color: '#1a3a5c' }}>{h}</span>
                ))}
              </div>
              {FLOWS.map((f, i) => (
                <div
                  key={i}
                  className="grid px-4 py-3 transition-all"
                  style={{
                    gridTemplateColumns: '2fr 2fr 1fr 1fr',
                    borderBottom: '1px solid #0d1e34',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,58,92,0.15)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span className="font-body" style={{ fontSize: 11, color: '#6b8aaa' }}>{f.from}</span>
                  <span className="font-body" style={{ fontSize: 11, color: '#e2eaf4' }}>{f.to}</span>
                  <span className="font-mono font-600" style={{ fontSize: 11, color: f.color }}>{f.amount}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(f.status) }} />
                    <span className="font-mono" style={{ fontSize: 9, color: statusColor(f.status), letterSpacing: '0.08em' }}>{f.status.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
