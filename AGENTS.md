<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Conventions

Follow [CONTRIBUTING.md](CONTRIBUTING.md), especially its Design section, and [docs/architecture.md](docs/architecture.md) for where things live.

# Testing

Run the light checks locally: `bun run format:check`, `bun run lint`, `bun run typecheck` and `bun run test`.

Leave the build, consumer installs and browser tests to CI. They start several Chromium instances that render WebGL in software, which makes a laptop unusable. Push the branch and open a draft PR, or run `gh workflow run registry.yml --ref <branch>`, then `gh pr checks --watch`. When the browser job fails, read the reports with `gh run download <run-id> -n browser-failures` (each failing test has an `error-context.md` and a trace).

To debug one browser test locally, run only that spec: `cd packages/registry-e2e && bunx playwright test tests/browser/<name>.spec.ts -g "<test title>"`. It needs the consumers and website built first.
