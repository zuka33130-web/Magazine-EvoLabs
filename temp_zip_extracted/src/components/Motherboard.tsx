import { PHASES, type RailId } from "../data/boot";
import type { SimStatus } from "../engine/useBootSim";

type CompState = "off" | "sb" | "on" | "busy" | "fault";

const FAULT_COMP: Record<string, string> = {
  sb5_dead: "atx",
  short_12v: "vrm",
  pg_fail: "atx",
  vrm_dead: "vrm",
  bios_corrupt: "flash",
  ram_dead: "ram",
  gpu_dead: "pcie",
  disk_dead: "m2",
  cmos_low: "bat",
};

const STANDBY_COMPS = ["atx", "ec", "sio", "flash", "bat"];

interface Props {
  phaseIndex: number;
  status: SimStatus;
  faultId: string | null;
  voltages: Record<RailId, number>;
}

const STYLE: Record<CompState, { fill: string; stroke: string; cls?: string }> = {
  off: { fill: "#0f1a27", stroke: "#22384f" },
  sb: { fill: "#1d1808", stroke: "#8a6a1f" },
  on: { fill: "#12283c", stroke: "#33608a" },
  busy: { fill: "#0e2f47", stroke: "#4cc9f0", cls: "comp-busy" },
  fault: { fill: "#341119", stroke: "#ff5d5d", cls: "comp-fault" },
};

export default function Motherboard({ phaseIndex, status, faultId, voltages }: Props) {
  const faultComp = faultId ? FAULT_COMP[faultId] ?? null : null;

  const stateFor = (id: string): CompState => {
    if (status === "g3") return "off";
    if (status === "fault" && faultComp === id) return "fault";
    if (status === "s5") return STANDBY_COMPS.includes(id) ? "sb" : "off";
    const cur = PHASES[Math.min(phaseIndex, PHASES.length - 1)];
    const isCurComp = cur.comps.includes(id);
    if (isCurComp && status !== "on") return status === "fault" ? "on" : "busy";
    let on = false;
    for (let i = 0; i <= Math.min(phaseIndex, PHASES.length - 1); i++) {
      if (PHASES[i].compsOn.includes(id) || PHASES[i].comps.includes(id)) {
        on = true;
        break;
      }
    }
    if (on) return "on";
    return STANDBY_COMPS.includes(id) ? "sb" : "off";
  };

  const box = (
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    sub?: string,
    extra?: React.ReactNode
  ) => {
    const st = STYLE[stateFor(id)];
    return (
      <g className={st.cls}>
        <rect x={x} y={y} width={w} height={h} rx={4} fill={st.fill} stroke={st.stroke} strokeWidth={1.4} />
        {extra}
        <text
          x={x + w / 2}
          y={y + h / 2 + (sub ? -3 : 3)}
          textAnchor="middle"
          fontSize={10}
          fontFamily="var(--font-mono)"
          fill={st.cls ? "#cfe9f7" : "#7e95ad"}
          style={{ letterSpacing: "0.08em" }}
        >
          {label}
        </text>
        {sub && (
          <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#51677f">
            {sub}
          </text>
        )}
      </g>
    );
  };

  /* pines de conector */
  const pins = (x: number, y: number, cols: number, rows: number, dx: number, dy: number, lit: boolean) => {
    const out: React.ReactNode[] = [];
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++)
        out.push(
          <rect
            key={`${c}-${r}`}
            x={x + c * dx}
            y={y + r * dy}
            width={7}
            height={7}
            rx={1.5}
            fill={lit ? "#2b2410" : "#0c1420"}
            stroke={lit ? "#b98a24" : "#26405c"}
            strokeWidth={0.8}
          />
        );
    return out;
  };

  const atx = stateFor("atx");
  const atxLit = atx === "on" || atx === "busy";
  const sbLit = voltages.v5sb > 3;

  const flow = (d: string, on: boolean, slow = false) =>
    on ? (
      <path d={d} fill="none" stroke="#ffb224" strokeWidth={1.6} opacity={0.55} className={slow ? "flow-line-slow" : "flow-line"} />
    ) : null;

  return (
    <svg viewBox="0 0 780 600" className="w-full h-auto select-none" role="img" aria-label="Esquema de la placa base">
      {/* PCB */}
      <rect x={16} y={16} width={748} height={568} rx={12} fill="#0c1723" stroke="#24405a" strokeWidth={1.6} />
      <rect x={26} y={26} width={728} height={548} rx={8} fill="none" stroke="#16283c" strokeWidth={1} strokeDasharray="2 5" />
      {[
        [40, 40],
        [740, 40],
        [40, 560],
        [740, 560],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={7} fill="#0a121c" stroke="#2c4a68" />
          <circle cx={cx} cy={cy} r={3} fill="#0a121c" stroke="#22384f" />
        </g>
      ))}

      {/* ---- flujos de energía (dibujados bajo los componentes) ---- */}
      {flow("M690,330 H250 V404 H216", sbLit, true)}
      {flow("M690,240 H430 V96 H384", voltages.v12 > 6)}
      {flow("M150,52 H200 V86", voltages.v12 > 6)}
      {flow("M290,110 V128", voltages.vcore > 0.5)}
      {flow("M176,225 H198", voltages.vcore > 0.5)}
      {flow("M690,380 H520 V336", voltages.v33 > 2)}

      {/* ---- EPS 8 pines ---- */}
      {box("eps", 54, 34, 100, 36, "EPS 12V", "8-PIN", <g>{pins(62, 42, 4, 2, 11, 11, voltages.v12 > 6)}</g>)}

      {/* ---- VRM (fases) ---- */}
      {(() => {
        const st = STYLE[stateFor("vrm")];
        const squares: React.ReactNode[] = [];
        for (let i = 0; i < 8; i++)
          squares.push(<rect key={`t${i}`} x={188 + i * 27} y={86} width={20} height={20} rx={3} fill={st.fill} stroke={st.stroke} strokeWidth={1.2} />);
        for (let i = 0; i < 5; i++)
          squares.push(<rect key={`l${i}`} x={152} y={130 + i * 30} width={20} height={20} rx={3} fill={st.fill} stroke={st.stroke} strokeWidth={1.2} />);
        return (
          <g className={st.cls}>
            {squares}
            <text x={300} y={80} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#7e95ad" style={{ letterSpacing: "0.12em" }}>
              VRM 12+1 FASES
            </text>
          </g>
        );
      })()}

      {/* ---- Socket CPU ---- */}
      {box("cpu", 200, 128, 200, 198, "CPU", "LGA1700", (
        <g>
          <rect x={216} y={144} width={168} height={166} rx={3} fill="none" stroke="#2c4a68" strokeWidth={1} />
          <rect x={238} y={166} width={124} height={122} rx={2} fill="none" stroke="#22384f" strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={226} cy={154} r={3} fill="#c9a227" opacity={0.8} />
        </g>
      ))}

      {/* ---- RAM ---- */}
      {(() => {
        const st = STYLE[stateFor("ram")];
        return (
          <g className={st.cls}>
            {[452, 478, 504, 530].map((x, i) => (
              <g key={x}>
                <rect x={x} y={100} width={14} height={230} rx={2} fill={st.fill} stroke={st.stroke} strokeWidth={1.3} />
                <rect x={x - 2} y={96} width={18} height={8} rx={2} fill={st.fill} stroke={st.stroke} />
                <rect x={x - 2} y={326} width={18} height={8} rx={2} fill={st.fill} stroke={st.stroke} />
                {i % 2 === 0 && <rect x={x + 3} y={108} width={8} height={214} fill="none" stroke="#22384f" strokeDasharray="2 4" />}
              </g>
            ))}
            <text x={498} y={352} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#7e95ad" style={{ letterSpacing: "0.12em" }}>
              DDR4 · DUAL CHANNEL
            </text>
          </g>
        );
      })()}

      {/* ---- ATX 24 pines ---- */}
      {(() => {
        const st = STYLE[atx];
        return (
          <g className={st.cls}>
            <rect x={688} y={168} width={52} height={244} rx={5} fill={st.fill} stroke={st.stroke} strokeWidth={1.5} />
            {pins(697, 178, 2, 12, 20, 19, atxLit || sbLit)}
            <text x={714} y={428} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#7e95ad" style={{ letterSpacing: "0.1em" }}>
              ATX 24-PIN
            </text>
          </g>
        );
      })()}

      {/* ---- PCH ---- */}
      {box("pch", 250, 372, 100, 90, "PCH", "CHIPSET", <rect x={266} y={388} width={68} height={58} rx={2} fill="none" stroke="#2c4a68" />)}

      {/* ---- Flash SPI ---- */}
      {(() => {
        const st = STYLE[stateFor("flash")];
        return (
          <g className={st.cls}>
            <rect x={384} y={386} width={38} height={30} rx={3} fill={st.fill} stroke={st.stroke} strokeWidth={1.3} />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x={388 + i * 8} y={381} width={4} height={5} fill={st.stroke} />
                <rect x={388 + i * 8} y={416} width={4} height={5} fill={st.stroke} />
              </g>
            ))}
            <text x={403} y={432} textAnchor="middle" fontSize={8.5} fontFamily="var(--font-mono)" fill="#7e95ad">
              SPI BIOS
            </text>
          </g>
        );
      })()}

      {/* ---- Pila CMOS ---- */}
      {(() => {
        const st = STYLE[stateFor("bat")];
        return (
          <g className={st.cls}>
            <circle cx={470} cy={420} r={24} fill={st.fill} stroke={st.stroke} strokeWidth={1.5} />
            <circle cx={470} cy={420} r={16} fill="none" stroke="#2c4a68" />
            <text x={470} y={417} textAnchor="middle" fontSize={8.5} fontFamily="var(--font-mono)" fill={st.cls ? "#cfe9f7" : "#7e95ad"}>
              CR2032
            </text>
            <text x={470} y={428} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="#51677f">
              3.0 V
            </text>
          </g>
        );
      })()}

      {/* ---- SIO / EC ---- */}
      {box("ec", 150, 380, 66, 48, "SIO/EC", "NCT6687")}
      {box("sio", 150, 436, 66, 30, "NVRAM", "25Q256")}

      {/* ---- Front panel ---- */}
      {(() => {
        const st = STYLE[stateFor("fp")];
        return (
          <g className={st.cls}>
            <rect x={54} y={506} width={92} height={26} rx={3} fill={st.fill} stroke={st.stroke} strokeWidth={1.3} />
            {pins(60, 512, 9, 2, 10, 8, st.cls !== undefined)}
            <text x={100} y={546} textAnchor="middle" fontSize={8.5} fontFamily="var(--font-mono)" fill="#7e95ad">
              FRONT PANEL
            </text>
          </g>
        );
      })()}

      {/* ---- PCIe x16 ---- */}
      {(() => {
        const st = STYLE[stateFor("pcie")];
        return (
          <g className={st.cls}>
            <rect x={170} y={474} width={350} height={24} rx={3} fill={st.fill} stroke={st.stroke} strokeWidth={1.4} />
            <rect x={274} y={478} width={3} height={16} fill={st.stroke} />
            <rect x={170} y={498} width={14} height={6} fill={st.fill} stroke={st.stroke} />
            <text x={345} y={469} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#7e95ad" style={{ letterSpacing: "0.1em" }}>
              PCIe x16 · GPU
            </text>
            <rect x={170} y={516} width={250} height={20} rx={3} fill="#0f1a27" stroke="#22384f" strokeWidth={1.2} />
            <text x={295} y={549} textAnchor="middle" fontSize={8.5} fontFamily="var(--font-mono)" fill="#51677f">
              PCIe x4
            </text>
          </g>
        );
      })()}

      {/* ---- M.2 ---- */}
      {box("m2", 560, 468, 110, 30, "M.2 NVMe", "GEN4 x4", (
        <circle cx={658} cy={483} r={4} fill="none" stroke="#2c4a68" />
      ))}

      {/* ---- SATA ---- */}
      {(() => {
        const st = STYLE[stateFor("sata")];
        return (
          <g className={st.cls}>
            <rect x={690} y={440} width={48} height={100} rx={4} fill={st.fill} stroke={st.stroke} strokeWidth={1.4} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={698} y={448 + i * 22} width={32} height={12} rx={2} fill="#0c1420" stroke={st.cls ? st.stroke : "#26405c"} />
            ))}
            <text x={714} y={556} textAnchor="middle" fontSize={8.5} fontFamily="var(--font-mono)" fill="#7e95ad">
              SATA 6G
            </text>
          </g>
        );
      })()}

      {/* ---- etiquetas de silk ---- */}
      <text x={40} y={84} fontSize={11} fontFamily="var(--font-mono)" fill="#3d5872" style={{ letterSpacing: "0.2em" }}>
        POST·LAB Z690-REF
      </text>
      <text x={40} y={100} fontSize={8} fontFamily="var(--font-mono)" fill="#2c4459">
        REV 1.0 · placa de referencia del simulador
      </text>

      {/* leyenda */}
      <g fontFamily="var(--font-mono)" fontSize={8.5}>
        {[
          { c: "#22384f", f: "#0f1a27", t: "APAGADO", i: 0 },
          { c: "#8a6a1f", f: "#1d1808", t: "STANDBY", i: 1 },
          { c: "#33608a", f: "#12283c", t: "ALIMENTADO", i: 2 },
          { c: "#4cc9f0", f: "#0e2f47", t: "TRABAJANDO", i: 3 },
          { c: "#ff5d5d", f: "#341119", t: "FALLO", i: 4 },
        ].map((l) => (
          <g key={l.t} transform={`translate(${398 + l.i * 74}, 572)`}>
            <rect width={10} height={10} rx={2} fill={l.f} stroke={l.c} />
            <text x={14} y={8.5} fill="#607a94">
              {l.t}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
