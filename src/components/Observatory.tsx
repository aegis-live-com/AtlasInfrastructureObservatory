import { useState, useMemo } from 'react'
import { MAP_NODES, MAP_CONNECTIONS, INFRA_NODES, AFRICA_PATH, MADAGASCAR_PATH } from '../data/mockData'
import type { Layer, MapNode } from '../types'

const LAYERS: { id: Layer; label: string; color: string; icon: string }[] = [
  { id: 'all', label: 'ALL SYSTEMS', color: '#e2eaf4', icon: '◎' },
  { id: 'energy', label: 'ENERGY', color: '#f59e0b', icon: '⚡' },
  { id: 'compute', label: 'COMPUTE', color: '#8b5cf6', icon: '◈' },
  { id: 'water', label: 'WATER', color: '#38bdf8', icon: '◐' },
  { id: 'land', label: 'LAND', color: '#84cc16', icon: '⬡' },
  { id: 'mobility', label: 'MOBILITY', color: '#10b981', icon: '⟶' },
  { id: 'human', label: 'HUMAN', color: '#ec4899', icon: '◉' },
  { id: 'ecology', label: 'ECOLOGY', color: '#22c55e', icon: '◎' },
  { id: 'capital', label: 'CAPITAL', color: '#00d4ff', icon: '◈' },
]

const LAYER_INFO: Record<Layer, { description: string; count: number }> = {
  all: { description: 'All infrastructure systems visible simultaneously', count: 21 },
  energy: { description: 'Generation, transmission, storage, and renewable potential', count: 18 },
  compute: { description: 'Data centers, fiber, cloud infrastructure, AI compute demand', count: 12 },
  water: { description: 'Rivers, reservoirs, aquifers, water stress, flood risk', count: 9 },
  land: { description: 'Agriculture, urbanization, forests, protected areas', count: 14 },
  mobility: { description: 'Roads, rail, ports, airports, logistics corridors', count: 16 },
  human: { description: 'Population, health, education, housing, economic activity', count: 8 },
  ecology: { description: 'Biodiversity, carbon, soil, forests, ecosystem resilience', count: 11 },
  capital: { description: 'Infrastructure investment, DFI, private capital, project pipelines', count: 6 },
}

function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const n = data.length
  const cx = 100; const cy = 100; const r = 72
  const pts = data.map((d, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    const scale = d.value / 100
    return { x: cx + r * scale * Math.cos(angle), y: cy + r * scale * Math.sin(angle), lx: cx + (r + 22) * Math.cos(angle), ly: cy + (r + 22) * Math.sin(angle), label: d.label }
  })
  const polygon = pts.map((p) => `${p.x},${p.y}`).join(' ')
  const grids = [25, 50, 75, 100].map((pct) =>
    data.map((_, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2
      const s = pct / 100
      return `${cx + r * s * Math.cos(angle)},${cy + r * s * Math.sin(angle)}`
    }).join(' ')
  )
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {grids.map((g, i) => <polygon key={i} points={g} fill="none" stroke="#1a3a5c" strokeWidth="0.8" />)}
      {data.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#1a3a5c" strokeWidth="0.8" />
      })}
      <polygon points={polygon} fill="rgba(0,212,255,0.12)" stroke="#00d4ff" strokeWidth="1.2" />
      {pts.map((p, i) => (
        <text key={i} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fill="#3d5a78" fontSize="7" fontFamily="JetBrains Mono">
          {p.label}
        </text>
      ))}
    </svg>
  )
}

function IntelligencePanel({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
  const node = INFRA_NODES[nodeId]
  if (!node) return null

  const radarData = [
    { label: 'FINANCIAL', value: node.sevenCapitals.financial },
    { label: 'HUMAN', value: node.sevenCapitals.human },
    { label: 'SOCIAL', value: node.sevenCapitals.social },
    { label: 'NATURAL', value: node.sevenCapitals.natural },
    { label: 'KNOWLEDGE', value: node.sevenCapitals.knowledge },
    { label: 'TECH', value: node.sevenCapitals.technological },
    { label: 'CULTURAL', value: node.sevenCapitals.cultural },
  ]

  const scores = [
    { label: 'Capacity', value: node.capacity, color: '#00d4ff' },
    { label: 'Demand', value: node.demand, color: '#f59e0b' },
    { label: 'Resilience', value: node.resilience, color: '#10b981' },
    { label: 'Risk', value: node.risk, color: '#f43f5e' },
    { label: 'Access', value: node.access, color: '#8b5cf6' },
    { label: 'Regen. Potential', value: node.regenerativePotential, color: '#10b981' },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto animate-slide-in-right" style={{ background: 'rgba(4,8,18,0.97)', borderLeft: '1px solid #1a3a5c' }}>
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>
              {node.type.toUpperCase()} · {node.country.toUpperCase()}
            </div>
            <h3 className="font-display font-700" style={{ fontSize: 16, color: '#e2eaf4', lineHeight: 1.2 }}>{node.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="font-mono flex-shrink-0 px-2 py-1 transition-colors"
            style={{ fontSize: 10, color: '#3d5a78', border: '1px solid #1a3a5c', borderRadius: 2 }}
          >
            ✕
          </button>
        </div>
        {/* RICI */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: '#1a3a5c' }}>
            <div className="h-px transition-all" style={{ width: `${node.rici}%`, background: '#00d4ff', boxShadow: '0 0 4px #00d4ff' }} />
          </div>
          <span className="font-mono font-600" style={{ fontSize: 13, color: '#00d4ff' }}>RICI {node.rici}</span>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
        <p className="font-body" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.6 }}>{node.description}</p>
      </div>

      {/* System scores */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
        <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>SYSTEM STATUS</div>
        <div className="flex flex-col gap-2.5">
          {scores.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-body" style={{ fontSize: 10, color: '#6b8aaa' }}>{s.label}</span>
                <span className="font-mono" style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.value}</span>
              </div>
              <div className="h-px" style={{ background: '#1a3a5c' }}>
                <div className="h-px transition-all" style={{ width: `${s.value}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key stats */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
        <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>KEY INDICATORS</div>
        <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {node.keyStats.map((s) => (
            <div key={s.label} className="p-2" style={{ background: 'rgba(26,58,92,0.2)', borderRadius: 3 }}>
              <div className="font-body" style={{ fontSize: 10, color: '#3d5a78', marginBottom: 2 }}>{s.label}</div>
              <div className="font-mono font-600" style={{ fontSize: 12, color: '#e2eaf4' }}>{s.value} <span style={{ color: '#3d5a78', fontWeight: 400, fontSize: 9 }}>{s.unit}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Seven Capitals Radar */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
        <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>SEVEN CAPITALS</div>
        <div style={{ height: 160 }}>
          <RadarChart data={radarData} />
        </div>
      </div>

      {/* Opportunities */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
        <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#10b981' }}>OPPORTUNITIES</div>
        <div className="flex flex-col gap-2">
          {node.opportunities.map((o, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#10b981' }} />
              <span className="font-body" style={{ fontSize: 11, color: '#4a8a6a', lineHeight: 1.5 }}>{o}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risks */}
      <div className="px-5 py-4">
        <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#f43f5e' }}>RISKS</div>
        <div className="flex flex-col gap-2">
          {node.risks.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#f43f5e' }} />
              <span className="font-body" style={{ fontSize: 11, color: '#6a3a4a', lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LAYER_COLOR: Record<Layer, string> = {
  all: '#00d4ff',
  energy: '#f59e0b',
  compute: '#8b5cf6',
  water: '#38bdf8',
  land: '#84cc16',
  mobility: '#10b981',
  human: '#ec4899',
  ecology: '#22c55e',
  capital: '#00d4ff',
}

function MapNodeDot({ node, active, onClick }: { node: MapNode; active: boolean; onClick: () => void }) {
  const isHub = node.type === 'hub' || node.type === 'port'
  const r = isHub ? 5 : 3.5
  const color = active ? '#f59e0b' : '#00d4ff'

  return (
    <g onClick={onClick} className="cursor-pointer" style={{ transform: `translate(${node.x}px, ${node.y}px)` }}>
      {active && (
        <>
          <circle r={r * 2.5} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" className="animate-pulse-ring" style={{ transformOrigin: '0 0' }} />
          <circle r={r * 1.8} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" className="animate-pulse-ring-slow" style={{ transformOrigin: '0 0' }} />
        </>
      )}
      <circle r={r + 2} fill="none" stroke={color} strokeWidth={isHub ? 1 : 0.5} opacity={active ? 0.4 : 0.2} />
      <circle r={r} fill={active ? color : (node.type === 'energy' ? '#f59e0b' : node.type === 'hub' ? '#00d4ff' : '#1a5a8a')} opacity={active ? 1 : 0.7} style={{ filter: active ? `drop-shadow(0 0 4px ${color})` : 'none' }} />
      {(isHub || active) && (
        <text y={r + 9} textAnchor="middle" fill={active ? color : '#3d5a78'} fontSize={active ? 7 : 6} fontFamily="JetBrains Mono" fontWeight={active ? 600 : 400}>
          {node.name}
        </text>
      )}
    </g>
  )
}

export default function Observatory({ searchQuery }: { searchQuery?: string }) {
  const [activeLayer, setActiveLayer] = useState<Layer>('all')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [showPanel, setShowPanel] = useState(true)

  const visibleNodes = useMemo(() =>
    MAP_NODES.filter((n) => activeLayer === 'all' || n.layers.includes(activeLayer)),
    [activeLayer]
  )

  const visibleConnections = useMemo(() =>
    MAP_CONNECTIONS.filter((c) => activeLayer === 'all' || c.layer === activeLayer),
    [activeLayer]
  )

  const nodeMap = useMemo(() => {
    const m: Record<string, MapNode> = {}
    MAP_NODES.forEach((n) => { m[n.id] = n })
    return m
  }, [])

  const connColor = (layer: Layer) => LAYER_COLOR[layer] || '#00d4ff'

  const handleNodeClick = (id: string) => {
    if (INFRA_NODES[id]) {
      setSelectedNodeId(id)
      setShowPanel(true)
    }
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#040a14' }}>
      {/* Layer controls */}
      <div className="flex flex-col flex-shrink-0 border-r overflow-y-auto" style={{ width: 200, borderColor: '#1a3a5c' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>INFRASTRUCTURE LAYERS</div>
        </div>
        {LAYERS.map((layer) => {
          const active = activeLayer === layer.id
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className="flex items-center gap-3 px-4 py-3 border-b text-left transition-all"
              style={{
                borderColor: '#0d1e34',
                background: active ? `${layer.color}08` : 'transparent',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: active ? layer.color : '#1a3a5c', boxShadow: active ? `0 0 6px ${layer.color}` : 'none' }} />
              <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: active ? layer.color : '#3d5a78' }}>
                {layer.label}
              </span>
            </button>
          )
        })}

        {/* Layer info */}
        <div className="px-4 py-4 mt-auto border-t" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.1em', color: LAYER_COLOR[activeLayer] }}>
            {LAYERS.find((l) => l.id === activeLayer)?.label}
          </div>
          <p className="font-body" style={{ fontSize: 10, color: '#3d5a78', lineHeight: 1.5 }}>
            {LAYER_INFO[activeLayer].description}
          </p>
          <div className="mt-3 font-mono" style={{ fontSize: 9, color: '#1a3a5c' }}>
            {LAYER_INFO[activeLayer].count} active assets
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 flex flex-col relative overflow-hidden scan-container">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b flex-shrink-0" style={{ borderColor: '#1a3a5c', background: 'rgba(4,10,20,0.9)' }}>
          <div className="flex items-center gap-4">
            <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>AFRICA · INFRASTRUCTURE INTELLIGENCE OBSERVATORY</div>
            {searchQuery && (
              <div className="font-mono px-2 py-0.5" style={{ fontSize: 9, color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 2 }}>
                {searchQuery}
              </div>
            )}
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full animate-glow-pulse" style={{ background: '#10b981' }} />
              <span className="font-mono" style={{ fontSize: 9, color: '#3d5a78', letterSpacing: '0.1em' }}>LIVE FEED</span>
            </div>
            <span className="font-mono" style={{ fontSize: 9, color: '#1a3a5c' }}>
              {visibleNodes.length} NODES · {visibleConnections.length} CONNECTIONS
            </span>
          </div>
        </div>

        {/* Map SVG */}
        <div className="flex-1 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #060e20 0%, #040a14 100%)' }}>
          {/* Background grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Africa map SVG */}
          <svg
            viewBox="0 0 400 520"
            preserveAspectRatio="xMidYMid meet"
            className="absolute"
            style={{ inset: 0, width: '100%', height: '100%' }}
          >
            <defs>
              <filter id="glow-strong">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-soft">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <radialGradient id="africa-fill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0a1e3a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#060e20" stopOpacity="0.7" />
              </radialGradient>
              {/* Animated flow gradient */}
              <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Continent fill */}
            <path d={AFRICA_PATH} fill="url(#africa-fill)" stroke="#1a3a5c" strokeWidth="0.8" />
            <path d={MADAGASCAR_PATH} fill="url(#africa-fill)" stroke="#1a3a5c" strokeWidth="0.8" />

            {/* Connections */}
            {visibleConnections.map((conn, i) => {
              const from = nodeMap[conn.from]
              const to = nodeMap[conn.to]
              if (!from || !to) return null
              const color = connColor(conn.layer)
              const isDashed = conn.planned || conn.type === 'submarine'
              return (
                <g key={i}>
                  {/* Shadow line */}
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth="3" opacity="0.04" />
                  {/* Main line */}
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={color}
                    strokeWidth={isDashed ? 0.6 : 0.8}
                    strokeDasharray={isDashed ? '4 3' : undefined}
                    opacity={isDashed ? 0.35 : 0.55}
                  />
                  {/* Animated flow particle */}
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray="12 200"
                    opacity="0.8"
                    className="animate-flow"
                    style={{ animationDuration: `${2 + (i % 4) * 0.7}s`, animationDelay: `${(i % 6) * 0.4}s`, filter: `drop-shadow(0 0 2px ${color})` }}
                  />
                </g>
              )
            })}

            {/* Nodes */}
            {visibleNodes.map((node) => (
              <MapNodeDot
                key={node.id}
                node={node}
                active={selectedNodeId === node.id}
                onClick={() => handleNodeClick(node.id)}
              />
            ))}

            {/* Latitude/longitude lines */}
            <line x1="0" y1="270" x2="400" y2="270" stroke="#1a3a5c" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.4" />
            <line x1="200" y1="0" x2="200" y2="520" stroke="#1a3a5c" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.4" />

            {/* Equator label */}
            <text x="12" y="267" fill="#1a3a5c" fontSize="6" fontFamily="JetBrains Mono">EQUATOR</text>
          </svg>

          {/* Overlay: find opportunities button */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <button
              className="font-mono px-6 py-2.5 transition-all"
              style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                color: '#040a14',
                background: '#00d4ff',
                borderRadius: 2,
                boxShadow: '0 0 24px rgba(0,212,255,0.4)',
              }}
              onClick={() => {
                setSelectedNodeId('nairobi')
                setShowPanel(true)
              }}
            >
              FIND OPPORTUNITIES
            </button>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center gap-6 px-5 py-2 border-t flex-shrink-0" style={{ borderColor: '#1a3a5c', background: 'rgba(4,10,20,0.9)' }}>
          {[
            { label: 'RICI Africa', value: '52.4', color: '#00d4ff' },
            { label: 'Energy Gap', value: '600M people', color: '#f43f5e' },
            { label: 'Investment Pipeline', value: '$124B', color: '#10b981' },
            { label: 'Active Projects', value: '847', color: '#8b5cf6' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="font-mono" style={{ fontSize: 9, color: '#3d5a78', letterSpacing: '0.08em' }}>{s.label}</span>
              <span className="font-mono font-600" style={{ fontSize: 10, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intelligence panel */}
      {selectedNodeId && showPanel && INFRA_NODES[selectedNodeId] && (
        <div className="flex-shrink-0" style={{ width: 360 }}>
          <IntelligencePanel
            nodeId={selectedNodeId}
            onClose={() => { setShowPanel(false); setSelectedNodeId(null) }}
          />
        </div>
      )}
    </div>
  )
}
