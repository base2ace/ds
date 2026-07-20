/* ==========================================================================
   Base2ace Technologies Education - Interactive Stack & Queue Engine
   ========================================================================== */

const StackQueueSim = {
  activeView: 'viewStackQueueSim',
  type: 'stack', // 'stack' or 'queue'
  items: [15, 30, 45],
  capacity: 8,

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

  setType(t) {
    this.type = t;
    document.getElementById('btnTypeStack').classList.toggle('active', t === 'stack');
    document.getElementById('btnTypeQueue').classList.toggle('active', t === 'queue');
    this.renderStage();
    this.renderCCode();
  },

  renderStage(highlightIdx = null) {
    const container = document.getElementById('sqStageContainer');
    if (!container) return;

    let html = '';

    if (this.type === 'stack') {
      // Vertical / Horizontal Stack representation
      html += `
        <div style="display:flex; flex-direction:column-reverse; gap:0.5rem; align-items:center; width:220px; border-bottom:4px solid var(--primary); border-left:3px solid var(--bg-surface-border); border-right:3px solid var(--bg-surface-border); padding:0.75rem 0.5rem; border-radius:0 0 var(--radius-md) var(--radius-md); min-height:220px; margin:0 auto;">
      `;

      for (let i = 0; i < this.capacity; i++) {
        const hasVal = i < this.items.length;
        const isTop = i === this.items.length - 1 && hasVal;
        const val = hasVal ? this.items[i] : '';
        const isHL = highlightIdx === i;

        html += `
          <div style="width:100%; height:38px; background:${isHL ? 'rgba(16,185,129,0.25)' : (hasVal ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)')}; border:1.5px solid ${isTop ? 'var(--primary)' : 'var(--bg-surface-border)'}; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; padding:0 0.85rem; font-family:var(--font-code); font-size:0.85rem; position:relative;">
            <span style="color:var(--text-main); font-weight:700;">${val}</span>
            <span style="font-size:0.72rem; color:var(--text-dim);">[${i}]</span>
            ${isTop ? `<span style="position:absolute; right:-70px; background:var(--primary); color:#fff; font-size:0.7rem; font-weight:700; padding:0.15rem 0.4rem; border-radius:var(--radius-sm);">TOP ➔</span>` : ''}
          </div>
        `;
      }

      html += `</div>`;
    } else {
      // Queue representation
      html += `
        <div style="display:flex; gap:0.5rem; align-items:center; overflow-x:auto; padding:1.5rem 0.5rem; border-bottom:3px solid var(--secondary); border-top:3px solid var(--secondary); border-radius:var(--radius-md);">
      `;

      for (let i = 0; i < this.capacity; i++) {
        const hasVal = i < this.items.length;
        const isFront = i === 0 && hasVal;
        const isRear = i === this.items.length - 1 && hasVal;
        const val = hasVal ? this.items[i] : '';
        const isHL = highlightIdx === i;

        let badge = '';
        if (isFront && isRear) badge = 'FRONT & REAR';
        else if (isFront) badge = 'FRONT ⬇';
        else if (isRear) badge = 'REAR ⬇';

        html += `
          <div style="min-width:75px; height:75px; background:${isHL ? 'rgba(16,185,129,0.25)' : (hasVal ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)')}; border:1.5px solid ${hasVal ? 'var(--secondary)' : 'var(--bg-surface-border)'}; border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:var(--font-code); font-size:0.85rem; position:relative;">
            ${badge ? `<div style="position:absolute; top:-24px; font-size:0.68rem; font-weight:700; color:var(--secondary); font-family:var(--font-sans); white-space:nowrap;">${badge}</div>` : ''}
            <span style="color:var(--text-main); font-weight:700; font-size:1.05rem;">${val}</span>
            <span style="font-size:0.7rem; color:var(--text-dim); margin-top:0.2rem;">[${i}]</span>
          </div>
        `;
      }

      html += `</div>`;
    }

    container.innerHTML = html;
  },

  push() {
    if (this.items.length >= this.capacity) return;
    const valInput = document.getElementById('sqValInput');
    const val = valInput ? parseInt(valInput.value) || Math.floor(Math.random() * 90 + 10) : 50;
    this.items.push(val);
    this.renderStage(this.items.length - 1);
    this.renderCCode(this.type === 'stack' ? 'push' : 'enqueue');
  },

  pop() {
    if (this.items.length === 0) return;
    if (this.type === 'stack') {
      this.items.pop();
      this.renderCCode('pop');
    } else {
      this.items.shift();
      this.renderCCode('dequeue');
    }
    this.renderStage();
  },

  renderCCode(op = 'push') {
    const codeContainer = document.getElementById('sqCCodeView');
    if (!codeContainer) return;

    let code = '';
    if (op === 'push') {
      code = `// Stack Push (LIFO)
void push(int stack[], int *top, int val) {
    if (*top == CAPACITY - 1) {
        printf("Stack Overflow!\\n");
        return;
    }
    stack[++(*top)] = val; // Increment top then assign
}`;
    } else if (op === 'pop') {
      code = `// Stack Pop (LIFO)
int pop(int stack[], int *top) {
    if (*top == -1) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    return stack[(*top)--]; // Return value then decrement top
}`;
    } else if (op === 'enqueue') {
      code = `// Queue Enqueue (FIFO)
void enqueue(int queue[], int *rear, int val) {
    if (*rear == CAPACITY - 1) return; // Full
    queue[++(*rear)] = val;
}`;
    } else {
      code = `// Queue Dequeue (FIFO)
int dequeue(int queue[], int *front, int rear) {
    if (*front > rear) return -1; // Empty
    return queue[(*front)++];
}`;
    }

    codeContainer.innerHTML = `<pre style="font-family:var(--font-code); font-size:0.85rem; color:var(--text-main); line-height:1.5;"><code>${code}</code></pre>`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  StackQueueSim.init();
});
