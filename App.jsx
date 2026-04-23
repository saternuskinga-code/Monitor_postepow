import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "body-progress-tracker-simple-v1";


const measurementFields = [
  { key: "arm", label: "Ramię (cm)", step: "0.1", placeholder: "np. 28.0" },
  { key: "chest", label: "Klatka (cm)", step: "0.1", placeholder: "np. 92.0" },
  { key: "bust", label: "Biust (cm)", step: "0.1", placeholder: "np. 95.0" },
  { key: "waist", label: "Talia (cm)", step: "0.1", placeholder: "np. 74.0" },
  { key: "belly", label: "Brzuch (cm)", step: "0.1", placeholder: "np. 81.0" },
  { key: "hips", label: "Biodra (cm)", step: "0.1", placeholder: "np. 98.5" },
  { key: "thigh", label: "Udo (cm)", step: "0.1", placeholder: "np. 56.0" },
  { key: "calf", label: "Łydka (cm)", step: "0.1", placeholder: "np. 37.0" },
];

const allFields = [
  { key: "weight", label: "Waga (kg)", step: "0.1", placeholder: "np. 72.4" },
  { key: "height", label: "Wzrost (cm)", step: "0.1", placeholder: "np. 168" },
  ...measurementFields,
];

const defaultForm = {
  date: new Date().toISOString().slice(0, 10),
  weight: "",
  height: "",
  arm: "",
  chest: "",
  bust: "",
  waist: "",
  belly: "",
  hips: "",
  thigh: "",
  calf: "",
};

const chartConfig = [
  { key: "weight", label: "Waga", unit: "kg", color: "#8f6d50" },
  { key: "waist", label: "Talia", unit: "cm", color: "#c08f5a" },
  { key: "belly", label: "Brzuch", unit: "cm", color: "#b76e79" },
  { key: "hips", label: "Biodra", unit: "cm", color: "#8c9a7b" },
  { key: "thigh", label: "Udo", unit: "cm", color: "#6f8f8d" },
  { key: "arm", label: "Ramię", unit: "cm", color: "#9b7f63" },
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f7f1e8 0%, #f3ebe0 45%, #efe5d8 100%)",
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#4c3b2f",
    padding: "20px 14px 32px",
  },
  wrap: {
    maxWidth: "760px",
    margin: "0 auto",
  },
  hero: {
    background: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(172, 143, 113, 0.18)",
    backdropFilter: "blur(8px)",
    borderRadius: "28px",
    padding: "22px 20px",
    boxShadow: "0 10px 30px rgba(120, 93, 67, 0.08)",
    marginBottom: "16px",
  },
  eyebrow: {
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#9b7f63",
    marginBottom: "10px",
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
  },
  h1: {
    fontSize: "30px",
    lineHeight: 1.1,
    marginBottom: "10px",
    marginTop: 0,
    color: "#3d2f25",
    fontWeight: 700,
  },
  sub: {
    color: "#786557",
    fontSize: "15px",
    lineHeight: 1.6,
    marginBottom: 0,
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "rgba(255, 252, 247, 0.92)",
    borderRadius: "24px",
    padding: "18px",
    border: "1px solid rgba(173, 144, 114, 0.18)",
    boxShadow: "0 10px 30px rgba(120, 93, 67, 0.08)",
    marginBottom: "14px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
  },
  statTitle: {
    fontSize: "11px",
    color: "#9b7f63",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#3d2f25",
  },
  tabs: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "8px",
    marginBottom: "14px",
  },
  tab: {
    border: "1px solid rgba(173, 144, 114, 0.2)",
    borderRadius: "16px",
    padding: "12px 8px",
    cursor: "pointer",
    background: "rgba(255, 250, 244, 0.85)",
    color: "#7c6552",
    fontWeight: 700,
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 14px rgba(120, 93, 67, 0.04)",
  },
  tabActive: {
    background: "#a78668",
    color: "#fffaf4",
    border: "1px solid #a78668",
  },
  heading2: {
    marginTop: 0,
    marginBottom: "14px",
    color: "#3d2f25",
    fontSize: "24px",
    lineHeight: 1.2,
  },
  label: {
    display: "block",
    fontSize: "13px",
    marginBottom: "7px",
    fontWeight: 700,
    color: "#6f5a49",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "16px",
    border: "1px solid #dfd0bf",
    fontSize: "16px",
    marginBottom: "12px",
    background: "#fffaf5",
    color: "#4c3b2f",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(120, 93, 67, 0.04)",
  },
  button: {
    width: "100%",
    border: "none",
    borderRadius: "18px",
    padding: "15px",
    background: "linear-gradient(135deg, #a78668 0%, #8f6d50 100%)",
    color: "#fffaf4",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
    boxShadow: "0 12px 26px rgba(143, 109, 80, 0.22)",
    fontFamily: "Arial, sans-serif",
  },
  pill: {
    display: "inline-block",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "Arial, sans-serif",
  },
  row: {
    border: "1px solid rgba(173, 144, 114, 0.16)",
    borderRadius: "20px",
    padding: "15px",
    marginBottom: "10px",
    background: "rgba(255, 252, 247, 0.95)",
    boxShadow: "0 8px 24px rgba(120, 93, 67, 0.05)",
  },
  small: {
    fontSize: "13px",
    color: "#8a7564",
    fontFamily: "Arial, sans-serif",
    lineHeight: 1.6,
  },
  deleteBtn: {
    border: "none",
    background: "#f5dfdc",
    color: "#8e4e47",
    borderRadius: "12px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "Arial, sans-serif",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(167, 134, 104, 0.35), transparent)",
    margin: "14px 0 18px",
  },
  chartCard: {
    border: "1px solid rgba(173, 144, 114, 0.16)",
    borderRadius: "22px",
    padding: "16px",
    marginBottom: "12px",
    background: "rgba(255, 252, 247, 0.97)",
    boxShadow: "0 8px 24px rgba(120, 93, 67, 0.05)",
  },
  chartTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  chartTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#3d2f25",
  },
  chartMeta: {
    fontSize: "12px",
    color: "#8a7564",
    fontFamily: "Arial, sans-serif",
  },
  chartSvgWrap: {
    width: "100%",
    overflow: "hidden",
    borderRadius: "16px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(248,241,232,0.85) 100%)",
    border: "1px solid rgba(173, 144, 114, 0.12)",
    padding: "8px",
    boxSizing: "border-box",
  },
  chartLegend: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#8a7564",
    fontFamily: "Arial, sans-serif",
  },
  chartEmpty: {
    padding: "26px 14px",
    textAlign: "center",
    color: "#8a7564",
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
  },
};

function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "—";
  return Number(value).toFixed(1);
}

function getBmi(weight, heightCm) {
  if (!weight || !heightCm) return null;
  const heightM = heightCm / 100;
  if (!heightM) return null;
  return weight / (heightM * heightM);
}

function getBmiStatus(bmi) {
  if (bmi == null) return null;
  if (bmi < 18.5) return { label: "Niedowaga", bg: "#e0f2fe", color: "#075985" };
  if (bmi < 25) return { label: "Prawidłowa waga", bg: "#dcfce7", color: "#166534" };
  if (bmi < 30) return { label: "Nadwaga", bg: "#fef3c7", color: "#92400e" };
  return { label: "Otyłość", bg: "#ffe4e6", color: "#9f1239" };
}

function getDiff(current, previous) {
  if (current == null || previous == null) return null;
  return current - previous;
}

function formatDiff(diff, unit) {
  if (diff == null) return "—";
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff.toFixed(1)} ${unit}`;
}

function getProgressMeta(diff) {
  if (diff == null || diff === 0) {
    return { color: "#64748b", bg: "#f1f5f9", text: "Bez zmian — stabilność też jest postępem." };
  }
  if (diff < 0) {
    return { color: "#166534", bg: "#dcfce7", text: "Super — idziesz w świetnym kierunku." };
  }
  return { color: "#b91c1c", bg: "#fee2e2", text: "Spokojnie — obserwuj trend i działaj dalej." };
}

function ProgressRow({ label, current, previous, unit = "cm" }) {
  const diff = getDiff(current, previous);
  const meta = getProgressMeta(diff);

  return (
    <div style={styles.row}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
          <div style={styles.small}>
            Teraz: {formatNumber(current)} {unit} • Poprzednio: {formatNumber(previous)} {unit}
          </div>
        </div>
        <div style={{ ...styles.pill, background: meta.bg, color: meta.color }}>
          {formatDiff(diff, unit)}
        </div>
      </div>
      <div style={{ marginTop: 10, color: meta.color, fontWeight: 600, fontSize: 14 }}>{meta.text}</div>
    </div>
  );
}

function buildChartPoints(data, key, width, height, padding) {
  const filtered = data.filter((item) => item[key] != null);
  if (filtered.length < 2) return null;

  const values = filtered.map((item) => Number(item[key]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = filtered.length > 1 ? (width - padding * 2) / (filtered.length - 1) : 0;

  const points = filtered.map((item, index) => {
    const x = padding + index * stepX;
    const y = height - padding - ((Number(item[key]) - min) / range) * (height - padding * 2);
    return { x, y, value: Number(item[key]), date: item.date };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return { points, min, max, linePath, areaPath };
}

function MiniChart({ title, data, dataKey, unit, color, baselineValue = null, baselineLabel = null }) {
  const width = 640;
  const height = 220;
  const padding = 26;
  const chart = buildChartPoints(data, dataKey, width, height, padding);

  if (!chart) {
    return (
      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>{title}</div>
        <div style={styles.chartEmpty}>Dodaj co najmniej dwa wpisy dla tego pomiaru, aby zobaczyć wykres.</div>
      </div>
    );
  }

  const first = baselineValue ?? chart.points[0]?.value;
  const last = chart.points[chart.points.length - 1]?.value;
  const diff = last - first;
  const trendColor = diff <= 0 ? "#166534" : "#b91c1c";
  const trendBg = diff <= 0 ? "#dcfce7" : "#fee2e2";

  return (
    <div style={styles.chartCard}>
      <div style={styles.chartTitleRow}>
        <div>
          <div style={styles.chartTitle}>{title}</div>
          <div style={styles.chartMeta}>Zakres: {chart.min.toFixed(1)}–{chart.max.toFixed(1)} {unit}</div>
        </div>
        <span style={{ ...styles.pill, background: trendBg, color: trendColor }}>
          {diff <= 0 ? "Spadek" : "Wzrost"}: {formatDiff(diff, unit)}
        </span>
      </div>

      <div style={styles.chartSvgWrap}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="220" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`fill-${dataKey}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((step) => {
            const y = padding + ((height - padding * 2) / 3) * step;
            return <line key={step} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(167,134,104,0.16)" strokeWidth="1" />;
          })}

          <path d={chart.areaPath} fill={`url(#fill-${dataKey})`} />
          <path d={chart.linePath} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

          {chart.points.map((point, index) => (
            <g key={`${dataKey}-${index}`}>
              <circle cx={point.x} cy={point.y} r="5" fill="#fffaf5" stroke={color} strokeWidth="3" />
              <text x={point.x} y={height - 6} textAnchor="middle" fontSize="11" fill="#8a7564" fontFamily="Arial, sans-serif">
                {String(point.date).slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div style={styles.chartLegend}>{baselineLabel ?? "Pierwszy wpis"}: {formatNumber(first)} {unit} • Ostatni wpis: {formatNumber(last)} {unit}</div>
    </div>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [activeTab, setActiveTab] = useState("add");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setEntries(parsed);
        const latestWithHeight = [...parsed].reverse().find((item) => item.height);
        if (latestWithHeight?.height) {
          setForm((prev) => ({ ...prev, height: String(latestWithHeight.height) }));
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const sortedEntries = useMemo(() => [...entries].sort((a, b) => new Date(a.date) - new Date(b.date)), [entries]);
  const lastEntry = sortedEntries[sortedEntries.length - 1];
  const prevEntry = sortedEntries[sortedEntries.length - 2];
  const firstEntry = sortedEntries[0];
    const weights = sortedEntries
    .map((e) => e.weight)
    .filter((w) => w != null);
  const maxWeight = weights.length ? Math.max(...weights) : null;

  const bmi = getBmi(lastEntry?.weight, lastEntry?.height);
  const bmiStatus = getBmiStatus(bmi);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date) return;

    const newEntry = {
      id: String(Date.now()),
      date: form.date,
      weight: form.weight === "" ? null : Number(form.weight),
      height: form.height === "" ? null : Number(form.height),
      arm: form.arm === "" ? null : Number(form.arm),
      chest: form.chest === "" ? null : Number(form.chest),
      bust: form.bust === "" ? null : Number(form.bust),
      waist: form.waist === "" ? null : Number(form.waist),
      belly: form.belly === "" ? null : Number(form.belly),
      hips: form.hips === "" ? null : Number(form.hips),
      thigh: form.thigh === "" ? null : Number(form.thigh),
      calf: form.calf === "" ? null : Number(form.calf),
    };

    const withoutSameDate = entries.filter((entry) => entry.date !== form.date);
    setEntries([...withoutSameDate, newEntry]);
    setForm({ ...defaultForm, date: new Date().toISOString().slice(0, 10), height: form.height });
    setActiveTab("progress");
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const stats = [
    { title: "Spadek od najwyższej wagi", value: formatDiff(getDiff(lastEntry?.weight, maxWeight), "kg") },
    { title: "Zmiana talii", value: formatDiff(getDiff(lastEntry?.waist, firstEntry?.waist), "cm") },
    { title: "Zmiana brzucha", value: formatDiff(getDiff(lastEntry?.belly, firstEntry?.belly), "cm") },
    { title: "Liczba wpisów", value: sortedEntries.length },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.hero}>
          <div style={styles.eyebrow}>Body progress journal</div>
          <h1 style={styles.h1}>Monitor postępów ciała</h1>
          <div style={styles.sub}>Zapisuj wagę i obwody w spokojnej, estetycznej przestrzeni. Aplikacja pokaże Ci BMI oraz zmiany między kolejnymi pomiarami.</div>
        </div>

        <div style={{ ...styles.grid2, marginBottom: 14 }}>
          {stats.map((stat) => (
            <div key={stat.title} style={styles.card}>
              <div style={styles.statTitle}>{stat.title}</div>
              <div style={styles.statValue}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={styles.statTitle}>BMI</div>
              <div style={styles.statValue}>{bmi != null ? bmi.toFixed(1) : "—"}</div>
            </div>
            <div>
              {bmiStatus ? (
                <span style={{ ...styles.pill, background: bmiStatus.bg, color: bmiStatus.color }}>{bmiStatus.label}</span>
              ) : (
                <span style={{ ...styles.pill, background: "#f1f5f9", color: "#64748b" }}>Wpisz wagę i wzrost</span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.tabs}>
          {[
            ["add", "Dodaj"],
            ["progress", "Postęp"],
            ["charts", "Wykresy"],
            ["history", "Historia"],
            ["info", "Info"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{ ...styles.tab, ...(activeTab === key ? styles.tabActive : {}) }}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "add" && (
          <div style={styles.card}>
            <h2 style={styles.heading2}>Dodaj pomiar</h2>
            <div style={styles.divider}></div>
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Data</label>
              <input style={styles.input} type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />

              {allFields.map((field) => (
                <div key={field.key}>
                  <label style={styles.label}>{field.label}</label>
                  <input
                    style={styles.input}
                    type="number"
                    inputMode="decimal"
                    step={field.step}
                    value={form[field.key]}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              ))}

              <button type="submit" style={styles.button}>Zapisz pomiar</button>
            </form>
          </div>
        )}

        {activeTab === "progress" && (
          <div>
            {sortedEntries.length < 2 ? (
              <div style={styles.card}>Dodaj co najmniej dwa pomiary, aby zobaczyć postęp.</div>
            ) : (
              <>
                <ProgressRow label="Waga" current={lastEntry?.weight} previous={prevEntry?.weight} unit="kg" />
                <ProgressRow label="Ramię" current={lastEntry?.arm} previous={prevEntry?.arm} />
                <ProgressRow label="Klatka" current={lastEntry?.chest} previous={prevEntry?.chest} />
                <ProgressRow label="Biust" current={lastEntry?.bust} previous={prevEntry?.bust} />
                <ProgressRow label="Talia" current={lastEntry?.waist} previous={prevEntry?.waist} />
                <ProgressRow label="Brzuch" current={lastEntry?.belly} previous={prevEntry?.belly} />
                <ProgressRow label="Biodra" current={lastEntry?.hips} previous={prevEntry?.hips} />
                <ProgressRow label="Udo" current={lastEntry?.thigh} previous={prevEntry?.thigh} />
                <ProgressRow label="Łydka" current={lastEntry?.calf} previous={prevEntry?.calf} />
              </>
            )}
          </div>
        )}

        {activeTab === "charts" && (
          <div style={styles.card}>
            <h2 style={styles.heading2}>Kolorowe wykresy postępu</h2>
            <div style={styles.divider}></div>
            {sortedEntries.length < 2 ? (
              <div style={styles.small}>Dodaj co najmniej dwa wpisy, aby zobaczyć kolorowe wykresy trendu.</div>
            ) : (
              chartConfig.map((chart) => (
                <MiniChart
                  key={chart.key}
                  title={chart.label}
                  data={sortedEntries}
                  dataKey={chart.key}
                  unit={chart.unit}
                  color={chart.color}
                  baselineValue={chart.key === "weight" ? maxWeight : null}
                  baselineLabel={chart.key === "weight" ? "Najwyższa waga" : null}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div style={styles.card}>
            <h2 style={styles.heading2}>Historia pomiarów</h2>
            <div style={styles.divider}></div>
            {sortedEntries.length === 0 ? (
              <div style={styles.small}>Nie ma jeszcze żadnych zapisanych pomiarów.</div>
            ) : (
              [...sortedEntries].reverse().map((entry) => {
                const entryBmi = getBmi(entry.weight, entry.height);
                const entryBmiStatus = getBmiStatus(entryBmi);
                return (
                  <div key={entry.id} style={styles.row}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{entry.date}</div>
                        <div style={{ ...styles.small, marginTop: 6 }}>
                          Waga: {formatNumber(entry.weight)} kg • BMI: {entryBmi != null ? entryBmi.toFixed(1) : "—"}
                        </div>
                      </div>
                      <button style={styles.deleteBtn} onClick={() => deleteEntry(entry.id)}>Usuń</button>
                    </div>

                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {entryBmiStatus && <span style={{ ...styles.pill, background: entryBmiStatus.bg, color: entryBmiStatus.color }}>{entryBmiStatus.label}</span>}
                      <span style={{ ...styles.pill, background: "#f1f5f9", color: "#334155" }}>Ramię: {formatNumber(entry.arm)} cm</span>
                      <span style={{ ...styles.pill, background: "#f1f5f9", color: "#334155" }}>Klatka: {formatNumber(entry.chest)} cm</span>
                      <span style={{ ...styles.pill, background: "#f1f5f9", color: "#334155" }}>Biust: {formatNumber(entry.bust)} cm</span>
                      <span style={{ ...styles.pill, background: "#f1f5f9", color: "#334155" }}>Talia: {formatNumber(entry.waist)} cm</span>
                      <span style={{ ...styles.pill, background: "#f1f5f9", color: "#334155" }}>Brzuch: {formatNumber(entry.belly)} cm</span>
                      <span style={{ ...styles.pill, background: "#f1f5f9", color: "#334155" }}>Biodra: {formatNumber(entry.hips)} cm</span>
                      <span style={{ ...styles.pill, background: "#f1f5f9", color: "#334155" }}>Udo: {formatNumber(entry.thigh)} cm</span>
                      <span style={{ ...styles.pill, background: "#f1f5f9", color: "#334155" }}>Łydka: {formatNumber(entry.calf)} cm</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "info" && (
          <div style={styles.card}>
            <h2 style={styles.heading2}>Jak używać</h2>
            <div style={styles.divider}></div>
            <div style={styles.small}>1. Dodaj pierwszy pomiar.</div>
            <div style={styles.small}>2. Przy kolejnym wpisie zobaczysz postęp na czerwono lub zielono.</div>
            <div style={styles.small}>3. Dane zapisują się na tym urządzeniu w przeglądarce.</div>
          </div>
        )}
      </div>
    </div>
  );
}
