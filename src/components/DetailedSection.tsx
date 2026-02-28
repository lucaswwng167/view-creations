import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, Legend, Cell, Tooltip
} from "recharts";

const incomeData = [
  { bracket: "<$25K", change: -4.8 },
  { bracket: "$25–45K", change: -3.9 },
  { bracket: "$45–75K", change: -2.7 },
  { bracket: "$75–120K", change: -1.6 },
  { bracket: ">$120K", change: -0.7 },
];

const incomeColors = ["#c05050", "#c07050", "#a06030", "#828c50", "#64a050"];

const sectorData = [
  { sector: "Electronics", pressure: 11.2 },
  { sector: "Apparel", pressure: 9.8 },
  { sector: "Household", pressure: 8.4 },
  { sector: "Vehicles", pressure: 6.1 },
  { sector: "Food", pressure: 3.2 },
  { sector: "Energy", pressure: 1.8 },
];

const basketData = [
  { category: "Essentials", change: 2.1 },
  { category: "Healthcare", change: 0.8 },
  { category: "Housing", change: 1.4 },
  { category: "Transport", change: 0.3 },
  { category: "Discretionary", change: -3.2 },
  { category: "Savings", change: -1.4 },
];

const employmentData = [
  { month: "Jan", tariff: 100, baseline: 100 },
  { month: "Feb", tariff: 99.4, baseline: 100.2 },
  { month: "Mar", tariff: 98.8, baseline: 100.4 },
  { month: "Apr", tariff: 98.2, baseline: 100.6 },
  { month: "May", tariff: 97.9, baseline: 100.7 },
  { month: "Jun", tariff: 97.7, baseline: 100.9 },
  { month: "Jul", tariff: 97.8, baseline: 101 },
  { month: "Aug", tariff: 98, baseline: 101.1 },
  { month: "Sep", tariff: 98.3, baseline: 101.3 },
  { month: "Oct", tariff: 98.4, baseline: 101.4 },
  { month: "Nov", tariff: 98.6, baseline: 101.5 },
  { month: "Dec", tariff: 98.6, baseline: 101.6 },
];

const chartStyle = {
  gridColor: "rgba(160,96,48,0.08)",
  accent: "#a06030",
  muted: "#70685e",
};

const ChartPanel = ({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) => (
  <div className="bg-card border border-primary/[0.15] p-5 flex flex-col">
    <div className="text-[9px] tracking-[0.2em] text-primary uppercase mb-1">{title}</div>
    <div className="text-[10px] text-muted mb-3.5">{sub}</div>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);

const DetailedSection = () => {
  return (
    <div className="min-w-full h-full px-[60px] pt-[90px] pb-10 flex flex-col relative">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <div className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2">02 — Detailed Analysis</div>
        <h1 className="font-display italic text-[clamp(32px,4vw,52px)] font-normal leading-[1.1] mb-1.5 text-foreground">
          Stratified Impact<br />by Segment
        </h1>
        <div className="text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
          Income cohorts · Sector breakdown · Spending reallocation
        </div>
      </motion.div>

      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
        <ChartPanel title="Spending Impact by Income Bracket" sub="% change in disposable income · annual">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
              <XAxis dataKey="bracket" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: "#2c2018", border: "1px solid rgba(160,96,48,0.3)", color: "#ece8e0", fontFamily: "Courier Prime", fontSize: 11 }} />
              <Bar dataKey="change" radius={[2, 2, 0, 0]}>
                {incomeData.map((_, i) => <Cell key={i} fill={incomeColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Sector Price Pressure" sub="Projected price increase by category (%)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="sector" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "#2c2018", border: "1px solid rgba(160,96,48,0.3)", color: "#ece8e0", fontFamily: "Courier Prime", fontSize: 11 }} />
              <Bar dataKey="pressure" fill={`${chartStyle.accent}99`} barSize={14} radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Spending Reallocation" sub="Shift in consumer basket · percentage points">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={basketData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
              <XAxis dataKey="category" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#2c2018", border: "1px solid rgba(160,96,48,0.3)", color: "#ece8e0", fontFamily: "Courier Prime", fontSize: 11 }} />
              <Bar dataKey="change" radius={[2, 2, 0, 0]}>
                {basketData.map((d, i) => <Cell key={i} fill={d.change >= 0 ? "rgba(192,112,112,0.7)" : "rgba(122,184,138,0.7)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Employment Trajectory" sub="Monthly job index · baseline = 100">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={employmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: chartStyle.muted, fontSize: 10, fontFamily: "Courier Prime" }} axisLine={false} tickLine={false} />
              <YAxis domain={[96, "auto"]} tick={{ fill: chartStyle.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#2c2018", border: "1px solid rgba(160,96,48,0.3)", color: "#ece8e0", fontFamily: "Courier Prime", fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Courier Prime" }} />
              <Line type="monotone" dataKey="tariff" name="With Tariff" stroke={chartStyle.accent} strokeWidth={2} dot={{ r: 2, fill: chartStyle.accent }} fill={`${chartStyle.accent}18`} />
              <Line type="monotone" dataKey="baseline" name="Baseline" stroke="rgba(112,104,94,0.5)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <div className="absolute bottom-8 right-16 text-[120px] font-display font-bold text-primary/[0.06] leading-none pointer-events-none select-none">02</div>
    </div>
  );
};

export default DetailedSection;
