/* ==========================================================================
   Base2ace Technologies Education - Interactive Stacks & Queues Engine
   Dual Module: Covers Both Stacks (LIFO) and Queues (FIFO)
   ========================================================================== */

const StackQueueEngine = {
  activeView: 'viewStackFoundations',
  
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
    this.renderStackStage();
    this.renderQueueStage();
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

    if (viewId === 'viewStackSim') {
      this.renderStackStage();
      this.renderCCode();
    } else if (viewId === 'viewQueueSim') {
      this.renderQueueStage();
      this.renderCCode();
    }
  },

  setStackMode(m) {
    this.stackMode = m;
    const btnArray = document.getElementById('btnSModeArray');
    const btnLL = document.getElementById('btnSModeLL');
    if (btnArray) btnArray.classList.toggle('active', m === 'array');
    if (btnLL) btnLL.classList.toggle('active', m === 'linkedlist');

    this.stopPlayback();
    this.clearAlerts('sAlertBanner');
    this.renderStackStage();
    this.renderCCode();
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
    this.clearAlerts('qAlertBanner');
    this.renderQueueStage();
    this.renderCCode();
  },

  clearAlerts(bannerId) {
    const alertEl = document.getElementById(bannerId);
    if (alertEl) alertEl.style.display = 'none';
  },

  showAlert(bannerId, msg, type = 'danger') {
    const alertEl = document.getElementById(bannerId);
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

  // STACK OPERATIONS
  pushOp() {
    this.clearAlerts('sAlertBanner');
    const valInput = document.getElementById('sValInput');
    const val = valInput ? parseInt(valInput.value) || 99 : 99;

    if (this.stackMode === 'array') {
      if (this.stackItems.length >= this.stackCapacity) {
        this.showAlert('sAlertBanner', `🚨 STACK OVERFLOW! Stack capacity is full (MAX = ${this.stackCapacity}). Cannot push ${val}.`, 'danger');
        return;
      }
    }

    this.generatePushSteps(val);
  },

  popOp() {
    this.clearAlerts('sAlertBanner');
    if (this.stackItems.length === 0) {
      this.showAlert('sAlertBanner', `⚠️ STACK UNDERFLOW! Stack is empty (top == -1). Cannot pop.`, 'danger');
      return;
    }

    this.generatePopSteps();
  },

  peekStackOp() {
    this.clearAlerts('sAlertBanner');
    if (this.stackItems.length === 0) {
      this.showAlert('sAlertBanner', `ℹ️ Stack is Empty (top == -1). Peek returns NULL / Undefined.`, 'info');
      return;
    }
    const topVal = this.stackItems[this.stackItems.length - 1];
    this.showAlert('sAlertBanner', `👁️ PEEK / TOP: Element at top is ${topVal} [Index ${this.stackItems.length - 1}]`, 'success');
    this.renderStackStage(this.stackItems.length - 1);
  },

  // QUEUE OPERATIONS
  enqueueOp() {
    this.clearAlerts('qAlertBanner');
    const valInput = document.getElementById('qValInput');
    const val = valInput ? parseInt(valInput.value) || 88 : 88;

    if (this.queueMode === 'linear') {
      if (this.rearPtr >= this.queueCapacity - 1) {
        if (this.frontPtr > 0) {
          this.showAlert('qAlertBanner', `🚨 WASTED SPACE OVERFLOW! rear reached MAX-1 (${this.queueCapacity-1}), but front is at ${this.frontPtr}. Slots 0..${this.frontPtr-1} are wasted! Solution: Circular Queue!`, 'danger');
        } else {
          this.showAlert('qAlertBanner', `🚨 QUEUE OVERFLOW! Queue is full (rear == MAX - 1). Cannot enqueue ${val}.`, 'danger');
        }
        return;
      }
    } else if (this.queueMode === 'circular') {
      if ((this.rearPtr + 1) % this.queueCapacity === this.frontPtr && this.queueItems.length > 0) {
        this.showAlert('qAlertBanner', `🚨 CIRCULAR QUEUE OVERFLOW! (rear + 1) % MAX == front. Queue capacity full (${this.queueCapacity}).`, 'danger');
        return;
      }
    }

    this.generateEnqueueSteps(val);
  },

  dequeueOp() {
    this.clearAlerts('qAlertBanner');
    if (this.queueItems.length === 0) {
      this.showAlert('qAlertBanner', `⚠️ QUEUE UNDERFLOW! Queue is empty. Cannot dequeue.`, 'danger');
      return;
    }

    this.generateDequeueSteps();
  },

  frontOp() {
    this.clearAlerts('qAlertBanner');
    if (this.queueItems.length === 0) {
      this.showAlert('qAlertBanner', `ℹ️ Queue is Empty. Front returns NULL / Undefined.`, 'info');
      return;
    }
    const frontVal = this.queueItems[0];
    this.showAlert('qAlertBanner', `👁️ FRONT PEEK: Element at Front is ${frontVal} [Index ${this.frontPtr}]`, 'success');
    this.renderQueueStage(0);
  },

  rearOp() {
    this.clearAlerts('qAlertBanner');
    if (this.queueItems.length === 0) {
      this.showAlert('qAlertBanner', `ℹ️ Queue is Empty. Rear returns NULL / Undefined.`, 'info');
      return;
    }
    const rearVal = this.queueItems[this.queueItems.length - 1];
    this.showAlert('qAlertBanner', `🎯 REAR PEEK: Element at Rear is ${rearVal} [Index ${this.rearPtr}]`, 'success');
    this.renderQueueStage(this.queueItems.length - 1);
  },

  // STEP ANIMATION ENGINE FOR STACK PUSH/POP
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

    const tempItems = JSON.parse(JSON.stringify(this.stackItems));
    const oldTop = tempItems.length - 1;

    this.steps.push(snapshot(tempItems, oldTop, `Step 1: Check isFull(): top (${oldTop}) < MAX - 1 (${this.stackCapacity - 1})`, 1, { 'top': oldTop, 'MAX': this.stackCapacity, 'val': val }));
    const newTop = oldTop + 1;
    this.steps.push(snapshot(tempItems, null, `Step 2: Increment top pointer: ++top (top is now ${newTop})`, 2, { 'top': newTop, 'val': val }));
    tempItems.push(val);
    this.steps.push(snapshot(tempItems, newTop, `Step 3: Assign value at stack[top]: stack[${newTop}] = ${val}. Push Complete!`, 3, { 'top': newTop, 'stack[top]': val }));

    this.stackItems = tempItems;
    this.currentStepIdx = 0;
    this.playSteps('s');
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

    const tempItems = JSON.parse(JSON.stringify(this.stackItems));
    const poppedVal = tempItems[tempItems.length - 1];
    const oldTop = tempItems.length - 1;

    this.steps.push(snapshot(tempItems, oldTop, `Step 1: Check isEmpty(): top (${oldTop}) != -1`, 1, { 'top': oldTop, 'top_val': poppedVal }));
    tempItems.pop();
    const newTop = tempItems.length - 1;
    this.steps.push(snapshot(tempItems, newTop >= 0 ? newTop : null, `Step 2: Extract stack[top] (${poppedVal}) and decrement top to ${newTop}. Pop Complete!`, 2, { 'popped': poppedVal, 'new_top': newTop }));

    this.stackItems = tempItems;
    this.currentStepIdx = 0;
    this.playSteps('s');
  },

  // STEP ANIMATION ENGINE FOR QUEUE ENQUEUE/DEQUEUE
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

    const tempItems = JSON.parse(JSON.stringify(this.queueItems));
    const oldRear = this.rearPtr;
    const oldFront = this.frontPtr;

    this.steps.push(snapshot(tempItems, oldFront, oldRear, null, `Step 1: Check isFull(): rear (${oldRear}) < MAX - 1 (${this.queueCapacity - 1})`, 1, { 'front': oldFront, 'rear': oldRear, 'val': val }));
    const newRear = oldRear + 1;
    this.steps.push(snapshot(tempItems, oldFront, newRear, null, `Step 2: Increment rear pointer: ++rear (rear is now ${newRear})`, 2, { 'front': oldFront, 'rear': newRear }));
    tempItems.push(val);
    this.steps.push(snapshot(tempItems, oldFront, newRear, tempItems.length - 1, `Step 3: Assign value at queue[rear]: queue[${newRear}] = ${val}. Enqueue Complete!`, 3, { 'rear': newRear, 'queue[rear]': val }));

    this.queueItems = tempItems;
    this.rearPtr = newRear;
    this.currentStepIdx = 0;
    this.playSteps('q');
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
    const newFront = oldFront + 1;

    this.steps.push(snapshot(tempItems, oldFront, this.rearPtr, 0, `Step 1: Extract queue[front] (${dequeuedVal})`, 1, { 'front': oldFront, 'dequeued': dequeuedVal }));
    this.steps.push(snapshot(tempItems, newFront, this.rearPtr, null, `Step 2: Advance front pointer: ++front (front is now ${newFront}). Wasted slots: 0..${oldFront}. Dequeue Complete!`, 2, { 'front': newFront, 'rear': this.rearPtr }));

    this.queueItems = tempItems;
    this.frontPtr = newFront;
    this.currentStepIdx = 0;
    this.playSteps('q');
  },

  activeStepPrefix: 's',

  playSteps(prefix = 's') {
    this.activeStepPrefix = prefix;
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
    if (this.steps.length === 0) return;

    const prefix = this.activeStepPrefix;
    const step = this.steps[this.currentStepIdx];

    if (prefix === 's') {
      this.renderStackStageWithItems(step.items, step.highlightIdx);
    } else {
      this.renderQueueStageWithItems(step.items, step.frontP, step.rearP, step.highlightIdx);
    }

    const stepDescEl = document.getElementById(`${prefix}StepDescBanner`);
    if (stepDescEl) {
      stepDescEl.innerHTML = `<strong>Step ${this.currentStepIdx + 1} of ${this.steps.length}:</strong> ${step.desc}`;
    }

    this.renderVariableWatch(`${prefix}VarWatchBox`, step.vars);
    this.highlightCCodeLine(`${prefix}CCodeView`, step.codeLineIdx);
    this.updatePlaybackUI();
  },

  renderVariableWatch(containerId, varsObj) {
    const watchEl = document.getElementById(containerId);
    if (!watchEl) return;

    if (!varsObj || Object.keys(varsObj).length === 0) {
      watchEl.innerHTML = `<span style="color:var(--text-muted); font-size:0.8rem;">No active variables</span>`;
      return;
    }

    let html = `<div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;"><span style="font-size:0.78rem; font-weight:700; color:var(--primary); text-transform:uppercase;">Variable Watch:</span>`;
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

  highlightCCodeLine(containerId, lineIdx) {
    const codeView = document.getElementById(containerId);
    if (!codeView) return;

    const lines = codeView.querySelectorAll('.code-line');
    lines.forEach((line, idx) => {
      line.classList.toggle('active-code-line', idx + 1 === lineIdx);
    });
  },

  updatePlaybackUI() {
    const prefix = this.activeStepPrefix;
    const playBtn = document.getElementById(`${prefix}BtnPlayPause`);
    if (playBtn) playBtn.innerHTML = this.isPlaying ? '⏸️ Pause' : '▶️ Play';

    const stepCounter = document.getElementById(`${prefix}StepCounter`);
    if (stepCounter) {
      stepCounter.innerText = this.steps.length > 0 ? `Step ${this.currentStepIdx + 1} / ${this.steps.length}` : 'Ready';
    }
  },

  renderStackStageWithItems(itemsArr, highlightIdx = null) {
    const container = document.getElementById('sStageContainer');
    if (!container) return;

    let html = '';
    if (this.stackMode === 'array') {
      html += `<div style="display:flex; flex-direction:column-reverse; gap:0.5rem; align-items:center; width:240px; border-bottom:4px solid var(--primary); border-left:3px solid var(--bg-surface-border); border-right:3px solid var(--bg-surface-border); padding:0.75rem 0.5rem; border-radius:0 0 var(--radius-md) var(--radius-md); min-height:240px; margin:0 auto;">`;
      for (let i = 0; i < this.stackCapacity; i++) {
        const hasVal = i < itemsArr.length;
        const isTop = i === itemsArr.length - 1 && hasVal;
        const val = hasVal ? itemsArr[i] : '';
        const isHL = highlightIdx === i;

        html += `
          <div style="width:100%; height:40px; background:${isHL ? 'rgba(16,185,129,0.28)' : (hasVal ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)')}; border:1.5px solid ${isTop ? 'var(--primary)' : 'var(--bg-surface-border)'}; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; padding:0 0.85rem; font-family:var(--font-code); font-size:0.85rem; position:relative; transition:all 0.3s ease;">
            <span style="color:var(--text-main); font-weight:700;">${val}</span>
            <span style="font-size:0.72rem; color:var(--text-dim);">[${i}]</span>
            ${isTop ? `<span style="position:absolute; right:-75px; background:var(--primary); color:#fff; font-size:0.72rem; font-weight:700; padding:0.2rem 0.5rem; border-radius:var(--radius-sm);">TOP ➔</span>` : ''}
          </div>
        `;
      }
      html += `</div>`;
    } else {
      // Dynamic Linked List Stack
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

  renderStackStage(highlightIdx = null) {
    this.renderStackStageWithItems(this.stackItems, highlightIdx);
  },

  renderQueueStageWithItems(itemsArr, frontP, rearP, highlightIdx = null) {
    const container = document.getElementById('qStageContainer');
    if (!container) return;

    let html = '';
    if (this.queueMode === 'linear') {
      html += `<div style="display:flex; flex-direction:column; gap:1.25rem; width:100%;"><div style="display:flex; gap:0.6rem; align-items:center; overflow-x:auto; padding:2rem 0.75rem; border-bottom:3px solid var(--secondary); border-top:3px solid var(--secondary); border-radius:var(--radius-md); background:rgba(0,0,0,0.2);">`;

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
          <div style="min-width:85px; height:85px; background:${isWasted ? 'rgba(239,68,68,0.12)' : (isHL ? 'rgba(16,185,129,0.28)' : (hasVal ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)'))}; border:2px solid ${isWasted ? 'var(--accent-red)' : (isFront ? 'var(--accent-green)' : (isRear ? 'var(--primary)' : 'var(--bg-surface-border)'))}; border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:var(--font-code); position:relative; flex-shrink:0;">
            ${badge ? `<div style="position:absolute; top:-26px; font-size:0.7rem; font-weight:800; color:${isWasted ? 'var(--accent-red)' : (isFront ? 'var(--accent-green)' : 'var(--primary)')}; font-family:var(--font-sans); white-space:nowrap;">${badge}</div>` : ''}
            <span style="color:${isWasted ? 'var(--accent-red)' : 'var(--text-main)'}; font-weight:800; font-size:1.15rem;">${val}</span>
            <span style="font-size:0.7rem; color:var(--text-dim); margin-top:0.2rem;">Index [${i}]</span>
          </div>
        `;
      }

      html += `</div>`;
      if (frontP > 0) {
        html += `
          <div style="background:rgba(239,68,68,0.12); border:1px solid var(--accent-red); padding:0.85rem 1.1rem; border-radius:var(--radius-md); color:var(--text-main); font-size:0.88rem; line-height:1.5;">
            <strong style="color:var(--accent-red);">⚠️ Linear Queue Wasted Space Problem:</strong> 
            Slots <code>[0..${frontP - 1}]</code> are wasted! Notice how <code>front</code> moved to index <code>${frontP}</code> after dequeues. Even though there are ${frontP} empty slots at the beginning, <code>rear</code> cannot wrap around without <strong>Circular Queue</strong>!
          </div>
        `;
      }
      html += `</div>`;
    } else {
      // Circular or LL Queue Stage
      html += `<div style="display:flex; align-items:center; gap:0.6rem; overflow-x:auto; padding:1.5rem 0.75rem; width:100%;">`;
      for (let i = 0; i < itemsArr.length; i++) {
        html += `<div style="background:var(--bg-surface); border:1.5px solid var(--secondary); padding:0.75rem; border-radius:var(--radius-md); font-family:var(--font-code);">${itemsArr[i]}</div>`;
      }
      html += `</div>`;
    }

    container.innerHTML = html;
  },

  renderQueueStage(highlightIdx = null) {
    this.renderQueueStageWithItems(this.queueItems, this.frontPtr, this.rearPtr, highlightIdx);
  },

  renderCCode() {
    const sView = document.getElementById('sCCodeView');
    const qView = document.getElementById('qCCodeView');

    if (sView) {
      let codeLines = [
        `if (top == MAX - 1) { printf("Stack Overflow\\n"); return; }`,
        `top = top + 1;`,
        `stack[top] = val;`
      ];
      let codeHTML = `<div style="font-family:var(--font-code); font-size:0.85rem; line-height:1.6;">`;
      codeLines.forEach((l, idx) => {
        codeHTML += `<div class="code-line" style="padding:0.2rem 0.5rem;"><span style="color:var(--text-dim); margin-right:0.75rem;">${idx + 1}</span><span>${l}</span></div>`;
      });
      codeHTML += `</div>`;
      sView.innerHTML = codeHTML;
    }

    if (qView) {
      let codeLines = [
        `if (rear == MAX - 1) { printf("Queue Overflow\\n"); return; }`,
        `rear = rear + 1;`,
        `queue[rear] = val;`
      ];
      let codeHTML = `<div style="font-family:var(--font-code); font-size:0.85rem; line-height:1.6;">`;
      codeLines.forEach((l, idx) => {
        codeHTML += `<div class="code-line" style="padding:0.2rem 0.5rem;"><span style="color:var(--text-dim); margin-right:0.75rem;">${idx + 1}</span><span>${l}</span></div>`;
      });
      codeHTML += `</div>`;
      qView.innerHTML = codeHTML;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  StackQueueEngine.init();
});
