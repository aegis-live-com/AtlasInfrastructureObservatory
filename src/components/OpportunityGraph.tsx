import { useState } from 'react'

interface GraphNode {
  id: string
  label: string
  sub: string
  category: 'problem' | 'place' | 'solution' | 'infrastructure' | 'finance' | 'outcome'
  x: number
  y: number
  color: string
  detail: string
}

interface GraphEdge {
  from: string
  to: string
  label?: string
}

interface Chain {
  id: string
  name: string
  color: string
  description: string
  nodes: string[]
  edges: string[]
}

const ALL_NODES: GraphNode[] = [
  // Problems
  { id: 'water-scarcity', label: 'Water Scarcity', sub: 'Crisis', category: 'problem', x: 60, y: 80, color: '#f43f5e', detail: '820M people in water stress in Africa. Climate change is accelerating aquifer depletion and rainfall variability.' },
  { id: 'energy-gap', label: 'Energy Gap', sub: 'Crisis', category: 'problem', x: 60, y: 200, color: '#f43f5e', detail: '600M Africans without reliable electricity. Annual economic cost of energy poverty: $5.3B+.' },
  { id: 'digital-gap', label: 'Digital Exclusion', sub: 'Crisis', category: 'problem', x: 60, y: 320, color: '#f43f5e', detail: '94% of African AI compute sent offshore. 60% without broadband. Digital colonialism is the new extraction.' },
  { id: 'food-insecurity', label: 'Food Insecurity', sub: 'Crisis', category: 'problem', x: 60, y: 440, color: '#f43f5e', detail: '282M people chronically hungry in Africa. 80% of agriculture is rain-fed. Climate change is the multiplier.' },

  // Places
  { id: 'nairobi', label: 'Nairobi', sub: 'Kenya', category: 'place', x: 220, y: 80, color: '#00d4ff', detail: 'East Africa hub. 4.9M people. RICI 71. High innovation capacity, constrained infrastructure.' },
  { id: 'lagos', label: 'Lagos', sub: 'Nigeria', category: 'place', x: 220, y: 200, color: '#00d4ff', detail: "Africa's largest city. 21M people. RICI 58. Highest infrastructure gap and opportunity in the world." },
  { id: 'kigali', label: 'Kigali', sub: 'Rwanda', category: 'place', x: 220, y: 320, color: '#00d4ff', detail: 'Emerging tech hub. 1.35M people. RICI 66. Strong governance, ambitious digital strategy.' },
  { id: 'western-kenya', label: 'Western Kenya', sub: 'Rural Region', category: 'place', x: 220, y: 440, color: '#00d4ff', detail: '6.2M people. Agricultural heartland. Low infrastructure density. High regeneration potential.' },

  // Solutions
  { id: 'wastewater-reuse', label: 'Wastewater Reuse', sub: 'Solution', category: 'solution', x: 380, y: 80, color: '#38bdf8', detail: 'Tertiary treatment enables 80% of wastewater to be reused for irrigation and industrial cooling. Proven technology.' },
  { id: 'distributed-solar', label: 'Distributed Solar', sub: 'Solution', category: 'solution', x: 380, y: 200, color: '#f59e0b', detail: '850MW across 280 commercial + community nodes. Battery storage enables 24/7 reliability. $680M capital.' },
  { id: 'ai-campus', label: 'AI Compute Campus', sub: 'Solution', category: 'solution', x: 380, y: 320, color: '#8b5cf6', detail: '45MW renewable-powered AI data center. Open-access platform for African developers and researchers.' },
  { id: 'agroforestry', label: 'Regenerative Agroforestry', sub: 'Solution', category: 'solution', x: 380, y: 440, color: '#22c55e', detail: 'Integrate trees, crops, and livestock. 40% yield increase + soil regeneration + carbon finance.' },

  // Infrastructure
  { id: 'treatment-plant', label: 'Treatment Plant', sub: 'Infrastructure', category: 'infrastructure', x: 530, y: 80, color: '#38bdf8', detail: '50,000 m³/day capacity. $28M capital. Requires 2MW continuous power. 15-year lifecycle.' },
  { id: 'solar-storage', label: 'Solar + Storage', sub: 'Infrastructure', category: 'infrastructure', x: 530, y: 200, color: '#f59e0b', detail: '280MW solar + 140MWh battery storage. 48 strategic nodes. Grid-forming capability.' },
  { id: 'data-center', label: 'Data Center + Fiber', sub: 'Infrastructure', category: 'infrastructure', x: 530, y: 320, color: '#8b5cf6', detail: '45MW compute. 100Gbps fiber backbone. Renewable powered. $380M total capital.' },
  { id: 'forest-system', label: 'Forest + Soil System', sub: 'Infrastructure', category: 'infrastructure', x: 530, y: 440, color: '#22c55e', detail: '180,000 ha of agroforestry + forest restoration. Carbon monitoring. Community management.' },

  // Finance
  { id: 'afdb-dfi', label: 'AfDB + DFI', sub: 'Finance', category: 'finance', x: 680, y: 80, color: '#8b5cf6', detail: '$2.4B committed to East Africa water infrastructure. 25-year tenors at concessional rates.' },
  { id: 'ifc-private', label: 'IFC + Private', sub: 'Finance', category: 'finance', x: 680, y: 200, color: '#00d4ff', detail: 'IFC $580M blended finance facility. Private co-investment crowd-in at 3:1 ratio.' },
  { id: 'microsoft-pe', label: 'Microsoft + PE', sub: 'Finance', category: 'finance', x: 680, y: 320, color: '#8b5cf6', detail: "Microsoft's $1B Africa commitment. PE infrastructure funds seeking 12%+ returns." },
  { id: 'carbon-markets', label: 'Carbon Markets', sub: 'Finance', category: 'finance', x: 680, y: 440, color: '#22c55e', detail: 'REDD+ + article 6.4 carbon credits at $18-45/tCO₂e. Voluntary + compliance markets.' },

  // Outcomes
  { id: 'food-security', label: 'Food Security', sub: 'Outcome', category: 'outcome', x: 840, y: 80, color: '#10b981', detail: '180,000 people with reliable water for agriculture. 35% yield increase. $48M/yr farm income.' },
  { id: 'economic-growth', label: 'Economic Growth', sub: 'Outcome', category: 'outcome', x: 840, y: 200, color: '#10b981', detail: '$3.2B GDP impact. 42,000 jobs. 1.2M people with improved energy access. 340,000 tCO₂e avoided/yr.' },
  { id: 'digital-sovereignty', label: 'Digital Sovereignty', sub: 'Outcome', category: 'outcome', x: 840, y: 320, color: '#10b981', detail: 'African AI trained on African data. 94% reduction in offshore compute dependency. 12,000 tech jobs.' },
  { id: 'regen-value', label: 'Regenerative Value', sub: 'Outcome', category: 'outcome', x: 840, y: 440, color: '#10b981', detail: '$82M/yr ecosystem service value. 380,000 tCO₂e sequestered. 6,200 farm families with new income.' },
]

const ALL_EDGES: GraphEdge[] = [
  // Water chain
  { from: 'water-scarcity', to: 'nairobi', label: 'affects' },
  { from: 'nairobi', to: 'wastewater-reuse', label: 'requires' },
  { from: 'wastewater-reuse', to: 'treatment-plant', label: 'enables' },
  { from: 'treatment-plant', to: 'afdb-dfi', label: 'financed by' },
  { from: 'afdb-dfi', to: 'food-security', label: 'unlocks' },
  // Energy chain
  { from: 'energy-gap', to: 'lagos', label: 'affects' },
  { from: 'lagos', to: 'distributed-solar', label: 'requires' },
  { from: 'distributed-solar', to: 'solar-storage', label: 'enables' },
  { from: 'solar-storage', to: 'ifc-private', label: 'financed by' },
  { from: 'ifc-private', to: 'economic-growth', label: 'unlocks' },
  // Compute chain
  { from: 'digital-gap', to: 'kigali', label: 'affects' },
  { from: 'kigali', to: 'ai-campus', label: 'requires' },
  { from: 'ai-campus', to: 'data-center', label: 'enables' },
  { from: 'data-center', to: 'microsoft-pe', label: 'financed by' },
  { from: 'microsoft-pe', to: 'digital-sovereignty', label: 'unlocks' },
  // Food chain
  { from: 'food-insecurity', to: 'western-kenya', label: 'affects' },
  { from: 'western-kenya', to: 'agroforestry', label: 'requires' },
  { from: 'agroforestry', to: 'forest-system', label: 'enables' },
  { from: 'forest-system', to: 'carbon-markets', label: 'financed by' },
  { from: 'carbon-markets', to: 'regen-value', label: 'unlocks' },
  // Cross-chain
  { from: 'solar-storage', to: 'treatment-plant', label: 'powers' },
  { from: 'data-center', to: 'solar-storage', label: 'needs power' },
  { from: 'food-security', to: 'economic-growth', label: 'contributes' },
]

const CHAINS: Chain[] = [
  {
    id: 'water', name: 'Water Security', color: '#38bdf8', description: 'Wastewater reuse creates water-food nexus',
    nodes: ['water-scarcity', 'nairobi', 'wastewater-reuse', 'treatment-plant', 'afdb-dfi', 'food-security'],
    edges: ['water-scarcity-nairobi', 'nairobi-wastewater-reuse', 'wastewater-reuse-treatment-plant', 'treatment-plant-afdb-dfi', 'afdb-dfi-food-security'],
  },
  {
    id: 'energy', name: 'Clean Energy', color: '#f59e0b', description: 'Distributed solar unlocks Lagos industrialization',
    nodes: ['energy-gap', 'lagos', 'distributed-solar', 'solar-storage', 'ifc-private', 'economic-growth'],
    edges: ['energy-gap-lagos', 'lagos-distributed-solar', 'distributed-solar-solar-storage', 'solar-storage-ifc-private', 'ifc-private-economic-growth'],
  },
  {
    id: 'compute', name: 'Digital Access', color: '#8b5cf6', description: 'AI campus ends African compute colonialism',
    nodes: ['digital-gap', 'kigali', 'ai-campus', 'data-center', 'microsoft-pe', 'digital-sovereignty'],
    edges: ['digital-gap-kigali', 'kigali-ai-campus', 'ai-campus-data-center', 'data-center-microsoft-pe', 'microsoft-pe-digital-sovereignty'],
  },
  {
    id: 'food', name: 'Food Systems', color: '#22c55e', description: 'Agroforestry regenerates land, community, and capital',
    nodes: ['food-insecurity', 'western-kenya', 'agroforestry', 'forest-system', 'carbon-markets', 'regen-value'],
    edges: ['food-insecurity-western-kenya', 'western-kenya-agroforestry', 'agroforestry-forest-system', 'forest-system-carbon-markets', 'carbon-markets-regen-value'],
  },
]

const CAT_LABELS: Record<GraphNode['category'], string> = {
  problem: 'PROBLEM', place: 'PLACE', solution: 'SOLUTION',
  infrastructure: 'INFRASTRUCTURE', finance: 'FINANCE', outcome: 'OUTCOME',
}

export default function OpportunityGraph() {
  const [activeChain, setActiveChain] = useState<string>('water')
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  const chain = CHAINS.find((c) => c.id === activeChain)!
  const activeNodes = new Set(chain.nodes)

  const isActiveEdge = (e: GraphEdge) => activeNodes.has(e.from) && activeNodes.has(e.to)

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#040a14' }}>
      {/* Left — chain selector + node detail */}
      <div className="flex flex-col border-r flex-shrink-0" style={{ width: 260, borderColor: '#1a3a5c' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>OPPORTUNITY GRAPH</div>
          <h2 className="font-display font-700" style={{ fontSize: 16, color: '#e2eaf4' }}>Infrastructure Chains</h2>
          <p className="font-body mt-1" style={{ fontSize: 11, color: '#3d5a78', lineHeight: 1.5 }}>
            From problem to regenerative value — trace the infrastructure chain.
          </p>
        </div>

        {/* Chain selector */}
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>SELECT CHAIN</div>
          <div className="flex flex-col gap-2">
            {CHAINS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => { setActiveChain(ch.id); setSelectedNode(null) }}
                className="text-left px-3 py-3 transition-all"
                style={{
                  background: activeChain === ch.id ? `${ch.color}10` : 'rgba(7,15,32,0.5)',
                  border: `1px solid ${activeChain === ch.id ? ch.color + '40' : '#1a3a5c'}`,
                  borderRadius: 3,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ch.color }} />
                  <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: activeChain === ch.id ? ch.color : '#6b8aaa' }}>{ch.name.toUpperCase()}</span>
                </div>
                <p className="font-body" style={{ fontSize: 10, color: '#3d5a78', lineHeight: 1.4 }}>{ch.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Node detail or hint */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {selectedNode ? (
            <div className="animate-slide-in-up">
              <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: selectedNode.color }}>{CAT_LABELS[selectedNode.category]}</div>
              <h4 className="font-display font-700 mb-1" style={{ fontSize: 15, color: '#e2eaf4' }}>{selectedNode.label}</h4>
              <div className="font-mono mb-3" style={{ fontSize: 9, color: '#3d5a78' }}>{selectedNode.sub}</div>
              <p className="font-body" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.6 }}>{selectedNode.detail}</p>

              {/* Show connected nodes */}
              <div className="mt-4">
                <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>CONNECTED TO</div>
                {ALL_EDGES.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id).map((e, i) => {
                  const otherId = e.from === selectedNode.id ? e.to : e.from
                  const other = ALL_NODES.find((n) => n.id === otherId)
                  if (!other) return null
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedNode(other)}
                      className="flex items-center gap-2 mb-2 w-full text-left"
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: other.color }} />
                      <div>
                        <span className="font-body" style={{ fontSize: 11, color: '#6b8aaa' }}>{other.label}</span>
                        {e.label && <span className="font-mono ml-2" style={{ fontSize: 9, color: '#2a4a6a' }}>({e.label})</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.5 }}>
              <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>CLICK ANY NODE TO EXPLORE</div>
              <div className="flex flex-col gap-2">
                {(['problem', 'place', 'solution', 'infrastructure', 'finance', 'outcome'] as const).map((cat) => {
                  const colors = { problem: '#f43f5e', place: '#00d4ff', solution: '#38bdf8', infrastructure: '#f59e0b', finance: '#8b5cf6', outcome: '#10b981' }
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: colors[cat] }} />
                      <span className="font-body" style={{ fontSize: 10, color: '#3d5a78' }}>{CAT_LABELS[cat]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main — graph canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b flex-shrink-0" style={{ borderColor: '#1a3a5c', background: 'rgba(4,10,20,0.9)' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: chain.color }} />
              <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: chain.color }}>{chain.name.toUpperCase()} CHAIN</span>
            </div>
            <span className="font-body" style={{ fontSize: 11, color: '#3d5a78' }}>{chain.description}</span>
          </div>
          <div className="flex items-center gap-4">
            {(['PROBLEM', 'PLACE', 'SOLUTION', 'INFRASTRUCTURE', 'FINANCE', 'OUTCOME']).map((l, i) => {
              const colors = ['#f43f5e', '#00d4ff', '#38bdf8', '#f59e0b', '#8b5cf6', '#10b981']
              return (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[i] }} />
                  <span className="font-mono" style={{ fontSize: 8, color: '#2a4a6a', letterSpacing: '0.08em' }}>{l}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* SVG Graph */}
        <div className="flex-1 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #060e20 0%, #040a14 100%)' }}>
          {/* Background grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.07 }}>
            <defs>
              <pattern id="og-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#og-grid)" />
          </svg>

          {/* Column labels */}
          <div className="absolute top-4 left-0 right-0 flex pointer-events-none" style={{ paddingLeft: '6%', paddingRight: '5%' }}>
            {['PROBLEMS', 'PLACES', 'SOLUTIONS', 'INFRASTRUCTURE', 'FINANCE', 'OUTCOMES'].map((col, i) => (
              <div key={col} className="flex-1 text-center font-mono" style={{ fontSize: 8, letterSpacing: '0.12em', color: '#1a3a5c' }}>{col}</div>
            ))}
          </div>

          <svg
            viewBox="0 0 940 530"
            preserveAspectRatio="xMidYMid meet"
            className="absolute"
            style={{ inset: 0, width: '100%', height: '100%' }}
          >
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 Z" fill="#1a3a5c" />
              </marker>
              <marker id="arrow-active" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 Z" fill={chain.color} />
              </marker>
            </defs>

            {/* Edges */}
            {ALL_EDGES.map((edge, i) => {
              const from = ALL_NODES.find((n) => n.id === edge.from)
              const to = ALL_NODES.find((n) => n.id === edge.to)
              if (!from || !to) return null
              const active = isActiveEdge(edge)
              const fx = from.x + 80; const fy = from.y + 24
              const tx = to.x - 4; const ty = to.y + 24
              const mx = (fx + tx) / 2

              return (
                <g key={i}>
                  <path
                    d={`M ${fx} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${tx} ${ty}`}
                    fill="none"
                    stroke={active ? chain.color : '#1a3a5c'}
                    strokeWidth={active ? 1.5 : 0.6}
                    strokeDasharray={active ? undefined : '3 4'}
                    opacity={active ? 0.7 : 0.3}
                    markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'}
                  />
                  {active && (
                    <path
                      d={`M ${fx} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${tx} ${ty}`}
                      fill="none"
                      stroke={chain.color}
                      strokeWidth="2.5"
                      strokeDasharray="15 400"
                      opacity="0.9"
                      className="animate-flow"
                      style={{ animationDuration: `${2 + (i % 4) * 0.5}s`, animationDelay: `${(i % 5) * 0.3}s` }}
                    />
                  )}
                  {edge.label && active && (
                    <text x={mx} y={(fy + ty) / 2 - 6} textAnchor="middle" fill={chain.color} fontSize="7" fontFamily="JetBrains Mono" opacity="0.7">
                      {edge.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {ALL_NODES.map((node) => {
              const isActive = activeNodes.has(node.id)
              const isSelected = selectedNode?.id === node.id
              const nx = node.x + 8; const ny = node.y

              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer', opacity: isActive ? 1 : 0.22 }}
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                >
                  {/* Pulse ring for active */}
                  {isActive && (
                    <rect
                      x={nx - 4} y={ny - 4}
                      width={168} height={56}
                      rx="4"
                      fill="none"
                      stroke={node.color}
                      strokeWidth="0.8"
                      opacity="0.3"
                    />
                  )}
                  {/* Main card */}
                  <rect
                    x={nx} y={ny}
                    width={160} height={48}
                    rx="3"
                    fill={isSelected ? `${node.color}18` : isActive ? 'rgba(7,15,32,0.95)' : 'rgba(7,15,32,0.6)'}
                    stroke={isSelected ? node.color : isActive ? `${node.color}50` : '#1a3a5c'}
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                  {/* Category indicator */}
                  <rect x={nx} y={ny} width="3" height="48" rx="1" fill={node.color} opacity={isActive ? 1 : 0.3} />
                  {/* Label */}
                  <text x={nx + 12} y={ny + 18} fill={isActive ? '#e2eaf4' : '#3d5a78'} fontSize="10" fontFamily="Outfit" fontWeight="600">
                    {node.label}
                  </text>
                  <text x={nx + 12} y={ny + 33} fill={isActive ? node.color : '#2a3a4a'} fontSize="8" fontFamily="JetBrains Mono">
                    {node.sub}
                  </text>
                  {/* Selected glow */}
                  {isSelected && (
                    <rect x={nx - 4} y={ny - 4} width={168} height={56} rx="4" fill="none" stroke={node.color} strokeWidth="1" opacity="0.6"
                      style={{ filter: `drop-shadow(0 0 6px ${node.color})` }} />
                  )}
                </g>
              )
            })}
          </svg>

          {/* Bottom: chain description */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t" style={{ borderColor: '#1a3a5c', background: 'rgba(4,10,20,0.92)' }}>
            <div className="flex items-center gap-6">
              <div>
                <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>ACTIVE CHAIN</div>
                <div className="font-display font-600" style={{ fontSize: 13, color: chain.color }}>{chain.name}</div>
              </div>
              <div className="flex items-center gap-1 font-body" style={{ fontSize: 11, color: '#3d5a78' }}>
                {chain.nodes.map((nid, i) => {
                  const node = ALL_NODES.find((n) => n.id === nid)!
                  return (
                    <span key={nid} className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedNode(node)}
                        className="transition-colors"
                        style={{ color: selectedNode?.id === nid ? node.color : '#6b8aaa', fontSize: 11 }}
                      >
                        {node.label}
                      </button>
                      {i < chain.nodes.length - 1 && <span style={{ color: '#1a3a5c', margin: '0 2px' }}>→</span>}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
