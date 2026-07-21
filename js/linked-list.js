/* ==========================================================================
   Base2ace Technologies Education - Animated Interactive Linked List Engine
   With Dynamic Doubly/Singly Struct Card & Real-Time C Execution Tracking
   ========================================================================== */

const LinkedListSim = {
  activeView: 'viewLinkedListSim',
  mode: 'singly', // 'singly' or 'doubly'
  activeOp: 'insertHead',
  activeCategory: 'all',
  nodes: [
    { id: 101, val: 12, addr: '0x7FFE10' },
    { id: 102, val: 28, addr: '0x7FFE24' },
    { id: 103, val: 45, addr: '0x7FFE38' }
  ],
  
  // Animation State
  steps: [],
  currentStepIdx: 0,
  isPlaying: false,
  playInterval: null,
  speedMs: 1200,

  init() {
    this.selectOperation('insertHead');
    this.renderStructInfoCard();
    this.renderStage();
  },

  switchSubView(viewId) {
    this.activeView = viewId;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active-view'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active-view');

    document.querySelectorAll('.sidebar-item[data-ll-view]').forEach(item => {
      item.classList.toggle('active', item.dataset.llView === viewId);
    });
  },

  setMode(m) {
    this.mode = m;
    document.getElementById('btnModeSingly').classList.toggle('active', m === 'singly');
    document.getElementById('btnModeDoubly').classList.toggle('active', m === 'doubly');
    this.stopPlayback();
    this.renderStructInfoCard();
    this.renderStage();
    this.renderCCode(this.activeOp);
  },

  renderStructInfoCard() {
    const cardEl = document.getElementById('llStructInfoCardContainer');
    if (!cardEl) return;

    const isDoubly = this.mode === 'doubly';

    if (isDoubly) {
      cardEl.innerHTML = `
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--primary); display:flex; align-items:center; gap:0.5rem;">
              <span>🧠</span> Doubly Linked List Node Definition & Memory Alignment (24 Bytes Total)
            </h4>
            <span class="badge badge-primary">Mode: Doubly Linked List</span>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;" class="matrix-layout-grid">
            
            <div style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem;">
              <div style="font-size:0.78rem; color:var(--text-muted); font-weight:700; margin-bottom:0.4rem;">1. Doubly C Code Struct Declaration</div>
              <pre style="font-family:var(--font-code); font-size:0.82rem; color:var(--accent-green); margin:0;"><code>struct Node {
    int data;           // 4 bytes (payload)
    struct Node* prev;  // 8 bytes (64-bit prev pointer)
    struct Node* next;  // 8 bytes (64-bit next pointer)
};                      // Total: 24 bytes allocated by malloc()

struct Node* head = NULL; // Initial List State</code></pre>
            </div>

            <div style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem;">
              <div style="font-size:0.78rem; color:var(--text-muted); font-weight:700; margin-bottom:0.4rem;">2. 24-Byte Heap Memory Block Layout</div>
              <div style="display:flex; flex-direction:column; gap:0.35rem; font-family:var(--font-code); font-size:0.78rem;">
                <div style="background:rgba(59,130,246,0.15); border:1px solid var(--primary); padding:0.35rem 0.6rem; border-radius:4px; display:flex; justify-content:space-between;">
                  <span>Offset +0x00 (4 Bytes)</span>
                  <strong style="color:var(--primary);">int data (Payload Value)</strong>
                </div>
                <div style="background:rgba(245,158,11,0.15); border:1px solid var(--accent-amber); padding:0.35rem 0.6rem; border-radius:4px; display:flex; justify-content:space-between;">
                  <span>Offset +0x08 (8 Bytes)</span>
                  <strong style="color:var(--accent-amber);">struct Node* prev (Target 64-bit Pointer)</strong>
                </div>
                <div style="background:rgba(6,182,212,0.15); border:1px solid var(--secondary); padding:0.35rem 0.6rem; border-radius:4px; display:flex; justify-content:space-between;">
                  <span>Offset +0x10 (8 Bytes)</span>
                  <strong style="color:var(--secondary);">struct Node* next (Target 64-bit Pointer)</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
    } else {
      cardEl.innerHTML = `
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--secondary); display:flex; align-items:center; gap:0.5rem;">
              <span>🧠</span> Singly Linked List Node Definition & Memory Alignment (16 Bytes Total)
            </h4>
            <span class="badge badge-primary">Mode: Singly Linked List</span>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;" class="matrix-layout-grid">
            
            <div style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem;">
              <div style="font-size:0.78rem; color:var(--text-muted); font-weight:700; margin-bottom:0.4rem;">1. Singly C Code Struct Declaration</div>
              <pre style="font-family:var(--font-code); font-size:0.82rem; color:var(--text-main); margin:0;"><code>struct Node {
    int data;          // 4 bytes (payload)
    struct Node* next; // 8 bytes (64-bit address pointer)
};                     // Total: 16 bytes allocated by malloc()

struct Node* head = NULL; // Initial List State</code></pre>
            </div>

            <div style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem;">
              <div style="font-size:0.78rem; color:var(--text-muted); font-weight:700; margin-bottom:0.4rem;">2. 16-Byte Heap Memory Block Layout</div>
              <div style="display:flex; flex-direction:column; gap:0.35rem; font-family:var(--font-code); font-size:0.78rem;">
                <div style="background:rgba(59,130,246,0.15); border:1px solid var(--primary); padding:0.35rem 0.6rem; border-radius:4px; display:flex; justify-content:space-between;">
                  <span>Offset +0x00 (4 Bytes)</span>
                  <strong style="color:var(--primary);">int data (Payload Value)</strong>
                </div>
                <div style="background:rgba(6,182,212,0.15); border:1px solid var(--secondary); padding:0.35rem 0.6rem; border-radius:4px; display:flex; justify-content:space-between;">
                  <span>Offset +0x08 (8 Bytes)</span>
                  <strong style="color:var(--secondary);">struct Node* next (Target 64-bit Pointer)</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
    }
  },

  filterOpCategory(catKey) {
    this.activeCategory = catKey;
    const catPills = {
      'all': 'llCatPillAll',
      'insert': 'llCatPillInsert',
      'delete': 'llCatPillDelete',
      'search': 'llCatPillSearch'
    };

    Object.keys(catPills).forEach(k => {
      const pill = document.getElementById(catPills[k]);
      if (pill) pill.classList.toggle('active', k === catKey);
    });

    document.querySelectorAll('.op-tab[data-ll-category]').forEach(tab => {
      if (catKey === 'all') {
        tab.style.display = 'inline-flex';
      } else {
        tab.style.display = (tab.dataset.llCategory === catKey) ? 'inline-flex' : 'none';
      }
    });
  },

  selectOpFromSidebar(opKey) {
    this.switchSubView('viewLinkedListSim');
    this.selectOperation(opKey);

    document.querySelectorAll('.sidebar-item[data-ll-op]').forEach(item => {
      item.classList.toggle('active', item.dataset.llOp === opKey);
    });
  },

  selectOperation(opKey) {
    this.stopPlayback();
    this.activeOp = opKey;

    const dropdown = document.getElementById('llOpDropdownSelect');
    if (dropdown && dropdown.value !== opKey) {
      dropdown.value = opKey;
    }

    document.querySelectorAll('.op-tab[data-ll-op]').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.llOp === opKey);
    });

    document.querySelectorAll('.sidebar-item[data-ll-op]').forEach(item => {
      item.classList.toggle('active', item.dataset.llOp === opKey);
    });

    this.renderOpControls(opKey);
    this.renderCCode(opKey);
  },

  renderOpControls(opKey) {
    const container = document.getElementById('llOpControlsContainer');
    if (!container) return;

    let html = '';
    const posMax = Math.max(1, this.nodes.length);

    switch (opKey) {
      case 'insertHead':
        html = `
          <div class="op-input-group">
            <label for="llValInput">New Value:</label>
            <input type="number" id="llValInput" class="op-input" value="99" style="width:70px; text-align:center;">
          </div>
          <button class="btn btn-primary btn-sm" onclick="LinkedListSim.generateAndPlaySteps(true)">▶️ Auto Play</button>
          <button class="btn btn-secondary btn-sm" onclick="LinkedListSim.prepareManualStep()">⏩ Manual Step-by-Step</button>
        `;
        break;

      case 'insertPos':
        html = `
          <div class="op-input-group">
            <label for="llValInput">Value:</label>
            <input type="number" id="llValInput" class="op-input" value="35" style="width:70px; text-align:center;">
          </div>
          <div class="op-input-group">
            <label for="llPosInput">Pos (1..${posMax + 1}):</label>
            <input type="number" id="llPosInput" class="op-input" value="2" min="1" max="${posMax + 1}" style="width:65px; text-align:center;">
          </div>
          <button class="btn btn-primary btn-sm" onclick="LinkedListSim.generateAndPlaySteps(true)">▶️ Auto Play</button>
          <button class="btn btn-secondary btn-sm" onclick="LinkedListSim.prepareManualStep()">⏩ Manual Step-by-Step</button>
        `;
        break;

      case 'insertTail':
        html = `
          <div class="op-input-group">
            <label for="llValInput">Value:</label>
            <input type="number" id="llValInput" class="op-input" value="88" style="width:70px; text-align:center;">
          </div>
          <button class="btn btn-primary btn-sm" onclick="LinkedListSim.generateAndPlaySteps(true)">▶️ Auto Play</button>
          <button class="btn btn-secondary btn-sm" onclick="LinkedListSim.prepareManualStep()">⏩ Manual Step-by-Step</button>
        `;
        break;

      case 'deleteHead':
      case 'deleteTail':
      case 'reverse':
      case 'traverse':
        html = `
          <button class="btn btn-primary btn-sm" onclick="LinkedListSim.generateAndPlaySteps(true)">▶️ Auto Play</button>
          <button class="btn btn-secondary btn-sm" onclick="LinkedListSim.prepareManualStep()">⏩ Manual Step-by-Step</button>
        `;
        break;

      case 'deletePos':
        html = `
          <div class="op-input-group">
            <label for="llPosInput">Pos (1..${posMax}):</label>
            <input type="number" id="llPosInput" class="op-input" value="2" min="1" max="${posMax}" style="width:65px; text-align:center;">
          </div>
          <button class="btn btn-primary btn-sm" onclick="LinkedListSim.generateAndPlaySteps(true)">▶️ Auto Play</button>
          <button class="btn btn-secondary btn-sm" onclick="LinkedListSim.prepareManualStep()">⏩ Manual Step-by-Step</button>
        `;
        break;

      case 'updatePos':
        html = `
          <div class="op-input-group">
            <label for="llPosInput">Pos (1..${posMax}):</label>
            <input type="number" id="llPosInput" class="op-input" value="2" min="1" max="${posMax}" style="width:65px; text-align:center;">
          </div>
          <div class="op-input-group">
            <label for="llValInput">New Value:</label>
            <input type="number" id="llValInput" class="op-input" value="99" style="width:70px; text-align:center;">
          </div>
          <button class="btn btn-primary btn-sm" onclick="LinkedListSim.generateAndPlaySteps(true)">▶️ Auto Play</button>
          <button class="btn btn-secondary btn-sm" onclick="LinkedListSim.prepareManualStep()">⏩ Manual Step-by-Step</button>
        `;
        break;

      case 'searchVal':
        html = `
          <div class="op-input-group">
            <label for="llValInput">Target Value:</label>
            <input type="number" id="llValInput" class="op-input" value="28" style="width:70px; text-align:center;">
          </div>
          <button class="btn btn-primary btn-sm" onclick="LinkedListSim.generateAndPlaySteps(true)">▶️ Auto Play</button>
          <button class="btn btn-secondary btn-sm" onclick="LinkedListSim.prepareManualStep()">⏩ Manual Step-by-Step</button>
        `;
        break;

      default:
        html = `
          <button class="btn btn-primary btn-sm" onclick="LinkedListSim.generateAndPlaySteps(true)">▶️ Auto Play</button>
          <button class="btn btn-secondary btn-sm" onclick="LinkedListSim.prepareManualStep()">⏩ Manual Step-by-Step</button>
        `;
        break;
    }

    container.innerHTML = html;
  },

  generateHexAddr() {
    return '0x7FFE' + Math.floor(Math.random() * 80 + 10).toString(16).toUpperCase();
  },

  prepareManualStep() {
    this.generateAndPlaySteps(false);
  },

  // STEP ANIMATION GENERATOR ENGINE
  generateAndPlaySteps(autoStart = true) {
    this.stopPlayback();
    this.steps = [];

    const valInput = document.getElementById('llValInput');
    const posInput = document.getElementById('llPosInput');
    const val = valInput ? parseInt(valInput.value) || 99 : 99;
    const pos = posInput ? parseInt(posInput.value) || 1 : 1;
    const isDoubly = this.mode === 'doubly';

    const snapshot = (nodesArr, highlightId, desc, codeLineIdx, vars) => {
      return {
        nodes: JSON.parse(JSON.stringify(nodesArr)),
        highlightId: highlightId,
        desc: desc,
        codeLineIdx: codeLineIdx,
        vars: vars
      };
    };

    if (this.activeOp === 'insertHead') {
      const newHex = this.generateHexAddr();
      const tempNodes = JSON.parse(JSON.stringify(this.nodes));
      const oldHead = tempNodes.length > 0 ? tempNodes[0].addr : 'NULL';

      // Step 1: malloc new node
      const newNode = { id: Date.now(), val: val, addr: newHex, tempNew: true };
      tempNodes.unshift(newNode);

      this.steps.push(snapshot(
        tempNodes,
        newNode.id,
        `Step 1: malloc(sizeof(struct Node)) allocated ${isDoubly ? '24' : '16'} bytes in Heap RAM at address ${newHex}`,
        1,
        { 'head': oldHead, 'newNode': newHex, 'val': val }
      ));

      // Step 2: assign data
      this.steps.push(snapshot(
        tempNodes,
        newNode.id,
        `Step 2: Assign value: newNode->data = ${val}`,
        2,
        { 'head': oldHead, 'newNode': newHex, 'newNode->data': val }
      ));

      // Step 3: assign prev and next pointers
      this.steps.push(snapshot(
        tempNodes,
        newNode.id,
        isDoubly ? `Step 3: Set prev & next: newNode->prev = NULL, newNode->next = head (${oldHead})` : `Step 3: Point next pointer to head: newNode->next = head (${oldHead})`,
        3,
        isDoubly ? { 'head': oldHead, 'newNode->prev': 'NULL', 'newNode->next': oldHead } : { 'head': oldHead, 'newNode->next': oldHead }
      ));

      // Step 4: update head pointer
      newNode.tempNew = false;
      this.steps.push(snapshot(
        tempNodes,
        newNode.id,
        `Step 4: Update head pointer to point to newNode (${newHex}). ${isDoubly ? 'Doubly' : 'Singly'} Head insertion complete!`,
        4,
        { 'head': newHex, 'newNode': newHex, 'head->data': val }
      ));

      this.nodes = tempNodes;

    } else if (this.activeOp === 'insertPos') {
      const newHex = this.generateHexAddr();
      const tempNodes = JSON.parse(JSON.stringify(this.nodes));

      let targetPos = Math.max(1, Math.min(pos, tempNodes.length + 1));
      const insertIndex = targetPos - 1;

      if (insertIndex === 0 || tempNodes.length === 0) {
        const oldHead = tempNodes.length > 0 ? tempNodes[0].addr : 'NULL';
        const newNode = { id: Date.now(), val: val, addr: newHex, tempNew: true };
        tempNodes.unshift(newNode);

        this.steps.push(snapshot(tempNodes, newNode.id, `Step 1: Save head reference: temp = head (${oldHead})`, 1, { 'head': oldHead, 'temp': oldHead }));
        this.steps.push(snapshot(tempNodes, newNode.id, `Step 2: malloc(sizeof(struct Node)) allocated node at ${newHex}`, 3, { 'newNode': newHex, 'val': val }));
        this.steps.push(snapshot(tempNodes, newNode.id, `Step 3: Assign value: newNode->data = ${val}`, 4, { 'newNode': newHex, 'newNode->data': val }));
        this.steps.push(snapshot(tempNodes, newNode.id, `Step 4: Point next pointer to head: newNode->next = ${oldHead}`, 5, { 'newNode->next': oldHead }));
        newNode.tempNew = false;
        this.steps.push(snapshot(tempNodes, newNode.id, `Step 5: Update head pointer to newNode (${newHex}). Position 1 insertion complete!`, 6, { 'head': newHex }));
      } else {
        this.steps.push(snapshot(tempNodes, tempNodes[0].id, `Step 1: Save head pointer: temp = head (${tempNodes[0].addr})`, 1, { 'head': tempNodes[0].addr, 'temp': tempNodes[0].addr }));

        for (let i = 0; i < insertIndex - 1; i++) {
          this.steps.push(snapshot(
            tempNodes,
            tempNodes[i].id,
            `Step ${this.steps.length + 1}: Traversed to Node #${i + 1} (${tempNodes[i].addr}). Advance temp = temp->next (${tempNodes[i + 1].addr})`,
            2,
            { 'temp': tempNodes[i + 1].addr, 'temp->data': tempNodes[i + 1].val, 'i': i + 2 }
          ));
        }

        const prevNode = tempNodes[insertIndex - 1];
        const nextNodeAddr = (insertIndex < tempNodes.length) ? tempNodes[insertIndex].addr : 'NULL';

        const newNode = { id: Date.now(), val: val, addr: newHex, tempNew: true };
        tempNodes.splice(insertIndex, 0, newNode);

        this.steps.push(snapshot(
          tempNodes,
          newNode.id,
          `Step ${this.steps.length + 1}: malloc(sizeof(struct Node)) allocated node at RAM address ${newHex}`,
          3,
          { 'temp': prevNode.addr, 'newNode': newHex, 'val': val }
        ));

        this.steps.push(snapshot(
          tempNodes,
          newNode.id,
          `Step ${this.steps.length + 1}: Assign payload value: newNode->data = ${val}`,
          4,
          { 'temp': prevNode.addr, 'newNode': newHex, 'newNode->data': val }
        ));

        this.steps.push(snapshot(
          tempNodes,
          newNode.id,
          isDoubly 
            ? `Step ${this.steps.length + 1}: Set newNode pointers: newNode->prev = ${prevNode.addr}, newNode->next = ${nextNodeAddr}`
            : `Step ${this.steps.length + 1}: Point next pointer: newNode->next = temp->next (${nextNodeAddr})`,
          5,
          isDoubly 
            ? { 'temp': prevNode.addr, 'newNode->prev': prevNode.addr, 'newNode->next': nextNodeAddr }
            : { 'temp': prevNode.addr, 'newNode->next': nextNodeAddr }
        ));

        newNode.tempNew = false;
        this.steps.push(snapshot(
          tempNodes,
          newNode.id,
          `Step ${this.steps.length + 1}: Connect predecessor: temp->next = newNode (${newHex}). Middle insertion at Position ${targetPos} complete!`,
          6,
          { 'temp': prevNode.addr, 'temp->next': newHex }
        ));
      }

      this.nodes = tempNodes;

    } else if (this.activeOp === 'insertTail') {
      const newHex = this.generateHexAddr();
      const tempNodes = JSON.parse(JSON.stringify(this.nodes));

      const newNode = { id: Date.now(), val: val, addr: newHex };
      this.steps.push(snapshot(tempNodes, null, `Step 1: malloc(sizeof(struct Node)) allocated node at ${newHex}`, 1, { 'newNode': newHex, 'val': val }));

      for (let i = 0; i < tempNodes.length; i++) {
        this.steps.push(snapshot(
          tempNodes,
          tempNodes[i].id,
          `Step 2: Traverse node #${i+1} (${tempNodes[i].addr}) searching for tail (next == NULL)`,
          4,
          { 'temp': tempNodes[i].addr, 'temp->data': tempNodes[i].val }
        ));
      }

      tempNodes.push(newNode);
      this.steps.push(snapshot(
        tempNodes,
        newNode.id,
        `Step 3: Attach newNode to tail: temp->next = newNode (${newHex}). Tail insertion complete!`,
        4,
        { 'tail': newHex, 'tail->data': val }
      ));

      this.nodes = tempNodes;

    } else if (this.activeOp === 'deleteHead') {
      if (this.nodes.length === 0) return;
      const tempNodes = JSON.parse(JSON.stringify(this.nodes));
      const deletedNode = tempNodes[0];

      this.steps.push(snapshot(tempNodes, deletedNode.id, `Step 1: Save head pointer: temp = head (${deletedNode.addr})`, 2, { 'head': deletedNode.addr, 'temp': deletedNode.addr }));

      tempNodes.shift();
      const newHeadAddr = tempNodes.length > 0 ? tempNodes[0].addr : 'NULL';

      this.steps.push(snapshot(tempNodes, null, `Step 2: Advance head pointer: head = head->next (${newHeadAddr})`, 3, { 'head': newHeadAddr, 'temp': deletedNode.addr }));
      this.steps.push(snapshot(tempNodes, null, `Step 3: free(temp) released heap memory at ${deletedNode.addr} back to OS!`, 5, { 'head': newHeadAddr, 'free_addr': deletedNode.addr }));

      this.nodes = tempNodes;

    } else if (this.activeOp === 'deletePos') {
      if (this.nodes.length === 0) return;
      const tempNodes = JSON.parse(JSON.stringify(this.nodes));
      let targetPos = Math.max(1, Math.min(pos, tempNodes.length));
      const delIndex = targetPos - 1;

      if (delIndex === 0) {
        const deletedNode = tempNodes[0];
        this.steps.push(snapshot(tempNodes, deletedNode.id, `Step 1: Save head pointer: temp = head (${deletedNode.addr})`, 1, { 'head': deletedNode.addr, 'temp': deletedNode.addr }));
        tempNodes.shift();
        const newHeadAddr = tempNodes.length > 0 ? tempNodes[0].addr : 'NULL';
        this.steps.push(snapshot(tempNodes, null, `Step 2: Advance head pointer: head = head->next (${newHeadAddr})`, 4, { 'head': newHeadAddr, 'temp': deletedNode.addr }));
        this.steps.push(snapshot(tempNodes, null, `Step 3: free(temp) released heap memory at ${deletedNode.addr}!`, 5, { 'head': newHeadAddr, 'free_addr': deletedNode.addr }));
      } else {
        this.steps.push(snapshot(tempNodes, tempNodes[0].id, `Step 1: Save head pointer: temp = head (${tempNodes[0].addr})`, 1, { 'head': tempNodes[0].addr, 'temp': tempNodes[0].addr }));

        for (let i = 0; i < delIndex - 1; i++) {
          this.steps.push(snapshot(
            tempNodes,
            tempNodes[i].id,
            `Step ${this.steps.length + 1}: Traverse to Node #${i + 1} (${tempNodes[i].addr}). Advance temp = temp->next (${tempNodes[i + 1].addr})`,
            2,
            { 'temp': tempNodes[i + 1].addr, 'i': i + 2 }
          ));
        }

        const prevNode = tempNodes[delIndex - 1];
        const targetNode = tempNodes[delIndex];
        const nextNodeAddr = (delIndex + 1 < tempNodes.length) ? tempNodes[delIndex + 1].addr : 'NULL';

        this.steps.push(snapshot(
          tempNodes,
          targetNode.id,
          `Step ${this.steps.length + 1}: Identify target node to delete: target = temp->next (${targetNode.addr})`,
          3,
          { 'temp': prevNode.addr, 'target': targetNode.addr, 'target->data': targetNode.val }
        ));

        tempNodes.splice(delIndex, 1);

        this.steps.push(snapshot(
          tempNodes,
          null,
          `Step ${this.steps.length + 1}: Bypass target node: temp->next = target->next (${nextNodeAddr})`,
          4,
          { 'temp': prevNode.addr, 'temp->next': nextNodeAddr }
        ));

        this.steps.push(snapshot(
          tempNodes,
          null,
          `Step ${this.steps.length + 1}: free(target) released memory at ${targetNode.addr}. Deletion at Position ${targetPos} complete!`,
          5,
          { 'free_addr': targetNode.addr }
        ));
      }

      this.nodes = tempNodes;

    } else if (this.activeOp === 'deleteTail') {
      if (this.nodes.length === 0) return;
      const tempNodes = JSON.parse(JSON.stringify(this.nodes));

      if (tempNodes.length === 1) {
        const deletedNode = tempNodes[0];
        this.steps.push(snapshot(tempNodes, deletedNode.id, `Step 1: Single node list: temp = head (${deletedNode.addr})`, 1, { 'head': deletedNode.addr }));
        tempNodes.pop();
        this.steps.push(snapshot(tempNodes, null, `Step 2: Update head = NULL`, 4, { 'head': 'NULL' }));
        this.steps.push(snapshot(tempNodes, null, `Step 3: free(tail) released memory at ${deletedNode.addr}!`, 5, { 'free_addr': deletedNode.addr }));
      } else {
        this.steps.push(snapshot(tempNodes, tempNodes[0].id, `Step 1: Save head pointer: temp = head (${tempNodes[0].addr})`, 1, { 'head': tempNodes[0].addr }));

        for (let i = 0; i < tempNodes.length - 2; i++) {
          this.steps.push(snapshot(
            tempNodes,
            tempNodes[i].id,
            `Step ${this.steps.length + 1}: Traverse to Node #${i + 1} (${tempNodes[i].addr}) looking for second-to-last node`,
            2,
            { 'temp': tempNodes[i].addr }
          ));
        }

        const secondLast = tempNodes[tempNodes.length - 2];
        const tailNode = tempNodes[tempNodes.length - 1];

        this.steps.push(snapshot(
          tempNodes,
          tailNode.id,
          `Step ${this.steps.length + 1}: Identify tail node: tail = temp->next (${tailNode.addr})`,
          3,
          { 'temp': secondLast.addr, 'tail': tailNode.addr }
        ));

        tempNodes.pop();

        this.steps.push(snapshot(
          tempNodes,
          secondLast.id,
          `Step ${this.steps.length + 1}: Disconnect tail: temp->next = NULL`,
          4,
          { 'temp': secondLast.addr, 'temp->next': 'NULL' }
        ));

        this.steps.push(snapshot(
          tempNodes,
          null,
          `Step ${this.steps.length + 1}: free(tail) released memory at ${tailNode.addr}. Tail deletion complete!`,
          5,
          { 'free_addr': tailNode.addr }
        ));
      }

      this.nodes = tempNodes;

    } else if (this.activeOp === 'updatePos') {
      if (this.nodes.length === 0) return;
      const tempNodes = JSON.parse(JSON.stringify(this.nodes));
      let targetPos = Math.max(1, Math.min(pos, tempNodes.length));
      const updateIndex = targetPos - 1;

      this.steps.push(snapshot(tempNodes, tempNodes[0].id, `Step 1: Start at head pointer: temp = head (${tempNodes[0].addr})`, 1, { 'head': tempNodes[0].addr, 'temp': tempNodes[0].addr }));

      for (let i = 0; i < updateIndex; i++) {
        this.steps.push(snapshot(
          tempNodes,
          tempNodes[i].id,
          `Step ${this.steps.length + 1}: Traverse node #${i + 1} (${tempNodes[i].addr})`,
          2,
          { 'temp': tempNodes[i].addr, 'temp->data': tempNodes[i].val }
        ));
      }

      const oldVal = tempNodes[updateIndex].val;
      tempNodes[updateIndex].val = val;

      this.steps.push(snapshot(
        tempNodes,
        tempNodes[updateIndex].id,
        `Step ${this.steps.length + 1}: Found node #${targetPos} (${tempNodes[updateIndex].addr}). Update payload: temp->data = ${val} (was ${oldVal})`,
        3,
        { 'temp': tempNodes[updateIndex].addr, 'temp->data': val }
      ));

      this.nodes = tempNodes;

    } else if (this.activeOp === 'searchVal') {
      let foundIdx = -1;
      for (let i = 0; i < this.nodes.length; i++) {
        const isMatch = this.nodes[i].val === val;
        this.steps.push(snapshot(
          this.nodes,
          this.nodes[i].id,
          `Step ${i + 1}: Inspecting Node #${i + 1} [val: ${this.nodes[i].val}, addr: ${this.nodes[i].addr}] — ${isMatch ? 'MATCH FOUND! 🎉' : 'No match, moving next'}`,
          2,
          { 'temp': this.nodes[i].addr, 'temp->data': this.nodes[i].val, 'target': val }
        ));
        if (isMatch) {
          foundIdx = i;
          break;
        }
      }

      if (foundIdx !== -1) {
        this.steps.push(snapshot(
          this.nodes,
          this.nodes[foundIdx].id,
          `Search Complete: Target value ${val} found at Position ${foundIdx + 1} (address ${this.nodes[foundIdx].addr})!`,
          3,
          { 'status': 'FOUND', 'pos': foundIdx + 1, 'addr': this.nodes[foundIdx].addr }
        ));
      } else {
        this.steps.push(snapshot(
          this.nodes,
          null,
          `Search Complete: Target value ${val} was NOT found in the linked list (returned -1 / NULL).`,
          3,
          { 'status': 'NOT_FOUND', 'target': val }
        ));
      }

    } else if (this.activeOp === 'reverse') {
      if (this.nodes.length <= 1) return;
      const tempNodes = JSON.parse(JSON.stringify(this.nodes));

      this.steps.push(snapshot(
        tempNodes,
        tempNodes[0].id,
        `Step 1: Initialize pointers: prev = NULL, current = head (${tempNodes[0].addr}), next = NULL`,
        1,
        { 'prev': 'NULL', 'current': tempNodes[0].addr, 'next': 'NULL' }
      ));

      for (let i = 0; i < tempNodes.length; i++) {
        const currAddr = tempNodes[i].addr;
        const nextAddr = (i + 1 < tempNodes.length) ? tempNodes[i + 1].addr : 'NULL';
        const prevAddr = (i > 0) ? tempNodes[i - 1].addr : 'NULL';

        this.steps.push(snapshot(
          tempNodes,
          tempNodes[i].id,
          `Step ${this.steps.length + 1}: Node #${i + 1} (${currAddr}): next = current->next (${nextAddr}), current->next = prev (${prevAddr})`,
          2,
          { 'prev': prevAddr, 'current': currAddr, 'next': nextAddr }
        ));
      }

      tempNodes.reverse();
      this.steps.push(snapshot(
        tempNodes,
        tempNodes[0].id,
        `Step ${this.steps.length + 1}: Reversing complete! Update head = prev (${tempNodes[0].addr}).`,
        3,
        { 'head': tempNodes[0].addr }
      ));

      this.nodes = tempNodes;

    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        this.steps.push(snapshot(
          this.nodes,
          this.nodes[i].id,
          `Step ${i+1}: Inspecting Node #${i+1} [val: ${this.nodes[i].val}, addr: ${this.nodes[i].addr}]`,
          2,
          { 'current': this.nodes[i].addr, 'current->data': this.nodes[i].val }
        ));
      }
    }

    this.currentStepIdx = 0;

    if (autoStart) {
      this.playSteps();
    } else {
      this.renderCurrentStep();
    }
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
    this.renderStageWithNodes(step.nodes, step.highlightId);

    const stepDescEl = document.getElementById('llStepDescBanner');
    if (stepDescEl) {
      stepDescEl.innerHTML = `<strong>Step ${this.currentStepIdx + 1} of ${this.steps.length}:</strong> ${step.desc}`;
    }

    this.renderVariableWatch(step.vars);
    this.highlightCCodeLine(step.codeLineIdx);
    this.updatePlaybackUI();
  },

  renderVariableWatch(varsObj) {
    const watchEl = document.getElementById('llVarWatchBox');
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
    const codeView = document.getElementById('llCCodeView');
    if (!codeView) return;

    const lines = codeView.querySelectorAll('.code-line');
    lines.forEach((line, idx) => {
      line.classList.toggle('active-code-line', idx + 1 === lineIdx);
    });
  },

  updatePlaybackUI() {
    const playBtn = document.getElementById('llBtnPlayPause');
    if (playBtn) playBtn.innerHTML = this.isPlaying ? '⏸️ Pause' : '▶️ Play';

    const stepCounter = document.getElementById('llStepCounter');
    if (stepCounter) {
      stepCounter.innerText = this.steps.length > 0 ? `Step ${this.currentStepIdx + 1} / ${this.steps.length}` : 'Ready';
    }
  },

  renderStageWithNodes(nodesArr, highlightId = null) {
    const container = document.getElementById('llNodesContainer');
    if (!container) return;

    if (nodesArr.length === 0) {
      container.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.5rem; padding:1.25rem 0.5rem;">
          <div style="background:rgba(59,130,246,0.18); border:1.5px solid var(--primary); padding:0.55rem 0.85rem; border-radius:var(--radius-md); text-align:center; font-family:var(--font-code); font-size:0.82rem; font-weight:700; color:var(--primary);">
            head pointer<br><span style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">NULL</span>
          </div>
          <span style="color:var(--text-dim); font-size:1.2rem;">➔ NULL (List Empty)</span>
        </div>
      `;
      return;
    }

    let html = `
      <div style="display:flex; align-items:center; gap:0.6rem; overflow-x:auto; padding:1.25rem 0.5rem; min-height:140px;">
        <div style="background:rgba(59,130,246,0.18); border:1.5px solid var(--primary); padding:0.6rem 0.9rem; border-radius:var(--radius-md); text-align:center; font-family:var(--font-code); font-size:0.82rem; font-weight:700; color:var(--primary); box-shadow:0 2px 8px rgba(59,130,246,0.2); flex-shrink:0;">
          head pointer<br><span style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">${nodesArr[0].addr}</span>
        </div>
        <div style="color:var(--primary); font-size:1.3rem; font-weight:800; padding:0 0.15rem; flex-shrink:0;">➔</div>
    `;

    for (let i = 0; i < nodesArr.length; i++) {
      const node = nodesArr[i];
      const isHighlighted = highlightId === node.id;
      const nextAddr = (i < nodesArr.length - 1) ? nodesArr[i + 1].addr : 'NULL';
      const prevAddr = (i > 0) ? nodesArr[i - 1].addr : 'NULL';

      html += `
        <div style="background:${isHighlighted ? 'rgba(16,185,129,0.28)' : 'var(--bg-surface)'}; border:2px solid ${isHighlighted ? 'var(--accent-green)' : 'var(--bg-surface-border)'}; border-radius:var(--radius-md); padding:0.75rem 0.85rem; display:flex; flex-direction:column; gap:0.35rem; min-width:140px; box-shadow:${isHighlighted ? '0 0 15px rgba(16,185,129,0.5)' : 'var(--shadow-card)'}; transition:all 0.3s ease; flex-shrink:0;">
          
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-dim); font-family:var(--font-code);">
            <span>Node #${i + 1}</span>
            <span>${node.addr}</span>
          </div>

          <div style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.4rem; text-align:center; font-size:1.1rem; font-weight:800; color:var(--text-main);">
            ${node.val}
          </div>

          <div style="font-size:0.72rem; color:var(--secondary); font-family:var(--font-code); text-align:center; line-height:1.3;">
            ${this.mode === 'doubly' ? `<span style="color:var(--text-muted);">prev: ${prevAddr}</span><br>` : ''}
            <span>next: ${nextAddr}</span>
          </div>
        </div>
      `;

      if (i < nodesArr.length - 1) {
        html += `
          <div style="display:inline-flex; align-items:center; justify-content:center; color:var(--secondary); font-size:1.35rem; font-weight:800; padding:0 0.15rem; flex-shrink:0;">
            ${this.mode === 'doubly' ? '⇄' : '➔'}
          </div>
        `;
      } else {
        html += `
          <div style="display:inline-flex; align-items:center; gap:0.3rem; color:var(--text-dim); font-size:1rem; font-weight:700; padding-left:0.2rem; flex-shrink:0;">
            <span>➔</span> <span style="background:rgba(255,255,255,0.05); padding:0.25rem 0.6rem; border-radius:var(--radius-sm); font-family:var(--font-code); font-size:0.78rem;">NULL</span>
          </div>
        `;
      }
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  renderStage(highlightId = null) {
    this.renderStageWithNodes(this.nodes, highlightId);
  },

  codeViewMode: 'snippet',

  toggleCodeViewMode(mode) {
    this.codeViewMode = mode;
    const btnSnippet = document.getElementById('llBtnCodeSnippet');
    const btnFull = document.getElementById('llBtnCodeFull');
    if (btnSnippet) btnSnippet.classList.toggle('active', mode === 'snippet');
    if (btnFull) btnFull.classList.toggle('active', mode === 'full');
    this.renderCCode(this.activeOp);
  },

  copyFullCCode() {
    const codeEl = document.getElementById('llFullCCodeText');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      const btn = document.getElementById('llBtnCopyCCode');
      if (btn) {
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy C Code'; }, 2000);
      }
    });
  },

  renderCCode(opKey) {
    const codeContainer = document.getElementById('llCCodeView');
    if (!codeContainer) return;

    if (this.codeViewMode === 'full') {
      this.renderFullCCode(opKey, codeContainer);
      return;
    }

    let codeLines = [];
    const isDoubly = this.mode === 'doubly';

    if (opKey === 'insertHead') {
      codeLines = [
        `struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));`,
        `newNode->data = val;`,
        isDoubly ? `newNode->prev = NULL; newNode->next = head;` : `newNode->next = head;`,
        isDoubly ? `if (head != NULL) head->prev = newNode; head = newNode;` : `head = newNode;`
      ];
    } else if (opKey === 'insertPos') {
      codeLines = [
        `struct Node* temp = head;`,
        `for (int i = 1; i < pos - 1 && temp != NULL; i++) temp = temp->next;`,
        `struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));`,
        `newNode->data = val;`,
        isDoubly ? `newNode->prev = temp; newNode->next = temp->next;` : `newNode->next = temp->next;`,
        isDoubly ? `if (temp->next) temp->next->prev = newNode; temp->next = newNode;` : `temp->next = newNode;`
      ];
    } else if (opKey === 'insertTail') {
      codeLines = [
        `struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));`,
        `newNode->data = val; newNode->next = NULL;`,
        isDoubly ? `if (head == NULL) { newNode->prev = NULL; head = newNode; }` : `if (head == NULL) head = newNode;`,
        isDoubly ? `else { struct Node* temp = head; while (temp->next) temp = temp->next; temp->next = newNode; newNode->prev = temp; }` : `else { struct Node* temp = head; while (temp->next) temp = temp->next; temp->next = newNode; }`
      ];
    } else if (opKey === 'deleteHead') {
      codeLines = [
        `if (head != NULL) {`,
        `    struct Node* temp = head;`,
        `    head = head->next;`,
        isDoubly ? `    if (head != NULL) head->prev = NULL;` : ``,
        `    free(temp);`,
        `}`
      ];
    } else if (opKey === 'deletePos') {
      codeLines = [
        `struct Node* temp = head;`,
        `for (int i = 1; i < pos - 1 && temp->next != NULL; i++) temp = temp->next;`,
        `struct Node* target = temp->next;`,
        isDoubly ? `temp->next = target->next; if (target->next) target->next->prev = temp;` : `temp->next = target->next;`,
        `free(target);`
      ];
    } else if (opKey === 'deleteTail') {
      codeLines = [
        `struct Node* temp = head;`,
        `while (temp->next && temp->next->next) temp = temp->next;`,
        `struct Node* tail = temp->next;`,
        `temp->next = NULL;`,
        `free(tail);`
      ];
    } else if (opKey === 'updatePos') {
      codeLines = [
        `struct Node* temp = head;`,
        `for (int i = 1; i < pos && temp != NULL; i++) temp = temp->next;`,
        `if (temp != NULL) temp->data = newVal;`
      ];
    } else if (opKey === 'searchVal') {
      codeLines = [
        `struct Node* temp = head; int pos = 1;`,
        `while (temp != NULL && temp->data != target) { temp = temp->next; pos++; }`,
        `if (temp != NULL) return pos; else return -1;`
      ];
    } else if (opKey === 'reverse') {
      codeLines = [
        isDoubly ? `struct Node *temp = NULL, *current = head;` : `struct Node *prev = NULL, *current = head, *next = NULL;`,
        isDoubly ? `while (current != NULL) { temp = current->prev; current->prev = current->next; current->next = temp; current = current->prev; }` : `while (current != NULL) { next = current->next; current->next = prev; prev = current; current = next; }`,
        isDoubly ? `if (temp != NULL) head = temp->prev;` : `head = prev;`
      ];
    } else {
      codeLines = [
        `struct Node* temp = head;`,
        `while (temp != NULL) {`,
        isDoubly ? `    printf("%d ⇄ ", temp->data);` : `    printf("%d -> ", temp->data);`,
        `    temp = temp->next;`,
        `}`
      ];
    }

    let codeHTML = `<div style="font-family:var(--font-code); font-size:0.85rem; line-height:1.6;">`;
    codeLines.forEach((lineText, idx) => {
      if (lineText) {
        codeHTML += `<div class="code-line" style="padding:0.2rem 0.5rem; border-radius:var(--radius-sm); font-family:var(--font-code); transition:all 0.3s ease;"><span style="color:var(--text-dim); margin-right:0.75rem; user-select:none; font-size:0.75rem;">${idx + 1}</span><span style="color:var(--text-main);">${lineText}</span></div>`;
      }
    });
    codeHTML += `</div>`;

    codeContainer.innerHTML = codeHTML;
  },

  renderFullCCode(opKey, container) {
    const isDoubly = this.mode === 'doubly';
    let fullCode = '';

    if (isDoubly) {
      fullCode = `#include <stdio.h>
#include <stdlib.h>

// Doubly Linked List Node Definition (24 Bytes)
struct Node {
    int data;
    struct Node* prev;
    struct Node* next;
};

// Insert at Beginning (Head) - O(1)
void insertHead(struct Node** head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->prev = NULL;
    newNode->next = *head;
    if (*head != NULL) (*head)->prev = newNode;
    *head = newNode;
}

// Print List Forward
void printList(struct Node* head) {
    struct Node* temp = head;
    while (temp != NULL) {
        printf("%d ⇄ ", temp->data);
        temp = temp->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL; // Initial empty list state
    insertHead(&head, 45);
    insertHead(&head, 28);
    insertHead(&head, 12);
    printf("Doubly Linked List Content:\\n");
    printList(head);
    return 0;
}`;
    } else {
      fullCode = `#include <stdio.h>
#include <stdlib.h>

// Singly Linked List Node Definition (16 Bytes)
struct Node {
    int data;
    struct Node* next;
};

// Insert at Beginning (Head) - O(1)
void insertHead(struct Node** head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = *head;
    *head = newNode;
}

// Print List Contents
void printList(struct Node* head) {
    struct Node* temp = head;
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL; // Initial empty list state
    insertHead(&head, 45);
    insertHead(&head, 28);
    insertHead(&head, 12);
    printf("Singly Linked List Content:\\n");
    printList(head);
    return 0;
}`;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
        <span style="font-size:0.8rem; color:var(--accent-green); font-weight:700;">Complete Executable GCC C Source Code</span>
        <button class="btn btn-secondary btn-sm" id="llBtnCopyCCode" onclick="LinkedListSim.copyFullCCode()">📋 Copy C Code</button>
      </div>
      <pre id="llFullCCodeText" style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem; font-family:var(--font-code); font-size:0.82rem; color:var(--secondary); overflow-x:auto; margin:0; line-height:1.5;"><code>${fullCode}</code></pre>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  LinkedListSim.init();
});
