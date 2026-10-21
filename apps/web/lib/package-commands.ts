export const packageManagers = ["bun", "pnpm", "npm", "yarn"] as const

export type PackageManager = (typeof packageManagers)[number]

const runners: Record<PackageManager, string> = {
  bun: "bunx",
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
}

// Commands are written once with bunx and shown for each package manager.
export function packageCommands(command: string) {
  if (!command.startsWith("bunx "))
    throw new Error(`Expected a bunx command: ${command}`)
  const rest = command.slice("bunx ".length)
  return Object.fromEntries(
    Object.entries(runners).map(([manager, runner]) => [
      manager,
      `${runner} ${rest}`,
    ])
  ) as Record<PackageManager, string>
}
