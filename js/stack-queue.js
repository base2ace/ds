/* ==========================================================================
   Base2ace Technologies Education - Interactive Stacks Module Engine
   Covers LIFO, Array Stack (Fixed/Overflow/Underflow), Linked List Stack,
   Real-World Analogies, Variable Watch & Line-by-Line C Code Highlighting
   ========================================================================== */

const StackSim = {
  activeView: 'viewStackFoundations',
  mode: 'array', // 'array' or 'linkedlist'
  items: [12, 28, 45],
  capacity: 6,
  
  // Animation State
  steps: [],
  currentStepIdx: 0,
  isPlaying: false,
  playInterval: null,
  speedMs: 1200,

  init() {
    this.renderStage();
    this.renderCCode();
  },

  switchSubView(viewId) {
    this.activeView = viewId;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active-view'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active-view');

    document.querySelectorAll('.sidebar-item[data-sq-view]').forEach(item => {
      item.classList.toggle('active', item.dataset.sqView === viewId);
    });
  },

  setMode(m) {
    this.mode = m;
    document.getElementById('btnModeArray').classList.toggle('active', m === 'array');
    document.getElementById('btnModeLinkedList').classList.toggle('active', m === 'linkedlist');
    this.stopPlayback();
    this.renderStage();
    this.renderCCode();
  },

  clearAlerts() {
    const alertEl = document.getElementById('sqAlertBanner');
    if (alertEl) alertEl.style.display = 'none';
  },

  showAlert(msg, type = 'danger') {
    const alertEl = document.getElementById('sqAlertBanner');
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.className = `badge badge-${type}`;
      alertEl.style.fontSize = '0.9rem';
      alertEl.style.padding = '0.5rem 1rem';
      alertEl.style.width = '100%';
      alertEl.style.textAlign = 'center';
      alertEl.innerText = msg;
    }
  },

  // STACK OPERATIONS
  pushOp() {
    this.clearAlerts();
    const valInput = document.getElementById('sqValInput');
    const val = valInput ? parseInt(valInput.value) || 99 : 99;

    if (this.mode === 'array') {
      if (this.items.length >= this.capacity) {
        this.showAlert(`🚨 STACK OVERFLOW! Stack capacity is full (MAX = ${this.capacity}). Cannot push ${val}.`, 'danger');
        return;
      }
    }

    this.generatePushSteps(val);
  },

  popOp() {
    this.clearAlerts();
    if (this.items.length === 0) {
      this.showAlert(`⚠️ STACK UNDERFLOW! Stack is empty (top == -1). Cannot pop.`, 'danger');
      return;
    }

    this.generatePopSteps();
  },

  peekOp() {
    this.clearAlerts();
    if (this.items.length === 0) {
      this.showAlert(`ℹ️ Stack is Empty (top == -1). Peek returns NULL / Undefined.`, 'info');
      return;
    }
    const topVal = this.items[this.items.length - 1];
    this.showAlert(`👁️ PEEK / TOP: Element at top is ${topVal} [Index ${this.items.length - 1}]`, 'success');
    this.renderStage(this.items.length - 1);
  },

  // STEP GENERATOR ENGINE
  generatePushSteps(val) {
    this.stopPlayback();
    this.steps = [];

    const snapshot = (itemsArr, highlightIdx, desc, codeLineIdx, vars) => {
      return {
        items: JSON.parse(JSON.stringify(itemsArr)),
        highlightIdx: highlightIdx,
        desc: desc,
        codeLineIdx: codeLineIdx,
        vars: vars
      };
    };

    if (this.mode === 'array') {
      const tempItems = JSON.parse(JSON.stringify(this.items));
      const oldTop = tempItems.length - 1;

      // Step 1: Check isFull()
      this.steps.push(snapshot(tempItems, oldTop, `Step 1: Check isFull(): top (${oldTop}) < MAX - 1 (${this.capacity - 1})`, 1, { 'top': oldTop, 'MAX': this.capacity, 'val': val }));

      // Step 2: Increment top
      const newTop = oldTop + 1;
      this.steps.push(snapshot(tempItems, null, `Step 2: Increment top pointer: ++top (top is now ${newTop})`, 2, { 'top': newTop, 'val': val }));

      // Step 3: Insert item
      tempItems.push(val);
      this.steps.push(snapshot(tempItems, newTop, `Step 3: Assign value into stack[top]: stack[${newTop}] = ${val}. Push Complete!`, 3, { 'top': newTop, 'stack[top]': val }));

      this.items = tempItems;
    } else {
      // Linked List Stack Push
      const tempItems = JSON.parse(JSON.stringify(this.items));
      const newHex = '0x7FFE' + Math.floor(Math.random() * 80 + 10).toString(16).toUpperCase();

      this.steps.push(snapshot(tempItems, null, `Step 1: malloc(sizeof(struct Node)) created node at address ${newHex}`, 1, { 'newNode': newHex, 'val': val }));
      
      tempItems.push(val);
      const newTopIdx = tempItems.length - 1;

      this.steps.push(snapshot(tempItems, newTopIdx, `Step 2: Point newNode->next to top node`, 2, { 'newNode->data': val, 'newNode->next': 'top' }));
      this.steps.push(snapshot(tempItems, newTopIdx, `Step 3: Update top pointer: top = newNode (${newHex}). Push Complete!`, 3, { 'top': newHex, 'top->data': val }));

      this.items = tempItems;
    }

    this.currentStepIdx = 0;
    this.playSteps();
  },

  generatePopSteps() {
    this.stopPlayback();
    this.steps = [];

    const snapshot = (itemsArr, highlightIdx, desc, codeLineIdx, vars) => {
      return {
        items: JSON.parse(JSON.stringify(itemsArr)),
        highlightIdx: highlightIdx,
        desc: desc,
        codeLineIdx: codeLineIdx,
        vars: vars
      };
    };

    const tempItems = JSON.parse(JSON.stringify(this.items));
    const poppedVal = tempItems[tempItems.length - 1];
    const oldTop = tempItems.length - 1;

    // Step 1: Check isEmpty
    this.steps.push(snapshot(tempItems, oldTop, `Step 1: Check isEmpty(): top (${oldTop}) != -1`, 1, { 'top': oldTop, 'top_val': poppedVal }));

    // Step 2: Extract value & decrement top
    tempItems.pop();
    const newTop = tempItems.length - 1;
    this.steps.push(snapshot(tempItems, newTop >= 0 ? newTop : null, `Step 2: Extract stack[top] (${poppedVal}) and decrement top to ${newTop}. Pop Complete!`, 2, { 'popped': poppedVal, 'new_top': newTop }));

    this.items = tempItems;
    this.currentStepIdx = 0;
    this.playSteps();
  },

  playSteps() {
    this.isPlaying = true;
    this.updatePlaybackUI();

    this.playInterval = setInterval(() => {
      if (this.currentStepIdx >= this.steps.length - 1) {
        this.stopPlayback();
        return;
      }
      this.currentStepIdx++;
      this.renderCurrentStep();
    }, this.speedMs);

    this.renderCurrentStep();
  },

  stopPlayback() {
    this.isPlaying = false;
    if (this.playInterval) clearInterval(this.playInterval);
    this.updatePlaybackUI();
  },

  stepForward() {
    this.stopPlayback();
    if (this.currentStepIdx < this.steps.length - 1) {
      this.currentStepIdx++;
      this.renderCurrentStep();
    }
  },

  stepBack() {
    this.stopPlayback();
    if (this.currentStepIdx > 0) {
      this.currentStepIdx--;
      this.renderCurrentStep();
    }
  },

  renderCurrentStep() {
    if (this.steps.length === 0) {
      this.renderStage();
      return;
    }

    const step = this.steps[this.currentStepIdx];
    this.renderStageWithItems(step.items, step.highlightIdx);

    const stepDescEl = document.getElementById('sqStepDescBanner');
    if (stepDescEl) {
      stepDescEl.innerHTML = `<strong>Step ${this.currentStepIdx + 1} of ${this.steps.length}:</strong> ${step.desc}`;
    }

    this.renderVariableWatch(step.vars);
    this.highlightCCodeLine(step.codeLineIdx);
    this.updatePlaybackUI();
  },

  renderVariableWatch(varsObj) {
    const watchEl = document.getElementById('sqVarWatchBox');
    if (!watchEl) return;

    if (!varsObj || Object.keys(varsObj).length === 0) {
      watchEl.innerHTML = `<span style="color:var(--text-muted); font-size:0.8rem;">No active variables</span>`;
      return;
    }

    let html = `
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
        <span style="font-size:0.78rem; font-weight:700; color:var(--primary); text-transform:uppercase;">Variable Watch:</span>
    `;

    Object.keys(varsObj).forEach(key => {
      html += `
        <div style="background:var(--bg-main); border:1px solid var(--primary); padding:0.25rem 0.6rem; border-radius:var(--radius-sm); font-family:var(--font-code); font-size:0.78rem;">
          <span style="color:var(--text-muted);">${key} = </span>
          <strong style="color:var(--accent-green);">${varsObj[key]}</strong>
        </div>
      `;
    });

    html += `</div>`;
    watchEl.innerHTML = html;
  },

  highlightCCodeLine(lineIdx) {
    const codeView = document.getElementById('sqCCodeView');
    if (!codeView) return;

    const lines = codeView.querySelectorAll('.code-line');
    lines.forEach((line, idx) => {
      line.classList.toggle('active-code-line', idx + 1 === lineIdx);
    });
  },

  updatePlaybackUI() {
    const playBtn = document.getElementById('sqBtnPlayPause');
    if (playBtn) playBtn.innerHTML = this.isPlaying ? '⏸️ Pause' : '▶️ Play';

    const stepCounter = document.getElementById('sqStepCounter');
    if (stepCounter) {
      stepCounter.innerText = this.steps.length > 0 ? `Step ${this.currentStepIdx + 1} / ${this.steps.length}` : 'Ready';
    }
  },

  renderStageWithItems(itemsArr, highlightIdx = null) {
    const container = document.getElementById('sqStageContainer');
    if (!container) return;

    let html = '';

    if (this.mode === 'array') {
      html += `
        <div style="display:flex; flex-direction:column-reverse; gap:0.5rem; align-items:center; width:240px; border-bottom:4px solid var(--primary); border-left:3px solid var(--bg-surface-border); border-right:3px solid var(--bg-surface-border); padding:0.75rem 0.5rem; border-radius:0 0 var(--radius-md) var(--radius-md); min-height:240px; margin:0 auto;">
      `;

      for (let i = 0; i < this.capacity; i++) {
        const hasVal = i < itemsArr.length;
        const isTop = i === itemsArr.length - 1 && hasVal;
        const val = hasVal ? itemsArr[i] : '';
        const isHL = highlightIdx === i;

        html += `
          <div style="width:100%; height:40px; background:${isHL ? 'rgba(16,185,129,0.28)' : (hasVal ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)')}; border:1.5px solid ${isTop ? 'var(--primary)' : 'var(--bg-surface-border)'}; border-radius:var(--radius-sm); display:flex; justify-space-between; align-items:center; padding:0 0.85rem; font-family:var(--font-code); font-size:0.85rem; position:relative; box-shadow:${isHL ? '0 0 12px rgba(16,185,129,0.5)' : 'none'}; transition:all 0.3s ease;">
            <span style="color:var(--text-main); font-weight:700;">${val}</span>
            <span style="font-size:0.72rem; color:var(--text-dim);">[${i}]</span>
            ${isTop ? `<span style="position:absolute; right:-75px; background:var(--primary); color:#fff; font-size:0.72rem; font-weight:700; padding:0.2rem 0.5rem; border-radius:var(--radius-sm);">TOP ➔</span>` : ''}
          </div>
        `;
      }

      html += `</div>`;
    } else {
      // Linked List Stack Stage
      html += `<div style="display:flex; flex-direction:column; gap:0.75rem; align-items:center; width:100%; min-height:180px;">`;

      if (itemsArr.length === 0) {
        html += `<div style="color:var(--text-dim); font-family:var(--font-code); font-size:0.9rem;">top ➔ NULL (Stack Empty)</div>`;
      } else {
        for (let i = itemsArr.length - 1; i >= 0; i--) {
          const isTop = i === itemsArr.length - 1;
          const isHL = highlightIdx === i;
          const hexAddr = '0x7FFE' + (80 - i * 4).toString(16).toUpperCase();

          html += `
            <div style="display:flex; align-items:center; gap:0.75rem;">
              ${isTop ? `<div style="background:var(--primary); color:#fff; font-size:0.72rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:var(--radius-sm); font-family:var(--font-code);">top ➔</div>` : '<div style="width:50px;"></div>'}
              <div style="background:${isHL ? 'rgba(16,185,129,0.28)' : 'var(--bg-surface)'}; border:2px solid ${isHL ? 'var(--accent-green)' : 'var(--bg-surface-border)'}; border-radius:var(--radius-md); padding:0.6rem 0.85rem; display:flex; gap:0.85rem; align-items:center; min-width:160px; font-family:var(--font-code); font-size:0.85rem;">
                <span style="color:var(--text-dim); font-size:0.72rem;">${hexAddr}</span>
                <strong style="color:var(--text-main); font-size:1.05rem;">${itemsArr[i]}</strong>
                <span style="color:var(--secondary); font-size:0.72rem;">next</span>
              </div>
            </div>
          `;
        }
      }

      html += `</div>`;
    }

    container.innerHTML = html;
  },

  renderStage(highlightIdx = null) {
    this.renderStageWithItems(this.items, highlightIdx);
  },

  codeViewMode: 'snippet',

  toggleCodeViewMode(mode) {
    this.codeViewMode = mode;
    const btnSnippet = document.getElementById('sqBtnCodeSnippet');
    const btnFull = document.getElementById('sqBtnCodeFull');
    if (btnSnippet) btnSnippet.classList.toggle('active', mode === 'snippet');
    if (btnFull) btnFull.classList.toggle('active', mode === 'full');
    this.renderCCode();
  },

  copyFullCCode() {
    const codeEl = document.getElementById('sqFullCCodeText');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      const btn = document.getElementById('sqBtnCopyCCode');
      if (btn) {
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy C Code'; }, 2000);
      }
    });
  },

  renderCCode() {
    const codeContainer = document.getElementById('sqCCodeView');
    if (!codeContainer) return;

    if (this.codeViewMode === 'full') {
      this.renderFullCCode(codeContainer);
      return;
    }

    let codeLines = [];

    if (this.mode === 'array') {
      codeLines = [
        `if (top == MAX - 1) { printf("Stack Overflow\\n"); return; }`,
        `top = top + 1;`,
        `stack[top] = val;`
      ];
    } else {
      codeLines = [
        `struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));`,
        `newNode->data = val; newNode->next = top;`,
        `top = newNode;`
      ];
    }

    let codeHTML = `<div style="font-family:var(--font-code); font-size:0.85rem; line-height:1.6;">`;
    codeLines.forEach((lineText, idx) => {
      codeHTML += `<div class="code-line" style="padding:0.2rem 0.5rem; border-radius:var(--radius-sm); font-family:var(--font-code); transition:all 0.3s ease;"><span style="color:var(--text-dim); margin-right:0.75rem; user-select:none; font-size:0.75rem;">${idx + 1}</span><span style="color:var(--text-main);">${lineText}</span></div>`;
    });
    codeHTML += `</div>`;

    codeContainer.innerHTML = codeHTML;
  },

  renderFullCCode(container) {
    let fullCode = '';

    if (this.mode === 'array') {
      fullCode = `#include <stdio.h>
#include <stdlib.h>
#define MAX 5

int stack[MAX];
int top = -1; // Initial Empty Stack State

void push(int val) {
    if (top == MAX - 1) {
        printf("Stack Overflow! Cannot push %d\\n", val);
        return;
    }
    stack[++top] = val;
    printf("Pushed %d to Stack\\n", val);
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow! Stack is empty\\n");
        return -1;
    }
    int val = stack[top--];
    return val;
}

int peek() {
    if (top == -1) return -1;
    return stack[top];
}

void display() {
    if (top == -1) { printf("Stack Empty\\n"); return; }
    printf("Stack Content (Top to Bottom): ");
    for (int i = top; i >= 0; i--) printf("%d ", stack[i]);
    printf("\\n");
}

int main() {
    push(10); push(20); push(30);
    display();
    printf("Popped: %d\\n", pop());
    display();
    return 0;
}`;
    } else {
      fullCode = `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* top = NULL; // Initial Dynamic Stack State

void push(int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = top;
    top = newNode;
    printf("Pushed %d onto Dynamic Stack\\n", val);
}

int pop() {
    if (top == NULL) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    struct Node* temp = top;
    int val = temp->data;
    top = top->next;
    free(temp);
    return val;
}

int main() {
    push(15); push(30); push(45);
    printf("Popped: %d\\n", pop());
    return 0;
}`;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
        <span style="font-size:0.8rem; color:var(--accent-green); font-weight:700;">Complete Executable GCC C Source Code</span>
        <button class="btn btn-secondary btn-sm" id="sqBtnCopyCCode" onclick="StackSim.copyFullCCode()">📋 Copy C Code</button>
      </div>
      <pre id="sqFullCCodeText" style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem; font-family:var(--font-code); font-size:0.82rem; color:var(--secondary); overflow-x:auto; margin:0; line-height:1.5;"><code>${fullCode}</code></pre>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  StackSim.init();
});
