# Homepage verification

Date: 2026-09-23. Working directory: `organui/`. No sibling repository was modified.

## Visitor story

Discover the anatomy collection → open a screenshot preview → switch views → close and return to the initiating card → follow a truthful repository or feedback destination. The page is prerendered; preview interactions are local React state, and Next.js serves optimized images from bundled files. There is no submission API, database, or live WebGL dependency.

## Build and code review

- `bun run lint`: passed for web and shared UI.
- `bun run typecheck`: passed for web and shared UI.
- `bun run build`: passed with Next.js 16.3.3 / Turbopack; `/` is statically prerendered.
- `git diff --check`: passed.
- Initial sandbox build stalled at compilation. It was interrupted; the same build completed with the process/local socket access required by Turbopack. No application workaround was needed.
- React review: server-rendered page/layout, isolated client preview component, serializable props, no fetching effects, no unnecessary global listeners, local fonts, and responsive image sizes. Full screenshots are mounted only when their dialog opens.

## Browser verification

Production preview: `http://127.0.0.1:3100`, bound to loopback. Port was checked before starting. Existing services were left alone.

Inspected in the Codex in-app Chromium browser at **1440×1000**, **1280×720**, **768×1024**, and **390×844**, measuring the actual DOM viewport after resizing. A fresh tab was used after an initial tab reported inconsistent viewport dimensions.

- All three showcase cards, navigation, project copy, contribution link, credits and footer render.
- Responsive composition: three columns on desktop/tablet, single column on mobile. No horizontal overflow: document scroll width equals client width (1425, 753 and 375 CSS pixels respectively, excluding the scrollbar).
- Heart preview opens with Enter. Its Anatomy selection button switches to the actual panel screenshot.
- Liver preview opens and Reveal interior displays the actual transparent-surface screenshot.
- Lungs preview opens on mobile and Mobile layout displays its portrait screenshot.
- All view buttons expose `aria-pressed`; each dialog has an accessible name and screenshot-status description.
- Dialog starts with Close focused. Shift+Tab from Close wraps to Open full image; Tab there wraps to Close. Escape closes and restores focus to the triggering organ button. Close button also works.
- Skip to content moves focus to `main`.
- Discover the explorers reaches `#explorers` with the section 32px below the viewport top. About reaches `#about`; wordmark returns to the top.
- Images loaded successfully; responsive `currentSrc` selects a 384px thumbnail on mobile. No three.js/WebGL assets load on this page.
- No browser console errors or warnings were observed on the final production flow.
- All 21 local page, image, icon and attribution URLs returned HTTP 200.
- Reduced-motion CSS inspected: smooth scrolling, hover scaling, transitions and animations are disabled under `prefers-reduced-motion: reduce`. An OS preference toggle was not performed.
- Clear focus outlines and normal document headings/landmarks inspected. This is not a complete assistive-technology audit.

Visual review caught and fixed thumbnails that included part of the source toolbar. Corrected crops preserve model proportions, use original canvas-color padding, and have fresh filenames to avoid old optimized-image cache entries. Captured evidence uses viewport screenshots because resizing and full-page capture sometimes introduced browser screenshot stitching artifacts; DOM inspection confirmed there were no duplicated sections. Final desktop and collection captures use a fresh default-size tab (1280×720).

Evidence: [desktop](screenshots/desktop.png), [mobile](screenshots/mobile.png), [collection](screenshots/collection.png), [interior preview](screenshots/interior-preview.png).

## Destinations and content

GitHub API verified that the three organ repositories exist but only contain starter files. OrganUI's repository is public with Issues enabled; its Issues URL returned HTTP 200. The three proposed `*.organui.com` demo hosts did not resolve even with network access enabled. Accordingly, no live-demo links are rendered. Public hosting and publication of the local explorer implementations remain launch dependencies.

Reviewed the siblings' README and model provenance records and the actual source screenshots. Rechecked the authoritative LSDB 4.0 and original-service 4.3 license pages. The site preserves distinct Heart/Liver CC BY 4.0 and Lungs CC BY-SA 2.1 Japan notices; local copies of the provenance records and font/icon licenses are served with the site.

## Limits

No public deployment, DNS edits, pushes, social posts, or sibling implementation publication. Safari, Firefox, physical mobile hardware, screen-reader behavior, and independent anatomical review were not tested. The screenshot UI previews the local implementations and deliberately does not simulate the explorers' 3D interactions.
