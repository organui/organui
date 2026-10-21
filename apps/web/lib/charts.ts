// The /charts gallery: each chart is a documentation example, grouped by
// the component that draws it.
export const chartGroups = [
  {
    id: "growth",
    title: "Growth",
    component: { title: "Growth chart", href: "/docs/components/growth-chart" },
    charts: [
      {
        name: "chart-growth-weight",
        title: "Weight-for-age",
        description: "Girls, 0–2 years, with WHO's percentile curves.",
      },
      {
        name: "chart-growth-length",
        title: "Length/height-for-age",
        description:
          "Boys, 0–5 years. The curve steps at 24 months, from lying to standing.",
      },
      {
        name: "chart-growth-head",
        title: "Head circumference-for-age",
        description: "Girls, 0–2 years.",
      },
    ],
  },
  {
    id: "ecg",
    title: "ECG",
    component: { title: "ECG trace", href: "/docs/components/ecg-trace" },
    charts: [
      {
        name: "chart-ecg-sinus",
        title: "Sinus rhythm",
        description: "A recorded strip at 72 bpm, with labelled waves.",
      },
      {
        name: "chart-ecg-live",
        title: "Live stream",
        description: "A stream that sweeps as samples arrive, with Pause.",
      },
      {
        name: "chart-ecg-bradycardia",
        title: "Bradycardia",
        description: "46 bpm: the beats spread out.",
      },
      {
        name: "chart-ecg-tachycardia",
        title: "Tachycardia",
        description: "128 bpm: the beats crowd together.",
      },
      {
        name: "chart-ecg-paper",
        title: "Paper speed and gain",
        description: "50 mm/s and 20 mm/mV, for a closer look at each wave.",
      },
    ],
  },
  {
    id: "lab-results",
    title: "Lab results",
    component: {
      title: "Lab results table",
      href: "/docs/components/lab-results",
    },
    charts: [
      {
        name: "chart-lab-trends",
        title: "Trends in a table",
        description: "A sparkline per row, against its reference range.",
      },
      {
        name: "chart-lab-sparkline",
        title: "One trend",
        description: "The sparkline on its own, beside the latest value.",
      },
    ],
  },
  {
    id: "vital-signs",
    title: "Vital signs",
    component: { title: "Vital signs", href: "/docs/components/vital-signs" },
    charts: [
      {
        name: "chart-vitals-adult",
        title: "Adult ranges",
        description: "Each reading flagged against common adult ranges.",
      },
      {
        name: "chart-vitals-custom",
        title: "Custom ranges",
        description: "Fahrenheit, chosen vitals and a target SpO₂ of 88–92%.",
      },
    ],
  },
] as const
