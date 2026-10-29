---
"@workspace/registry": minor
---

The image viewer is now the scan viewer: install `@organui/scan-viewer`, and import `ScanViewer`, `ScanViewerProps`, `ScanViewerHandle` and `ScanViewerTool` from `components/ui/scan-viewer`. `ImageSlice`, `ImageWindow` and the DICOM and phantom helpers keep their names. The old registry URLs and docs page redirect to the new ones, so `shadcn add` on the old name still installs, as the scan viewer.
