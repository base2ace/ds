/* ==========================================================================
   base2ace Academy - Interactive Pointer Arithmetic Sandbox Module
   ========================================================================== */

const PointerSandbox = {
  sampleArray: [12, 45, 67, 23, 89, 34],
  baseAddressHex: 0x7ffe00,

  init() {
    this.renderSandbox();
    this.setupListeners();
  },

  renderSandbox() {
    const container = document.getElementById('pointerSandboxContainer');
    if (!container) return;

    let html = `
      <div style="background:var(--bg-card); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.75rem; margin-bottom:2rem;">
        <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
          <span>🧠</span> Interactive C Pointer Arithmetic & Dereferencing Sandbox
        </h2>
        <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1.5rem;">
          In C, an array name <code>arr</code> is a pointer constant to <code>&arr[0]</code>. Test expressions below to watch C address calculation in real-time.
        </p>

        <!-- Expression Quick Buttons -->
        <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:1.25rem;">
          <span style="font-size:0.85rem; color:var(--text-dim); display:flex; align-items:center;">Try Expressions:</span>
          <button class="btn btn-secondary btn-sm" onclick="PointerSandbox.evaluateExpr('arr + 0')"><code>arr + 0</code></button>
          <button class="btn btn-secondary btn-sm" onclick="PointerSandbox.evaluateExpr('arr + 2')"><code>arr + 2</code></button>
          <button class="btn btn-secondary btn-sm" onclick="PointerSandbox.evaluateExpr('*(arr + 2)')"><code>*(arr + 2)</code></button>
          <button class="btn btn-secondary btn-sm" onclick="PointerSandbox.evaluateExpr('&arr[3]')"><code>&arr[3]</code></button>
          <button class="btn btn-secondary btn-sm" onclick="PointerSandbox.evaluateExpr('arr[4]')"><code>arr[4]</code></button>
        </div>

        <!-- Expression Input Bar -->
        <div style="display:flex; gap:0.85rem; align-items:center; background:var(--bg-surface); padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--bg-surface-border); flex-wrap:wrap;">
          <label style="font-weight:700; color:var(--primary); font-family:var(--font-code);">C Expression:</label>
          <input type="text" id="pointerExprInput" class="config-input" value="*(arr + 2)" style="width:200px; text-align:left; padding:0.4rem 0.8rem;" aria-label="Pointer Expression Input">
          <button class="btn btn-primary btn-sm" onclick="PointerSandbox.evalFromInput()">⚡ Evaluate Expression</button>
        </div>

        <!-- Evaluation Output Card -->
        <div id="pointerEvalOutput" style="margin-top:1.5rem; background:#090e18; border:1px solid rgba(59,130,246,0.3); border-radius:var(--radius-md); padding:1.25rem;">
          <!-- Rendered dynamically -->
        </div>
      </div>

      <!-- Live Memory Layout Blocks -->
      <div style="background:var(--bg-card); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.75rem;">
        <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <span>📌</span> Contiguous Stack RAM Layout (4 Bytes per int)
        </h3>
        <div id="sandboxRamContainer" style="display:flex; gap:0.6rem; overflow-x:auto; padding:1rem 0;">
          <!-- Node blocks rendered here -->
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.evaluateExpr('*(arr + 2)');
  },

  setupListeners() {
    const input = document.getElementById('pointerExprInput');
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.evalFromInput();
      });
    }
  },

  evalFromInput() {
    const input = document.getElementById('pointerExprInput');
    if (input) this.evaluateExpr(input.value.trim());
  },

  evaluateExpr(exprStr) {
    const outputEl = document.getElementById('pointerEvalOutput');
    const inputEl = document.getElementById('pointerExprInput');
    if (inputEl) inputEl.value = exprStr;
    if (!outputEl) return;

    let targetIdx = 0;
    let isAddress = false;
    let isDereference = false;
    let explanation = '';

    const clean = exprStr.replace(/\s+/g, '');

    if (clean === 'arr' || clean === 'arr+0' || clean === '&arr[0]') {
      targetIdx = 0;
      isAddress = true;
      explanation = '<code>arr</code> points directly to the Base Address of the first element <code>&arr[0]</code>.';
    } else if (clean.match(/^arr\+(\d+)$/)) {
      targetIdx = parseInt(clean.match(/^arr\+(\d+)$/)[1], 10);
      isAddress = true;
      explanation = `Pointer addition: <code>Base_Address + (${targetIdx} × sizeof(int))</code>. Moves forward by ${targetIdx * 4} bytes.`;
    } else if (clean.match(/^\*\((arr\+\d+)\)$/)) {
      targetIdx = parseInt(clean.match(/\d+/)[0], 10);
      isDereference = true;
      explanation = `Dereferencing operator <code>*</code> extracts the value stored at memory location <code>arr + ${targetIdx}</code>.`;
    } else if (clean.match(/^&arr\[(\d+)\]$/)) {
      targetIdx = parseInt(clean.match(/^&arr\[(\d+)\]$/)[1], 10);
      isAddress = true;
      explanation = `Address-of operator <code>&</code> returns the exact RAM memory address of index <code>[${targetIdx}]</code>.`;
    } else if (clean.match(/^arr\[(\d+)\]$/)) {
      targetIdx = parseInt(clean.match(/^arr\[(\d+)\]$/)[1], 10);
      isDereference = true;
      explanation = `Direct array indexing <code>arr[${targetIdx}]</code> is identical to <code>*(arr + ${targetIdx})</code>.`;
    } else {
      outputEl.innerHTML = `<div style="color:var(--accent-red); font-family:var(--font-code);">Invalid expression format. Try: <code>arr + 2</code>, <code>*(arr + 2)</code>, <code>&arr[3]</code>, <code>arr[1]</code></div>`;
      return;
    }

    if (targetIdx < 0 || targetIdx >= this.sampleArray.length) {
      outputEl.innerHTML = `<div style="color:var(--accent-red); font-family:var(--font-code);">Index out of bounds! Array size is ${this.sampleArray.length}.</div>`;
      return;
    }

    const hexAddr = "0x" + (this.baseAddressHex + (targetIdx * 4)).toString(16).toUpperCase();
    const val = this.sampleArray[targetIdx];

    outputEl.innerHTML = `
      <div style="font-family:var(--font-code); font-size:1.1rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
        <span style="color:var(--secondary); font-weight:700;">${exprStr}</span>
        <span style="color:var(--text-dim);">=</span>
        <span style="color:var(--accent-amber); font-weight:800; font-size:1.3rem;">
          ${isAddress ? hexAddr : val}
        </span>
        <span class="badge ${isAddress ? 'badge-primary' : 'badge-success'}">
          ${isAddress ? 'RAM Address' : 'Stored Integer Value'}
        </span>
      </div>
      <p style="font-size:0.88rem; color:var(--text-muted); margin-top:0.6rem;">${explanation}</p>
    `;

    this.renderRamBlocks(targetIdx, isAddress);
  },

  renderRamBlocks(highlightIdx, isAddress) {
    const container = document.getElementById('sandboxRamContainer');
    if (!container) return;

    let html = '';
    this.sampleArray.forEach((val, i) => {
      const hexAddr = "0x" + (this.baseAddressHex + (i * 4)).toString(16).toUpperCase();
      const isTarget = i === highlightIdx;
      const borderStyle = isTarget ? (isAddress ? 'border-color:var(--primary); box-shadow:0 0 15px var(--primary-glow); transform:translateY(-4px);' : 'border-color:var(--accent-amber); box-shadow:0 0 15px rgba(245,158,11,0.4); transform:translateY(-4px);') : '';

      html += `
        <div style="background:var(--bg-surface); border:2px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:0.85rem; width:100px; text-align:center; transition:all 0.3s ease; ${borderStyle}">
          <div style="font-family:var(--font-code); font-weight:800; font-size:1.2rem; color:var(--text-main);">${val}</div>
          <div style="font-size:0.75rem; color:var(--text-dim); margin:0.2rem 0;">arr[${i}]</div>
          <div style="font-family:var(--font-code); font-size:0.7rem; color:var(--secondary); font-weight:700;">${hexAddr}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PointerSandbox.init();
});
