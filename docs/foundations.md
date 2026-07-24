# OrganUI Foundations

## Accessibility

- Target WCAG 2.2 AA and preserve keyboard and screen-reader behavior.
- Never communicate clinical meaning through color, position, or icons alone.
- Use visible labels, native semantics, and understandable focus states.
- Test light and dark themes, mobile layouts, 200% zoom, long values, and high contrast.

## Semantic Status

- Use plain workflow language and publish the meaning of every supported state.
- Keep unavailable, unknown, pending, empty, and error states explicit.
- Treat warning and critical labels as consumer-configured product language, not universal clinical definitions.
- Visual indicators support local policy; they never replace clinical judgment.

## Typography, Spacing, and Data

- Use semantic shadcn tokens instead of fixed palette utilities.
- Keep values and units adjacent and use tabular numerals for changing measurements.
- Build hierarchy with consistent spacing and composable Card, Alert, Badge, and Separator primitives.
- Preserve long identifiers and translated labels without truncating essential context.

## Focus and Interaction

- Preserve visible focus and a logical keyboard order.
- Do not rely on hover, gestures, or pointer input alone.
- Announce asynchronous updates intentionally and avoid unnecessary live regions.
- Confirm destructive actions and let consumers configure escalation behavior.

## Data Safety

- Use synthetic names, identifiers, dates, measurements, and study records in every example.
- Never commit protected health information, credentials, or proprietary research data.
- Consumers own authentication, authorization, auditing, encryption, retention, clinical validation, and regulatory review.
