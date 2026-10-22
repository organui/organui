import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  ContrastIcon,
  FileTextIcon,
  InfoIcon,
  MinusIcon,
  MoveIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TriangleAlertIcon,
  Undo2Icon,
  XIcon,
} from "lucide-react"

// Registry items draw icons through this placeholder, as shadcn's registry
// does. `shadcn add` replaces each one with the icon named for the installing
// project's iconLibrary. In this repository it renders the lucide icon, the
// site's library. Add an icon here when an item first uses it.
const icons = {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  ContrastIcon,
  FileTextIcon,
  InfoIcon,
  MinusIcon,
  MoveIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TriangleAlertIcon,
  Undo2Icon,
  XIcon,
}

export const iconLibraries = [
  "lucide",
  "tabler",
  "hugeicons",
  "phosphor",
  "remixicon",
] as const

type IconPlaceholderProps = { lucide: keyof typeof icons } & Record<
  Exclude<(typeof iconLibraries)[number], "lucide">,
  string
> &
  React.ComponentProps<"svg">

export function IconPlaceholder(props: IconPlaceholderProps) {
  const Icon = icons[props.lucide]
  const svgProps = Object.fromEntries(
    Object.entries(props).filter(
      ([name]) => !(iconLibraries as readonly string[]).includes(name)
    )
  )
  return <Icon {...svgProps} />
}
