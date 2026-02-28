import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, Legend, Cell, Tooltip, AreaChart, Area
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type PopGroup = "all" | "low" | "middle" | "high";
type StatKey = "hunger" | "housing" | "injury" | "education" | "savings" | "happiness";

const statLabels: Record<StatKey, string> = {
  hunger: "Hunger", housing: "Housing", injury: "Injury",
  education: "Education", savings: "Savings", happiness: "Happiness",
};

const popLabels: Record<PopGroup, string> = {
  all: "All Population", low: "Low Income (<$25K)",
  middle: "Middle Income ($25–75K)", high: "High Income (>$75K)",
};

const incomeDataSets: Record<StatKey, Record<PopGroup, number[]>> = {
  hunger: {
    all: [-8.2, -6.1, -3.4, -1.8, -0.6],
    low: [-12.4, -8.9, -4.1, -1.2, -0.3],
    middle: [-5.8, -5.4, -4.2, -2.1, -0.7],
    high: [-2.1, -1.8, -1.4, -1.0, -0.5],
  },
  housing: {
    all: [-5.1, -4.2, -3.0, -1.9, -0.9],
    low: [-9.3, -7.1, -3.8, -1.4, -0.4],
    middle: [-4.2, -4.0, -3.6, -2.5, -1.1],
    high: [-1.8, -1.5, -1.2, -1.0, -0.8],
  },
  injury: {
    all: [-3.8, -3.1, -2.2, -1.4, -0.5],
    low: [-6.7, -5.2, -2.8, -0.9, -0.2],
    middle: [-3.1, -2.9, -2.6, -1.8, -0.6],
    high: [-1.2, -1.0, -0.8, -0.7, -0.4],
  },
  education: {
    all: [-6.4, -5.0, -3.6, -2.1, -0.8],
    low: [-11.1, -7.8, -4.5, -1.5, -0.3],
    middle: [-5.2, -4.8, -4.1, -2.8, -0.9],
    high: [-2.4, -2.0, -1.6, -1.2, -0.7],
  },
  savings: {
    all: [-9.1, -7.2, -4.8, -2.6, -1.1],
    low: [-14.6, -10.4, -5.9, -1.8, -0.4],
    middle: [-7.4, -6.8, -5.6, -3.4, -1.3],
    high: [-3.2, -2.8, -2.2, -1.8, -1.0],
  },
  happiness: {
    all: [-7.5, -5.8, -3.9, -2.3, -0.9],
    low: [-13.2, -9.1, -4.8, -1.6, -0.3],
    middle: [-6.1, -5.5, -4.5, -3.0, -1.1],
    high: [-2.8, -2.3, -1.8, -1.4, -0.8],
  },
};

const sectorDataSets: Record<StatKey, { sector: string; pressure: number }[]> = {
  hunger: [
    { sector: "Grain & Cereal", pressure: 14.2 }, { sector: "Fresh Produce", pressure: 11.8 },
    { sector: "Dairy", pressure: 9.4 }, { sector: "Meat & Poultry", pressure: 7.6 },
    { sector: "Packaged Food", pressure: 5.1 }, { sector: "Beverages", pressure: 2.8 },
  ],
  housing: [
    { sector: "Rent", pressure: 8.9 }, { sector: "Utilities", pressure: 7.2 },
    { sector: "Maintenance", pressure: 6.1 }, { sector: "Insurance", pressure: 4.8 },
    { sector: "Furnishing", pressure: 3.5 }, { sector: "Property Tax", pressure: 1.9 },
  ],
  injury: [
    { sector: "Emergency Care", pressure: 12.1 }, { sector: "Rehab Services", pressure: 9.6 },
    { sector: "Pharmaceuticals", pressure: 7.8 }, { sector: "Mental Health", pressure: 5.4 },
    { sector: "Insurance Claims", pressure: 4.1 }, { sector: "Preventive Care", pressure: 2.3 },
  ],
  education: [
    { sector: "Tuition", pressure: 10.8 }, { sector: "Textbooks", pressure: 8.4 },
    { sector: "Technology", pressure: 7.1 }, { sector: "Childcare", pressure: 5.9 },
    { sector: "Extracurricular", pressure: 3.7 }, { sector: "Transport", pressure: 2.2 },
  ],
  savings: [
    { sector: "Electronics", pressure: 11.2 }, { sector: "Apparel", pressure: 9.8 },
    { sector: "Household", pressure: 8.4 }, { sector: "Vehicles", pressure: 6.1 },
    { sector: "Food", pressure: 3.2 }, { sector: "Energy", pressure: 1.8 },
  ],
  happiness: [
    { sector: "Leisure", pressure: 9.4 }, { sector: "Social Activities", pressure: 8.1 },
    { sector: "Travel", pressure: 7.3 }, { sector: "Dining Out", pressure: 5.8 },
    { sector: "Entertainment", pressure: 4.2 }, { sector: "Fitness", pressure: 2.6 },
  ],
};

const basketDataSets: Record<StatKey, Record<PopGroup, { category: string; change: number }[]>> = {
  hunger: {
    all: [{ category: "Essentials", change: 4.2 }, { category: "Healthcare", change: -0.8 }, { category: "Housing", change: -0.4 }, { category: "Transport", change: -0.9 }, { category: "Discretionary", change: -4.8 }, { category: "Savings", change: -2.1 }],
    low: [{ category: "Essentials", change: 7.1 }, { category: "Healthcare", change: -1.4 }, { category: "Housing", change: -0.6 }, { category: "Transport", change: -1.8 }, { category: "Discretionary", change: -6.2 }, { category: "Savings", change: -3.8 }],
    middle: [{ category: "Essentials", change: 3.6 }, { category: "Healthcare", change: -0.6 }, { category: "Housing", change: -0.3 }, { category: "Transport", change: -0.7 }, { category: "Discretionary", change: -3.9 }, { category: "Savings", change: -1.6 }],
    high: [{ category: "Essentials", change: 1.4 }, { category: "Healthcare", change: -0.2 }, { category: "Housing", change: -0.1 }, { category: "Transport", change: -0.3 }, { category: "Discretionary", change: -1.8 }, { category: "Savings", change: -0.6 }],
  },
  housing: {
    all: [{ category: "Essentials", change: 1.1 }, { category: "Healthcare", change: -0.3 }, { category: "Housing", change: 3.8 }, { category: "Transport", change: -1.2 }, { category: "Discretionary", change: -3.1 }, { category: "Savings", change: -2.4 }],
    low: [{ category: "Essentials", change: 1.8 }, { category: "Healthcare", change: -0.6 }, { category: "Housing", change: 6.2 }, { category: "Transport", change: -2.1 }, { category: "Discretionary", change: -4.8 }, { category: "Savings", change: -3.9 }],
    middle: [{ category: "Essentials", change: 0.9 }, { category: "Healthcare", change: -0.2 }, { category: "Housing", change: 3.4 }, { category: "Transport", change: -1.0 }, { category: "Discretionary", change: -2.6 }, { category: "Savings", change: -1.8 }],
    high: [{ category: "Essentials", change: 0.4 }, { category: "Healthcare", change: -0.1 }, { category: "Housing", change: 1.6 }, { category: "Transport", change: -0.4 }, { category: "Discretionary", change: -1.2 }, { category: "Savings", change: -0.8 }],
  },
  injury: {
    all: [{ category: "Essentials", change: 0.6 }, { category: "Healthcare", change: 3.4 }, { category: "Housing", change: -0.2 }, { category: "Transport", change: -0.8 }, { category: "Discretionary", change: -2.4 }, { category: "Savings", change: -1.8 }],
    low: [{ category: "Essentials", change: 1.0 }, { category: "Healthcare", change: 5.8 }, { category: "Housing", change: -0.4 }, { category: "Transport", change: -1.4 }, { category: "Discretionary", change: -3.9 }, { category: "Savings", change: -3.1 }],
    middle: [{ category: "Essentials", change: 0.5 }, { category: "Healthcare", change: 3.0 }, { category: "Housing", change: -0.2 }, { category: "Transport", change: -0.7 }, { category: "Discretionary", change: -2.0 }, { category: "Savings", change: -1.4 }],
    high: [{ category: "Essentials", change: 0.2 }, { category: "Healthcare", change: 1.4 }, { category: "Housing", change: -0.1 }, { category: "Transport", change: -0.3 }, { category: "Discretionary", change: -0.9 }, { category: "Savings", change: -0.6 }],
  },
  education: {
    all: [{ category: "Essentials", change: -0.4 }, { category: "Healthcare", change: -0.6 }, { category: "Housing", change: -0.3 }, { category: "Transport", change: -0.8 }, { category: "Discretionary", change: -3.6 }, { category: "Savings", change: 2.8 }],
    low: [{ category: "Essentials", change: -0.8 }, { category: "Healthcare", change: -1.1 }, { category: "Housing", change: -0.5 }, { category: "Transport", change: -1.4 }, { category: "Discretionary", change: -5.6 }, { category: "Savings", change: -4.2 }],
    middle: [{ category: "Essentials", change: -0.3 }, { category: "Healthcare", change: -0.5 }, { category: "Housing", change: -0.2 }, { category: "Transport", change: -0.6 }, { category: "Discretionary", change: -3.0 }, { category: "Savings", change: -2.0 }],
    high: [{ category: "Essentials", change: -0.1 }, { category: "Healthcare", change: -0.2 }, { category: "Housing", change: -0.1 }, { category: "Transport", change: -0.3 }, { category: "Discretionary", change: -1.4 }, { category: "Savings", change: -0.8 }],
  },
  savings: {
    all: [{ category: "Essentials", change: 2.1 }, { category: "Healthcare", change: 0.8 }, { category: "Housing", change: 1.4 }, { category: "Transport", change: 0.3 }, { category: "Discretionary", change: -3.2 }, { category: "Savings", change: -1.4 }],
    low: [{ category: "Essentials", change: 3.6 }, { category: "Healthcare", change: 1.4 }, { category: "Housing", change: 2.4 }, { category: "Transport", change: 0.5 }, { category: "Discretionary", change: -5.4 }, { category: "Savings", change: -2.8 }],
    middle: [{ category: "Essentials", change: 1.8 }, { category: "Healthcare", change: 0.7 }, { category: "Housing", change: 1.2 }, { category: "Transport", change: 0.2 }, { category: "Discretionary", change: -2.8 }, { category: "Savings", change: -1.1 }],
    high: [{ category: "Essentials", change: 0.8 }, { category: "Healthcare", change: 0.3 }, { category: "Housing", change: 0.5 }, { category: "Transport", change: 0.1 }, { category: "Discretionary", change: -1.2 }, { category: "Savings", change: -0.5 }],
  },
  happiness: {
    all: [{ category: "Essentials", change: -0.6 }, { category: "Healthcare", change: -1.2 }, { category: "Housing", change: -0.8 }, { category: "Transport", change: -0.4 }, { category: "Discretionary", change: -4.1 }, { category: "Savings", change: -1.2 }],
    low: [{ category: "Essentials", change: -1.1 }, { category: "Healthcare", change: -2.2 }, { category: "Housing", change: -1.4 }, { category: "Transport", change: -0.7 }, { category: "Discretionary", change: -6.8 }, { category: "Savings", change: -2.4 }],
    middle: [{ category: "Essentials", change: -0.5 }, { category: "Healthcare", change: -1.0 }, { category: "Housing", change: -0.7 }, { category: "Transport", change: -0.3 }, { category: "Discretionary", change: -3.4 }, { category: "Savings", change: -1.0 }],
    high: [{ category: "Essentials", change: -0.2 }, { category: "Healthcare", change: -0.4 }, { category: "Housing", change: -0.3 }, { category: "Transport", change: -0.1 }, { category: "Discretionary", change: -1.6 }, { category: "Savings", change: -0.4 }],
  },
};

const employmentDataSets: Record<StatKey, Record<PopGroup, { drop: number; recovery: number }>> = {
  hunger:     { all: { drop: 2.8, recovery: 0.06 }, low: { drop: 4.2, recovery: 0.04 }, middle: { drop: 2.4, recovery: 0.07 }, high: { drop: 1.1, recovery: 0.09 } },
  housing:    { all: { drop: 1.9, recovery: 0.08 }, low: { drop: 3.1, recovery: 0.05 }, middle: { drop: 1.7, recovery: 0.08 }, high: { drop: 0.8, recovery: 0.1 } },
  injury:     { all: { drop: 1.4, recovery: 0.05 }, low: { drop: 2.6, recovery: 0.03 }, middle: { drop: 1.2, recovery: 0.06 }, high: { drop: 0.5, recovery: 0.08 } },
  education:  { all: { drop: 2.2, recovery: 0.07 }, low: { drop: 3.8, recovery: 0.04 }, middle: { drop: 2.0, recovery: 0.07 }, high: { drop: 0.9, recovery: 0.09 } },
  savings:    { all: { drop: 3.1, recovery: 0.08 }, low: { drop: 5.0, recovery: 0.05 }, middle: { drop: 2.8, recovery: 0.08 }, high: { drop: 1.4, recovery: 0.1 } },
  happiness:  { all: { drop: 2.0, recovery: 0.04 }, low: { drop: 3.5, recovery: 0.02 }, middle: { drop: 1.8, recovery: 0.05 }, high: { drop: 0.7, recovery: 0.07 } },
};

const generateEmploymentData = (pop: PopGroup, stat: StatKey) => {
  const { drop, recovery } = employmentDataSets[stat][pop];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.map((month, i) => ({
    month,
    tariff: +(100 - drop * (1 - Math.exp(-i / 3)) + (i > 6 ? (i - 6) * recovery : 0)).toFixed(1),
    baseline: +(100 + i * 0.15).toFixed(1),
  }));
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

const DetailedSection = () => {
  const [popGroup, setPopGroup] = useState<PopGroup>("all");
  const [stat, setStat] = useState<StatKey>("savings");

  // Key forces Recharts to re-mount and replay its grow animation
  const animKey = `${popGroup}-${stat}`;

  const incomeData = ["<$25K", "$25–45K", "$45–75K", "$75–120K", ">$120K"].map((bracket, i) => ({
    bracket,
    change: incomeDataSets[stat][popGroup][i],
  }));
  const sectorData = sectorDataSets[stat];
  const basketData = basketDataSets[stat][popGroup];
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
            <ResponsiveContainer width="100%" height="100%" key={animKey + "-income"}>
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
                <XAxis dataKey="bracket" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="change" radius={[2, 2, 0, 0]} animationDuration={ANIM_DURATION} animationEasing={ANIM_EASING}>
                  {incomeData.map((_, i) => <Cell key={i} fill={incomeColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>,

          <ChartPanel key="sector" title={`Sector Price Pressure · ${statLabels[stat]}`} sub="Projected increase by category (%)">
            <ResponsiveContainer width="100%" height="100%" key={animKey + "-sector"}>
              <BarChart data={sectorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} horizontal={false} />
                <XAxis type="number" tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="sector" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pressure" fill={`${chartStyle.accent}99`} barSize={14} radius={[0, 2, 2, 0]} animationDuration={ANIM_DURATION} animationEasing={ANIM_EASING} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>,

          <ChartPanel key="basket" title={`Spending Reallocation · ${statLabels[stat]}`} sub={`Shift in consumer basket · ${popLabels[popGroup]}`}>
            <ResponsiveContainer width="100%" height="100%" key={animKey + "-basket"}>
              <BarChart data={basketData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
                <XAxis dataKey="category" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="change" radius={[2, 2, 0, 0]} animationDuration={ANIM_DURATION} animationEasing={ANIM_EASING}>
                  {basketData.map((d, i) => <Cell key={i} fill={d.change >= 0 ? "rgba(192,112,112,0.7)" : "rgba(122,184,138,0.7)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>,

          <ChartPanel key="employment" title={`Employment Trajectory · ${statLabels[stat]}`} sub={`Monthly job index · ${popLabels[popGroup]}`}>
            <ResponsiveContainer width="100%" height="100%" key={animKey + "-employment"}>
              <AreaChart data={employmentData}>
                <defs>
                  <linearGradient id="tariffGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartStyle.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={chartStyle.accent} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
                <YAxis domain={[94, "auto"]} tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Courier Prime" }} />
                <Area type="monotone" dataKey="tariff" name="With Tariff" stroke={chartStyle.accent} strokeWidth={2} fill="url(#tariffGrad)" dot={{ r: 2, fill: chartStyle.accent }} animationDuration={ANIM_DURATION} animationEasing={ANIM_EASING} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="rgba(112,104,94,0.5)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} animationDuration={ANIM_DURATION} animationEasing={ANIM_EASING} />
              </AreaChart>
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
