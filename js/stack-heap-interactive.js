/* ==========================================================================
   base2ace Academy - Interactive Stack vs Heap Memory Simulator
   ========================================================================== */

const StackHeapSim = {
  mode: 'heap', // 'stack' or 'heap'
  heapState: 'unallocated', // 'unallocated', 'allocated', 'reallocated', 'freed', 'nullified'
  size: 4,
  stackBaseHex: 0x7ffe00,
  heapBaseHex: 0x904010,

  init() {
    this.renderSimulator();
  },

  renderSimulator() {
    const container = document.getElementById('viewStackHeap');
    if (!container) return;

    let html = `
      <div style="background:var(--bg-card); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.75rem;">
        <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
          <span>🧱</span> Interactive Stack vs Heap RAM Allocation Simulator
        </h2>
        <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1.5rem;">
          Visualize how C manages fixed-size array allocation on the CPU Stack versus dynamic runtime allocation on the Heap pool with <code>malloc()</code>, <code>realloc()</code>, and <code>free()</code>.
        </p>

        <!-- Mode Selector Tabs -->
        <div style="display:flex; gap:0.75rem; margin-bottom:1.5rem; flex-wrap:wrap;">
          <button class="btn ${this.mode === 'heap' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="StackHeapSim.setMode('heap')">
            🌐 Dynamic Heap Allocation (malloc / free)
          </button>
          <button class="btn ${this.mode === 'stack' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="StackHeapSim.setMode('stack')">
            📌 Static Stack Allocation (int arr[N])
          </button>
        </div>

        <!-- Dynamic Controls & Action Strip -->
        <div id="stackHeapControls" style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.75rem; display:flex; align-items:center; gap:0.85rem; flex-wrap:wrap;">
          <!-- Controls rendered by mode -->
        </div>

        <!-- Visual Memory Dual Canvas (Stack vs Heap) -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.75rem;" class="viz-layout">
          
          <!-- CPU Stack Region -->
          <div style="background:rgba(15,23,42,0.9); border:1.5px solid rgba(59,130,246,0.3); border-radius:var(--radius-md); padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 style="font-size:1.05rem; font-weight:700; color:#60a5fa; display:flex; align-items:center; gap:0.4rem;">
                <span>📌</span> CPU Stack Frame (main)
              </h3>
              <span class="badge badge-primary">Stack RAM</span>
            </div>

            <div id="stackMemoryStage" style="min-height:220px; display:flex; flex-direction:column; gap:0.75rem;">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- Dynamic Heap Region -->
          <div style="background:rgba(15,23,42,0.9); border:1.5px solid rgba(6,182,212,0.3); border-radius:var(--radius-md); padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 style="font-size:1.05rem; font-weight:700; color:var(--secondary); display:flex; align-items:center; gap:0.4rem;">
                <span>🌐</span> Dynamic Heap Memory Pool
              </h3>
              <span class="badge badge-success">Heap RAM</span>
            </div>

            <div id="heapMemoryStage" style="min-height:220px; display:flex; flex-direction:column; justify-content:center; gap:0.75rem;">
              <!-- Rendered dynamically -->
            </div>
          </div>

        </div>

        <!-- C Code View & Real-Time Explanation -->
        <div style="margin-top:1.75rem; background:#090e18; border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.25rem; font-family:var(--font-code); font-size:0.88rem; line-height:1.6;" id="stackHeapCodeView">
          <!-- Synchronized code -->
        </div>

      </div>
    `;

    container.innerHTML = html;
    this.updateState();
  },

  setMode(m) {
    this.mode = m;
    this.heapState = 'unallocated';
    this.size = 4;
    this.renderSimulator();
  },

  updateState() {
    this.renderControls();
    this.renderStackStage();
    this.renderHeapStage();
    this.renderCodeView();
  },

  renderControls() {
    const controls = document.getElementById('stackHeapControls');
    if (!controls) return;

    if (this.mode === 'stack') {
      controls.innerHTML = `
        <span style="font-size:0.88rem; color:var(--text-muted);">Static stack array size fixed at compile time: <code>int arr[4] = {10, 20, 30, 40};</code></span>
        <button class="btn btn-primary btn-sm" onclick="StackHeapSim.triggerStackPush()">🔄 Re-enter Scope (Push Stack)</button>
      `;
    } else {
      let btns = '';
      if (this.heapState === 'unallocated' || this.heapState === 'freed' || this.heapState === 'nullified') {
        btns = `<button class="btn btn-primary btn-sm" onclick="StackHeapSim.allocateHeap()">⚙️ malloc(4 * sizeof(int))</button>`;
      } else if (this.heapState === 'allocated') {
        btns = `
          <button class="btn btn-accent btn-sm" onclick="StackHeapSim.reallocateHeap()">↔️ realloc(arr, 6 * sizeof(int))</button>
          <button class="btn btn-reset btn-sm" onclick="StackHeapSim.freeHeap()">🧹 free(arr)</button>
        `;
      } else if (this.heapState === 'reallocated') {
        btns = `
          <button class="btn btn-reset btn-sm" onclick="StackHeapSim.freeHeap()">🧹 free(arr)</button>
        `;
      }

      controls.innerHTML = `
        <span style="font-size:0.88rem; color:var(--text-muted);">Heap State: <strong style="color:var(--accent-amber);">${this.heapState.toUpperCase()}</strong></span>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">${btns}</div>
        ${this.heapState === 'freed' ? `<button class="btn btn-secondary btn-sm" onclick="StackHeapSim.nullifyPtr()">Set arr = NULL (Fix Dangling Pointer)</button>` : ''}
      `;
    }
  },

  renderStackStage() {
    const stack = document.getElementById('stackMemoryStage');
    if (!stack) return;

    if (this.mode === 'stack') {
      let nodes = '';
      for (let i = 0; i < 4; i++) {
        const hex = "0x" + (this.stackBaseHex + (i * 4)).toString(16).toUpperCase();
        nodes += `
          <div style="background:rgba(59,130,246,0.15); border:1.5px solid rgba(59,130,246,0.4); padding:0.6rem 1rem; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; font-family:var(--font-code); font-size:0.88rem;">
            <div><span style="color:var(--text-dim);">arr[${i}] =</span> <strong style="color:var(--text-main); font-size:1.05rem;">${(i + 1) * 10}</strong></div>
            <code style="color:#93c5fd; font-size:0.78rem;">${hex}</code>
          </div>
        `;
      }
      stack.innerHTML = `
        <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.3rem;">Array data stored directly inside Stack Frame:</div>
        ${nodes}
      `;
    } else {
      // Heap mode: Pointer variable on Stack pointing to Heap address
      let ptrVal = 'NULL';
      let statusColor = 'var(--text-dim)';
      if (this.heapState === 'allocated' || this.heapState === 'reallocated') {
        ptrVal = "0x" + this.heapBaseHex.toString(16).toUpperCase();
        statusColor = 'var(--secondary)';
      } else if (this.heapState === 'freed') {
        ptrVal = "0x" + this.heapBaseHex.toString(16).toUpperCase() + " ⚠️ DANGLING";
        statusColor = 'var(--accent-red)';
      }

      stack.innerHTML = `
        <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.3rem;">Pointer variable stored on Stack:</div>
        <div style="background:rgba(255,255,255,0.03); border:1.5px solid var(--bg-surface-border); padding:1rem; border-radius:var(--radius-md); font-family:var(--font-code);">
          <div style="color:var(--secondary); font-weight:700; font-size:0.95rem;">int *arr;</div>
          <div style="margin-top:0.5rem; font-size:0.88rem;">
            Holds Address: <code style="color:${statusColor}; font-weight:800; font-size:1.05rem;">${ptrVal}</code>
          </div>
          <div style="font-size:0.75rem; color:var(--text-dim); margin-top:0.3rem;">Stack Address of pointer 'arr': 0x7FFE00</div>
        </div>
      `;
    }
  },

  renderHeapStage() {
    const heap = document.getElementById('heapMemoryStage');
    if (!heap) return;

    if (this.mode === 'stack') {
      heap.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-dim); font-size:0.9rem;">
          🌐 Heap memory is untouched.<br>Static array <code>int arr[4]</code> resides entirely on the Stack.
        </div>
      `;
    } else {
      if (this.heapState === 'unallocated') {
        heap.innerHTML = `
          <div style="text-align:center; padding:2rem; color:var(--text-dim); font-size:0.9rem;">
            No Heap memory allocated yet.<br>Click <code>malloc()</code> to reserve bytes on the Heap pool.
          </div>
        `;
      } else if (this.heapState === 'allocated' || this.heapState === 'reallocated') {
        let count = this.heapState === 'reallocated' ? 6 : 4;
        let blocks = '';
        for (let i = 0; i < count; i++) {
          const hex = "0x" + (this.heapBaseHex + (i * 4)).toString(16).toUpperCase();
          const val = (i + 1) * 15;
          const isNew = i >= 4;

          blocks += `
            <div style="background:${isNew ? 'rgba(16,185,129,0.2)' : 'rgba(6,182,212,0.15)'}; border:1.5px solid ${isNew ? 'var(--accent-green)' : 'rgba(6,182,212,0.4)'}; padding:0.6rem 0.85rem; border-radius:var(--radius-sm); text-align:center; min-width:65px;">
              <div style="font-family:var(--font-code); font-weight:800; font-size:1.05rem; color:var(--text-main);">${val}</div>
              <div style="font-size:0.7rem; color:var(--text-dim);">arr[${i}]</div>
              <div style="font-family:var(--font-code); font-size:0.68rem; color:var(--secondary); font-weight:700;">${hex}</div>
            </div>
          `;
        }

        heap.innerHTML = `
          <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.3rem;">
            Allocated Heap Memory Block (${count} ints = ${count * 4} Bytes):
          </div>
          <div style="display:flex; gap:0.5rem; overflow-x:auto; padding:0.5rem 0;">${blocks}</div>
        `;
      } else if (this.heapState === 'freed') {
        heap.innerHTML = `
          <div style="background:rgba(239,68,68,0.1); border:1.5px solid rgba(239,68,68,0.4); padding:1.25rem; border-radius:var(--radius-md); text-align:center;">
            <div style="color:var(--accent-red); font-weight:800; font-size:1.05rem; margin-bottom:0.4rem;">⚠️ Memory Freed!</div>
            <div style="font-size:0.85rem; color:var(--text-muted);">
              <code>free(arr)</code> released Heap RAM back to OS. Pointer <code>arr</code> on Stack is now a <strong>DANGLING POINTER</strong> pointing to invalid RAM!
            </div>
          </div>
        `;
      } else if (this.heapState === 'nullified') {
        heap.innerHTML = `
          <div style="background:rgba(16,185,129,0.1); border:1.5px solid rgba(16,185,129,0.4); padding:1.25rem; border-radius:var(--radius-md); text-align:center;">
            <div style="color:var(--accent-green); font-weight:800; font-size:1.05rem; margin-bottom:0.4rem;">✅ Pointer Safe (arr = NULL)</div>
            <div style="font-size:0.85rem; color:var(--text-muted);">
              Setting <code>arr = NULL</code> prevents accidental access to freed RAM.
            </div>
          </div>
        `;
      }
    }
  },

  renderCodeView() {
    const codeView = document.getElementById('stackHeapCodeView');
    if (!codeView) return;

    if (this.mode === 'stack') {
      codeView.innerHTML = `
        <div style="color:var(--text-dim); margin-bottom:0.5rem;">// Static Stack Code Example</div>
        <div><span class="syn-kw">void</span> <span class="syn-fn">exampleStack</span>() {</div>
        <div style="padding-left:1.5rem;" class="code-line active-line">    <span class="syn-kw">int</span> arr[<span class="syn-num">4</span>] = {<span class="syn-num">10</span>, <span class="syn-num">20</span>, <span class="syn-num">30</span>, <span class="syn-num">40</span>}; <span class="syn-cmt">// 4 ints on Stack</span></div>
        <div>} <span class="syn-cmt">// Function ends ➔ arr automatically destroyed!</span></div>
      `;
    } else {
      let code = '';
      if (this.heapState === 'unallocated') {
        code = `<div><span class="syn-kw">int</span> *arr = <span class="syn-kw">NULL</span>; <span class="syn-cmt">// Unallocated pointer</span></div>`;
      } else if (this.heapState === 'allocated') {
        code = `
          <div><span class="syn-kw">int</span> *arr = (<span class="syn-kw">int</span>*) <span class="syn-fn">malloc</span>(<span class="syn-num">4</span> * <span class="syn-kw">sizeof</span>(<span class="syn-kw">int</span>)); <span class="syn-cmt">// 16 Bytes on Heap</span></div>
          <div class="code-line active-line">arr[<span class="syn-num">0</span>] = <span class="syn-num">15</span>; arr[<span class="syn-num">1</span>] = <span class="syn-num">30</span>; arr[<span class="syn-num">2</span>] = <span class="syn-num">45</span>; arr[<span class="syn-num">3</span>] = <span class="syn-num">60</span>;</div>
        `;
      } else if (this.heapState === 'reallocated') {
        code = `
          <div><span class="syn-cmt">// Resize Heap memory dynamically from 4 to 6 ints</span></div>
          <div class="code-line active-line">arr = (<span class="syn-kw">int</span>*) <span class="syn-fn">realloc</span>(arr, <span class="syn-num">6</span> * <span class="syn-kw">sizeof</span>(<span class="syn-kw">int</span>));</div>
        `;
      } else if (this.heapState === 'freed') {
        code = `
          <div class="code-line active-line"><span class="syn-fn">free</span>(arr); <span class="syn-cmt">// ⚠️ Deallocates Heap memory!</span></div>
          <div><span class="syn-cmt">// Warning: arr still holds memory address 0x904010 (Dangling Pointer)</span></div>
        `;
      } else if (this.heapState === 'nullified') {
        code = `
          <div><span class="syn-fn">free</span>(arr);</div>
          <div class="code-line active-line">arr = <span class="syn-kw">NULL</span>; <span class="syn-cmt">// ✅ Safe pointer hygiene</span></div>
        `;
      }

      codeView.innerHTML = code;
    }
  },

  allocateHeap() {
    this.heapState = 'allocated';
    this.updateState();
  },

  reallocateHeap() {
    this.heapState = 'reallocated';
    this.updateState();
  },

  freeHeap() {
    this.heapState = 'freed';
    this.updateState();
  },

  nullifyPtr() {
    this.heapState = 'nullified';
    this.updateState();
  },

  triggerStackPush() {
    this.updateState();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  StackHeapSim.init();
});
