import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip, Legend, Line,
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type AgentId = `agent-${number}`;
type StatKey = "hunger" | "housing" | "injury" | "education" | "savings" | "happiness";

const statLabels: Record<StatKey, string> = {
  hunger: "Hunger", housing: "Housing", injury: "Injury",
  education: "Education", savings: "Savings", happiness: "Happiness",
};

const AGENT_COUNT = 20;

const agentLabels: Record<AgentId, string> = Object.fromEntries(
  Array.from({ length: AGENT_COUNT }, (_, i) => [`agent-${i + 1}`, `Agent ${i + 1}`])
) as Record<AgentId, string>;

// Generate initial trait scores for each agent (deterministic)
const getAgentTraits = (agentIndex: number): Record<StatKey, number> => {
  const traits: Partial<Record<StatKey, number>> = {};
  const keys: StatKey[] = ["savings", "hunger", "injury", "housing", "happiness", "education"];
  keys.forEach((key, i) => {
    const seed = agentIndex * 13 + i * 7 + 3;
    const val = 40 + Math.round(seededRandom(seed) * 55);
    traits[key] = val;
  });
  return traits as Record<StatKey, number>;
};

const traitDescriptor = (val: number): string => {
  if (val >= 80) return "High";
  if (val >= 55) return "Moderate";
  return "Low";
};

// Seed-based pseudo-random for deterministic agent data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const generateAgentData = (agentIndex: number, stat: StatKey) => {
  const statSeed = Object.keys(statLabels).indexOf(stat);
  const seed = agentIndex * 6 + statSeed;
  const drop = 1.5 + seededRandom(seed) * 4.5;
  const recovery = 0.02 + seededRandom(seed + 100) * 0.1;
  const volatility = 0.3 + seededRandom(seed + 200) * 0.7;

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map((month, i) => ({
    month,
    value: +(100 - drop * (1 - Math.exp(-i / 3)) + (i > 6 ? (i - 6) * recovery : 0) + (seededRandom(seed + i * 7) - 0.5) * volatility).toFixed(1),
    baseline: +(100 + i * 0.15).toFixed(1),
  }));
};

const generateAllAgentsData = (stat: StatKey) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map((month, mIdx) => {
    let sum = 0;
    for (let a = 1; a <= AGENT_COUNT; a++) {
      const agentData = generateAgentData(a, stat);
      sum += agentData[mIdx].value;
    }
    return {
      month,
      value: +(sum / AGENT_COUNT).toFixed(1),
      baseline: +(100 + mIdx * 0.15).toFixed(1),
    };
  });
};

const chartStyle = {
  gridColor: "rgba(160,96,48,0.08)",
  accent: "#a06030",
  muted: "#70685e",
};

const tooltipStyle = {
  background: "#2c2018",
  border: "1px solid rgba(160,96,48,0.3)",
  color: "#ece8e0",
  fontFamily: "Courier Prime",
  fontSize: 11,
};

const ANIM_DURATION = 800;
const ANIM_EASING = "ease-out" as const;

const ChartPanel = ({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) => (
  <div className="bg-card border border-primary/[0.15] p-5 flex flex-col h-full">
    <div className="text-[9px] tracking-[0.2em] text-primary uppercase mb-1">{title}</div>
    <div className="text-[10px] text-muted mb-3.5">{sub}</div>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);

const chartVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: 0.2 + 0.15 * i },
  }),
};

// Colors for multi-agent overlay
const agentColors = [
  "#c05050", "#c07050", "#a06030", "#828c50", "#64a050",
  "#50a0a0", "#5070c0", "#7050c0", "#a050a0", "#c05080",
  "#d08040", "#90a040", "#40a080", "#4080c0", "#8060d0",
  "#d06060", "#b08030", "#60b060", "#5090b0", "#9070a0",
];

const ResilienceSection = () => {
  const [agent, setAgent] = useState<AgentId>("agent-1");
  const [stat, setStat] = useState<StatKey>("savings");

  const animKey = `${agent}-${stat}`;
  const agentIndex = parseInt(agent.split("-")[1]);
  const traits = getAgentTraits(agentIndex);

  return (
    <div className="min-w-full h-full px-[60px] pt-[90px] pb-10 flex flex-col relative">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <div className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2">03 — Agent Simulation</div>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-display italic text-[clamp(32px,4vw,52px)] font-normal leading-[1.1] mb-1.5 text-foreground">
              Agent-Based Behavior Analysis
            </h1>
            <div className="text-[11px] tracking-[0.15em] text-muted uppercase">
              20 agents · Personality-driven responses · Temporal dynamics
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={agent} onValueChange={(v) => setAgent(v as AgentId)}>
              <SelectTrigger className="w-[180px] h-8 text-[11px] bg-card border-primary/20 text-foreground font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/20 max-h-[300px]">
                {Object.entries(agentLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="text-[11px] font-mono text-foreground">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stat} onValueChange={(v) => setStat(v as StatKey)}>
              <SelectTrigger className="w-[150px] h-8 text-[11px] bg-card border-primary/20 text-foreground font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/20">
                {Object.entries(statLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="text-[11px] font-mono text-foreground">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Agent Traits Summary */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }} viewport={{ once: true }} className="mb-6">
        <div className="bg-card border border-primary/[0.15] p-4 flex items-center gap-6">
          <div className="text-[9px] tracking-[0.2em] text-primary uppercase whitespace-nowrap">Initial Profile</div>
          <div className="flex gap-4 flex-wrap">
            {(Object.keys(statLabels) as StatKey[]).map((key) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted font-mono">{statLabels[key]}:</span>
                <span className="text-[10px] text-foreground font-mono font-bold">{traits[key]}</span>
                <span className={`text-[9px] font-mono ${traits[key] >= 80 ? "text-green-600" : traits[key] >= 55 ? "text-yellow-600" : "text-red-500"}`}>
                  ({traitDescriptor(traits[key])})
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Single agent chart */}
      <div className="flex-1">
        <motion.div custom={0} variants={chartVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="h-full">
          <ChartPanel title={`${statLabels[stat]} Over Time · ${agentLabels[agent]}`} sub="Monthly index trajectory">
            <ResponsiveContainer width="100%" height="100%" key={animKey + "-single"}>
              <AreaChart data={generateAgentData(agentIndex, stat)}>
                <defs>
                  <linearGradient id="agentGradSingle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartStyle.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={chartStyle.accent} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
                <YAxis domain={[93, "auto"]} tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Courier Prime" }} />
                <Area type="monotone" dataKey="value" name={agentLabels[agent]} stroke={chartStyle.accent} strokeWidth={2} fill="url(#agentGradSingle)" dot={{ r: 2, fill: chartStyle.accent }} animationDuration={ANIM_DURATION} animationEasing={ANIM_EASING} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="rgba(112,104,94,0.5)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} animationDuration={ANIM_DURATION} animationEasing={ANIM_EASING} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-16 text-[120px] font-display font-bold text-primary/[0.06] leading-none pointer-events-none select-none">03</div>
    </div>
  );
};

export default ResilienceSection;
