import { useEffect, useRef, useState } from "react";
import type { LogEntry, LogLevel } from "../engine/useBootSim";
import { cn } from "../utils/cn";

const LEVEL_STYLE: Record<LogLevel, string> = {
  PWR: "text-volt",
  SIG: "text-sig",
  SYS: "text-ink-dim",
  ERR: "text-alarm",
  OK: "text-ok",
};

const FILTERS: (LogLevel | "ALL")[] = ["ALL", "PWR", "SIG", "ERR", "OK"];

function fmt(ms: number): string {
  const s = ms / 1000;
  return `${s.toFixed(2).padStart(6, "0")}s`;
}

export default function LogConsole({ logs }: { logs: LogEntry[] }) {
  const [filter, setFilter] = useState<LogLevel | "ALL">("ALL");
  const boxRef = useRef<HTMLDivElement>(null);

  const shown = filter === "ALL" ? logs : logs.filter((l) => l.level === filter);

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown.length]);

  return (
    <section className="panel flex flex-col min-h-0 flex-1">
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <h2 className="panel-title">Consola del firmware</h2>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "font-mono text-[9px] px-1.5 py-0.5 rounded-sm border transition-colors",
                filter === f
                  ? "border-sig/60 text-sig bg-sig-soft"
                  : "border-line text-ink-faint hover:text-ink-dim hover:border-bench-600"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>
      <div
        ref={boxRef}
        className="relative flex-1 overflow-y-auto scroll-slim px-4 pb-3 font-mono text-[10.5px] leading-[1.7] min-h-[280px]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 log-scan" />
        {shown.map((l, i) => (
          <div key={i} className="flex gap-2 whitespace-pre-wrap break-words">
            <span className="text-ink-faint/70 shrink-0 tabular-nums">{fmt(l.t)}</span>
            <span className={cn("shrink-0 w-8 font-semibold", LEVEL_STYLE[l.level])}>{l.level}</span>
            <span className={l.level === "ERR" ? "text-alarm" : l.level === "OK" ? "text-ok" : "text-ink-dim"}>
              {l.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
