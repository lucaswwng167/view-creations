import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, Legend, Cell, Tooltip
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type PopGroup = "all" | "low" | "middle" | "high";
type StatKey = "hunger" | "housing" | "injury" | "education" | "savings" | "happiness";

const statLabels: Record<StatKey, string> = {
  hunger: "Hunger",
  housing: "Housing",
  injury: "Injury",
  education: "Education",
  savings: "Savings",
  happiness: "Happiness",
};

const popLabels: Record<PopGroup, string> = {
  all: "All Population",
  low: "Low Income (<$25K)",
  middle: "Middle Income ($25–75K)",
  high: "High Income (>$75K)",
};

// Simulated data keyed by [popGroup][stat]
const generateIncomeData = (pop: PopGroup, stat: StatKey) => {
  const base: Record<StatKey, number[]> = {
    hunger:     [-8.2, -6.1, -3.4, -1.8, -0.6],
    housing:    [-5.1, -4.2, -3.0, -1.9, -0.9],
    injury:     [-3.8, -3.1, -2.2, -1.4, -0.5],
    education:  [-6.4, -5.0, -3.6, -2.1, -0.8],
    savings:    [-9.1, -7.2, -4.8, -2.6, -1.1],
    happiness:  [-7.5, -5.8, -3.9, -2.3, -0.9],
  };
  const multiplier: Record<PopGroup, number[]> = {
    all:    [1, 1, 1, 1, 1],
    low:    [1.3, 1.2, 0.9, 0.6, 0.4],
    middle: [0.7, 0.9, 1.2, 1.0, 0.7],
    high:   [0.4, 0.6, 0.8, 1.1, 1.3],
  };
  const brackets = ["<$25K", "$25–45K", "$45–75K", "$75–120K", ">$120K"];
  return brackets.map((bracket, i) => ({
    bracket,
    change: +(base[stat][i] * multiplier[pop][i]).toFixed(1),
  }));
};

const generateSectorData = (_pop: PopGroup, stat: StatKey) => {
  const bases: Record<StatKey, number[]> = {
    hunger:     [14.2, 8.1, 6.3, 3.2, 5.8, 2.1],
    housing:    [6.1, 4.8, 9.2, 5.5, 2.8, 3.4],
    injury:     [3.2, 7.1, 5.6, 8.8, 2.1, 1.9],
    education:  [8.4, 6.2, 4.1, 3.5, 7.8, 2.6],
    savings:    [11.2, 9.8, 8.4, 6.1, 3.2, 1.8],
    happiness:  [7.8, 8.4, 6.9, 4.2, 5.1, 3.3],
  };
  const sectors = ["Electronics", "Apparel", "Household", "Vehicles", "Food", "Energy"];
  return sectors.map((sector, i) => ({ sector, pressure: bases[stat][i] }));
};

const generateBasketData = (pop: PopGroup, stat: StatKey) => {
  const bases: Record<StatKey, number[]> = {
    hunger:     [4.2, 0.6, 0.9, -0.2, -4.8, -2.1],
    housing:    [1.8, 1.2, 2.8, 0.1, -2.4, -1.8],
    injury:     [1.4, 2.1, 0.6, 0.8, -1.9, -1.2],
    education:  [1.1, 0.4, 0.7, -0.5, -2.8, -0.6],
    savings:    [2.1, 0.8, 1.4, 0.3, -3.2, -1.4],
    happiness:  [1.6, 0.5, 1.1, -0.1, -2.6, -1.0],
  };
  const scale = pop === "low" ? 1.4 : pop === "high" ? 0.6 : pop === "middle" ? 1.0 : 1.0;
  const categories = ["Essentials", "Healthcare", "Housing", "Transport", "Discretionary", "Savings"];
  return categories.map((category, i) => ({ category, change: +(bases[stat][i] * scale).toFixed(1) }));
};

const generateEmploymentData = (pop: PopGroup, stat: StatKey) => {
  const drops: Record<StatKey, number> = {
    hunger: 2.8, housing: 1.9, injury: 1.4, education: 2.2, savings: 3.1, happiness: 2.0,
  };
  const drop = drops[stat] * (pop === "low" ? 1.3 : pop === "high" ? 0.6 : pop === "middle" ? 1.0 : 1.0);
  return Array.from({ length: 12 }, (_, i) => {
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i];
    const decay = Math.max(0, 1 - (i / 5));
    return {
      month,
      tariff: +(100 - drop * (1 - Math.exp(-i / 3)) + (i > 6 ? (i - 6) * 0.08 : 0)).toFixed(1),
      baseline: +(100 + i * 0.15).toFixed(1),
    };
  });
};

const incomeColors = ["#c05050", "#c07050", "#a06030", "#828c50", "#64a050"];

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

const DetailedSection = () => {
  const [popGroup, setPopGroup] = useState<PopGroup>("all");
  const [stat, setStat] = useState<StatKey>("savings");

  const incomeData = generateIncomeData(popGroup, stat);
  const sectorData = generateSectorData(popGroup, stat);
  const basketData = generateBasketData(popGroup, stat);
  const employmentData = generateEmploymentData(popGroup, stat);

  return (
    <div className="min-w-full h-full px-[60px] pt-[90px] pb-10 flex flex-col relative">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <div className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2">02 — Detailed Analysis</div>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-display italic text-[clamp(32px,4vw,52px)] font-normal leading-[1.1] mb-1.5 text-foreground">
              Stratified Impact<br />by Segment
            </h1>
            <div className="text-[11px] tracking-[0.15em] text-muted uppercase">
              Income cohorts · Sector breakdown · Spending reallocation
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={popGroup} onValueChange={(v) => setPopGroup(v as PopGroup)}>
              <SelectTrigger className="w-[180px] h-8 text-[11px] bg-card border-primary/20 text-foreground font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/20">
                {Object.entries(popLabels).map(([k, v]) => (
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

      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
        {[
          <ChartPanel key="income" title={`${statLabels[stat]} Impact by Income Bracket`} sub={`% change · ${popLabels[popGroup]}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
                <XAxis dataKey="bracket" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="change" radius={[2, 2, 0, 0]}>
                  {incomeData.map((_, i) => <Cell key={i} fill={incomeColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>,

          <ChartPanel key="sector" title={`Sector Price Pressure · ${statLabels[stat]}`} sub="Projected increase by category (%)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} horizontal={false} />
                <XAxis type="number" tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="sector" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pressure" fill={`${chartStyle.accent}99`} barSize={14} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>,

          <ChartPanel key="basket" title={`Spending Reallocation · ${statLabels[stat]}`} sub={`Shift in consumer basket · ${popLabels[popGroup]}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={basketData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
                <XAxis dataKey="category" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="change" radius={[2, 2, 0, 0]}>
                  {basketData.map((d, i) => <Cell key={i} fill={d.change >= 0 ? "rgba(192,112,112,0.7)" : "rgba(122,184,138,0.7)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>,

          <ChartPanel key="employment" title={`Employment Trajectory · ${statLabels[stat]}`} sub={`Monthly job index · ${popLabels[popGroup]}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={employmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
                <YAxis domain={[96, "auto"]} tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Courier Prime" }} />
                <Line type="monotone" dataKey="tariff" name="With Tariff" stroke={chartStyle.accent} strokeWidth={2} dot={{ r: 2, fill: chartStyle.accent }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="rgba(112,104,94,0.5)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>,
        ].map((chart, i) => (
          <motion.div key={i} custom={i} variants={chartVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {chart}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-8 right-16 text-[120px] font-display font-bold text-primary/[0.06] leading-none pointer-events-none select-none">02</div>
    </div>
  );
};

export default DetailedSection;
