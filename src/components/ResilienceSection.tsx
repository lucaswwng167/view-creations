import { motion } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend
} from "recharts";

const radarData = [
  { axis: "Economic Diversity", chicago: 78, avg: 60 },
  { axis: "Social Safety Net", chicago: 55, avg: 58 },
  { axis: "Infrastructure", chicago: 72, avg: 62 },
  { axis: "Fiscal Reserves", chicago: 60, avg: 55 },
  { axis: "Housing Flexibility", chicago: 48, avg: 56 },
  { axis: "Workforce Mobility", chicago: 70, avg: 60 },
];

const phases = [
  { label: "Q1 · Shock", text: "Price spikes, consumer uncertainty, import slowdown", active: true },
  { label: "Q2 · Adjustment", text: "Retail margin compression, small business exits begin", active: false },
  { label: "Q3 · Rebalance", text: "Domestic substitution picks up, fiscal revenues flow in", active: false },
  { label: "Q4 · Equilibrium", text: "New price levels stabilize; employment settles at lower floor", active: false },
];

const recommendations = [
  { priority: "▲ High Priority", text: "Introduce targeted consumer relief credits for households below $45K income threshold to offset regressive price impact." },
  { priority: "→ Medium Priority", text: "Launch a small business tariff transition fund sourced from 15% of new municipal tariff revenues." },
  { priority: "◇ Strategic", text: "Accelerate domestic supplier development in electronics and apparel to reduce import dependency within 24 months." },
];

const ResilienceSection = () => {
  return (
    <div className="min-w-full h-full px-[60px] pt-[90px] pb-10 flex flex-col relative">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
        <div className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2">03 — Resilience Score</div>
        <h1 className="font-display italic text-[clamp(32px,4vw,52px)] font-normal leading-[1.1] mb-1.5 text-foreground">
          City Readiness &<br />Policy Pathways
        </h1>
        <div className="text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
          Adaptive capacity assessment · Forward-looking scenario recommendations
        </div>
      </motion.div>

      <div className="grid grid-cols-[1.2fr_1fr] gap-4 flex-1">
        {/* Left */}
        <div className="flex flex-col gap-4">
          {/* Radar */}
          <div className="bg-card border border-primary/[0.15] p-6 flex-1 flex flex-col">
            <div className="text-[9px] tracking-[0.25em] text-primary uppercase mb-4 pb-3 border-b border-primary/20">
              Resilience Radar — Chicago
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(160,96,48,0.12)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "#70685e", fontSize: 9, fontFamily: "Courier Prime" }} />
                  <Radar name="Chicago" dataKey="chicago" stroke="#a06030" fill="#a0603020" strokeWidth={1.5} dot={{ r: 3, fill: "#a06030" }} />
                  <Radar name="US City Avg" dataKey="avg" stroke="rgba(112,104,94,0.5)" fill="rgba(112,104,94,0.05)" strokeDasharray="3 3" strokeWidth={1} dot={{ r: 2, fill: "rgba(112,104,94,0.5)" }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Courier Prime" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card border border-primary/[0.15] p-5">
            <div className="text-[9px] tracking-[0.25em] text-primary uppercase mb-4 pb-3 border-b border-primary/20">
              Projected Phase Timeline
            </div>
            <div className="flex">
              {phases.map((p, i) => (
                <div
                  key={i}
                  className={`flex-1 px-3 py-2.5 border border-primary/[0.15] ${i < phases.length - 1 ? "border-r-0" : ""} ${p.active ? "bg-primary/[0.08]" : ""}`}
                >
                  <div className="text-[8px] tracking-[0.2em] text-primary uppercase mb-1">{p.label}</div>
                  <div className="text-[10px] text-muted-foreground leading-[1.4]">{p.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Risk score */}
          <div className="bg-card border border-primary/30 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(160,96,48,0.08)_0%,_transparent_70%)] pointer-events-none" />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="font-display text-[72px] font-bold text-primary leading-none block relative z-10"
            >
              62
            </motion.span>
            <span className="text-[9px] tracking-[0.25em] text-muted uppercase mt-2 block">Resilience Score / 100</span>
            <p className="font-body italic text-sm text-muted-foreground mt-3 leading-[1.5]">
              Chicago's diversified economy and strong logistics infrastructure provide moderate buffer — but income inequality amplifies downside risk for low-wage households.
            </p>
          </div>

          {/* Recommendations */}
          <div className="flex-1 flex flex-col gap-2.5">
            {recommendations.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                viewport={{ once: true }}
                className="bg-card border border-primary/[0.12] border-l-[3px] border-l-primary p-4"
              >
                <div className="text-[8px] tracking-[0.25em] text-primary uppercase mb-1.5">{r.priority}</div>
                <div className="text-xs text-muted-foreground leading-[1.5]">{r.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-16 text-[120px] font-display font-bold text-primary/[0.06] leading-none pointer-events-none select-none">03</div>
    </div>
  );
};

export default ResilienceSection;
