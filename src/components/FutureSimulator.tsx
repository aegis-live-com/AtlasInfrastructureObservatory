import { useState, useMemo } from 'react'
import { DEFAULT_SIMULATION, SCENARIOS } from '../data/mockData'
import type { SimulationVariables, SimulationOutcomes } from '../types'

function computeOutcomes(vars: SimulationVariables): SimulationOutcomes {
  const baseEnergy = 850
  const energyTWh =
    (baseEnergy * (vars.energyDemand / 100) * (1 + (vars.populationGrowth - 100) / 200) * (1 + (vars.aiComputeDemand - 100) / 400)) / 100
  const renewableShare = Math.min(95, vars.renewablePenetration * (1 + (vars.technologyAdoption - 100) / 400))
  const fossilEnergy = energyTWh * (1 - renewableShare / 100)
  const emissionsMtCO2 =
    fossilEnergy * 0.48 * (1 - (vars.ecosystemRestoration - 100) / 600) * (vars.climatePressure / 100)
  const waterStressIndex =
    Math.min(100, 45 * (100 / vars.waterAvailability) * (vars.urbanization / 100) * (vars.climatePressure / 100) * 1.1)
  const capitalRequiredBn =
    energyTWh * 1.2 +
    (vars.infrastructureInvestment / 100) * 120 +
    (vars.aiComputeDemand - 100) * 0.8
  const totalPop = 1400 * (vars.populationGrowth / 100)
  const accessRate = Math.min(0.98, 0.62 + (vars.infrastructureInvestment - 100) / 500 + (vars.technologyAdoption - 100) / 800)
  const populationWithAccess = totalPop * accessRate
  const resilienceScore = Math.min(
    100,
    40 +
      renewableShare * 0.3 +
      (vars.ecosystemRestoration - 100) * 0.12 +
      (vars.infrastructureInvestment - 100) * 0.08 -
      (vars.climatePressure - 100) * 0.15,
  )
  const ecosystemHealthScore = Math.min(
    100,
    30 +
      (vars.ecosystemRestoration - 100) * 0.35 -
      (vars.urbanization - 100) * 0.15 -
      (vars.climatePressure - 100) * 0.2 +
      renewableShare * 0.2,
  )
  const gdpImpactBn = (vars.infrastructureInvestment / 100) * 380 * (vars.technologyAdoption / 100) * 1.2

  return {
    energyTWh: Math.round(energyTWh * 10) / 10,
    renewableShare: Math.round(renewableShare),
    emissionsMtCO2: Math.round(emissionsMtCO2),
    waterStressIndex: Math.round(waterStressIndex),
    capitalRequiredBn: Math.round(capitalRequiredBn),
    populationWithAccess: Math.round(populationWithAccess),
    resilienceScore: Math.round(Math.max(0, resilienceScore)),
    ecosystemHealthScore: Math.round(Math.max(0, ecosystemHealthScore)),
    gdpImpactBn: Math.round(gdpImpactBn),
  }
}

const SLIDERS: { key: keyof SimulationVariables; label: string; unit: string; min: number; max: number; color: string }[] = [
  { key: 'aiComputeDemand', label: 'AI Compute Demand', unit: '%', min: 50, max: 500, color: '#8b5cf6' },
  { key: 'populationGrowth', label: 'Population Growth', unit: '%', min: 80, max: 200, color: '#00d4ff' },
  { key: 'energyDemand', label: 'Energy Demand', unit: '%', min: 70, max: 300, color: '#f59e0b' },
  { key: 'renewablePenetration', label: 'Renewable Penetration', unit: '%', min: 10, max: 100, color: '#10b981' },
  { key: 'waterAvailability', label: 'Water Availability', unit: '%', min: 30, max: 140, color: '#38bdf8' },
  { key: 'infrastructureInvestment', label: 'Infrastructure Investment', unit: '%', min: 50, max: 400, color: '#00d4ff' },
  { key: 'urbanization', label: 'Urbanization Rate', unit: '%', min: 70, max: 200, color: '#f59e0b' },
  { key: 'climatePressure', label: 'Climate Pressure', unit: '%', min: 60, max: 280, color: '#f43f5e' },
  { key: 'ecosystemRestoration', label: 'Ecosystem Restoration', unit: '%', min: 40, max: 250, color: '#10b981' },
  { key: 'technologyAdoption', label: 'Technology Adoption', unit: '%', min: 60, max: 350, color: '#8b5cf6' },
]

function ScoreGauge({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="font-body" style={{ fontSize: 11, color: '#6b8aaa' }}>{label}</span>
        <span className="font-mono font-600" style={{ fontSize: 12, color }}>{value.toLocaleString()}</span>
      </div>
      <div className="h-px relative" style={{ background: '#1a3a5c' }}>
        <div
          className="absolute inset-y-0 left-0 transition-all duration-700"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
    </div>
  )
}

export default function FutureSimulator() {
  const [vars, setVars] = useState<SimulationVariables>(DEFAULT_SIMULATION)
  const [activeScenario, setActiveScenario] = useState<string | null>(null)
  const outcomes = useMemo(() => computeOutcomes(vars), [vars])

  const handleSlider = (key: keyof SimulationVariables, value: number) => {
    setVars((v) => ({ ...v, [key]: value }))
    setActiveScenario(null)
  }

  const applyScenario = (key: string) => {
    const s = SCENARIOS[key]
    setVars({
      aiComputeDemand: s.aiComputeDemand,
      populationGrowth: s.populationGrowth,
      energyDemand: s.energyDemand,
      renewablePenetration: s.renewablePenetration,
      waterAvailability: s.waterAvailability,
      infrastructureInvestment: s.infrastructureInvestment,
      urbanization: s.urbanization,
      climatePressure: s.climatePressure,
      ecosystemRestoration: s.ecosystemRestoration,
      technologyAdoption: s.technologyAdoption,
    })
    setActiveScenario(key)
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#040a14' }}>
      {/* Left — sliders */}
      <div className="flex flex-col border-r overflow-y-auto" style={{ width: 320, borderColor: '#1a3a5c', flexShrink: 0 }}>
        {/* Header */}
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.15em', color: '#3d5a78' }}>FUTURE SIMULATOR</div>
          <h2 className="font-display font-700" style={{ fontSize: 18, color: '#e2eaf4' }}>Simulate The Future</h2>
          <p className="font-body mt-1" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.5 }}>
            Adjust variables to explore alternative infrastructure futures for Africa.
          </p>
        </div>

        {/* Scenario presets */}
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>SCENARIO PRESETS</div>
          <div className="flex flex-col gap-1.5">
            {Object.entries(SCENARIOS).map(([key, s]) => (
              <button
                key={key}
                onClick={() => applyScenario(key)}
                className="flex items-center gap-3 px-3 py-2 text-left transition-all"
                style={{
                  background: activeScenario === key ? `${s.color}10` : 'transparent',
                  border: `1px solid ${activeScenario === key ? s.color + '40' : '#1a3a5c'}`,
                  borderRadius: 3,
                }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div>
                  <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: activeScenario === key ? s.color : '#6b8aaa' }}>
                    {s.name}
                  </div>
                  <div className="font-body" style={{ fontSize: 10, color: '#3d5a78', lineHeight: 1.4 }}>
                    {s.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => { setVars(DEFAULT_SIMULATION); setActiveScenario(null) }}
            className="mt-2 w-full font-mono py-2 transition-colors"
            style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78', border: '1px solid #1a3a5c', borderRadius: 3 }}
          >
            RESET TO BASELINE
          </button>
        </div>

        {/* Sliders */}
        <div className="flex-1 px-5 py-4 flex flex-col gap-5">
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>VARIABLES — BASELINE = 100%</div>
          {SLIDERS.map((s) => (
            <div key={s.key}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-body" style={{ fontSize: 11, color: '#8a9aaa' }}>{s.label}</span>
                <span className="font-mono" style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>
                  {vars[s.key]}{s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                value={vars[s.key]}
                onChange={(e) => handleSlider(s.key, Number(e.target.value))}
                style={{ accentColor: s.color }}
              />
              <div className="flex justify-between mt-1">
                <span className="font-mono" style={{ fontSize: 8, color: '#2a3a4a' }}>{s.min}%</span>
                <span className="font-mono" style={{ fontSize: 8, color: '#2a3a4a' }}>{s.max}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center — outcomes */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-5 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="flex items-center gap-3 mb-1">
            {activeScenario && (
              <div
                className="font-mono px-2 py-0.5 text-xs"
                style={{
                  background: `${SCENARIOS[activeScenario].color}15`,
                  border: `1px solid ${SCENARIOS[activeScenario].color}40`,
                  color: SCENARIOS[activeScenario].color,
                  borderRadius: 2,
                  fontSize: 9,
                  letterSpacing: '0.1em',
                }}
              >
                {SCENARIOS[activeScenario].name.toUpperCase()}
              </div>
            )}
            <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>
              2025 → 2040 PROJECTION · EAST AFRICA REGION
            </div>
          </div>
          <h2 className="font-display font-700" style={{ fontSize: 22, color: '#e2eaf4' }}>
            {activeScenario ? SCENARIOS[activeScenario].name : "My Future"} — System Outcomes
          </h2>
        </div>

        {/* Main outcome metrics */}
        <div className="px-8 py-6 grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: 'Total Energy Demand', value: `${outcomes.energyTWh} TWh`, sub: 'Annual generation required', color: '#f59e0b', icon: '⚡' },
            { label: 'Renewable Share', value: `${outcomes.renewableShare}%`, sub: 'Of total generation', color: '#10b981', icon: '☀' },
            { label: 'CO₂ Emissions', value: `${outcomes.emissionsMtCO2} Mt`, sub: 'Annual CO₂ equivalent', color: outcomes.emissionsMtCO2 > 400 ? '#f43f5e' : '#10b981', icon: '◎' },
            { label: 'Water Stress Index', value: `${outcomes.waterStressIndex}/100`, sub: outcomes.waterStressIndex > 70 ? 'CRITICAL' : outcomes.waterStressIndex > 50 ? 'HIGH' : 'MODERATE', color: outcomes.waterStressIndex > 70 ? '#f43f5e' : '#38bdf8', icon: '◈' },
            { label: 'Capital Required', value: `$${outcomes.capitalRequiredBn}B`, sub: 'Infrastructure investment needed', color: '#00d4ff', icon: '◉' },
            { label: 'Population with Access', value: `${outcomes.populationWithAccess}M`, sub: 'Energy + water + connectivity', color: '#8b5cf6', icon: '◐' },
          ].map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-2 p-5 transition-all"
              style={{ background: 'rgba(7,15,32,0.8)', border: '1px solid #1a3a5c', borderRadius: 4 }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 18, color: m.color }}>{m.icon}</span>
                <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>{m.label.toUpperCase()}</span>
              </div>
              <div className="font-display font-700" style={{ fontSize: 28, color: m.color, letterSpacing: '-0.01em' }}>
                {m.value}
              </div>
              <div className="font-mono" style={{ fontSize: 9, color: '#3d5a78', letterSpacing: '0.08em' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Resilience + ecosystem scores */}
        <div className="px-8 pb-6 grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="p-5" style={{ background: 'rgba(7,15,32,0.8)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
            <div className="font-mono mb-4" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>SYSTEM HEALTH SCORES</div>
            <div className="flex flex-col gap-4">
              <ScoreGauge value={outcomes.resilienceScore} max={100} color="#00d4ff" label="Infrastructure Resilience" />
              <ScoreGauge value={outcomes.ecosystemHealthScore} max={100} color="#10b981" label="Ecosystem Health" />
              <ScoreGauge value={outcomes.renewableShare} max={100} color="#f59e0b" label="Renewable Share" />
              <ScoreGauge value={Math.max(0, 100 - outcomes.waterStressIndex)} max={100} color="#38bdf8" label="Water Security" />
            </div>
          </div>

          {/* GDP + narrative */}
          <div className="p-5" style={{ background: 'rgba(7,15,32,0.8)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
            <div className="font-mono mb-4" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>ECONOMIC IMPACT</div>
            <div className="font-display font-700 mb-2" style={{ fontSize: 40, color: '#10b981', letterSpacing: '-0.02em' }}>
              ${outcomes.gdpImpactBn}B
            </div>
            <div className="font-body mb-5" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.5 }}>
              Estimated long-term GDP impact from infrastructure investment at these levels by 2040.
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Energy transition', value: `$${Math.round(outcomes.energyTWh * 0.8)}B`, color: '#f59e0b' },
                { label: 'Digital infrastructure', value: `$${Math.round(outcomes.capitalRequiredBn * 0.22)}B`, color: '#8b5cf6' },
                { label: 'Water systems', value: `$${Math.round(outcomes.capitalRequiredBn * 0.18)}B`, color: '#38bdf8' },
                { label: 'Nature-based', value: `$${Math.round(outcomes.capitalRequiredBn * 0.08)}B`, color: '#10b981' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: row.color }} />
                    <span className="font-body" style={{ fontSize: 11, color: '#6b8aaa' }}>{row.label}</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: 11, color: row.color, fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mx-8 mb-8 px-5 py-4" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 4 }}>
          <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#00d4ff' }}>WHAT ARE WE NOT SEEING?</div>
          <p className="font-body" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.6 }}>
            These projections assume smooth capital deployment, political continuity, and technology performance at current trajectories. The model cannot capture political economy resistance, informal system displacement effects, or the compounding benefits of regenerative feedback loops. Treat these as orientation, not prediction.
          </p>
        </div>
      </div>
    </div>
  )
}
