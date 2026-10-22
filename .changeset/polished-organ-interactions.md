---
"@workspace/registry": minor
---

Polish every organ's shared viewer with optional uncontrolled selection and `defaultSelectedId`, a grouped keyboard-accessible structure menu, selection announcements, and controls that fit narrow containers. Keep controlled selection authoritative, avoid ghosting visible anatomy when the selection is hidden or invalid, and prevent camera drags, cancelled gestures, and secondary clicks from selecting structures. Apply the same behaviour to Base UI and Radix.

Keep selection mode stable for each viewer, reset uncontrolled selection when its model or source changes (not when the model object is merely recreated), let readers clear an uncontrolled selection by clicking empty space or pressing Escape, and allow selection announcements to be configured with `announceSelection`. Controlled viewers leave announcements to their surrounding UI by default. Omit fully hidden structure groups and keep long selected labels on one line.
