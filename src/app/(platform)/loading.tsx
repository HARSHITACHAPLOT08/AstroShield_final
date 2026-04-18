export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[28px] p-6">
        <div className="h-4 w-36 rounded-full bg-cyan-300/15" />
        <div className="mt-4 h-12 w-3/5 rounded-2xl bg-slate-800/60" />
        <div className="mt-3 h-5 w-2/3 rounded-full bg-slate-800/50" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-4">
          <div className="glass-panel rounded-[28px] p-5">
            <div className="h-5 w-40 rounded-full bg-slate-800/55" />
            <div className="mt-6 h-[420px] rounded-[26px] bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-cyan-500/8" />
          </div>
          <div className="glass-panel rounded-[28px] p-5">
            <div className="h-5 w-52 rounded-full bg-slate-800/55" />
            <div className="mt-6 h-[320px] rounded-[26px] bg-slate-900/70" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel rounded-[28px] p-5">
            <div className="h-5 w-44 rounded-full bg-slate-800/55" />
            <div className="mt-6 space-y-3">
              <div className="h-16 rounded-2xl bg-slate-900/70" />
              <div className="h-16 rounded-2xl bg-slate-900/70" />
              <div className="h-16 rounded-2xl bg-slate-900/70" />
            </div>
          </div>
          <div className="glass-panel rounded-[28px] p-5">
            <div className="h-5 w-52 rounded-full bg-slate-800/55" />
            <div className="mt-6 space-y-4">
              <div className="h-20 rounded-2xl bg-slate-900/70" />
              <div className="h-20 rounded-2xl bg-slate-900/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}