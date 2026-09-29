# DESIGN_NOTES.md

## 1. Unified Navigation Menu & Redesigned Header System

This update converts the tab system into a unified **Navigation Menu** and redesigned **Header System** functioning together as one cohesive architecture:

1. **Shared Navigation Config ([`src/config/navigation.js`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/config/navigation.js))**:
   - Single canonical configuration array (`NAV_ITEMS`) defining all 5 sections (`check`, `rates`, `other`, `taluka`, `rules`).
   - Shared between desktop `NavBar` and mobile `BottomNav`, guaranteeing labels, order, icons, and hashes remain 100% in sync.

2. **Top Navigation Bar ([`src/components/NavBar.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/components/NavBar.jsx))**:
   - **Desktop & Tablet ($\ge 768$px)**:
     - Sticky top bar (height $68$px, $z$-index $100$) with translucent background and backdrop blur (`backdrop-filter: blur(16px)`).
     - **Left**: Logo mark SVG + Gujarati title "સબસિડી સાથી" + small secondary badge "Subsidy Sathi".
     - **Center / Right**: The 5 navigation items as accessible links with icon + label, filled active brand pill with subtle elevation, hover states, and smooth 200ms transitions.
     - **Keyboard Navigation**: Full arrow-key navigation (Left/Right) and Tab support with visible focus ring.
     - **Far Right**: Dedicated $44 \times 44$px `ThemeToggle` button.
     - **Adaptive Spacing**: Between 768px and 1100px, items scale padding fluidly and support horizontal scrolling if viewport is constrained without breaking layout.
   - **Mobile ($< 768$px)**:
     - Compact sticky app bar ($56$px): Logo + "સબસિડી સાથી" on the left, theme toggle on the right. Top navigation links are hidden on mobile to avoid duplication.

3. **Hero Section ([`src/components/Hero.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/components/Hero.jsx))**:
   - Positioned below the navbar (not sticky).
   - Rich brand green-to-teal gradient with radial glow accent.
   - Eyebrow pill badge: "વિકસિત ગુજરાત ઔદ્યોગિક નીતિ 2026 · ઉદ્યોગ અને ખાણ વિભાગ".
   - Comfortable description text ($16$px+ desktop, $14.5$px mobile, line-height 1.6).
   - **3 Untruncated GR Reference Cards**:
     1. **MSME સહાય GR**: `IMD/WRT/e-file/9/2026/2630/CH · 25.09.2026`
     2. **Large, Mega, Ultra Mega GR**: `IMD/WRT/e-file/9/2026/2320/I`
     3. **તાલુકા વર્ગીકરણ GR**: `IMD/HMR/e-file/9/2026/2211/I · 08.09.2026`
     - Desktop: 3-column equal-height glassmorphic cards with document icons.
     - Mobile: Horizontal snap-scrolling row; header takes $\le 35\%$ of first screen height.
   - **Curved Bottom Divider**: SVG soft curve flowing smoothly into the page surface (`var(--paper)`).

4. **Fixed Mobile Bottom Navigation ([`src/components/BottomNav.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/components/BottomNav.jsx))**:
   - Positioned at `bottom: 0`, spanning full screen width with safe-area padding (`env(safe-area-inset-bottom)`).
   - 5 items with Lucide icons stacked above 2-line wrapped Gujarati labels.
   - Touch targets $\ge 48$px (`min-height: 52px`).
   - Active state features a soft tinted capsule indicator behind the icon with brand accent color.
   - Floating summary bar for Checker tab on mobile is positioned at `bottom: calc(64px + env(safe-area-inset-bottom, 0px))`, sitting cleanly directly above the bottom nav without overlap.

5. **Balanced 2-Column Grid (Form Left, Results + Next Steps Right) & Full-Width Other Subsidies**:
   - Container `.wrap` spans up to `1600px` with fluid padding `clamp(16px, 3vw, 48px)`.
   - **Equal Height Columns**: The `.checker` top grid uses `align-items: stretch;`.
     - Left column: The complete `CheckerForm` (7 input sections).
     - Right column: `ResultPanel` containing Hero Card, Year Breakdown Table/Chart, EPF Assistance, Eligibility Conditions (પાત્રતાની શરતો), and Next Steps (આગળનાં પગલાં).
     - Because the combined natural height of these 5 right panels closely matches the left form (~1700px), both columns end at the exact same horizontal baseline without awkward stretching or empty spaces.
   - **Full-Width Bottom Section ([`.checker-full-width`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/styles/global.css))**:
     - **તમને લાગુ પડતી અન્ય સહાય**: Positioned across the entire 100% container width below the 2-column grid. The 6 subsidy cards (ERP, Quality, ZED, ICT, Tech, Patent) display across 3-4 spacious columns.

---

## 2. Breakpoint & Responsive Matrix

| Breakpoint Range | Device Class | Top App Bar / NavBar | Hero Section | Bottom Nav | Checker Layout |
|---|---|---|---|---|---|
| **360px – 480px** | Compact / Standard Phones | 56px sticky bar (Logo + Title + Theme button) | Compact ($\le 35\%$ screen), snap-scroll GR cards | Fixed 5-tab bottom nav, $\ge 48$px targets | Single column form $\to$ result panel |
| **768px – 960px** | Tablets / Small Laptops | 68px sticky navbar with 5 nav links + Theme toggle | 3-column GR cards + soft curved divider | Hidden (`display: none`) | Stacked comfortable layout |
| **1024px – 1440px** | Desktop / Laptops | Full 68px sticky navbar with icons + labels | Full width hero with 3 GR cards | Hidden | 2-column grid (`1.05fr / 1fr`), sticky result panel |
| **1600px – 1920px+** | Wide Desktop Monitors | 1600px aligned container, full-width glass navbar | 1600px aligned hero content | Hidden | Full 2-column grid, zero dead margin space |

---

## 3. Files Created and Modified

- **Created**:
  - [`src/config/navigation.js`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/config/navigation.js): Shared navigation items definition.
  - [`src/components/ThemeToggle.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/components/ThemeToggle.jsx): Self-contained 44x44px theme toggle with `sd-theme` persistence.
  - [`src/components/NavBar.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/components/NavBar.jsx): Sticky top navbar (desktop nav menu + mobile app bar).
  - [`src/components/Hero.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/components/Hero.jsx): Non-sticky hero section with gradient, badge, description, GR cards, and curved divider.
  - [`src/components/BottomNav.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/components/BottomNav.jsx): Native-style fixed bottom navigation for mobile screens.
- **Modified**:
  - [`src/components/Help.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/components/Help.jsx): Upgraded to interactive `HelpModal` popup dialog with backdrop blur, keyboard ESC support, click-outside dismiss, and header title mapping.
  - [`src/components/CheckerForm.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/components/CheckerForm.jsx): Added refined guidance card and wired `activeHelpKey` state to open the popup modal without inline layout shifts.
  - [`src/App.jsx`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/App.jsx): Integrated NavBar, Hero, and BottomNav while maintaining identical state, URL hashes, and smooth scrolling.
  - [`src/styles/global.css`](file:///c:/Users/JenishKhambhaliya/OneDrive%20-%20TAVISH%20INFOTECH%20PVT%20LTD/Desktop/TAVISH%20INFOTECH/Projects/Subsidy%20sathi/src/styles/global.css): Complete styling for top navbar, hero, bottom nav, help modal dialog, and form guidance card.

---

## 4. Invariants Kept 100% Untouched

1. **Calculations & Formulas**: `src/lib/calc.js` and all files in `src/data/` were completely untouched. All 12 automated unit test cases pass with exact numerical matches.
2. **Text Content**: Every Gujarati label, help box explanation, warning, GR reference code, number, date, and English subtitle is preserved verbatim.
3. **State & Persistence**: `sd-tab` and `sd-theme` in `localStorage`, URL hash routing (`#check`, `#rates`, `#other`, `#taluka`, `#rules`), and accessibility ARIA roles/states are preserved.
