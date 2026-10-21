const levels = [
  {
    name: "normal",
    label: "Normal",
    example: "Sodium 140 mmol/L, within range",
  },
  { name: "info", label: "Info", example: "Repeat sample requested" },
  { name: "warning", label: "Warning", example: "Potassium 5.5 mmol/L, high" },
  {
    name: "critical",
    label: "Critical",
    example: "Potassium 6.4 mmol/L, critical high",
  },
] as const

// Written out in full, so Tailwind finds each class.
const styles = {
  normal:
    "border-severity-normal/30 bg-severity-normal/10 text-severity-normal",
  info: "border-severity-info/30 bg-severity-info/10 text-severity-info",
  warning:
    "border-severity-warning/30 bg-severity-warning/10 text-severity-warning",
  critical:
    "border-severity-critical/30 bg-severity-critical/10 text-severity-critical",
} as const

export function Example() {
  return (
    <ul className="flex flex-col gap-3">
      {levels.map((level) => (
        <li
          key={level.name}
          className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3 text-sm ${styles[level.name]}`}
        >
          <span className="font-semibold">{level.label}</span>
          <span className="text-foreground">{level.example}</span>
        </li>
      ))}
    </ul>
  )
}
