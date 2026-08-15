const KPI_ROWS = [
  { category: 'ENERGY', metrics: [
    { label: 'People with electricity access', baseline: '600M gap', current: '612M gap', target: '0 by 2040', color: '#f59e0b', trend: '+2%' },
    { label: 'Renewable share of generation', baseline: '12%', current: '22%', target: '75% by 2035', color: '#10b981', trend: '+10pts' },
    { label: 'Energy cost per kWh (avg)', baseline: '$0.22', current: '$0.19', target: '$0.09 by 2035', color: '#00d4ff', trend: '−14%' },
  ]},
  { category: 'COMPUTE', metrics: [
    { label: 'AI compute capacity (Africa)', baseline: '12MW', current: '42MW', target: '2,000MW by 2030', color: '#8b5cf6', trend: '+250%' },
    { label: 'Internet penetration', baseline: '28%', current: '36%', target: '80% by 2035', color: '#8b5cf6', trend: '+8pts' },
  ]},
  { category: 'WATER', metrics: [
    { label: 'Population in water stress', baseline: '780M', current: '820M', target: '<400M by 2040', color: '#38bdf8', trend: '−5%' },
    { label: 'Wastewater treated', baseline: '8%', current: '12%', target: '60% by 2035', color: '#38bdf8', trend: '+4pts' },
  ]},
  { category: 'ECOLOGY', metrics: [
    { label: 'Forest cover (Africa)', baseline: '657Mha', current: '648Mha', target: '700Mha by 2040', color: '#22c55e', trend: '−1.4%' },
    { label: 'Degraded land restored', baseline: '0', current: '18Mha', target: '120Mha by 2035', color: '#22c55e', trend: 'Positive' },
  ]},
  { category: 'HUMAN', metrics: [
    { label: 'People lifted from energy poverty', baseline: '0', current: '42M', target: '600M by 2040', color: '#ec4899', trend: 'Positive' },
    { label: 'Jobs in clean infrastructure', baseline: '1.2M', current: '2.8M', target: '18M by 2035', color: '#ec4899', trend: '+133%' },
  ]},
]

const SEVEN_CAPITALS_GLOBAL = [
  { label: 'Financial', value: 58, color: '#00d4ff' },
  { label: 'Human', value: 62, color: '#ec4899' },
  { label: 'Social', value: 54, color: '#f59e0b' },
  { label: 'Natural', value: 38, color: '#22c55e' },
  { label: 'Knowledge', value: 66, color: '#8b5cf6' },
  { label: 'Technological', value: 48, color: '#38bdf8' },
  { label: 'Cultural', value: 72, color: '#f59e0b' },
]

function MiniRadar({ data }: { data: { label: string; value: number; color: string }[] }) {
  const n = data.length
  const cx = 120; const cy = 120; const r = 88
  const pts = data.map((d, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    const scale = d.value / 100
    return { x: cx + r * scale * Math.cos(angle), y: cy + r * scale * Math.sin(angle), lx: cx + (r + 26) * Math.cos(angle), ly: cy + (r + 26) * Math.sin(angle), ...d }
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
    <svg viewBox="0 0 240 240" style={{ width: '100%', height: '100%' }}>
      {grids.map((g, i) => <polygon key={i} points={g} fill="none" stroke="#1a3a5c" strokeWidth="0.8" />)}
      {data.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#1a3a5c" strokeWidth="0.8" />
      })}
      <polygon points={polygon} fill="rgba(0,212,255,0.08)" stroke="#00d4ff" strokeWidth="1" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={p.color} opacity="0.8" />
          <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fill="#3d5a78" fontSize="7.5" fontFamily="JetBrains Mono">{p.label}</text>
        </g>
      ))}
    </svg>
  )
}

export default function ImpactView() {
  const trendColor = (t: string) => t.startsWith('+') || t === 'Positive' ? '#10b981' : t.startsWith('−') ? '#f43f5e' : '#f59e0b'

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#040a14' }}>
      {/* Left — Seven Capitals */}
      <div className="flex flex-col border-r flex-shrink-0" style={{ width: 280, borderColor: '#1a3a5c' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>IMPACT INTELLIGENCE</div>
          <h2 className="font-display font-700" style={{ fontSize: 16, color: '#e2eaf4' }}>Seven Capitals — Africa</h2>
        </div>
        <div className="p-5 border-b" style={{ borderColor: '#1a3a5c', height: 260 }}>
          <MiniRadar data={SEVEN_CAPITALS_GLOBAL} />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {SEVEN_CAPITALS_GLOBAL.map((c) => (
            <div key={c.label} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-body" style={{ fontSize: 11, color: '#6b8aaa' }}>{c.label}</span>
                <span className="font-mono font-600" style={{ fontSize: 12, color: c.color }}>{c.value}</span>
              </div>
              <div className="h-px" style={{ background: '#1a3a5c' }}>
                <div className="h-px" style={{ width: `${c.value}%`, background: c.color }} />
              </div>
            </div>
          ))}
          <p className="font-body mt-4" style={{ fontSize: 10, color: '#2a4a6a', lineHeight: 1.5 }}>
            Natural capital is the most critical gap. Every other capital depends on ecological integrity.
          </p>
        </div>
      </div>

      {/* Right — KPI metrics */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 py-4 border-b flex-shrink-0" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>REGENERATIVE INFRASTRUCTURE CAPACITY INDEX — IMPACT TRACKING</div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {KPI_ROWS.map((section) => (
            <div key={section.category} className="mb-8">
              <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.16em', color: '#3d5a78' }}>{section.category}</div>
              <div className="border rounded overflow-hidden" style={{ borderColor: '#1a3a5c' }}>
                {/* Header */}
                <div className="grid px-5 py-2.5" style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', background: 'rgba(26,58,92,0.2)', borderBottom: '1px solid #1a3a5c' }}>
                  {['INDICATOR', 'BASELINE', 'CURRENT', 'TARGET', 'TREND'].map((h) => (
                    <span key={h} className="font-mono" style={{ fontSize: 8, letterSpacing: '0.12em', color: '#1a3a5c' }}>{h}</span>
                  ))}
                </div>
                {section.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="grid px-5 py-4"
                    style={{
                      gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr',
                      borderBottom: i < section.metrics.length - 1 ? '1px solid #0d1e34' : 'none',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
                      <span className="font-body" style={{ fontSize: 11, color: '#8aacca' }}>{m.label}</span>
                    </div>
                    <span className="font-mono" style={{ fontSize: 11, color: '#3d5a78' }}>{m.baseline}</span>
                    <span className="font-mono font-600" style={{ fontSize: 11, color: m.color }}>{m.current}</span>
                    <span className="font-mono" style={{ fontSize: 10, color: '#3d5a78' }}>{m.target}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-600" style={{ fontSize: 10, color: trendColor(m.trend) }}>{m.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom principle */}
          <div className="p-6 mt-4" style={{ background: 'rgba(7,15,32,0.8)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
            <p className="font-display font-600 text-center" style={{ fontSize: 16, color: '#e2eaf4', lineHeight: 1.6, letterSpacing: '0.02em' }}>
              "Infrastructure is not what civilization owns.<br />Infrastructure is what civilization becomes capable of doing."
            </p>
            <p className="font-mono text-center mt-3" style={{ fontSize: 9, color: '#1a3a5c', letterSpacing: '0.12em' }}>ATLAS SANCTUM · NORTH STAR</p>
          </div>
        </div>
      </div>
    </div>
  )
}
