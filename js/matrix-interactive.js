/* ==========================================================================
   base2ace Academy - Interactive 2D Matrix & Row-Major Memory Engine
   ========================================================================== */

const MatrixInteractive = {
  rows: 3,
  cols: 3,
  baseAddressHex: 0x7ffe00,
  matrixData: [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
  ],
  selectedCell: { r: 1, c: 1 }, // default matrix[1][1] = 50

  init() {
    this.renderMatrixInteractive();
  },

  renderMatrixInteractive() {
    const container = document.getElementById('matrixInteractiveContainer');
    if (!container) return;

    let html = `
      <div style="background:var(--bg-card); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.75rem; margin-bottom:2rem;">
        <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
          <span>📐</span> Interactive 2D Array / Matrix Row-Major Mapper
        </h2>
        <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1.5rem;">
          Click any cell in the 2D grid below to inspect how C converts 2D indices <code>matrix[r][c]</code> into a 1D flat RAM address.
        </p>

        <!-- Dynamic Formula Banner -->
        <div id="matrixFormulaBanner" style="background:rgba(59,130,246,0.12); border:1.5px solid rgba(59,130,246,0.4); border-radius:var(--radius-md); padding:1.25rem; text-align:center; margin-bottom:1.75rem;">
          <!-- Dynamically populated -->
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.75rem;" class="matrix-layout-grid">

          <!-- Left: 2D Grid Visualizer -->
          <div style="background:var(--bg-surface); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--bg-surface-border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 style="font-size:1.05rem; font-weight:700; color:var(--secondary);">2D Grid View (matrix[3][3])</h3>
              <span style="font-size:0.8rem; color:var(--text-dim);">(Click a cell to select)</span>
            </div>

            <div id="matrixGridStage" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.75rem; max-width:280px; margin:0 auto;">
              <!-- Cells populated dynamically -->
            </div>
          </div>

          <!-- Right: Selected Cell Offset Breakdown -->
          <div style="background:var(--bg-surface); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--bg-surface-border); font-family:var(--font-code);">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--primary); margin-bottom:1rem; font-family:var(--font-sans);">
              🔍 Row-Major Calculation Inspector
            </h3>
            <div id="matrixCalcBreakdown" style="font-size:0.9rem; display:flex; flex-direction:column; gap:0.85rem;">
              <!-- Dynamic breakdown -->
            </div>
          </div>

        </div>
      </div>

      <!-- Flat RAM Memory Block View -->
      <div style="background:var(--bg-card); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.75rem;">
        <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <span>📌</span> Flat 1D RAM Memory Array View (Sequential Row-Major Bytes)
        </h3>
        <div id="matrixFlatRamContainer" style="display:flex; gap:0.5rem; overflow-x:auto; padding:1rem 0;">
          <!-- Flat memory nodes -->
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.updateMatrixState();
  },

  selectCell(r, c) {
    this.selectedCell = { r, c };
    this.updateMatrixState();
  },

  updateMatrixState() {
    const { r, c } = this.selectedCell;
    const flatIndex = (r * this.cols) + c;
    const offsetBytes = flatIndex * 4;
    const hexAddr = "0x" + (this.baseAddressHex + offsetBytes).toString(16).toUpperCase();
    const cellValue = this.matrixData[r][c];

    // 1. Update Formula Banner
    const banner = document.getElementById('matrixFormulaBanner');
    if (banner) {
      banner.innerHTML = `
        <div style="font-size:0.82rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.3rem;">Row-Major Memory Mapping Formula</div>
        <div style="font-family:var(--font-code); font-weight:800; font-size:1.2rem; color:#93c5fd;">
          Address(matrix[${r}][${c}]) = Base (0x${this.baseAddressHex.toString(16).toUpperCase()}) + ((${r} × ${this.cols}) + ${c}) × 4 Bytes = <span style="color:var(--accent-amber);">${hexAddr}</span>
        </div>
      `;
    }

    // 2. Render 2D Grid Cells
    const gridStage = document.getElementById('matrixGridStage');
    if (gridStage) {
      let gridHtml = '';
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          const isSelected = i === r && j === c;
          const borderStyle = isSelected
            ? 'border-color:var(--accent-amber); background:rgba(245,158,11,0.2); box-shadow:0 0 15px rgba(245,158,11,0.4); transform:scale(1.06);'
            : 'border-color:var(--bg-surface-border); background:var(--bg-card);';

          gridHtml += `
            <div class="node-box" style="width:100%; height:75px; flex-direction:column; gap:0.2rem; cursor:pointer; ${borderStyle}" onclick="MatrixInteractive.selectCell(${i}, ${j})">
              <div style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${this.matrixData[i][j]}</div>
              <div style="font-size:0.7rem; color:var(--secondary); font-family:var(--font-code);">[${i}][${j}]</div>
            </div>
          `;
        }
      }
      gridStage.innerHTML = gridHtml;
    }

    // 3. Render Calculation Breakdown
    const breakdown = document.getElementById('matrixCalcBreakdown');
    if (breakdown) {
      breakdown.innerHTML = `
        <div style="background:rgba(255,255,255,0.03); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid var(--bg-surface-border);">
          <span style="color:var(--text-dim);">Selected Cell:</span> <strong style="color:var(--secondary);">matrix[${r}][${c}]</strong>
        </div>
        <div style="background:rgba(255,255,255,0.03); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid var(--bg-surface-border);">
          <span style="color:var(--text-dim);">Cell Value:</span> <strong style="color:var(--accent-amber); font-size:1.1rem;">${cellValue}</strong>
        </div>
        <div style="background:rgba(255,255,255,0.03); padding:0.75rem; border-radius:var(--radius-md); border:1px solid var(--bg-surface-border);">
          <span style="color:var(--text-dim);">Flat 1D Index Calculation:</span><br>
          <code>(${r} × ${this.cols} cols) + ${c} = ${flatIndex}</code> (element #${flatIndex + 1})
        </div>
        <div style="background:rgba(255,255,255,0.03); padding:0.75rem; border-radius:var(--radius-md); border:1px solid var(--bg-surface-border);">
          <span style="color:var(--text-dim);">Byte Offset:</span><br>
          <code>${flatIndex} × 4 Bytes = +${offsetBytes} Bytes</code>
        </div>
        <div style="background:rgba(59,130,246,0.15); padding:0.75rem; border-radius:var(--radius-md); border:1px solid rgba(59,130,246,0.3);">
          <span style="color:var(--text-dim);">Final Hex RAM Address:</span><br>
          <code style="color:var(--primary); font-size:1.05rem; font-weight:800;">${hexAddr}</code>
        </div>
      `;
    }

    // 4. Render Flat RAM Memory Strip
    const flatRam = document.getElementById('matrixFlatRamContainer');
    if (flatRam) {
      let ramHtml = '';
      let index = 0;

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          const isSelected = i === r && j === c;
          const hex = "0x" + (this.baseAddressHex + (index * 4)).toString(16).toUpperCase();
          const highlightStyle = isSelected
            ? 'border-color:var(--accent-amber); background:rgba(245,158,11,0.25); box-shadow:0 0 15px rgba(245,158,11,0.5); transform:translateY(-6px);'
            : 'border-color:var(--bg-surface-border); background:var(--bg-surface);';

          ramHtml += `
            <div style="min-width:75px; padding:0.75rem 0.5rem; border:2px solid var(--bg-surface-border); border-radius:var(--radius-md); text-align:center; transition:all 0.3s ease; ${highlightStyle}">
              <div style="font-family:var(--font-code); font-weight:800; font-size:1.1rem; color:var(--text-main);">${this.matrixData[i][j]}</div>
              <div style="font-size:0.72rem; color:var(--text-dim); margin:0.2rem 0;">[${i}][${j}]</div>
              <div style="font-family:var(--font-code); font-size:0.68rem; color:var(--secondary); font-weight:700;">${hex}</div>
            </div>
          `;
          index++;
        }
      }
      flatRam.innerHTML = ramHtml;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MatrixInteractive.init();
});
