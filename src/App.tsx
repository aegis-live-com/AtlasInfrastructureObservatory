import { useState } from 'react'
import type { View } from './types'
import Navigation from './components/Navigation'
import HomeScreen from './components/HomeScreen'
import Observatory from './components/Observatory'
import FutureSimulator from './components/FutureSimulator'
import OpportunityEngine from './components/OpportunityEngine'
import OpportunityGraph from './components/OpportunityGraph'
import DesignStudio from './components/DesignStudio'
import AtlasCopilot from './components/AtlasCopilot'
import CapitalView from './components/CapitalView'
import ImpactView from './components/ImpactView'
import ProjectsView from './components/ProjectsView'
import WhatIfModal from './components/WhatIfModal'

function ExploreView() {
  const [tab, setTab] = useState<'opportunities' | 'graph'>('opportunities')
  return (
    <div className="flex flex-col h-full" style={{ background: '#040a14' }}>
      <div className="flex items-center border-b flex-shrink-0" style={{ borderColor: '#1a3a5c', background: 'rgba(4,10,20,0.9)', height: 40 }}>
        {[{ id: 'opportunities', label: 'OPPORTUNITY ENGINE' }, { id: 'graph', label: 'INFRASTRUCTURE GRAPH' }].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className="px-6 h-full font-mono transition-all relative"
            style={{ fontSize: 9, letterSpacing: '0.13em', color: tab === t.id ? '#00d4ff' : '#3d5a78' }}
          >
            {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: '#00d4ff' }} />}
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === 'opportunities' ? <OpportunityEngine /> : <OpportunityGraph />}
      </div>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [showWhatIf, setShowWhatIf] = useState(false)

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    setView('observe')
  }

  const handleNavigate = (v: View) => {
    setView(v)
  }

  if (view === 'home') {
    return (
      <>
        <HomeScreen onSearch={handleSearch} onNavigate={handleNavigate} />
        <WhatIfButton onClick={() => setShowWhatIf(true)} />
        {showWhatIf && <WhatIfModal onClose={() => setShowWhatIf(false)} />}
      </>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#040a14' }}>
      <Navigation currentView={view} onNavigate={handleNavigate} onHome={() => setView('home')} />
      <div className="flex-1 overflow-hidden">
        {view === 'observe' && <Observatory searchQuery={searchQuery} />}
        {view === 'explore' && <ExploreView />}
        {view === 'design' && <DesignStudio />}
        {view === 'simulate' && <FutureSimulator />}
        {view === 'capital' && <CapitalView />}
        {view === 'projects' && <ProjectsView />}
        {view === 'impact' && <ImpactView />}
        {view === 'atlas' && <AtlasCopilot />}
      </div>
      <WhatIfButton onClick={() => setShowWhatIf(true)} />
      {showWhatIf && <WhatIfModal onClose={() => setShowWhatIf(false)} />}
    </div>
  )
}

function WhatIfButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed z-40 font-mono transition-all group"
      style={{
        bottom: 24,
        right: 24,
        padding: '10px 20px',
        fontSize: 11,
        letterSpacing: '0.18em',
        color: '#00d4ff',
        background: 'rgba(4,10,20,0.92)',
        border: '1px solid rgba(0,212,255,0.3)',
        borderRadius: 3,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 0 24px rgba(0,212,255,0.15)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0,212,255,0.1)'
        e.currentTarget.style.boxShadow = '0 0 32px rgba(0,212,255,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(4,10,20,0.92)'
        e.currentTarget.style.boxShadow = '0 0 24px rgba(0,212,255,0.15)'
      }}
    >
      WHAT IF? →
    </button>
  )
}
