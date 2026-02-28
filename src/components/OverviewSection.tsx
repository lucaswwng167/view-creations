import { motion } from "framer-motion";

const kpis = [
  { label: "Consumer Price Index", value: "+3.2%", type: "neg" as const, delta: "above baseline", sub: "annual" },
  { label: "Household Real Income", value: "−$840", type: "neg" as const, delta: "per household", sub: "year 1" },
  { label: "Employment Impact", value: "−1.4%", type: "neg" as const, delta: "retail & trade", sub: "~18,200 jobs" },
  { label: "Municipal Revenue", value: "+$290M", type: "pos" as const, delta: "tax receipts", sub: "year 1" },
];

const benefits = [
  { text: "Domestic manufacturers of substitutable goods", tag: "+1.8% output" },
  { text: "Municipal government via new tariff revenues", tag: "+$290M" },
  { text: "Local-sourced retailers with minimal import exposure" },
];

const costs = [
  { text: "Low-income households with less spending flexibility", tag: "most exposed" },
  { text: "Import-dependent retailers, 6–12% margin compression" },
  { text: "Small businesses facing higher input costs", tag: "−2.1% formation" },
];

const stats = [
  { value: "8.4%", label: "extra income spent\nby bottom quintile" },
  { value: "−4.7%", label: "port cargo volume\nby Q3" },
  { value: "18 mo.", label: "until revenue gains\nlikely erode" },
];

const OverviewSection = () => {
  return (
    <div className="min-w-full h-full px-[60px] pt-[90px] pb-10 flex flex-col relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2">01 — Overview</div>
        <h1 className="font-display italic text-[clamp(32px,4vw,52px)] font-normal leading-[1.1] mb-1.5 text-foreground">
          Policy Impact<br />at a Glance
        </h1>
        <div className="text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
          Aggregate effects across Chicago metropolitan area · 12-month projection
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-[2px] mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            className="bg-card border border-primary/[0.15] p-5 relative group overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <div className="text-[9px] tracking-[0.25em] text-muted uppercase mb-3">{kpi.label}</div>
            <div className={`font-display text-4xl font-bold leading-none mb-1.5 ${kpi.type === "neg" ? "text-negative" : "text-positive"}`}>
              {kpi.value}
            </div>
            <div className="text-[11px] text-muted">
              {kpi.delta} · <span className="text-muted-foreground">{kpi.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lower Grid */}
      <div className="grid grid-cols-2 gap-5 flex-1">
        {/* Verdict */}
        <div className="bg-card border border-primary/[0.15] p-6 flex flex-col gap-5">
          <div>
            <div className="text-[9px] tracking-[0.25em] text-primary uppercase mb-4 pb-3 border-b border-primary/20">
              Analyst Verdict
            </div>
            <p className="font-body text-[17px] leading-[1.7] text-muted-foreground italic">
              Lower-income households bear the sharpest burden — spending ~<strong className="text-foreground not-italic">8.4%</strong> more of income on affected goods.
              Short-term revenue gains are likely offset by reduced consumer activity within <strong className="text-foreground not-italic">18 months</strong>.
            </p>
          </div>
          <div className="flex border border-primary/[0.15]">
            {stats.map((s, i) => (
              <div key={i} className="flex-1 px-4 py-3.5 flex flex-col">
                <div className="font-display text-[22px] font-bold text-foreground mb-1">{s.value}</div>
                <div className="text-[9px] tracking-[0.1em] text-muted leading-[1.4] whitespace-pre-line">{s.label}</div>
                {i < stats.length - 1 && <div className="absolute right-0 top-0 bottom-0 w-px bg-primary/[0.15]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Winners / Losers */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-primary/[0.15] p-6">
            <div className="text-[9px] tracking-[0.25em] text-positive/80 uppercase mb-4 pb-3 border-b border-primary/20">
              ↑ Who Benefits
            </div>
            <ul className="flex flex-col gap-2">
              {benefits.map((b, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2 leading-[1.4]">
                  {b.text}
                  {b.tag && <span className="text-[9px] tracking-[0.12em] text-primary bg-primary/10 px-2 py-0.5 whitespace-nowrap shrink-0">{b.tag}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-primary/[0.15] p-6">
            <div className="text-[9px] tracking-[0.25em] text-negative/80 uppercase mb-4 pb-3 border-b border-primary/20">
              ↓ Who Bears Cost
            </div>
            <ul className="flex flex-col gap-2">
              {costs.map((c, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2 leading-[1.4]">
                  {c.text}
                  {c.tag && <span className="text-[9px] tracking-[0.12em] text-primary bg-primary/10 px-2 py-0.5 whitespace-nowrap shrink-0">{c.tag}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-16 text-[120px] font-display font-bold text-primary/[0.06] leading-none pointer-events-none select-none">01</div>
    </div>
  );
};

export default OverviewSection;
