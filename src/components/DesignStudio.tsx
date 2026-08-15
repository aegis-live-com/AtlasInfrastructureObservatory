import { useState, useMemo, useCallback } from 'react'
import { AFRICA_PATH, MADAGASCAR_PATH } from '../data/mockData'

interface InfraComponent {
  id: string
  name: string
  icon: string
  color: string
  category: string
  capacity: string
  capital: number
  powerDemand: number
  powerProvides: number
  co2Avoided: number
  beneficiaries: number
  dependencies: string[]
  provides: string[]
}

const COMPONENTS: InfraComponent[] = [
  {
    id: 'solar', name: 'Solar Farm', icon: '☀', color: '#f59e0b', category: 'Energy',
    capacity: '50 MW', capital: 45, powerDemand: 0, powerProvides: 50, co2Avoided: 62000, beneficiaries: 28000,
    dependencies: ['Land access', 'Grid connection', 'Water (minimal)'],
    provides: ['Power: 50 MW', 'Clean generation'],
  },
  {
    id: 'wind', name: 'Wind Farm', icon: '⟳', color: '#38bdf8', category: 'Energy',
    capacity: '100 MW', capital: 120, powerDemand: 0, powerProvides: 100, co2Avoided: 128000, beneficiaries: 55000,
    dependencies: ['Remote land', 'Grid corridor', 'Access roads'],
    provides: ['Power: 100 MW', 'Night generation'],
  },
  {
    id: 'storage', name: 'Battery Storage', icon: '⬡', color: '#10b981', category: 'Energy',
    capacity: '80 MWh', capital: 24, powerDemand: 0, powerProvides: 0, co2Avoided: 0, beneficiaries: 15000,
    dependencies: ['Grid connection', 'Security', 'Land (small)'],
    provides: ['Grid stability', 'Backup: 80 MWh'],
  },
  {
    id: 'microgrid', name: 'Microgrid', icon: '◎', color: '#00d4ff', category: 'Energy',
    capacity: '5 MW', capital: 12, powerDemand: 0, powerProvides: 5, co2Avoided: 8000, beneficiaries: 25000,
    dependencies: ['Solar or wind input', 'Storage', 'Distribution network'],
    provides: ['Community power: 5 MW', 'Energy independence'],
  },
  {
    id: 'datacenter', name: 'Data Center', icon: '◈', color: '#8b5cf6', category: 'Compute',
    capacity: '20 MW compute', capital: 80, powerDemand: 20, powerProvides: 0, co2Avoided: 0, beneficiaries: 2000000,
    dependencies: ['Power: 20 MW continuous', 'Fiber: 100 Gbps', 'Water: cooling', 'Skilled workforce'],
    provides: ['AI compute', 'Cloud services', '250 direct jobs'],
  },
  {
    id: 'fiber', name: 'Fiber Network', icon: '~', color: '#8b5cf6', category: 'Compute',
    capacity: '10 Gbps', capital: 8, powerDemand: 0.2, powerProvides: 0, co2Avoided: 0, beneficiaries: 85000,
    dependencies: ['Land access', 'Power: repeaters', 'Exchange point'],
    provides: ['Connectivity: 10 Gbps', 'Digital access'],
  },
  {
    id: 'water', name: 'Water Treatment', icon: '◐', color: '#38bdf8', category: 'Water',
    capacity: '50,000 m³/day', capital: 28, powerDemand: 2, powerProvides: 0, co2Avoided: 0, beneficiaries: 180000,
    dependencies: ['Power: 2 MW', 'Water source', 'Roads', 'Land'],
    provides: ['Clean water', 'Wastewater reuse', 'Flood buffer'],
  },
  {
    id: 'rail', name: 'Rail Corridor', icon: '—', color: '#10b981', category: 'Mobility',
    capacity: '4,000 passengers/day', capital: 180, powerDemand: 5, powerProvides: 0, co2Avoided: 48000, beneficiaries: 450000,
    dependencies: ['Land corridor: 50 km+', 'Power: electrified', 'Rolling stock'],
    provides: ['Connectivity', 'Freight capacity', '1,200 jobs'],
  },
  {
    id: 'hospital', name: 'Hospital', icon: '+', color: '#ec4899', category: 'Human',
    capacity: '200 beds', capital: 35, powerDemand: 0.8, powerProvides: 0, co2Avoided: 0, beneficiaries: 150000,
    dependencies: ['Power: 0.8 MW reliable', 'Water: treated', 'Paved roads', 'Fiber'],
    provides: ['Healthcare: 200 beds', 'Health anchor', '400 jobs'],
  },
  {
    id: 'school', name: 'School Campus', icon: '◎', color: '#f59e0b', category: 'Human',
    capacity: '2,000 students', capital: 8, powerDemand: 0.2, powerProvides: 0, co2Avoided: 0, beneficiaries: 12000,
    dependencies: ['Power: 0.2 MW', 'Water', 'Roads'],
    provides: ['Education: 2,000 students', '80 jobs'],
  },
  {
    id: 'forest', name: 'Forest Restoration', icon: '⬡', color: '#22c55e', category: 'Ecology',
    capacity: '1,000 ha', capital: 4, powerDemand: 0, powerProvides: 0, co2Avoided: 3800, beneficiaries: 8000,
    dependencies: ['Land rights', 'Community agreement', 'Water access'],
    provides: ['Carbon: 3,800 tCO₂e/yr', 'Biodiversity', 'Watershed'],
  },
  {
    id: 'housing', name: 'Housing', icon: '⬡', color: '#ec4899', category: 'Human',
    capacity: '500 units', capital: 25, powerDemand: 1, powerProvides: 0, co2Avoided: 0, beneficiaries: 2000,
    dependencies: ['Land', 'Water', 'Power', 'Roads', 'Sanitation'],
    provides: ['Housing: 500 units', 'Community anchor'],
  },
]

const CATEGORIES = ['Energy', 'Compute', 'Water', 'Mobility', 'Human', 'Ecology']
const CAT_COLORS: Record<string, string> = {
  Energy: '#f59e0b', Compute: '#8b5cf6', Water: '#38bdf8',
  Mobility: '#10b981', Human: '#ec4899', Ecology: '#22c55e',
}

interface Placed {
  uid: string
  type: string
  x: number
  y: number
}

interface Analysis {
  totalCapital: number
  totalPower: number
  powerSupply: number
  totalBeneficiaries: number
  totalCO2: number
  warnings: { text: string; suggestion: string }[]
  sevenCapitals: Record<string, number>
}

function analyzeDesign(placed: Placed[]): Analysis {
  const types = placed.map((p) => p.type)
  const get = (id: string) => COMPONENTS.find((c) => c.id === id)!

  const totalCapital = placed.reduce((s, p) => s + get(p.type).capital, 0)
  const totalPower = placed.reduce((s, p) => s + get(p.type).powerDemand, 0)
  const powerSupply = placed.reduce((s, p) => s + get(p.type).powerProvides, 0)
  const totalBeneficiaries = placed.reduce((s, p) => s + get(p.type).beneficiaries, 0)
  const totalCO2 = placed.reduce((s, p) => s + get(p.type).co2Avoided, 0)

  const has = (id: string) => types.includes(id)
  const count = (id: string) => types.filter((t) => t === id).length

  const warnings: { text: string; suggestion: string }[] = []

  if (has('datacenter') && !has('solar') && !has('wind') && !has('microgrid')) {
    warnings.push({
      text: `Data center requires ${count('datacenter') * 20} MW continuous power. No renewable generation placed — grid-dependency risk is CRITICAL.`,
      suggestion: `Add ${Math.ceil(count('datacenter') * 20 / 50)} Solar Farm(s) + ${count('datacenter')} Battery Storage unit(s) to ensure energy security.`,
    })
  } else if (has('datacenter') && totalPower > powerSupply) {
    warnings.push({
      text: `Power demand (${totalPower.toFixed(1)} MW) exceeds renewable supply (${powerSupply} MW). Grid gap: ${(totalPower - powerSupply).toFixed(1)} MW.`,
      suggestion: `Add ${Math.ceil((totalPower - powerSupply) / 50)} more Solar Farm(s) to achieve power self-sufficiency.`,
    })
  }

  if (has('datacenter') && !has('fiber')) {
    warnings.push({
      text: 'Data center placed without fiber connectivity — stranded asset risk. No data can enter or exit.',
      suggestion: 'Add a Fiber Network to enable data center operations.',
    })
  }

  if ((has('solar') || has('wind')) && !has('storage')) {
    warnings.push({
      text: 'Renewable generation without battery storage creates intermittency — 60% of generation unusable without storage.',
      suggestion: 'Add Battery Storage (80 MWh) to enable 24/7 renewable operation and grid stability.',
    })
  }

  if (has('hospital') && !has('water')) {
    warnings.push({
      text: 'Hospital requires high-quality treated water. No water treatment in design.',
      suggestion: 'Add Water Treatment facility — medical operations require treated water supply.',
    })
  }

  if (has('hospital') && totalPower > powerSupply && powerSupply > 0) {
    warnings.push({
      text: `Hospital needs guaranteed power: 0.8 MW uninterruptible. Grid gap present.`,
      suggestion: 'Add Battery Storage for hospital backup — power outages in hospitals are life-critical.',
    })
  }

  if (has('rail') && powerSupply === 0) {
    warnings.push({
      text: 'Electrified rail requires grid power. No generation in design — rail operations at risk.',
      suggestion: 'Add Solar Farm or Wind Farm as rail electrification anchor.',
    })
  }

  if (has('housing') && !has('water')) {
    warnings.push({
      text: 'Housing development without water treatment creates unsanitary conditions at scale.',
      suggestion: 'Add Water Treatment — essential for sustainable housing at density.',
    })
  }

  if (placed.length >= 5 && warnings.length === 0) {
    warnings.push({
      text: '',
      suggestion: 'Strong multi-system design. Consider adding Forest Restoration to balance natural capital and generate carbon finance.',
    })
  }

  const hasGen = has('solar') || has('wind') || has('microgrid')
  const sevenCapitals = {
    financial: Math.min(100, 35 + placed.length * 5 + (has('datacenter') ? 18 : 0) + (has('rail') ? 12 : 0)),
    human: Math.min(100, 25 + (has('hospital') ? 28 : 0) + (has('school') ? 18 : 0) + (has('housing') ? 12 : 0) + placed.length * 3),
    social: Math.min(100, 30 + placed.length * 5 + (has('housing') ? 14 : 0) + (has('school') ? 10 : 0)),
    natural: Math.min(100, 15 + (has('forest') ? 35 : 0) + (has('water') ? 22 : 0) + (hasGen ? 10 : 0)),
    knowledge: Math.min(100, 25 + (has('datacenter') ? 32 : 0) + (has('fiber') ? 22 : 0) + (has('school') ? 16 : 0)),
    technological: Math.min(100, 20 + (has('datacenter') ? 32 : 0) + (has('fiber') ? 22 : 0) + (hasGen ? 16 : 0)),
    cultural: Math.min(100, 38 + placed.length * 4 + (has('school') ? 8 : 0)),
  }

  return { totalCapital, totalPower, powerSupply, totalBeneficiaries, totalCO2, warnings, sevenCapitals }
}

function MiniRadar({ data }: { data: { label: string; value: number; color: string }[] }) {
  const n = data.length
  const cx = 96; const cy = 96; const r = 72
  const pts = data.map((d, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    const scale = d.value / 100
    return { x: cx + r * scale * Math.cos(angle), y: cy + r * scale * Math.sin(angle), lx: cx + (r + 24) * Math.cos(angle), ly: cy + (r + 24) * Math.sin(angle), ...d }
  })
  const poly = pts.map((p) => `${p.x},${p.y}`).join(' ')
  const grids = [25, 50, 75, 100].map((pct) =>
    data.map((_, i) => { const a = (i / n) * 2 * Math.PI - Math.PI / 2; const s = pct / 100; return `${cx + r * s * Math.cos(a)},${cy + r * s * Math.sin(a)}` }).join(' ')
  )
  return (
    <svg viewBox="0 0 192 192" className="w-full h-full">
      {grids.map((g, i) => <polygon key={i} points={g} fill="none" stroke="#1a3a5c" strokeWidth="0.8" />)}
      {data.map((_, i) => { const a = (i / n) * 2 * Math.PI - Math.PI / 2; return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#1a3a5c" strokeWidth="0.8" /> })}
      <polygon points={poly} fill="rgba(0,212,255,0.1)" stroke="#00d4ff" strokeWidth="1.2" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="2.5" fill={p.color} />
          <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fill="#3d5a78" fontSize="7" fontFamily="JetBrains Mono">{p.label}</text>
        </g>
      ))}
    </svg>
  )
}

let uidCounter = 1

export default function DesignStudio() {
  const [selectedCat, setSelectedCat] = useState('Energy')
  const [pendingType, setPendingType] = useState<string | null>(null)
  const [placed, setPlaced] = useState<Placed[]>([])
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [hoveredPlaced, setHoveredPlaced] = useState<string | null>(null)

  const analysis = useMemo(() => analyzeDesign(placed), [placed])

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!pendingType) return
    const rect = e.currentTarget.getBoundingClientRect()
    const scaleX = 400 / rect.width
    const scaleY = 520 / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    setPlaced((prev) => [...prev, { uid: `c${uidCounter++}`, type: pendingType, x, y }])
    setPendingType(null)
    setMousePos(null)
  }, [pendingType])

  const handleSvgMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!pendingType) return
    const rect = e.currentTarget.getBoundingClientRect()
    const scaleX = 400 / rect.width
    const scaleY = 520 / rect.height
    setMousePos({ x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY })
  }, [pendingType])

  const handleSvgMouseLeave = useCallback(() => setMousePos(null), [])

  const removeComponent = (uid: string) => setPlaced((prev) => prev.filter((p) => p.uid !== uid))

  const clearAll = () => { setPlaced([]); setPendingType(null) }

  const pendingComp = pendingType ? COMPONENTS.find((c) => c.id === pendingType) : null

  const radarData = [
    { label: 'FINANCIAL', value: analysis.sevenCapitals.financial, color: '#00d4ff' },
    { label: 'HUMAN', value: analysis.sevenCapitals.human, color: '#ec4899' },
    { label: 'SOCIAL', value: analysis.sevenCapitals.social, color: '#f59e0b' },
    { label: 'NATURAL', value: analysis.sevenCapitals.natural, color: '#22c55e' },
    { label: 'KNOWLEDGE', value: analysis.sevenCapitals.knowledge, color: '#8b5cf6' },
    { label: 'TECH', value: analysis.sevenCapitals.technological, color: '#38bdf8' },
    { label: 'CULTURAL', value: analysis.sevenCapitals.cultural, color: '#f59e0b' },
  ]

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#040a14' }}>
      {/* Left — component palette */}
      <div className="flex flex-col border-r flex-shrink-0 overflow-y-auto" style={{ width: 220, borderColor: '#1a3a5c' }}>
        <div className="px-4 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>DESIGN STUDIO</div>
          <h2 className="font-display font-700" style={{ fontSize: 16, color: '#e2eaf4' }}>Design This Future</h2>
          <p className="font-body mt-1" style={{ fontSize: 10, color: '#3d5a78', lineHeight: 1.5 }}>
            Select a component, then click on the map to place it.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1 p-3 border-b" style={{ borderColor: '#1a3a5c' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className="px-2 py-1 font-mono transition-all"
              style={{
                fontSize: 8,
                letterSpacing: '0.1em',
                color: selectedCat === cat ? '#040a14' : CAT_COLORS[cat],
                background: selectedCat === cat ? CAT_COLORS[cat] : `${CAT_COLORS[cat]}12`,
                border: `1px solid ${CAT_COLORS[cat]}40`,
                borderRadius: 2,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Component list */}
        <div className="flex-1 p-3 flex flex-col gap-2">
          {COMPONENTS.filter((c) => c.category === selectedCat).map((comp) => {
            const isPending = pendingType === comp.id
            return (
              <button
                key={comp.id}
                onClick={() => setPendingType(isPending ? null : comp.id)}
                className="text-left p-3 transition-all"
                style={{
                  background: isPending ? `${comp.color}12` : 'rgba(7,15,32,0.6)',
                  border: `1px solid ${isPending ? comp.color + '60' : '#1a3a5c'}`,
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span style={{ fontSize: 16, color: comp.color, lineHeight: 1 }}>{comp.icon}</span>
                  <span className="font-display font-600" style={{ fontSize: 12, color: isPending ? comp.color : '#e2eaf4' }}>{comp.name}</span>
                </div>
                <div className="font-mono mb-1" style={{ fontSize: 8, color: comp.color, letterSpacing: '0.08em' }}>{comp.capacity}</div>
                <div className="flex justify-between">
                  <span className="font-body" style={{ fontSize: 9, color: '#3d5a78' }}>Capital</span>
                  <span className="font-mono" style={{ fontSize: 9, color: '#6b8aaa' }}>${comp.capital}M</span>
                </div>
                {isPending && (
                  <div className="mt-2 font-mono text-center" style={{ fontSize: 8, color: comp.color, letterSpacing: '0.1em' }}>
                    ↓ CLICK MAP TO PLACE
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Clear button */}
        {placed.length > 0 && (
          <div className="p-3 border-t" style={{ borderColor: '#1a3a5c' }}>
            <button
              onClick={clearAll}
              className="w-full py-2 font-mono transition-all"
              style={{ fontSize: 9, letterSpacing: '0.1em', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 3 }}
            >
              CLEAR DESIGN
            </button>
          </div>
        )}
      </div>

      {/* Center — map canvas */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b flex-shrink-0" style={{ borderColor: '#1a3a5c', background: 'rgba(4,10,20,0.9)' }}>
          <div className="flex items-center gap-4">
            <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>INFRASTRUCTURE DESIGN CANVAS · AFRICA</span>
            {pendingComp && (
              <div className="flex items-center gap-2 font-mono px-3 py-1" style={{ fontSize: 9, color: pendingComp.color, border: `1px solid ${pendingComp.color}40`, borderRadius: 2, background: `${pendingComp.color}08` }}>
                <span>{pendingComp.icon}</span>
                <span>PLACING: {pendingComp.name.toUpperCase()}</span>
                <button onClick={() => setPendingType(null)} style={{ color: '#3d5a78', marginLeft: 4 }}>✕</button>
              </div>
            )}
          </div>
          <span className="font-mono" style={{ fontSize: 9, color: '#1a3a5c' }}>{placed.length} COMPONENTS PLACED</span>
        </div>

        {/* Map SVG */}
        <div className="flex-1 relative" style={{ background: 'radial-gradient(ellipse at center, #060e20 0%, #040a14 100%)', cursor: pendingType ? 'crosshair' : 'default' }}>
          {/* Background grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.1 }}>
            <defs>
              <pattern id="ds-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ds-grid)" />
          </svg>

          {/* Main SVG */}
          <svg
            viewBox="0 0 400 520"
            preserveAspectRatio="xMidYMid meet"
            className="absolute"
            style={{ inset: 0, width: '100%', height: '100%' }}
            onClick={handleSvgClick}
            onMouseMove={handleSvgMouseMove}
            onMouseLeave={handleSvgMouseLeave}
          >
            <defs>
              <radialGradient id="ds-africa-fill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0a1e3a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#060e20" stopOpacity="0.7" />
              </radialGradient>
            </defs>

            {/* Africa fill */}
            <path d={AFRICA_PATH} fill="url(#ds-africa-fill)" stroke="#1a3a5c" strokeWidth="0.8" />
            <path d={MADAGASCAR_PATH} fill="url(#ds-africa-fill)" stroke="#1a3a5c" strokeWidth="0.8" />

            {/* Latitude/longitude guides */}
            <line x1="0" y1="270" x2="400" y2="270" stroke="#1a3a5c" strokeWidth="0.3" strokeDasharray="2 5" opacity="0.5" />
            <line x1="200" y1="0" x2="200" y2="520" stroke="#1a3a5c" strokeWidth="0.3" strokeDasharray="2 5" opacity="0.5" />
            <text x="12" y="267" fill="#1a3a5c" fontSize="5.5" fontFamily="JetBrains Mono">EQUATOR</text>

            {/* Dependency connections between placed components */}
            {placed.map((a) => {
              const aComp = COMPONENTS.find((c) => c.id === a.type)!
              return placed.map((b) => {
                if (a.uid >= b.uid) return null
                const bComp = COMPONENTS.find((c) => c.id === b.type)!
                // Draw connection if one provides what other needs
                const aProvidesBPower = aComp.powerProvides > 0 && bComp.powerDemand > 0
                const bProvidesAPower = bComp.powerProvides > 0 && aComp.powerDemand > 0
                const fiberToData = (a.type === 'fiber' && b.type === 'datacenter') || (b.type === 'fiber' && a.type === 'datacenter')
                const storageToGen = (a.type === 'storage' && (b.type === 'solar' || b.type === 'wind')) || (b.type === 'storage' && (a.type === 'solar' || a.type === 'wind'))
                if (!aProvidesBPower && !bProvidesAPower && !fiberToData && !storageToGen) return null
                const depColor = fiberToData ? '#8b5cf6' : storageToGen ? '#10b981' : '#f59e0b'
                return (
                  <g key={`${a.uid}-${b.uid}`}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={depColor} strokeWidth="0.8" strokeDasharray="5 4" opacity="0.5" />
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={depColor} strokeWidth="1.5" strokeDasharray="10 200" opacity="0.9" className="animate-flow" style={{ animationDuration: '2.5s' }} />
                  </g>
                )
              })
            })}

            {/* Placed components */}
            {placed.map((p) => {
              const comp = COMPONENTS.find((c) => c.id === p.type)!
              const isHov = hoveredPlaced === p.uid
              return (
                <g
                  key={p.uid}
                  style={{ transform: `translate(${p.x}px,${p.y}px)`, cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPlaced(p.uid)}
                  onMouseLeave={() => setHoveredPlaced(null)}
                  onClick={(e) => { e.stopPropagation(); removeComponent(p.uid) }}
                >
                  {isHov && <circle r="14" fill={`${comp.color}15`} stroke={comp.color} strokeWidth="0.5" opacity="0.6" />}
                  <circle r={isHov ? 9 : 7} fill={comp.color} opacity={0.9} style={{ filter: `drop-shadow(0 0 5px ${comp.color}80)` }} />
                  <text textAnchor="middle" dominantBaseline="middle" fill="#040a14" fontSize={isHov ? "8" : "6"} fontFamily="sans-serif" fontWeight="bold">
                    {comp.icon}
                  </text>
                  <text y="16" textAnchor="middle" fill={comp.color} fontSize="6.5" fontFamily="JetBrains Mono">
                    {comp.name}
                  </text>
                  {isHov && (
                    <text y="25" textAnchor="middle" fill="#f43f5e" fontSize="6" fontFamily="JetBrains Mono">
                      click to remove
                    </text>
                  )}
                </g>
              )
            })}

            {/* Ghost cursor */}
            {pendingComp && mousePos && (
              <g style={{ transform: `translate(${mousePos.x}px,${mousePos.y}px)`, pointerEvents: 'none', opacity: 0.7 }}>
                <circle r="9" fill={pendingComp.color} opacity="0.5" style={{ filter: `drop-shadow(0 0 8px ${pendingComp.color})` }} />
                <text textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="7" fontFamily="sans-serif" fontWeight="bold">{pendingComp.icon}</text>
                <circle r="18" fill="none" stroke={pendingComp.color} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
              </g>
            )}
          </svg>

          {/* Empty state hint */}
          {placed.length === 0 && !pendingType && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center" style={{ opacity: 0.25 }}>
                <div className="font-mono mb-2" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#e2eaf4' }}>SELECT A COMPONENT FROM THE LEFT</div>
                <div className="font-body" style={{ fontSize: 12, color: '#6b8aaa' }}>Then click on Africa to place it</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right — analysis panel */}
      <div className="flex flex-col border-l flex-shrink-0 overflow-y-auto" style={{ width: 300, borderColor: '#1a3a5c', background: 'rgba(4,8,18,0.97)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>ATLAS ANALYSIS</div>
          <h3 className="font-display font-700" style={{ fontSize: 15, color: '#e2eaf4' }}>Design Intelligence</h3>
        </div>

        {/* Summary metrics */}
        <div className="grid gap-0 border-b" style={{ gridTemplateColumns: '1fr 1fr', borderColor: '#1a3a5c' }}>
          {[
            { label: 'Capital', value: `$${analysis.totalCapital}M`, color: '#00d4ff' },
            { label: 'Beneficiaries', value: analysis.totalBeneficiaries > 1000000 ? `${(analysis.totalBeneficiaries / 1000000).toFixed(1)}M` : `${(analysis.totalBeneficiaries / 1000).toFixed(0)}K`, color: '#10b981' },
            { label: 'CO₂ Avoided', value: `${(analysis.totalCO2 / 1000).toFixed(0)}K t/yr`, color: '#22c55e' },
            { label: 'Power Balance', value: `${analysis.powerSupply - analysis.totalPower > 0 ? '+' : ''}${(analysis.powerSupply - analysis.totalPower).toFixed(0)} MW`, color: analysis.powerSupply >= analysis.totalPower ? '#10b981' : '#f43f5e' },
          ].map((m, i) => (
            <div key={m.label} className="px-4 py-3" style={{ borderRight: i % 2 === 0 ? '1px solid #1a3a5c' : 'none', borderBottom: '1px solid #1a3a5c' }}>
              <div className="font-body mb-0.5" style={{ fontSize: 10, color: '#3d5a78' }}>{m.label}</div>
              <div className="font-mono font-700" style={{ fontSize: 16, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Atlas warnings */}
        {analysis.warnings.length > 0 && (
          <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
            <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#f43f5e' }}>ATLAS WARNINGS</div>
            <div className="flex flex-col gap-3">
              {analysis.warnings.map((w, i) => (
                <div key={i}>
                  {w.text && (
                    <div className="flex items-start gap-2 mb-2 px-3 py-2" style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 3 }}>
                      <span style={{ color: '#f43f5e', fontSize: 11, flexShrink: 0 }}>!</span>
                      <p className="font-body" style={{ fontSize: 10, color: '#8a4a5a', lineHeight: 1.5 }}>{w.text}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-2 px-3 py-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 3 }}>
                    <span style={{ color: '#00d4ff', fontSize: 11, flexShrink: 0 }}>→</span>
                    <p className="font-body" style={{ fontSize: 10, color: '#3a6a8a', lineHeight: 1.5 }}>{w.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placed list */}
        {placed.length > 0 && (
          <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
            <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>PLACED COMPONENTS</div>
            <div className="flex flex-col gap-1.5">
              {placed.map((p) => {
                const comp = COMPONENTS.find((c) => c.id === p.type)!
                return (
                  <div key={p.uid} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span style={{ color: comp.color, fontSize: 13 }}>{comp.icon}</span>
                      <span className="font-body" style={{ fontSize: 11, color: '#6b8aaa' }}>{comp.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono" style={{ fontSize: 10, color: '#3d5a78' }}>${comp.capital}M</span>
                      <button onClick={() => removeComponent(p.uid)} style={{ color: '#2a3a4a', fontSize: 10 }}>✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Seven Capitals radar */}
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>SEVEN CAPITALS IMPACT</div>
          <div style={{ height: 160 }}>
            <MiniRadar data={radarData} />
          </div>
          {placed.length === 0 && (
            <p className="font-body text-center mt-2" style={{ fontSize: 10, color: '#2a3a4a' }}>Place components to see impact</p>
          )}
        </div>

        {/* Dependencies of selected component type */}
        {pendingComp && (
          <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
            <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: pendingComp.color }}>{pendingComp.name.toUpperCase()} — DEPENDENCIES</div>
            {pendingComp.dependencies.map((d) => (
              <div key={d} className="flex items-center gap-2 mb-1.5">
                <div className="w-1 h-1 rounded-full" style={{ background: pendingComp.color }} />
                <span className="font-body" style={{ fontSize: 10, color: '#4a6a8a' }}>{d}</span>
              </div>
            ))}
            <div className="font-mono mt-3 mb-2" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>PROVIDES</div>
            {pendingComp.provides.map((p) => (
              <div key={p} className="flex items-center gap-2 mb-1.5">
                <div className="w-1 h-1 rounded-full" style={{ background: '#10b981' }} />
                <span className="font-body" style={{ fontSize: 10, color: '#3a6a5a' }}>{p}</span>
              </div>
            ))}
          </div>
        )}

        {/* Generate project CTA */}
        {placed.length >= 3 && (
          <div className="px-5 py-5">
            <button
              className="w-full py-3 font-mono transition-all mb-3"
              style={{ fontSize: 10, letterSpacing: '0.14em', color: '#040a14', background: '#00d4ff', borderRadius: 3, boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}
            >
              GENERATE PROJECT →
            </button>
            <p className="font-body text-center" style={{ fontSize: 10, color: '#2a4a6a', lineHeight: 1.5 }}>
              Convert this design into a full infrastructure project with thesis, capital strategy, and impact contract.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
