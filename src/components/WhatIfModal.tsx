import { useState } from 'react'

const EXAMPLES = [
  "What if every African city had abundant clean energy?",
  "What if data centers became regenerative energy anchors?",
  "What if rivers were treated as critical infrastructure?",
  "What if housing generated food and energy?",
  "What if infrastructure investment optimized human flourishing rather than GDP alone?",
]

interface Expansion {
  assumptions: string[]
  systems: string[]
  requirements: string[]
  opportunities: string[]
  risks: string[]
  outcomes: string[]
}

function generateExpansion(query: string): Expansion {
  const q = query.toLowerCase()
  if (q.includes('energy') || q.includes('clean') || q.includes('renewable')) {
    return {
      assumptions: ['Energy storage costs continue declining', 'Grid infrastructure can be upgraded', 'Political will exists to reform utilities'],
      systems: ['Power generation', 'Grid infrastructure', 'Industrial processes', 'Digital infrastructure', 'Water systems', 'Economic activity'],
      requirements: ['2,400 GW of new renewable capacity', 'Smart grid modernization: $180B', 'Storage: 800 GWh across the continent', 'Transmission corridors: 45,000 km'],
      opportunities: ['Massive industrialization enabled by abundant energy', 'Data center buildout becomes cost-competitive', 'Agriculture transformation with powered irrigation', 'Green hydrogen export economy'],
      risks: ['Land use conflict for large-scale solar/wind', 'Grid stability challenges with high renewable penetration', 'Foreign exchange exposure on equipment imports', 'Stranded asset risk for existing fossil infrastructure'],
      outcomes: ['$2.8T additional GDP by 2040', '600M people lifted from energy poverty', '1.2B tCO₂e avoided annually', '42M jobs in clean energy sector'],
    }
  }
  if (q.includes('data center') || q.includes('compute') || q.includes('ai')) {
    return {
      assumptions: ['Renewable energy is available to power compute', 'Cooling water can be sourced sustainably', 'Fiber connectivity exists or can be built', 'AI talent pipeline develops in parallel'],
      systems: ['Power grid', 'Water systems', 'Fiber networks', 'Real estate / land', 'Education systems', 'Finance systems'],
      requirements: ['2,000+ MW of renewable-powered compute capacity', 'Fiber backbone: 120,000 km', 'Water cooling or air cooling infrastructure', 'AI talent programs: 500,000+ engineers'],
      opportunities: ['African AI models trained on African data', 'Sovereign digital infrastructure independence', 'Regional cloud services replacing offshore dependency', 'AI-powered agriculture and health systems'],
      risks: ['Energy demand increase: +180 TWh/year', 'Water consumption in water-stressed regions', 'Brain drain if talent can earn globally', 'Concentration in 3-4 cities deepens inequality'],
      outcomes: ['$420B annual economic value from AI services', '94% reduction in AI latency for African users', 'Digital sovereignty for 54 nations', '28M tech sector jobs by 2040'],
    }
  }
  if (q.includes('river') || q.includes('water')) {
    return {
      assumptions: ['Ecosystem services can be priced and financed', 'Cross-border water governance is achievable', 'Climate change impacts on hydrology are manageable', 'Communities accept infrastructure in watersheds'],
      systems: ['Freshwater systems', 'Agriculture', 'Energy generation', 'Urban water supply', 'Biodiversity', 'Climate systems'],
      requirements: ['Watershed protection: 180M hectares', 'River monitoring network: 28,000 sensors', 'Wastewater treatment: 400 facilities', 'Ecosystem service payment systems'],
      opportunities: ['Freshwater security for 1.2B people', 'Hydropower without mega-dam destruction', 'Agricultural water productivity +80%', 'Blue carbon finance from wetland restoration'],
      risks: ['Climate change altering flow regimes', 'Upstream/downstream political tensions', 'Infrastructure locks in water allocation', 'Ecological disruption during construction'],
      outcomes: ['Water security index: +42 points', '400M people protected from water stress', '220M tCO₂e sequestered in wetlands', '$82B annual ecosystem service value'],
    }
  }
  return {
    assumptions: ['Current technology trajectories hold', 'Governance conditions are stable', 'Capital markets remain accessible', 'Social license can be obtained'],
    systems: ['Energy systems', 'Water infrastructure', 'Digital connectivity', 'Community systems', 'Capital systems', 'Governance'],
    requirements: ['Multi-system coordination mechanism', 'Integrated financing architecture', 'Community engagement at scale', 'Long-term institutional commitment'],
    opportunities: ['Systems-level infrastructure transformation', 'New economic models around regenerative assets', 'Cross-sector coordination creating multiplier effects', 'Demonstration effect attracting global capital'],
    risks: ['Coordination failure between actors', 'Political economy resistance', 'Technology risk at scale', 'Community opposition if not well-designed'],
    outcomes: ['Civilizational capacity expansion', 'Reduced infrastructure vulnerability', 'New economic value creation', 'Improved human and ecological outcomes'],
  }
}

interface Props {
  onClose: () => void
}

export default function WhatIfModal({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<Expansion | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (q: string) => {
    if (!q.trim()) return
    setQuery(q)
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(generateExpansion(q))
      setLoading(false)
    }, 1000)
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(4,10,20,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="flex flex-col w-full max-w-2xl max-h-[88vh] animate-float-up"
        style={{ background: '#060e22', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div>
            <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.18em', color: '#3d5a78' }}>WHAT IF?</div>
            <h2 className="font-display font-700" style={{ fontSize: 22, color: '#e2eaf4' }}>Ask a Civilizational Question</h2>
          </div>
          <button onClick={onClose} className="font-mono px-3 py-1.5 transition-all" style={{ fontSize: 10, color: '#3d5a78', border: '1px solid #1a3a5c', borderRadius: 3 }}>
            ✕
          </button>
        </div>

        {/* Input */}
        <div className="px-7 py-5 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(query) }}
              placeholder="What if…"
              className="flex-1 px-4 py-3 font-body outline-none"
              style={{ fontSize: 15, color: '#e2eaf4', background: 'rgba(7,15,32,0.8)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 3, caretColor: '#00d4ff' }}
              autoFocus
            />
            <button
              onClick={() => handleSubmit(query)}
              className="px-5 font-mono transition-all flex-shrink-0"
              style={{ fontSize: 10, letterSpacing: '0.12em', color: '#040a14', background: '#00d4ff', borderRadius: 3 }}
            >
              EXPAND →
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {EXAMPLES.slice(0, 3).map((ex) => (
              <button
                key={ex}
                onClick={() => handleSubmit(ex)}
                className="font-body px-3 py-1.5 text-left transition-all"
                style={{ fontSize: 11, color: '#3d5a78', border: '1px solid #1a3a5c', borderRadius: 3 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#8aacca'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#3d5a78'; e.currentTarget.style.borderColor = '#1a3a5c' }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: '#00d4ff', animation: 'glow-pulse 0.8s ease-in-out 0s infinite' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#00d4ff', animation: 'glow-pulse 0.8s ease-in-out 0.2s infinite' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#00d4ff', animation: 'glow-pulse 0.8s ease-in-out 0.4s infinite' }} />
              <span className="font-mono ml-2" style={{ fontSize: 10, color: '#3d5a78', letterSpacing: '0.1em' }}>Expanding assumptions…</span>
            </div>
          )}
          {result && (
            <div className="px-7 py-5 grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {[
                { label: 'ASSUMPTIONS', items: result.assumptions, color: '#f43f5e' },
                { label: 'SYSTEMS AFFECTED', items: result.systems, color: '#8b5cf6' },
                { label: 'INFRASTRUCTURE REQUIREMENTS', items: result.requirements, color: '#f59e0b' },
                { label: 'OPPORTUNITIES', items: result.opportunities, color: '#10b981' },
                { label: 'RISKS', items: result.risks, color: '#f43f5e' },
                { label: 'POTENTIAL OUTCOMES', items: result.outcomes, color: '#00d4ff' },
              ].map((section) => (
                <div key={section.label} className="animate-slide-in-up">
                  <div className="font-mono mb-2" style={{ fontSize: 8, letterSpacing: '0.14em', color: section.color }}>{section.label}</div>
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: section.color }} />
                      <span className="font-body" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
