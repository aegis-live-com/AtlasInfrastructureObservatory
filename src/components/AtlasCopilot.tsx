import { useState, useRef, useEffect } from 'react'
import { ATLAS_RESPONSES } from '../data/mockData'
import type { ChatMessage } from '../types'

const SUGGESTED = [
  "What is the biggest infrastructure bottleneck in Nairobi?",
  "Where could renewable energy unlock the most economic activity?",
  "What infrastructure would make this region more resilient to drought?",
  "Find opportunities where water infrastructure and agriculture intersect.",
  "What would happen if we invested $1 billion here?",
  "What are we not seeing?",
]

function getAtlasResponse(query: string): ChatMessage['structured'] & { text: string } {
  const lower = query.toLowerCase()
  for (const r of ATLAS_RESPONSES) {
    if (new RegExp(r.pattern).test(lower)) {
      return { text: r.response, ...r.structured }
    }
  }
  return {
    text: `Analyzing infrastructure patterns for: "${query}"\n\nThis touches multiple interdependent systems. Let me map the key nodes and relationships. The most significant leverage points I can identify are the energy-compute-water nexus and the governance-capital coordination gap. Infrastructure in this space requires systems thinking: no single intervention is sufficient — the leverage is in sequencing and coordination.`,
    assumptions: ['Data availability in queried domain', 'Current trend trajectories hold', 'Governance conditions remain stable'],
    systemsAffected: ['Energy systems', 'Water infrastructure', 'Digital connectivity', 'Community systems'],
  }
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in-up`}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border" style={{ background: 'rgba(0,212,255,0.08)', borderColor: 'rgba(0,212,255,0.2)' }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00d4ff' }} />
        </div>
      )}
      <div className={`max-w-2xl ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-3`}>
        {/* Main text */}
        <div
          className="px-5 py-4"
          style={{
            background: isUser ? 'rgba(0,212,255,0.08)' : 'rgba(7,15,32,0.9)',
            border: `1px solid ${isUser ? 'rgba(0,212,255,0.2)' : '#1a3a5c'}`,
            borderRadius: 4,
          }}
        >
          <p className="font-body" style={{ fontSize: 13, color: '#c2d0e0', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {msg.content}
          </p>
        </div>

        {/* Structured output */}
        {!isUser && msg.structured && (
          <div className="w-full flex flex-col gap-2">
            {msg.structured.systemsAffected && (
              <div className="px-4 py-3" style={{ background: 'rgba(7,15,32,0.7)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
                <div className="font-mono mb-2" style={{ fontSize: 8, letterSpacing: '0.14em', color: '#3d5a78' }}>SYSTEMS AFFECTED</div>
                <div className="flex flex-wrap gap-1.5">
                  {msg.structured.systemsAffected.map((s) => (
                    <span key={s} className="font-mono px-2 py-0.5" style={{ fontSize: 9, color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 2 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {msg.structured.requirements && (
              <div className="px-4 py-3" style={{ background: 'rgba(7,15,32,0.7)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
                <div className="font-mono mb-2" style={{ fontSize: 8, letterSpacing: '0.14em', color: '#f59e0b' }}>INFRASTRUCTURE REQUIREMENTS</div>
                {msg.structured.requirements.map((r) => (
                  <div key={r} className="flex items-start gap-2 mb-1">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#f59e0b' }} />
                    <span className="font-body" style={{ fontSize: 11, color: '#6a5a3a', lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            )}
            {msg.structured.opportunities && (
              <div className="px-4 py-3" style={{ background: 'rgba(7,15,32,0.7)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
                <div className="font-mono mb-2" style={{ fontSize: 8, letterSpacing: '0.14em', color: '#10b981' }}>OPPORTUNITIES IDENTIFIED</div>
                {msg.structured.opportunities.map((o) => (
                  <div key={o} className="flex items-start gap-2 mb-1">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#10b981' }} />
                    <span className="font-body" style={{ fontSize: 11, color: '#3a6a5a', lineHeight: 1.5 }}>{o}</span>
                  </div>
                ))}
              </div>
            )}
            {msg.structured.outcomes && (
              <div className="px-4 py-3" style={{ background: 'rgba(7,15,32,0.7)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
                <div className="font-mono mb-2" style={{ fontSize: 8, letterSpacing: '0.14em', color: '#8b5cf6' }}>POTENTIAL OUTCOMES</div>
                {msg.structured.outcomes.map((o) => (
                  <div key={o} className="flex items-start gap-2 mb-1">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#8b5cf6' }} />
                    <span className="font-body" style={{ fontSize: 11, color: '#5a4a8a', lineHeight: 1.5 }}>{o}</span>
                  </div>
                ))}
              </div>
            )}
            {msg.structured.assumptions && (
              <div className="px-4 py-3" style={{ background: 'rgba(7,15,32,0.7)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
                <div className="font-mono mb-2" style={{ fontSize: 8, letterSpacing: '0.14em', color: '#f43f5e' }}>ASSUMPTIONS IN THIS RESPONSE</div>
                {msg.structured.assumptions.map((a) => (
                  <div key={a} className="flex items-start gap-2 mb-1">
                    <span style={{ color: '#f43f5e', fontSize: 10, flexShrink: 0 }}>!</span>
                    <span className="font-body" style={{ fontSize: 11, color: '#6a3a4a', lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

let msgCounter = 1

export default function AtlasCopilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'atlas',
      content:
        "I'm Atlas — your infrastructure intelligence companion. I can help you understand infrastructure systems, identify opportunities, model futures, and design interventions across energy, water, compute, land, mobility, and ecology.\n\nAsk me anything. And always ask: what are we not seeing?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const sendMessage = (query: string) => {
    if (!query.trim() || isThinking) return
    const userMsg: ChatMessage = {
      id: `msg-${msgCounter++}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    setTimeout(() => {
      const resp = getAtlasResponse(query)
      const atlasMsg: ChatMessage = {
        id: `msg-${msgCounter++}`,
        role: 'atlas',
        content: resp.text,
        timestamp: new Date(),
        structured: {
          systemsAffected: resp.systemsAffected,
          requirements: resp.requirements,
          opportunities: resp.opportunities,
          outcomes: resp.outcomes,
          assumptions: resp.assumptions,
        },
      }
      setMessages((prev) => [...prev, atlasMsg])
      setIsThinking(false)
    }, 1200 + Math.random() * 800)
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#040a14' }}>
      {/* Left sidebar — context */}
      <div className="flex-shrink-0 border-r flex flex-col" style={{ width: 240, borderColor: '#1a3a5c' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ background: 'rgba(0,212,255,0.08)', borderColor: 'rgba(0,212,255,0.2)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#00d4ff' }} />
            </div>
            <div>
              <div className="font-display font-700" style={{ fontSize: 13, color: '#e2eaf4' }}>ATLAS</div>
              <div className="font-mono" style={{ fontSize: 8, color: '#3d5a78', letterSpacing: '0.1em' }}>INTELLIGENCE COPILOT</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
            <span className="font-mono" style={{ fontSize: 9, color: '#3d5a78', letterSpacing: '0.08em' }}>ONLINE · REASONING ACTIVE</span>
          </div>
        </div>

        <div className="px-5 py-4 border-b" style={{ borderColor: '#1a3a5c' }}>
          <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>SUGGESTED QUESTIONS</div>
          <div className="flex flex-col gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-left px-3 py-2 transition-all"
                style={{ background: 'rgba(26,58,92,0.15)', border: '1px solid #1a3a5c', borderRadius: 3, fontSize: 10, color: '#4a6a8a', lineHeight: 1.4 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'; e.currentTarget.style.color = '#8aaaca' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a3a5c'; e.currentTarget.style.color = '#4a6a8a' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d5a78' }}>ACTIVE CONTEXT</div>
          {[
            { label: 'Region', value: 'East Africa' },
            { label: 'Focus', value: 'All Systems' },
            { label: 'Horizon', value: '2040' },
          ].map((c) => (
            <div key={c.label} className="flex justify-between items-baseline mb-2">
              <span className="font-body" style={{ fontSize: 10, color: '#3d5a78' }}>{c.label}</span>
              <span className="font-mono" style={{ fontSize: 10, color: '#6b8aaa' }}>{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Headline */}
        <div className="px-8 py-4 border-b flex-shrink-0" style={{ borderColor: '#1a3a5c', background: 'rgba(4,10,20,0.8)' }}>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#3d5a78' }}>ATLAS AI — NATURAL LANGUAGE INFRASTRUCTURE INTELLIGENCE</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {isThinking && (
            <div className="flex gap-4 animate-slide-in-up">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border" style={{ background: 'rgba(0,212,255,0.08)', borderColor: 'rgba(0,212,255,0.2)' }}>
                <div className="w-2.5 h-2.5 rounded-full animate-glow-pulse" style={{ background: '#00d4ff' }} />
              </div>
              <div className="px-5 py-4" style={{ background: 'rgba(7,15,32,0.9)', border: '1px solid #1a3a5c', borderRadius: 4 }}>
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#00d4ff', animation: `glow-pulse 1s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                  <span className="font-mono ml-2" style={{ fontSize: 10, color: '#3d5a78' }}>Atlas is reasoning…</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-8 pb-6 pt-4 border-t flex-shrink-0" style={{ borderColor: '#1a3a5c' }}>
          <div className="flex items-center gap-4 px-5 py-4" style={{ background: 'rgba(7,15,32,0.9)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 4 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input) }}
              placeholder="Ask Atlas anything about infrastructure, systems, opportunities, futures…"
              className="flex-1 bg-transparent outline-none font-body"
              style={{ fontSize: 13, color: '#e2eaf4', caretColor: '#00d4ff' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isThinking}
              className="font-mono px-4 py-1.5 transition-all flex-shrink-0"
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                color: input.trim() && !isThinking ? '#040a14' : '#1a3a5c',
                background: input.trim() && !isThinking ? '#00d4ff' : 'rgba(26,58,92,0.3)',
                borderRadius: 2,
                transition: 'all 0.2s',
              }}
            >
              ASK →
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-mono" style={{ fontSize: 9, color: '#1a3a5c', letterSpacing: '0.08em' }}>
              ATLAS distinguishes: OBSERVED · ESTIMATED · MODELED · FORECAST · UNKNOWN
            </p>
            <button
              onClick={() => sendMessage("What are we not seeing?")}
              className="font-mono px-3 py-1 transition-all"
              style={{ fontSize: 9, letterSpacing: '0.1em', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 2 }}
            >
              WHAT ARE WE NOT SEEING? →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
