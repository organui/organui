# Versioning and Registry Stability

OrganUI follows Semantic Versioning for tagged releases.

- **Patch** releases fix behavior without changing the public component API.
- **Minor** releases add backward-compatible items, props, states, or documentation.
- **Major** releases may rename items, remove states, change required props, or alter
  installation paths.

Registry items are source code copied into consumer projects. Release notes must
identify changed items, migration steps, dependency changes, and accessibility
impacts. Deprecations should remain available for at least one minor release when
practical. The hosted `/r/<name>.json` paths are stable within a major version.
