/* ==========================================================================
   base2ace Academy - Common C Array Programs & Algorithms Module
   ========================================================================== */

const CPrograms = {
  programs: [
    {
      id: "maxMin",
      title: "🏆 Find Maximum & Minimum Element",
      desc: "Iterates through array keeping track of current max and min values in O(n) time.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      explanation: "Initialize max and min to arr[0]. Loop from index 1 to n-1, updating max if arr[i] > max and min if arr[i] < min.",
      code: [
        '<span class="syn-cmt">// Find Max and Min in an Array</span>',
        '<span class="syn-kw">#include</span> <span class="syn-str">&lt;stdio.h&gt;</span>',
        '',
        '<span class="syn-kw">void</span> <span class="syn-fn">findMaxMin</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> size) {',
        '    <span class="syn-kw">int</span> min = arr[<span class="syn-num">0</span>], max = arr[<span class="syn-num">0</span>];',
        '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">1</span>; i &lt; size; i++) {',
        '        <span class="syn-kw">if</span> (arr[i] &gt; max) max = arr[i];',
        '        <span class="syn-kw">if</span> (arr[i] &lt; min) min = arr[i];',
        '    }',
        '    <span class="syn-fn">printf</span>(<span class="syn-str">"Max = %d, Min = %d\\n"</span>, max, min);',
        '}'
      ]
    },
    {
      id: "reverse",
      title: "🔄 Reverse Array In-Place (Two Pointers)",
      desc: "Reverses an array in-place by swapping elements from start (low) and end (high) pointers.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      explanation: "Set low = 0 and high = n-1. Swap arr[low] and arr[high] while incrementing low and decrementing high until low >= high.",
      code: [
        '<span class="syn-cmt">// Reverse Array using Two Pointers</span>',
        '<span class="syn-kw">void</span> <span class="syn-fn">reverseArray</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> size) {',
        '    <span class="syn-kw">int</span> low = <span class="syn-num">0</span>, high = size - <span class="syn-num">1</span>;',
        '    <span class="syn-kw">while</span> (low &lt; high) {',
        '        <span class="syn-kw">int</span> temp = arr[low];',
        '        arr[low] = arr[high];',
        '        arr[high] = temp;',
        '        low++;',
        '        high--;',
        '    }',
        '}'
      ]
    },
    {
      id: "isSorted",
      title: "🔍 Check if Array is Sorted",
      desc: "Verifies if array elements are in non-decreasing order in O(n) time.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      explanation: "Compare every adjacent pair arr[i] and arr[i+1]. If arr[i] > arr[i+1], array is unsorted (return 0). If loop completes, return 1.",
      code: [
        '<span class="syn-cmt">// Check if Array is Sorted in Non-Decreasing Order</span>',
        '<span class="syn-kw">int</span> <span class="syn-fn">isSorted</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> size) {',
        '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i &lt; size - <span class="syn-num">1</span>; i++) {',
        '        <span class="syn-kw">if</span> (arr[i] &gt; arr[i + <span class="syn-num">1</span>]) {',
        '            <span class="syn-kw">return</span> <span class="syn-num">0</span>; <span class="syn-cmt">// Unsorted</span>',
        '        }',
        '    }',
        '    <span class="syn-kw">return</span> <span class="syn-num">1</span>; <span class="syn-cmt">// Sorted</span>',
        '}'
      ]
    },
    {
      id: "removeDupes",
      title: "✂️ Remove Duplicates from Sorted Array",
      desc: "Removes duplicates in-place from a sorted array using slow and fast pointers.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      explanation: "Use i for unique pointer and j to scan. When arr[j] != arr[i], increment i and set arr[i] = arr[j]. Returns new size i + 1.",
      code: [
        '<span class="syn-cmt">// Remove Duplicates in Sorted Array</span>',
        '<span class="syn-kw">int</span> <span class="syn-fn">removeDuplicates</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
        '    <span class="syn-kw">if</span> (n == <span class="syn-num">0</span>) <span class="syn-kw">return</span> <span class="syn-num">0</span>;',
        '    <span class="syn-kw">int</span> i = <span class="syn-num">0</span>;',
        '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> j = <span class="syn-num">1</span>; j &lt; n; j++) {',
        '        <span class="syn-kw">if</span> (arr[j] != arr[i]) {',
        '            i++;',
        '            arr[i] = arr[j];',
        '        }',
        '    }',
        '    <span class="syn-kw">return</span> i + <span class="syn-num">1</span>; <span class="syn-cmt">// New length</span>',
        '}'
      ]
    },
    {
      id: "transposeMatrix",
      title: "📐 2D Matrix Transpose (Row ➔ Column)",
      desc: "Swaps rows and columns of a 2D matrix in-place (`matrix[i][j]` ➔ `matrix[j][i]`).",
      timeComplexity: "O(N²)",
      spaceComplexity: "O(1)",
      explanation: "For an N x N matrix, loop i from 0 to N-1 and j from i+1 to N-1, swapping matrix[i][j] with matrix[j][i].",
      code: [
        '<span class="syn-cmt">// Matrix Transpose (N x N)</span>',
        '<span class="syn-kw">void</span> <span class="syn-fn">transposeMatrix</span>(<span class="syn-kw">int</span> N, <span class="syn-kw">int</span> mat[N][N]) {',
        '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i &lt; N; i++) {',
        '        <span class="syn-kw">for</span> (<span class="syn-kw">int</span> j = i + <span class="syn-num">1</span>; j &lt; N; j++) {',
        '            <span class="syn-kw">int</span> temp = mat[i][j];',
        '            mat[i][j] = mat[j][i];',
        '            mat[j][i] = temp;',
        '        }',
        '    }',
        '}'
      ]
    }
  ],

  activeProgramId: "maxMin",

  init() {
    this.renderPrograms();
  },

  renderPrograms() {
    const container = document.getElementById('cProgramsContainer');
    if (!container) return;

    let html = `
      <div style="background:var(--bg-card); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.75rem;">
        <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
          <span>💻</span> Essential C Array Programs & Algorithms Library
        </h2>
        <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1.5rem;">
          Explore standard C algorithms, view code logic, time complexity, and copy runnable C source code for exams & interviews.
        </p>

        <!-- Program Navigation Tabs -->
        <div style="display:flex; gap:0.6rem; overflow-x:auto; padding-bottom:0.75rem; border-bottom:1px solid var(--bg-surface-border); margin-bottom:1.5rem;">
    `;

    this.programs.forEach(prog => {
      const isActive = prog.id === this.activeProgramId;
      html += `
        <button class="op-tab ${isActive ? 'active' : ''}" onclick="CPrograms.selectProgram('${prog.id}')">
          ${prog.title}
        </button>
      `;
    });

    html += `
        </div>
        <div id="activeProgramContent">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.renderActiveProgramContent();
  },

  selectProgram(progId) {
    this.activeProgramId = progId;
    this.renderPrograms();
  },

  renderActiveProgramContent() {
    const container = document.getElementById('activeProgramContent');
    const prog = this.programs.find(p => p.id === this.activeProgramId);
    if (!container || !prog) return;

    let codeText = prog.code.map(l => l.replace(/<[^>]*>/g, '')).join('\n');

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">${prog.title}</h3>
          <p style="font-size:0.88rem; color:var(--text-muted); margin-top:0.2rem;">${prog.desc}</p>
        </div>
        <div style="display:flex; gap:0.6rem;">
          <span class="badge badge-success">Time: ${prog.timeComplexity}</span>
          <span class="badge badge-primary">Space: ${prog.spaceComplexity}</span>
          <button class="btn btn-secondary btn-sm" onclick="CPrograms.copyCode(\`${escape(codeText)}\`)">📋 Copy C Code</button>
        </div>
      </div>

      <!-- C Code View -->
      <div style="background:#090e18; border:1px solid rgba(59,130,246,0.3); border-radius:var(--radius-md); padding:1.25rem; font-family:var(--font-code); font-size:0.88rem; line-height:1.6; margin-bottom:1.5rem; overflow-x:auto;">
    `;

    prog.code.forEach((lineText, idx) => {
      html += `
        <div class="code-line">
          <span class="line-num" style="width:35px; color:var(--text-dim); user-select:none;">${idx + 1}</span>
          <span class="line-text">${lineText}</span>
        </div>
      `;
    });

    html += `
      </div>

      <!-- Algorithmic Explanation -->
      <div style="background:var(--bg-surface); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--bg-surface-border);">
        <h4 style="font-size:0.95rem; color:var(--secondary); margin-bottom:0.4rem; font-family:var(--font-sans);">💡 Algorithm Explanation</h4>
        <p style="font-size:0.88rem; color:var(--text-muted);">${prog.explanation}</p>
      </div>
    `;

    container.innerHTML = html;
  },

  copyCode(escapedText) {
    const rawText = unescape(escapedText);
    navigator.clipboard.writeText(rawText).then(() => {
      alert("C Code copied to clipboard!");
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CPrograms.init();
});
