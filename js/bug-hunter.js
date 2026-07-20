/* ==========================================================================
   base2ace Academy - Interactive C Bug Hunter Module
   ========================================================================== */

const BugHunter = {
  bugs: [
    {
      title: "🐛 Bug #1: Array Index Out of Bounds (Buffer Overflow)",
      desc: "In C, accessing an index at or beyond `size` reads memory outside the allocated array stack frame.",
      code: [
        '<span class="syn-kw">int</span> arr[<span class="syn-num">5</span>] = {<span class="syn-num">10</span>, <span class="syn-num">20</span>, <span class="syn-num">30</span>, <span class="syn-num">40</span>, <span class="syn-num">50</span>};',
        '<span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i &lt;= <span class="syn-num">5</span>; i++) { <span class="syn-cmt">// ⚠️ BUG: i <= 5 accesses index 5!</span>',
        '    <span class="syn-fn">printf</span>(<span class="syn-str">"%d "</span>, arr[i]);',
        '}'
      ],
      question: "Why does `arr[5]` cause Undefined Behavior in C?",
      options: [
        "Because C arrays use 1-based indexing.",
        "Because `arr[5]` is the 6th element, accessing memory beyond allocated 5 ints.",
        "Because `for` loops cannot use `<=` in C.",
        "Because `int` variables cannot hold values over 50."
      ],
      correct: 1,
      explanation: "For an array of size 5, valid indices are 0, 1, 2, 3, and 4. `arr[5]` attempts to read memory beyond the array boundary."
    },
    {
      title: "⚠️ Bug #2: Uninitialized Array Garbage Values",
      desc: "Unlike Java or C#, local C arrays declared on the stack are NOT initialized to zero automatically.",
      code: [
        '<span class="syn-kw">int</span> arr[<span class="syn-num">5</span>]; <span class="syn-cmt">// Stack allocation without initialization</span>',
        '<span class="syn-fn">printf</span>(<span class="syn-str">"%d\\n"</span>, arr[<span class="syn-num">2</span>]); <span class="syn-cmt">// ⚠️ What is printed?</span>'
      ],
      question: "What value will `printf(\"%d\", arr[2])` display?",
      options: [
        "Always 0.",
        "A unpredictable 'Garbage Value' leftover in that RAM memory address.",
        "Null.",
        "Compilation Error."
      ],
      correct: 1,
      explanation: "Uninitialized stack variables contain leftover bit patterns (garbage data) from whatever previously used that RAM address."
    }
  ],

  init() {
    this.renderBugHunter();
  },

  renderBugHunter() {
    const container = document.getElementById('bugHunterContainer');
    if (!container) return;

    let html = `
      <div style="background:var(--bg-card); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.75rem; margin-bottom:2rem;">
        <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
          <span>🐛</span> C Array Bug Hunter & Pitfalls Playground
        </h2>
        <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1.5rem;">
          Analyze common C programming bugs below. Inspect memory behavior and test your debugging skills!
        </p>

        <div style="display:flex; flex-direction:column; gap:1.75rem;">
    `;

    this.bugs.forEach((b, idx) => {
      html += `
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.5rem;">
          <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;">${b.title}</h3>
          <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem;">${b.desc}</p>

          <!-- Code Snippet Box -->
          <div style="background:#090e18; border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-md); padding:1rem; font-family:var(--font-code); font-size:0.85rem; margin-bottom:1.25rem;">
      `;

      b.code.forEach(line => {
        html += `<div style="padding:0.15rem 0;">${line}</div>`;
      });

      html += `
          </div>

          <!-- Interactive Question -->
          <div style="font-weight:700; font-size:0.95rem; margin-bottom:0.75rem; color:#93c5fd;">${b.question}</div>
          <div style="display:flex; flex-direction:column; gap:0.5rem;" id="bugOptions_${idx}">
      `;

      b.options.forEach((opt, oIdx) => {
        html += `
          <button class="btn btn-secondary" style="text-align:left; justify-content:flex-start;" onclick="BugHunter.answerBug(${idx}, ${oIdx})">
            <span class="badge badge-primary" style="margin-right:0.5rem;">${String.fromCharCode(65 + oIdx)}</span> ${opt}
          </button>
        `;
      });

      html += `
          </div>
          <div id="bugFeedback_${idx}" style="margin-top:1rem;"></div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  answerBug(bugIdx, optionIdx) {
    const bug = this.bugs[bugIdx];
    const feedbackEl = document.getElementById(`bugFeedback_${bugIdx}`);
    if (!bug || !feedbackEl) return;

    const isCorrect = optionIdx === bug.correct;
    feedbackEl.innerHTML = `
      <div style="padding:0.85rem 1rem; border-radius:var(--radius-md); background:${isCorrect ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'}; border:1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}; font-size:0.9rem;">
        <div style="font-weight:700; color:${isCorrect ? 'var(--accent-green)' : 'var(--accent-amber)'}; margin-bottom:0.3rem;">
          ${isCorrect ? '🎉 Correct Debugger Analysis!' : '❌ Incorrect Selection'}
        </div>
        <div style="color:var(--text-muted);">${bug.explanation}</div>
      </div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  BugHunter.init();
});
