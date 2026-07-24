# OrganUI Foundations

## Accessibility

- Meet WCAG 2.2 AA and preserve keyboard and screen-reader behavior.
- Never communicate clinical meaning through color, position, or icons alone.
- Use visible labels, appropriate semantics, and understandable focus states.
- Test empty, loading, error, disabled, and high-zoom experiences.

## Data Safety

- Use synthetic names, identifiers, dates, and measurements in every example.
- Never commit protected health information, study participant data, secrets,
  or proprietary research data.
- Keep components presentational by default; consumers own authorization,
  auditing, retention, and clinical validation.

## Clinical Language

- Prefer plain, neutral workflow terms and document what each status means.
- Do not imply diagnosis, urgency, or treatment without explicit consumer
  configuration.
- Treat labels as product language, not universal clinical definitions.

## Design Tokens

- Use shadcn semantic tokens rather than fixed palette utilities.
- Reserve `destructive` for states requiring immediate attention or irreversible
  actions.
- Ensure component meaning remains clear across custom themes and dark mode.
