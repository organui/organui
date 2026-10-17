import type { AnatomyNode } from "@workspace/registry/anatomy-tree"

// Original, simplified demo data shared by the docs page and the index preview.
export const anatomyExampleData: AnatomyNode[] = [
  {
    id: "heart",
    label: "Heart",
    children: [
      {
        id: "left",
        label: "Left heart",
        children: [
          { id: "la", label: "Left atrium" },
          { id: "lv", label: "Left ventricle" },
        ],
      },
      {
        id: "right",
        label: "Right heart",
        children: [
          { id: "ra", label: "Right atrium" },
          { id: "rv", label: "Right ventricle" },
        ],
      },
    ],
  },
]
