/* ==========================================================================
   base2ace Academy - Interactive C Array Quiz Engine
   ========================================================================== */

const quizData = [
  {
    question: "What is the time complexity of accessing an array element by index in C?",
    options: ["O(1) Constant Time", "O(n) Linear Time", "O(log n) Logarithmic Time", "O(n²) Quadratic Time"],
    answer: 0,
    explanation: "Because elements are stored contiguously in memory, C calculates `Address(arr[i]) = Base + i * sizeof(int)` instantly in O(1) time."
  },
  {
    question: "In C language, what happens when an array of 5 elements is declared as `int arr[5];`?",
    options: [
      "Memory cells are dynamically allocated across random RAM slots.",
      "5 contiguous 4-byte memory blocks are reserved on the Stack.",
      "The size of the array can automatically shrink or grow.",
      "Index starts at 1 instead of 0."
    ],
    answer: 1,
    explanation: "C array elements are allocated in consecutive contiguous memory locations, typically 4 bytes per integer on 32/64-bit systems."
  },
  {
    question: "Why does inserting an element at index 0 of an array take O(n) time?",
    options: [
      "Because C must re-compile the source code.",
      "Because all existing elements must be shifted one position to the right.",
      "Because array indices cannot be modified.",
      "Because memory addresses must be converted to binary."
    ],
    answer: 1,
    explanation: "To make room at index 0, every element from index 0 to n-1 must be shifted one position to the right, taking O(n) shifts."
  }
];

let userAnswers = Array(quizData.length).fill(null);

document.addEventListener('DOMContentLoaded', () => {
  renderQuiz();
});

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  let html = '';

  quizData.forEach((q, qIdx) => {
    html += `
      <div class="quiz-card" style="background:var(--bg-card); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:1.5rem;">
        <h4 style="font-size:1.05rem; margin-bottom:1rem; color:var(--text-main);">
          Q${qIdx + 1}: ${q.question}
        </h4>
        <div class="quiz-options" style="display:flex; flex-direction:column; gap:0.6rem;">
    `;

    q.options.forEach((opt, oIdx) => {
      const isSelected = userAnswers[qIdx] === oIdx;
      const btnStyle = isSelected
        ? 'background:rgba(59, 130, 246, 0.2); border-color:var(--primary); color:var(--text-main); font-weight:600;'
        : 'background:var(--bg-surface); border-color:var(--bg-surface-border); color:var(--text-muted);';

      html += `
        <button class="btn btn-secondary" style="text-align:left; justify-content:flex-start; ${btnStyle}" onclick="selectQuizOption(${qIdx}, ${oIdx})">
          <span class="badge badge-primary" style="margin-right:0.5rem;">${String.fromCharCode(65 + oIdx)}</span> ${opt}
        </button>
      `;
    });

    if (userAnswers[qIdx] !== null) {
      const isCorrect = userAnswers[qIdx] === q.answer;
      const feedbackClass = isCorrect ? 'badge-success' : 'badge-warning';
      html += `
        <div style="margin-top:1rem; padding:0.85rem; border-radius:var(--radius-md); background:rgba(255,255,255,0.03); border:1px solid var(--bg-surface-border);">
          <span class="badge ${feedbackClass}" style="margin-bottom:0.5rem;">${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</span>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.3rem;">${q.explanation}</p>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function selectQuizOption(qIdx, oIdx) {
  userAnswers[qIdx] = oIdx;
  renderQuiz();
}
