---
"@workspace/registry": minor
---

The organ viewer, molecule viewer and DNA helix fade what is not selected towards the stage's own colour, read from the theme, so faded parts recede in dark mode rather than turning pale, and they repaint when the theme changes. The organ viewer and DNA helix are 28rem tall by default, as the molecule and image viewers are.

The molecule viewer shows shadcn's spinner while a structure loads, and now installs it, and offers Try again after a WebGL failure whatever the source. It no longer suggests checking the connection for a structure passed as text, and the organ viewer no longer suggests it for a model that lacks its structures. Status lines use the same text size in every viewer. The three viewers take every prop of their root element and mark it with `data-slot`.
