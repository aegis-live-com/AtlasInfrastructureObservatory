import { useState } from 'react'
import { OPPORTUNITIES } from '../data/mockData'
import type { Opportunity } from '../types'

function CapitalStack({ stack }: { stack: Opportunity['capitalStack'] }) {
  return (
    <div>
      <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>CAPITAL STACK</div>
      <div className="flex h-3 rounded-full overflow-hidden mb-3">
        {stack.map((s) => (
          <div key={s.source} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {stack.map((s) => (
          <div key={s.source} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="font-body" style={{ fontSize: 10, color: '#6b8aaa' }}>{s.source}</span>
            <span className="font-mono font-600" style={{ fontSize: 10, color: s.color }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OpportunityCard({ opp, isSelected, onClick }: { opp: Opportunity; isSelected: boolean; onClick: () => void }) {
  const potentialColor = opp.regenerativePotential === 'High' ? '#10b981' : opp.regenerativePotential === 'Medium' ? '#f59e0b' : '#f43f5e'
  return (
    <button
      onClick={onClick}
      className="text-left w-full p-5 transition-all"
      style={{
        background: isSelected ? 'rgba(0,212,255,0.05)' : 'rgba(7,15,32,0.7)',
        border: `1px solid ${isSelected ? 'rgba(0,212,255,0.25)' : '#1a3a5c'}`,
        borderRadius: 4,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>OPPORTUNITY #{opp.id.split('-')[1]}</div>
          <h3 className="font-display font-600" style={{ fontSize: 15, color: '#e2eaf4', lineHeight: 1.2 }}>{opp.title}</h3>
        </div>
        <div className="flex-shrink-0 font-mono px-2 py-1" style={{ fontSize: 9, letterSpacing: '0.08em', color: potentialColor, border: `1px solid ${potentialColor}30`, borderRadius: 2, background: `${potentialColor}08` }}>
          {opp.regenerativePotential}
        </div>
      </div>
      <div className="font-mono mb-3" style={{ fontSize: 9, color: '#00d4ff' }}>{opp.location}</div>
      <p className="font-body mb-3" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.5 }}>{opp.problem.slice(0, 160)}…</p>
      <div className="flex flex-wrap gap-1.5">
        {opp.dependencies.map((d) => (
          <span key={d} className="font-mono px-2 py-0.5" style={{ fontSize: 9, color: '#3d5a78', border: '1px solid #1a3a5c', borderRadius: 2 }}>{d}</span>
        ))}
      </div>
    </button>
  )
}

function OpportunityDetail({ opp }: { opp: Opportunity }) {
  const [tab, setTab] = useState<'overview' | 'finance' | 'analysis'>('overview')
  const potentialColor = opp.regenerativePotential === 'High' ? '#10b981' : opp.regenerativePotential === 'Medium' ? '#f59e0b' : '#f43f5e'

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'rgba(4,8,18,0.97)', borderLeft: '1px solid #1a3a5c' }}>
      {/* Header */}
      <div className="px-6 py-5 border-b flex-shrink-0" style={{ borderColor: '#1a3a5c' }}>
        <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>OPPORTUNITY #{opp.id.split('-')[1]}</div>
        <h2 className="font-display font-700 mb-1" style={{ fontSize: 20, color: '#e2eaf4', lineHeight: 1.2 }}>{opp.title}</h2>
        <div className="font-mono" style={{ fontSize: 10, color: '#00d4ff' }}>{opp.location}</div>
        <div className="mt-3 flex items-center gap-3">
          <div className="font-mono px-2 py-1" style={{ fontSize: 9, color: potentialColor, border: `1px solid ${potentialColor}30`, borderRadius: 2, background: `${potentialColor}08` }}>
            {opp.regenerativePotential.toUpperCase()} REGENERATIVE POTENTIAL
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: '#1a3a5c' }}>
        {[['overview', 'OVERVIEW'], ['finance', 'FINANCE'], ['analysis', 'ANALYSIS']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id as typeof tab)}
            className="px-5 py-2.5 font-mono transition-all"
            style={{
              fontSize: 9,
              letterSpacing: '0.12em',
              color: tab === id ? '#00d4ff' : '#3d5a78',
              borderBottom: tab === id ? '1px solid #00d4ff' : '1px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {tab === 'overview' && (
          <div className="flex flex-col gap-6">
            {/* Impact metrics */}
            <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {[
                { label: 'Capital Required', value: opp.capitalRequired, color: '#00d4ff' },
                { label: 'Beneficiaries', value: opp.beneficiaries, color: '#10b981' },
                { label: 'Resilience +', value: `${opp.resilienceImprovement}%`, color: '#8b5cf6' },
                { label: 'Emissions Avoided', value: opp.emissionsReduction, color: '#10b981' },
              ].map((m) => (
                <div key={m.label} className="p-3" style={{ background: 'rgba(26,58,92,0.15)', border: '1px solid #1a3a5c', borderRadius: 3 }}>
                  <div className="font-body mb-1" style={{ fontSize: 10, color: '#3d5a78' }}>{m.label}</div>
                  <div className="font-mono font-600" style={{ fontSize: 14, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>THE PROBLEM</div>
              <p className="font-body" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.6 }}>{opp.problem}</p>
            </div>
            <div>
              <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#10b981' }}>THE OPPORTUNITY</div>
              <p className="font-body" style={{ fontSize: 11, color: '#4a8a6a', lineHeight: 1.6 }}>{opp.opportunity}</p>
            </div>
            <div>
              <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#f59e0b' }}>WHY NOW?</div>
              <p className="font-body" style={{ fontSize: 11, color: '#6a5a3a', lineHeight: 1.6 }}>{opp.whyNow}</p>
            </div>
            <div>
              <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#8b5cf6' }}>WHAT COULD CHANGE?</div>
              <p className="font-body" style={{ fontSize: 11, color: '#5a4a8a', lineHeight: 1.6 }}>{opp.whatCouldChange}</p>
            </div>
            {/* Dependencies */}
            <div>
              <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>DEPENDENCIES</div>
              <div className="flex flex-wrap gap-1.5">
                {opp.dependencies.map((d) => (
                  <span key={d} className="font-mono px-2 py-1" style={{ fontSize: 9, color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 2 }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'finance' && (
          <div className="flex flex-col gap-6">
            <CapitalStack stack={opp.capitalStack} />
            <div>
              <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>WHO NEEDS TO PARTICIPATE?</div>
              <div className="flex flex-col gap-2">
                {opp.participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00d4ff' }} />
                    <span className="font-body" style={{ fontSize: 11, color: '#4a6a8a' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="w-full py-3 font-mono transition-all"
              style={{ fontSize: 10, letterSpacing: '0.14em', color: '#040a14', background: '#00d4ff', borderRadius: 3, boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}
            >
              CREATE PROJECT FROM OPPORTUNITY →
            </button>
          </div>
        )}

        {tab === 'analysis' && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#f43f5e' }}>WHAT COULD PREVENT IT?</div>
              {opp.barriers.map((b, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#f43f5e' }} />
                  <span className="font-body" style={{ fontSize: 11, color: '#6a3a4a', lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
            <div className="p-4" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 4 }}>
              <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#00d4ff' }}>QUESTIONS WE STILL NEED TO ANSWER</div>
              <div className="flex flex-col gap-2">
                {[
                  'Who holds decision-making power over land access?',
                  'What is the genuine community demand vs. externally projected need?',
                  'How does this interact with existing informal infrastructure?',
                  'What are the second-order ecological effects?',
                  'What happens if anchor investors withdraw?',
                ].map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ color: '#00d4ff', fontSize: 10 }}>?</span>
                    <span className="font-body" style={{ fontSize: 11, color: '#3a5a7a', lineHeight: 1.5 }}>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OpportunityEngine() {
  const [selected, setSelected] = useState<Opportunity>(OPPORTUNITIES[0])

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#040a14' }}>
      {/* Left list */}
      <div className="flex flex-col border-r overflow-y-auto" style={{ width: 420, borderColor: '#1a3a5c', flexShrink: 0 }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.15em', color: '#3d5a78' }}>OPPORTUNITY ENGINE</div>
          <h2 className="font-display font-700" style={{ fontSize: 18, color: '#e2eaf4' }}>Infrastructure Opportunities</h2>
          <p className="font-body mt-1" style={{ fontSize: 11, color: '#4a6a8a' }}>
            Identified from infrastructure gap analysis, demand signals, and capital readiness.
          </p>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-3">
          {OPPORTUNITIES.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              isSelected={selected.id === opp.id}
              onClick={() => setSelected(opp)}
            />
          ))}
        </div>
      </div>

      {/* Right detail */}
      <div className="flex-1 overflow-hidden">
        <OpportunityDetail opp={selected} />
      </div>
    </div>
  )
}
