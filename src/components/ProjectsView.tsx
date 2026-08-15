import { useState } from 'react'
import { PROJECTS } from '../data/mockData'
import type { Project } from '../types'

const STAGES: Project['stage'][] = ['DISCOVER', 'DIAGNOSE', 'DESIGN', 'VALIDATE', 'FINANCE', 'BUILD', 'OPERATE', 'MEASURE', 'REGENERATE']

const stageColor = (s: Project['stage']) => {
  const map: Record<Project['stage'], string> = {
    DISCOVER: '#3d5a78', DIAGNOSE: '#8b5cf6', DESIGN: '#f59e0b', VALIDATE: '#f59e0b',
    FINANCE: '#00d4ff', BUILD: '#38bdf8', OPERATE: '#10b981', MEASURE: '#10b981', REGENERATE: '#22c55e',
  }
  return map[s]
}

function ProjectCard({ project, active, onClick }: { project: Project; active: boolean; onClick: () => void }) {
  const color = stageColor(project.stage)
  return (
    <button
      onClick={onClick}
      className="text-left w-full p-4 transition-all"
      style={{
        background: active ? 'rgba(0,212,255,0.04)' : 'rgba(7,15,32,0.6)',
        border: `1px solid ${active ? 'rgba(0,212,255,0.2)' : '#1a3a5c'}`,
        borderRadius: 4,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-mono px-2 py-0.5" style={{ fontSize: 8, letterSpacing: '0.12em', color, border: `1px solid ${color}30`, borderRadius: 2, background: `${color}0a` }}>
          {project.stage}
        </div>
        <div className="font-mono" style={{ fontSize: 9, color: '#3d5a78' }}>{project.timeline}</div>
      </div>
      <h3 className="font-display font-600 mb-1" style={{ fontSize: 13, color: '#e2eaf4', lineHeight: 1.2 }}>{project.name}</h3>
      <div className="font-mono mb-2" style={{ fontSize: 9, color: '#00d4ff' }}>{project.location}</div>
      <div className="flex flex-wrap gap-1">
        {project.tags.map((t) => (
          <span key={t} className="font-mono px-1.5 py-0.5" style={{ fontSize: 8, color: '#3d5a78', border: '1px solid #1a3a5c', borderRadius: 2 }}>{t}</span>
        ))}
      </div>
    </button>
  )
}

function ProjectDetail({ project }: { project: Project }) {
  const color = stageColor(project.stage)
  const stageIdx = STAGES.indexOf(project.stage)

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: 'rgba(4,8,18,0.97)', borderLeft: '1px solid #1a3a5c' }}>
      <div className="px-6 py-5 border-b flex-shrink-0" style={{ borderColor: '#1a3a5c' }}>
        <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>{project.type.toUpperCase()}</div>
        <h2 className="font-display font-700 mb-1" style={{ fontSize: 20, color: '#e2eaf4', lineHeight: 1.2 }}>{project.name}</h2>
        <div className="font-mono" style={{ fontSize: 10, color: '#00d4ff' }}>{project.location}</div>
        <div className="flex items-center gap-3 mt-3">
          <div className="font-mono px-2 py-1 font-600" style={{ fontSize: 9, letterSpacing: '0.08em', color, border: `1px solid ${color}30`, borderRadius: 2, background: `${color}0a` }}>
            {project.stage}
          </div>
          <span className="font-mono" style={{ fontSize: 9, color: '#3d5a78' }}>Lead: {project.lead}</span>
        </div>
      </div>

      {/* Lifecycle progress */}
      <div className="px-6 py-5 border-b" style={{ borderColor: '#1a3a5c' }}>
        <div className="font-mono mb-4" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>PROJECT LIFECYCLE</div>
        <div className="flex items-center gap-0">
          {STAGES.map((s, i) => {
            const done = i < stageIdx
            const current = i === stageIdx
            const sc = stageColor(s)
            return (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center" style={{ minWidth: 0 }}>
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      background: current ? sc : done ? '#1a3a5c' : 'transparent',
                      border: `1px solid ${current ? sc : done ? '#1a3a5c' : '#0d1e34'}`,
                      boxShadow: current ? `0 0 8px ${sc}60` : 'none',
                    }}
                  >
                    {done && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#3d5a78' }} />}
                    {current && <div className="w-2 h-2 rounded-full" style={{ background: sc }} />}
                  </div>
                  <span className="font-mono mt-1" style={{ fontSize: 6, letterSpacing: '0.06em', color: current ? sc : '#1a3a5c', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {s}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div className="flex-1 h-px mx-0.5" style={{ background: done ? '#1a3a5c' : '#0d1e34', marginBottom: 14 }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail */}
      <div className="px-6 py-5 flex flex-col gap-5">
        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {[
            { label: 'Capital', value: project.capital, color: '#00d4ff' },
            { label: 'Timeline', value: project.timeline, color: '#f59e0b' },
            { label: 'RICI Score', value: `${project.rici}/100`, color: '#10b981' },
            { label: 'Lead Organization', value: project.lead.split('+')[0].trim(), color: '#8b5cf6' },
          ].map((m) => (
            <div key={m.label} className="p-3" style={{ background: 'rgba(26,58,92,0.12)', border: '1px solid #1a3a5c', borderRadius: 3 }}>
              <div className="font-body mb-1" style={{ fontSize: 10, color: '#3d5a78' }}>{m.label}</div>
              <div className="font-mono font-600" style={{ fontSize: 13, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#3d5a78' }}>DESCRIPTION</div>
          <p className="font-body" style={{ fontSize: 11, color: '#4a6a8a', lineHeight: 1.6 }}>{project.description}</p>
        </div>

        <div>
          <div className="font-mono mb-2" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#10b981' }}>IMPACT</div>
          <p className="font-body" style={{ fontSize: 11, color: '#3a6a5a', lineHeight: 1.6 }}>{project.impact}</p>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-2.5 font-mono transition-all" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 3 }}>
            VIEW DIGITAL TWIN
          </button>
          <button className="flex-1 py-2.5 font-mono transition-all" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#040a14', background: '#00d4ff', borderRadius: 3 }}>
            OPEN PROJECT →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsView() {
  const [selected, setSelected] = useState<Project>(PROJECTS[0])
  const [filter, setFilter] = useState<Project['stage'] | 'ALL'>('ALL')

  const filtered = filter === 'ALL' ? PROJECTS : PROJECTS.filter((p) => p.stage === filter)

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#040a14' }}>
      {/* Left */}
      <div className="flex flex-col border-r overflow-hidden" style={{ width: 380, borderColor: '#1a3a5c', flexShrink: 0 }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.15em', color: '#3d5a78' }}>PROJECT INTELLIGENCE</div>
          <h2 className="font-display font-700" style={{ fontSize: 18, color: '#e2eaf4' }}>Infrastructure Projects</h2>
        </div>

        {/* Stage filter */}
        <div className="flex items-center gap-0 border-b overflow-x-auto" style={{ borderColor: '#1a3a5c' }}>
          <button
            onClick={() => setFilter('ALL')}
            className="px-3 py-2 font-mono flex-shrink-0 transition-all"
            style={{ fontSize: 8, letterSpacing: '0.1em', color: filter === 'ALL' ? '#00d4ff' : '#3d5a78', borderBottom: filter === 'ALL' ? '1px solid #00d4ff' : '1px solid transparent' }}
          >
            ALL
          </button>
          {['DESIGN', 'FINANCE', 'BUILD', 'OPERATE'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as Project['stage'])}
              className="px-3 py-2 font-mono flex-shrink-0 transition-all"
              style={{ fontSize: 8, letterSpacing: '0.1em', color: filter === s ? stageColor(s as Project['stage']) : '#3d5a78', borderBottom: filter === s ? `1px solid ${stageColor(s as Project['stage'])}` : '1px solid transparent' }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} active={selected.id === p.id} onClick={() => setSelected(p)} />
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 overflow-hidden">
        <ProjectDetail project={selected} />
      </div>
    </div>
  )
}
