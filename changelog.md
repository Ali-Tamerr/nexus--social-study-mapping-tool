# Changelog

## [v1.5] - 2026-01-31

### Feature: Advanced Navigation & Precision

- **Arrow Key Movement:** Added ability to move elements with arrow keys; supports `Shift` keyboard key for proportional/large jumps.

### Bug Fixes

- **Precision Panning:** Fixed middle-mouse key panning for smoother canvas navigation.
- **Auto-Save Logic:** Fixed issue where attachments and connections were added successfully without requiring a manual 'save changes' click.

---

## [v1.4] - 2026-01-30

### Bug Fixes

- **Preview Enhancement:** Fixed node/shape filtering in the preview pane and resolved scroll issues in popups.
- **Mobile Rendering:** Fixed sudden node/drawing enlargement issues triggered by swiping in pan mode.
- **Resize Logic:** Resolved flickering and shape disappearance bugs during resize actions.

---

## [v1.3] - 2026-01-27 — 2026-01-29

### Modifications

- **Mobile-First UI:** Applied comprehensive responsive design updates across all project pages.

### Bug Fixes

- **Build Optimization:** Resolved production build errors and data-fetching issues.
- **Data Integrity:** Fixed logic errors in separating account data and project ownership.

---

## [v1.2] - 2026-01-18 — 2026-01-26

### Feature: Dynamic Content & Exporting

- **Canvas Exporting:** Implemented PNG and JPG export functionality with intelligent cropping to fit graph bounds.
- **Collaboration Elements:** Modified share popup to include **QR Code** generation for quick mobile sharing.
- **Navigation Aids:** Added "Go back to content" button for quick re-centering on the active workspace.
- **Tabbed Groups:** Added 'Groups' (tabs) feature to categorize different sections of a knowledge graph.
- **Customization:** Integrated custom color pickers for nodes and shape components.

### Feature: Group & Node Logic

- **Drawing Tools:** Fixed rotation issues for circles/rhombuses and added a selection field/area tool.
- **Canvas Polish:** Blocked browser back/forward gestures during heavy swiping to prevent accidental navigation.

---

## [v1.1] - 2026-01-15 — 2026-01-17

### Feature: Tool Suite

- **Tool Suite:** Finalized the first stable versions of the Pen, Text, Eraser, and Node Connection tools.
- **History Management:** Implemented stable Undo/Redo functionality for all editor actions.

## [v1.0] - 2026-01-08 — 2026-01-14

### Feature: Core Graph Engine

- **Next.js 16 Foundation:** Initial architecture setup using the Next.js 16 App Router and **D3-force**.
- **State Management:** Implemented centralized store for node positions, connections, and individual coloring.
- **Persistence:** Shifted drawing data from local storage to a permanent database.
