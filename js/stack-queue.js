/* ==========================================================================
   Base2ace Technologies Education - Interactive Stacks & Queues Engine
   Covers Stacks (LIFO) and Queues (FIFO) with Array, Circular & Linked List
   Simulators, Wasted Space Explanation, Variable Watch & C Code Tracker
   ========================================================================== */

const StackQueueEngine = {
  mainTab: 'stack', // 'stack' or 'queue'
  activeView: 'viewQueueFoundations',
  
  // Stack State
  stackMode: 'array', // 'array' or 'linkedlist'
  stackItems: [12, 28, 45],
  stackCapacity: 6,

  // Queue State
  queueMode: 'linear', // 'linear', 'circular', or 'linkedlist'
  queueItems: [10, 25, 40],
  queueCapacity: 6,
  frontPtr: 0,
  rearPtr: 2,

  // Animation State
  steps: [],
  currentStepIdx: 0,
  isPlaying: false,
  playInterval: null,
  speedMs: 1200,

  init() {
    this.renderQueueStage();
    this.renderCCode();
  },

  setMainTab(tabKey) {
    this.mainTab = tabKey;
    document.getElementById('tabNavStack').classList.toggle('active', tabKey === 'stack');
    document.getElementById('tabNavQueue').classList.toggle('active', tabKey === 'queue');

    const stackSection = document.getElementById('sectionStackModule');
    const queueSection = document.getElementById('sectionQueueModule');
    if (stackSection) stackSection.style.display = tabKey === 'stack' ? 'block' : 'none';
    if (queueSection) queueSection.style.display = tabKey === 'queue' ? 'block' : 'none';

    this.stopPlayback();
    if (tabKey === 'queue') {
      this.renderQueueStage();
    } else if (typeof StackSim !== 'undefined') {
      StackSim.renderStage();
    }
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

  setQueueMode(m) {
    this.queueMode = m;
    const btnLinear = document.getElementById('btnQModeLinear');
    const btnCircular = document.getElementById('btnQModeCircular');
    const btnLL = document.getElementById('btnQModeLL');
    if (btnLinear) btnLinear.classList.toggle('active', m === 'linear');
    if (btnCircular) btnCircular.classList.toggle('active', m === 'circular');
    if (btnLL) btnLL.classList.toggle('active', m === 'linkedlist');

    this.stopPlayback();
    this.clearAlerts();
    this.renderQueueStage();
    this.renderCCode();
  },

  clearAlerts() {
    const alertEl = document.getElementById('qAlertBanner');
    if (alertEl) alertEl.style.display = 'none';
  },

  showAlert(msg, type = 'danger') {
    const alertEl = document.getElementById('qAlertBanner');
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.className = `badge badge-${type}`;
      alertEl.style.fontSize = '0.9rem';
      alertEl.style.padding = '0.55rem 1rem';
      alertEl.style.width = '100%';
      alertEl.style.textAlign = 'center';
      alertEl.innerText = msg;
    }
  },

  // QUEUE OPERATIONS
  enqueueOp() {
    this.clearAlerts();
    const valInput = document.getElementById('qValInput');
    const val = valInput ? parseInt(valInput.value) || 99 : 99;

    if (this.queueMode === 'linear') {
      if (this.rearPtr >= this.queueCapacity - 1) {
        if (this.frontPtr > 0) {
          this.showAlert(`🚨 WASTED SPACE OVERFLOW! rear reached MAX-1 (${this.queueCapacity-1}), but front is at ${this.frontPtr}. Slots 0..${this.frontPtr-1} are wasted! Solution: Circular Queue or Shift!`, 'danger');
        } else {
          this.showAlert(`🚨 QUEUE OVERFLOW! Queue is full (rear == MAX - 1). Cannot enqueue ${val}.`, 'danger');
        }
        return;
      }
    } else if (this.queueMode === 'circular') {
      if ((this.rearPtr + 1) % this.queueCapacity === this.frontPtr && this.queueItems.length > 0) {
        this.showAlert(`🚨 CIRCULAR QUEUE OVERFLOW! (rear + 1) % MAX == front. Queue capacity full (${this.queueCapacity}).`, 'danger');
        return;
      }
    }

    this.generateEnqueueSteps(val);
  },

  dequeueOp() {
    this.clearAlerts();
    if (this.queueItems.length === 0) {
      this.showAlert(`⚠️ QUEUE UNDERFLOW! Queue is empty (front > rear or items == 0). Cannot dequeue.`, 'danger');
      return;
    }

    this.generateDequeueSteps();
  },

  frontOp() {
    this.clearAlerts();
    if (this.queueItems.length === 0) {
      this.showAlert(`ℹ️ Queue is Empty. Front pointer returns NULL / Undefined.`, 'info');
      return;
    }
    const frontVal = this.queueItems[0];
    this.showAlert(`👁️ FRONT PEEK: Element at Front is ${frontVal} [Index ${this.frontPtr}]`, 'success');
    this.renderQueueStage(0);
  },

  rearOp() {
    this.clearAlerts();
    if (this.queueItems.length === 0) {
      this.showAlert(`ℹ️ Queue is Empty. Rear pointer returns NULL / Undefined.`, 'info');
      return;
    }
    const rearVal = this.queueItems[this.queueItems.length - 1];
    this.showAlert(`🎯 REAR PEEK: Element at Rear is ${rearVal} [Index ${this.rearPtr}]`, 'success');
    this.renderQueueStage(this.queueItems.length - 1);
  },

  // STEP GENERATOR ENGINE FOR QUEUE
  generateEnqueueSteps(val) {
    this.stopPlayback();
    this.steps = [];

    const snapshot = (itemsArr, frontP, rearP, highlightIdx, desc, codeLineIdx, vars) => {
      return {
        items: JSON.parse(JSON.stringify(itemsArr)),
        frontP: frontP,
        rearP: rearP,
        highlightIdx: highlightIdx,
        desc: desc,
        codeLineIdx: codeLineIdx,
        vars: vars
      };
    };

    if (this.queueMode === 'linear') {
      const tempItems = JSON.parse(JSON.stringify(this.queueItems));
      const oldRear = this.rearPtr;
      const oldFront = this.frontPtr;

      // Step 1: Check isFull
      this.steps.push(snapshot(tempItems, oldFront, oldRear, null, `Step 1: Check isFull(): rear (${oldRear}) < MAX - 1 (${this.queueCapacity - 1})`, 1, { 'front': oldFront, 'rear': oldRear, 'val': val }));

      // Step 2: Increment rear pointer
      const newRear = oldRear + 1;
      this.steps.push(snapshot(tempItems, oldFront, newRear, null, `Step 2: Increment rear pointer: ++rear (rear is now ${newRear})`, 2, { 'front': oldFront, 'rear': newRear }));

      // Step 3: Insert item
      tempItems.push(val);
      this.steps.push(snapshot(tempItems, oldFront, newRear, tempItems.length - 1, `Step 3: Assign value at queue[rear]: queue[${newRear}] = ${val}. Enqueue Complete!`, 3, { 'rear': newRear, 'queue[rear]': val }));

      this.queueItems = tempItems;
      this.rearPtr = newRear;

    } else if (this.queueMode === 'circular') {
      const tempItems = JSON.parse(JSON.stringify(this.queueItems));
      const oldRear = this.rearPtr;
      const newRear = (oldRear + 1) % this.queueCapacity;

      this.steps.push(snapshot(tempItems, this.frontPtr, oldRear, null, `Step 1: Circular modulo math: rear = (rear + 1) % MAX = (${oldRear}+1)%${this.queueCapacity} = ${newRear}`, 1, { 'rear': newRear, 'val': val }));
      
      tempItems.push(val);
      this.steps.push(snapshot(tempItems, this.frontPtr, newRear, tempItems.length - 1, `Step 2: Insert item into circular ring at index ${newRear}. Enqueue Complete!`, 2, { 'rear': newRear, 'queue[rear]': val }));

      this.queueItems = tempItems;
      this.rearPtr = newRear;

    } else {
      // Linked List Queue
      const tempItems = JSON.parse(JSON.stringify(this.queueItems));
      const newHex = '0x7FFE' + Math.floor(Math.random() * 80 + 10).toString(16).toUpperCase();

      this.steps.push(snapshot(tempItems, 0, tempItems.length - 1, null, `Step 1: malloc(sizeof(struct Node)) created node at ${newHex}`, 1, { 'newNode': newHex, 'val': val }));
      
      tempItems.push(val);
      const newRearIdx = tempItems.length - 1;

      this.steps.push(snapshot(tempItems, 0, newRearIdx, newRearIdx, `Step 2: Attach to rear: rear->next = newNode; rear = newNode (${newHex}). Enqueue Complete!`, 2, { 'rear': newHex, 'rear->data': val }));

      this.queueItems = tempItems;
    }

    this.currentStepIdx = 0;
    this.playSteps();
  },

  generateDequeueSteps() {
    this.stopPlayback();
    this.steps = [];

    const snapshot = (itemsArr, frontP, rearP, highlightIdx, desc, codeLineIdx, vars) => {
      return {
        items: JSON.parse(JSON.stringify(itemsArr)),
        frontP: frontP,
        rearP: rearP,
        highlightIdx: highlightIdx,
        desc: desc,
        codeLineIdx: codeLineIdx,
        vars: vars
      };
    };

    const tempItems = JSON.parse(JSON.stringify(this.queueItems));
    const dequeuedVal = tempItems.shift();
    const oldFront = this.frontPtr;

    if (this.queueMode === 'linear') {
      const newFront = oldFront + 1;
      this.steps.push(snapshot(tempItems, oldFront, this.rearPtr, 0, `Step 1: Extract queue[front] (${dequeuedVal})`, 1, { 'front': oldFront, 'dequeued': dequeuedVal }));
      this.steps.push(snapshot(tempItems, newFront, this.rearPtr, null, `Step 2: Advance front pointer: ++front (front is now ${newFront}). Wasted slots: 0..${oldFront}. Dequeue Complete!`, 2, { 'front': newFront, 'rear': this.rearPtr }));
      
      this.frontPtr = newFront;
    } else {
      this.steps.push(snapshot(tempItems, 0, tempItems.length - 1, null, `Step 1: Extract & free node (${dequeuedVal}) from Front. Dequeue Complete!`, 2, { 'dequeued': dequeuedVal }));
    }

    this.queueItems = tempItems;
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
      this.renderQueueStage();
      return;
    }

    const step = this.steps[this.currentStepIdx];
    this.renderQueueStageWithItems(step.items, step.frontP, step.rearP, step.highlightIdx);

    const stepDescEl = document.getElementById('qStepDescBanner');
    if (stepDescEl) {
      stepDescEl.innerHTML = `<strong>Step ${this.currentStepIdx + 1} of ${this.steps.length}:</strong> ${step.desc}`;
    }

    this.renderVariableWatch(step.vars);
    this.highlightCCodeLine(step.codeLineIdx);
    this.updatePlaybackUI();
  },

  renderVariableWatch(varsObj) {
    const watchEl = document.getElementById('qVarWatchBox');
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
    const codeView = document.getElementById('qCCodeView');
    if (!codeView) return;

    const lines = codeView.querySelectorAll('.code-line');
    lines.forEach((line, idx) => {
      line.classList.toggle('active-code-line', idx + 1 === lineIdx);
    });
  },

  updatePlaybackUI() {
    const playBtn = document.getElementById('qBtnPlayPause');
    if (playBtn) playBtn.innerHTML = this.isPlaying ? '⏸️ Pause' : '▶️ Play';

    const stepCounter = document.getElementById('qStepCounter');
    if (stepCounter) {
      stepCounter.innerText = this.steps.length > 0 ? `Step ${this.currentStepIdx + 1} / ${this.steps.length}` : 'Ready';
    }
  },

  renderQueueStageWithItems(itemsArr, frontP, rearP, highlightIdx = null) {
    const container = document.getElementById('qStageContainer');
    if (!container) return;

    let html = '';

    if (this.queueMode === 'linear') {
      html += `
        <div style="display:flex; flex-direction:column; gap:1.25rem; width:100%;">
          
          <!-- Queue Track Stage -->
          <div style="display:flex; gap:0.6rem; align-items:center; overflow-x:auto; padding:2rem 0.75rem; border-bottom:3px solid var(--secondary); border-top:3px solid var(--secondary); border-radius:var(--radius-md); background:rgba(0,0,0,0.2);">
      `;

      for (let i = 0; i < this.queueCapacity; i++) {
        const isWasted = i < frontP;
        const arrayIdx = i - frontP;
        const hasVal = arrayIdx >= 0 && arrayIdx < itemsArr.length;
        const isFront = i === frontP && hasVal;
        const isRear = i === rearP && hasVal;
        const val = hasVal ? itemsArr[arrayIdx] : (isWasted ? '❌' : '');
        const isHL = highlightIdx === arrayIdx;

        let badge = '';
        if (isFront && isRear) badge = 'FRONT & REAR';
        else if (isFront) badge = 'FRONT ⬇';
        else if (isRear) badge = 'REAR ⬇';
        else if (isWasted) badge = 'WASTED SLOT';

        html += `
          <div style="min-width:85px; height:85px; background:${isWasted ? 'rgba(239,68,68,0.12)' : (isHL ? 'rgba(16,185,129,0.28)' : (hasVal ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)'))}; border:2px solid ${isWasted ? 'var(--accent-red)' : (isFront ? 'var(--accent-green)' : (isRear ? 'var(--primary)' : 'var(--bg-surface-border)'))}; border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:var(--font-code); position:relative; box-shadow:${isHL ? '0 0 14px rgba(16,185,129,0.5)' : 'none'}; transition:all 0.3s ease; flex-shrink:0;">
            ${badge ? `<div style="position:absolute; top:-26px; font-size:0.7rem; font-weight:800; color:${isWasted ? 'var(--accent-red)' : (isFront ? 'var(--accent-green)' : 'var(--primary)')}; font-family:var(--font-sans); white-space:nowrap;">${badge}</div>` : ''}
            <span style="color:${isWasted ? 'var(--accent-red)' : 'var(--text-main)'}; font-weight:800; font-size:1.15rem;">${val}</span>
            <span style="font-size:0.7rem; color:var(--text-dim); margin-top:0.2rem;">Index [${i}]</span>
          </div>
        `;
      }

      html += `
          </div>

          <!-- Wasted Space Explanation Box -->
          ${frontP > 0 ? `
            <div style="background:rgba(239,68,68,0.12); border:1px solid var(--accent-red); padding:0.85rem 1.1rem; border-radius:var(--radius-md); color:var(--text-main); font-size:0.88rem; line-height:1.5;">
              <strong style="color:var(--accent-red);">⚠️ Linear Queue Wasted Space Problem:</strong> 
              Slots <code>[0..${frontP - 1}]</code> are wasted! Notice how <code>front</code> moved to index <code>${frontP}</code> after dequeues. Even though there are ${frontP} empty slots at the beginning, <code>rear</code> cannot wrap around without <strong>Circular Queue</strong> or shifting elements!
            </div>
          ` : ''}

        </div>
      `;
    } else if (this.queueMode === 'circular') {
      // Circular Queue Representation
      html += `
        <div style="display:flex; flex-direction:column; align-items:center; gap:1.25rem; width:100%;">
          <div style="font-size:0.9rem; color:var(--accent-green); font-weight:700;">🔄 Circular Queue Modulo Ring: Index = (rear + 1) % MAX</div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center; padding:1.25rem; background:rgba(0,0,0,0.2); border:2px dashed var(--accent-green); border-radius:var(--radius-lg); width:100%;">
      `;

      for (let i = 0; i < this.queueCapacity; i++) {
        const hasVal = i < itemsArr.length;
        const isFront = i === this.frontPtr && hasVal;
        const isRear = i === this.rearPtr && hasVal;
        const val = hasVal ? itemsArr[i] : '';

        html += `
          <div style="width:80px; height:80px; border-radius:50%; background:${hasVal ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.03)'}; border:2px solid ${isFront ? 'var(--accent-green)' : (isRear ? 'var(--primary)' : 'var(--bg-surface-border)')}; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:var(--font-code); position:relative;">
            <span style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${val}</span>
            <span style="font-size:0.68rem; color:var(--text-dim);">[${i}]</span>
            ${isFront ? `<span style="position:absolute; top:-22px; font-size:0.65rem; color:var(--accent-green); font-weight:800;">FRONT</span>` : ''}
            ${isRear ? `<span style="position:absolute; bottom:-22px; font-size:0.65rem; color:var(--primary); font-weight:800;">REAR</span>` : ''}
          </div>
        `;
      }

      html += `</div></div>`;
    } else {
      // Linked List Queue Stage
      html += `<div style="display:flex; align-items:center; gap:0.6rem; overflow-x:auto; padding:1.5rem 0.75rem; width:100%;">`;

      if (itemsArr.length === 0) {
        html += `<div style="color:var(--text-dim); font-family:var(--font-code); font-size:0.9rem;">front ➔ NULL | rear ➔ NULL (Queue Empty)</div>`;
      } else {
        html += `
          <div style="background:rgba(16,185,129,0.18); border:1.5px solid var(--accent-green); padding:0.55rem 0.85rem; border-radius:var(--radius-md); text-align:center; font-family:var(--font-code); font-size:0.8rem; font-weight:700; color:var(--accent-green); flex-shrink:0;">
            front ➔
          </div>
        `;

        for (let i = 0; i < itemsArr.length; i++) {
          const isRear = i === itemsArr.length - 1;
          const isHL = highlightIdx === i;
          const hexAddr = '0x7FFE' + (10 + i * 14).toString(16).toUpperCase();

          html += `
            <div style="background:${isHL ? 'rgba(16,185,129,0.28)' : 'var(--bg-surface)'}; border:2px solid ${isHL ? 'var(--accent-green)' : 'var(--bg-surface-border)'}; border-radius:var(--radius-md); padding:0.75rem 0.85rem; display:flex; flex-direction:column; gap:0.35rem; min-width:135px; flex-shrink:0; font-family:var(--font-code);">
              <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-dim);">
                <span>Node #${i+1}</span>
                <span>${hexAddr}</span>
              </div>
              <div style="background:var(--bg-main); padding:0.4rem; text-align:center; font-size:1.1rem; font-weight:800; color:var(--text-main); border-radius:4px;">
                ${itemsArr[i]}
              </div>
              <div style="font-size:0.7rem; color:var(--secondary); text-align:center;">
                ${isRear ? '<strong style="color:var(--primary);">rear node</strong>' : 'next'}
              </div>
            </div>
          `;

          if (i < itemsArr.length - 1) {
            html += `<div style="color:var(--secondary); font-size:1.2rem; font-weight:800; flex-shrink:0;">➔</div>`;
          } else {
            html += `<div style="color:var(--text-dim); font-size:0.9rem; flex-shrink:0;">➔ NULL</div>`;
          }
        }
      }

      html += `</div>`;
    }

    container.innerHTML = html;
  },

  renderQueueStage(highlightIdx = null) {
    this.renderQueueStageWithItems(this.queueItems, this.frontPtr, this.rearPtr, highlightIdx);
  },

  codeViewMode: 'snippet',

  toggleCodeViewMode(mode) {
    this.codeViewMode = mode;
    const btnSnippet = document.getElementById('qBtnCodeSnippet');
    const btnFull = document.getElementById('qBtnCodeFull');
    if (btnSnippet) btnSnippet.classList.toggle('active', mode === 'snippet');
    if (btnFull) btnFull.classList.toggle('active', mode === 'full');
    this.renderCCode();
  },

  copyFullCCode() {
    const codeEl = document.getElementById('qFullCCodeText');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      const btn = document.getElementById('qBtnCopyCCode');
      if (btn) {
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy C Code'; }, 2000);
      }
    });
  },

  renderCCode() {
    const codeContainer = document.getElementById('qCCodeView');
    if (!codeContainer) return;

    if (this.codeViewMode === 'full') {
      this.renderFullCCode(codeContainer);
      return;
    }

    let codeLines = [];

    if (this.queueMode === 'linear') {
      codeLines = [
        `if (rear == MAX - 1) { printf("Queue Overflow\\n"); return; }`,
        `rear = rear + 1;`,
        `queue[rear] = val;`
      ];
    } else if (this.queueMode === 'circular') {
      codeLines = [
        `if ((rear + 1) % MAX == front) { printf("Circular Queue Overflow\\n"); return; }`,
        `rear = (rear + 1) % MAX;`,
        `queue[rear] = val;`
      ];
    } else {
      codeLines = [
        `struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));`,
        `newNode->data = val; newNode->next = NULL;`,
        `rear->next = newNode; rear = newNode;`
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

    if (this.queueMode === 'linear') {
      fullCode = `#include <stdio.h>
#include <stdlib.h>
#define MAX 5

int queue[MAX];
int front = -1, rear = -1; // Initial Empty State

void enqueue(int val) {
    if (rear == MAX - 1) {
        printf("Queue Overflow! Cannot enqueue %d\\n", val);
        return;
    }
    if (front == -1) front = 0;
    queue[++rear] = val;
    printf("Enqueued %d\\n", val);
}

int dequeue() {
    if (front == -1 || front > rear) {
        printf("Queue Underflow!\\n");
        return -1;
    }
    int val = queue[front++];
    return val;
}

int peekFront() {
    if (front == -1 || front > rear) return -1;
    return queue[front];
}

void display() {
    if (front == -1 || front > rear) { printf("Queue Empty\\n"); return; }
    printf("Queue Contents: ");
    for (int i = front; i <= rear; i++) printf("%d ", queue[i]);
    printf("\\n");
}

int main() {
    enqueue(10); enqueue(20); enqueue(30);
    display();
    printf("Dequeued: %d\\n", dequeue());
    display();
    return 0;
}`;
    } else if (this.queueMode === 'circular') {
      fullCode = `#include <stdio.h>
#include <stdlib.h>
#define MAX 5

int cqueue[MAX];
int front = -1, rear = -1;

void enqueue(int val) {
    if ((rear + 1) % MAX == front) {
        printf("Circular Queue Overflow!\\n");
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % MAX;
    cqueue[rear] = val;
    printf("Enqueued %d into Circular Queue\\n", val);
}

int dequeue() {
    if (front == -1) {
        printf("Circular Queue Underflow!\\n");
        return -1;
    }
    int val = cqueue[front];
    if (front == rear) { front = -1; rear = -1; }
    else front = (front + 1) % MAX;
    return val;
}

int main() {
    enqueue(10); enqueue(20); enqueue(30); enqueue(40);
    printf("Dequeued: %d\\n", dequeue());
    enqueue(50); // Reuses index 0!
    return 0;
}`;
    } else {
      fullCode = `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node *front = NULL, *rear = NULL;

void enqueue(int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = NULL;
    if (rear == NULL) {
        front = rear = newNode;
        return;
    }
    rear->next = newNode;
    rear = newNode;
}

int dequeue() {
    if (front == NULL) return -1;
    struct Node* temp = front;
    int val = temp->data;
    front = front->next;
    if (front == NULL) rear = NULL;
    free(temp);
    return val;
}

int main() {
    enqueue(100); enqueue(200); enqueue(300);
    printf("Dequeued from Dynamic Linked List Queue: %d\\n", dequeue());
    return 0;
}`;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
        <span style="font-size:0.8rem; color:var(--accent-green); font-weight:700;">Complete Executable GCC C Source Code</span>
        <button class="btn btn-secondary btn-sm" id="qBtnCopyCCode" onclick="StackQueueEngine.copyFullCCode()">📋 Copy C Code</button>
      </div>
      <pre id="qFullCCodeText" style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem; font-family:var(--font-code); font-size:0.82rem; color:var(--secondary); overflow-x:auto; margin:0; line-height:1.5;"><code>${fullCode}</code></pre>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  StackQueueEngine.init();
});
