const PromptBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/92 backdrop-blur-xl border-b border-primary/20 px-10 py-3.5 flex items-center gap-5">
      <div className="font-mono text-[13px] font-bold tracking-[0.15em] whitespace-nowrap">
        URBAN<span className="text-primary">MIND</span>
      </div>
      <div className="w-px h-6 bg-primary/40" />
      <div className="text-[10px] tracking-[0.2em] text-primary uppercase whitespace-nowrap">
        Simulating
      </div>
      <div className="font-body italic text-[15px] text-muted-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        10% increase in import tariffs on consumer goods, effective Q1
      </div>
    </header>
  );
};

export default PromptBar;
