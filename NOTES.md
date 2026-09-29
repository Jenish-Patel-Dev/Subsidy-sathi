# Technical Notes & Observations (NOTES.md)

This document records technical details, architectural decisions, and suspected bugs or nuances in the original `subsidy-sathi.html` that have been preserved as instructed for 1:1 behavioral and calculation parity.

---

### 1. `classify()` MSME Return Object & `notes` Array (Suspected Original Bug)
- **Observation**:
  In `subsidy-sathi.html` (lines 141–144):
  ```javascript
  if (size !== "large") {
    key = s.kind === "selected" ? "msme_sel" : "msme_gen";
    if (s.kind === "thrust") {
      notes.push([
        "info",
        "MSME યોજનામાં થ્રસ્ટ સેક્ટર માટે અલગ દર નથી; ફક્ત 5 પસંદગીના થ્રસ્ટ સેક્ટરને ઊંચા દર મળે છે. તેથી સામાન્ય MSME દર લાગુ."
      ]);
    }
    return { size, key, sector: s, gfciLarge }; // <-- 'notes' is NOT included in returned object!
  }
  ```
  While the note is pushed to `notes` when an MSME selects a thrust sector, the return statement omits `notes`. Consequently, `cl.notes` is `undefined` when `checks(r)` runs, so the note is not displayed in the "પાત્રતાની શરતો" list.
  In contrast, the large-unit branch (line 159) returns `{ size, key, sector: s, gfciLarge, megaReq, ultraReq, notes }`.
- **Decision Taken**:
  In accordance with the instruction (*"Do not fix or refactor formulas. If you think something is a bug, leave it as is and list it in a NOTES.md file for me to review"*), we preserved the exact original return object in `src/lib/calc.js`. If you wish to enable this note for MSMEs in the future, simply include `notes` in the MSME return object.

---

### 2. Ceiling Room Priority & No Carry-Forward
- In each disbursement year $y \in [1..N]$:
  1. Capital subsidy is allocated first up to the remaining annual ceiling (`room`).
  2. Interest subsidy is allocated second up to the remaining room.
  3. Power tariff subsidy is allocated third up to the remaining room.
  4. Any excess amount that exceeds either the component ceiling or annual ceiling is recorded in `lost` and is not carried forward to subsequent years.
- For Micro enterprises, Capital subsidy is disbursed 100% in Year 1 (`R.annMicro[0]`), while subsequent years have a lower annual ceiling (`R.annMicro[1]`). For Small, Medium, and Large units, Capital subsidy is divided into equal annual installments over $N$ years.

---

### 3. Term Loan Interest Amortization & Floor
- Loan eligibility is capped at EFCI: `loanElig = Math.min(inp.loan, efci)`.
- Average annual outstanding balance assumes equal annual principal repayment over the tenure:
  $$\text{Balance}_y = \text{loanElig} \times \left(1 - \frac{y - 0.5}{\text{tenure}}\right)$$
- The effective subsidy rate is capped so the unit bears at least 2%:
  $$\text{subRate} = \frac{\max(0, \min(R.\text{int} + \text{bonus}, \text{rate} - 2))}{100}$$
- A +1% bonus interest applies to MSMEs if the entrepreneur is a woman, registered startup, or first-generation entrepreneur (additive once, maximum +1%).

---

### 4. Help Box Positioning in Multi-Column Grids
- In `subsidy-sathi.html`, inputs within `.row` (2 columns) or `.row3` (3 columns) had their help popups rendered below the entire row (`anchor.after(makeBox(key, "div"))`). This prevented one column's help box from vertically stretching neighboring input cells.
- In `CheckerForm.jsx`, we preserved this exact visual behavior by placing the `HelpBox` elements immediately after the grid row container rather than inside the column label.

---

### 5. Tab State Persistence & Synchronization
- Tab selection is read first from the URL hash (`window.location.hash`).
- If no valid hash is present, it falls back to `localStorage.getItem("sd-tab")`.
- When switching tabs, the selection updates both `localStorage` (wrapped in try/catch) and `window.location.hash`.
- A `hashchange` listener ensures browser Back/Forward navigation between tabs functions seamlessly.

---

### 6. Automated Parity Verification
- All 12 test cases in `test/calc.test.js` compare the output of `src/lib/calc.js` against the original HTML's functions executed in a Node.js VM context.
- Calculations matched 100% with zero deviation in numerical totals, annual breakdowns, EPF amounts, checks, and next steps.
