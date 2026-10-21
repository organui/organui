export const packageManagers = ["bun", "pnpm", "npm", "yarn"] as const

export type PackageManager = (typeof packageManagers)[number]

const runners: Record<PackageManager, string> = {
  bun: "bunx",
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
}

const installers: Record<PackageManager, string> = {
  bun: "bun add",
  pnpm: "pnpm add",
  npm: "npm install",
  yarn: "yarn add",
}

// Commands are written once for bun, as `bunx …` or `bun add …`, and shown
// for each package manager.
export function packageCommands(command: string) {
  const [prefix, commands] = command.startsWith("bunx ")
    ? ["bunx ", runners]
    : command.startsWith("bun add ")
      ? ["bun add ", installers]
      : []
  if (!prefix || !commands)
    throw new Error(`Expected a bunx or bun add command: ${command}`)
  const rest = command.slice(prefix.length)
  return Object.fromEntries(
    Object.entries(commands).map(([manager, start]) => [
      manager,
      `${start} ${rest}`,
    ])
  ) as Record<PackageManager, string>
}
