# સબસિડી સાથી (Subsidy Sathi) - React Application

A 1:1 React port of the Gujarat Industrial Subsidy Scheme Calculator (MSME GR + Large-unit GRs).
Original application was a single-file static HTML document (`subsidy-sathi.html`). This project preserves the exact UI, Gujarati typography, styling, calculations, numbers, and behavior.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```

### 3. Run verification test suite
```bash
npm test
```

### 4. Build for production
```bash
npm run build
```

---

## 📁 Folder Structure

```
subsidy-sathi/
├── index.html                   # HTML entry point with Google Fonts (Noto Sans Gujarati, Noto Serif Gujarati, IBM Plex Mono)
├── package.json                 # Project configuration & test scripts
├── vite.config.js               # Vite + React plugin configuration
├── subsidy-sathi.html           # Original static HTML preserved for reference & tests
├── NOTES.md                     # Technical notes, preserved behaviors & suspected original bugs
├── README.md                    # Project documentation
├── test/
│   └── calc.test.js             # Automated side-by-side verification tests comparing calc logic with original HTML
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main application state & tab coordinator
    ├── data/
    │   ├── talukas.js           # 34 districts, 130 Category A & 138 Category B talukas with catOf()
    │   ├── sectors.js           # Annexure-A sector classifications (General, Thrust, Selected)
    │   ├── schemes.js           # Scheme rate tables & caps from GRs
    │   ├── help.js              # Full dictionary of Gujarati help texts (with <b>, <br>)
    │   ├── rules.js             # Rules & conditions data structure
    │   └── other.js             # Other subsidy schemes (MSME, Selected Thrust, Large)
    ├── lib/
    │   ├── format.js            # Indian numbering & currency formatters (money, rupees, pct)
    │   └── calc.js              # Pure calculation functions (classify, compute, getChecks, getSteps)
    ├── components/
    │   ├── Masthead.jsx         # Header masthead with policy references & SVG logo
    │   ├── Tabs.jsx             # Sticky tab bar supporting URL hash & localStorage persistence
    │   ├── Help.jsx             # Reusable HelpButton (i) and HelpBox components
    │   ├── CheckerForm.jsx      # Left panel input form with dependent talukas & live inputs
    │   ├── ResultPanel.jsx      # Right panel result display with ceiling meter, SVG bar chart, tables
    │   ├── RateTables.jsx       # Tab 2: Scheme rates comparison tables
    │   ├── OtherSubsidies.jsx   # Tab 3: Detailed other assistance items
    │   ├── TalukaGrid.jsx       # Tab 4: Taluka classification grid with search & category filters
    │   ├── Rules.jsx            # Tab 5: Rules and conditions definition list cards
    │   └── Footer.jsx           # Legal disclaimer & authority reference
    └── styles/
        └── global.css           # Exact CSS rules, CSS variables, dark/light themes, and responsive queries
```

---

## 🔍 Features & Exact Port Guarantees

1. **Exact Mathematical Parity**:
   - `src/lib/calc.js` reproduces identical formulas for EFCI, interest subvention with floor rates (>= 2%), tenure-based year-by-year amortized balance calculations, annual and overall ceilings, no-carry-forward ordering (Capital -> Interest -> Power), and EPF reimbursements.
   - Verified across 12 comprehensive test cases side-by-side with original script evaluation in `test/calc.test.js`.

2. **Dependent Dropdowns & Dynamic UI**:
   - Selecting a district updates the taluka select dynamically.
   - Category A/B pill and GR reference line update live.
   - Expansion / Diversification radio button reveals existing GFCI input (`#exWrap`).
   - Initial "example values filled" notification (`#exNote`) dismisses upon user input.

3. **Inline Interactive Help**:
   - Every `i` help button toggles its corresponding Gujarati help box with static HTML tags preserved.
   - Help boxes inside multi-column rows render cleanly full-width below the row grid without breaking row alignments.

4. **Themes & Responsiveness**:
   - Supports light and dark mode automatically via `prefers-color-scheme` and manual override via `[data-theme="dark"]` attribute using the identical CSS custom properties.
   - Responsive breakpoints (single-column checker layout below 900px, single-column component tiles below 560px).
