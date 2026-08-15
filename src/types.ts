export type View = 'home' | 'observe' | 'explore' | 'simulate' | 'design' | 'capital' | 'projects' | 'impact' | 'atlas'

export type Layer =
  | 'all'
  | 'energy'
  | 'compute'
  | 'water'
  | 'land'
  | 'mobility'
  | 'human'
  | 'ecology'
  | 'capital'

export interface MapNode {
  id: string
  name: string
  x: number
  y: number
  type: 'city' | 'energy' | 'compute' | 'water' | 'port' | 'hub'
  country: string
  rici: number
  population?: number
  layers: Layer[]
}

export interface MapConnection {
  from: string
  to: string
  layer: Layer
  type: 'power' | 'fiber' | 'rail' | 'road' | 'pipeline' | 'submarine'
  planned?: boolean
  label?: string
}

export interface InfrastructureNode {
  id: string
  name: string
  type: string
  country: string
  region: string
  rici: number
  capacity: number
  demand: number
  growth: number
  resilience: number
  risk: number
  investment: number
  access: number
  regenerativePotential: number
  population: number
  description: string
  keyStats: { label: string; value: string; unit?: string }[]
  opportunities: string[]
  risks: string[]
  sevenCapitals: {
    financial: number
    human: number
    social: number
    natural: number
    knowledge: number
    technological: number
    cultural: number
  }
}

export interface Opportunity {
  id: string
  title: string
  location: string
  problem: string
  opportunity: string
  dependencies: string[]
  capitalRequired: string
  beneficiaries: string
  resilienceImprovement: number
  emissionsReduction: string
  regenerativePotential: 'High' | 'Medium' | 'Low'
  whyNow: string
  whatCouldChange: string
  participants: string[]
  barriers: string[]
  capitalStack: { source: string; pct: number; color: string }[]
}

export interface SimulationVariables {
  aiComputeDemand: number
  populationGrowth: number
  energyDemand: number
  renewablePenetration: number
  waterAvailability: number
  infrastructureInvestment: number
  urbanization: number
  climatePressure: number
  ecosystemRestoration: number
  technologyAdoption: number
}

export interface SimulationOutcomes {
  energyTWh: number
  renewableShare: number
  emissionsMtCO2: number
  waterStressIndex: number
  capitalRequiredBn: number
  populationWithAccess: number
  resilienceScore: number
  ecosystemHealthScore: number
  gdpImpactBn: number
}

export interface Project {
  id: string
  name: string
  location: string
  stage: 'DISCOVER' | 'DIAGNOSE' | 'DESIGN' | 'VALIDATE' | 'FINANCE' | 'BUILD' | 'OPERATE' | 'MEASURE' | 'REGENERATE'
  type: string
  capital: string
  timeline: string
  lead: string
  rici: number
  description: string
  impact: string
  tags: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'atlas'
  content: string
  timestamp: Date
  structured?: {
    assumptions?: string[]
    systemsAffected?: string[]
    requirements?: string[]
    opportunities?: string[]
    risks?: string[]
    outcomes?: string[]
  }
}
