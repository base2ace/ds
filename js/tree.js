/* ==========================================================================
   Base2ace Technologies Education - Interactive Trees Engine
   Module 4: Trees (Visual Tree Canvas, Interactive Terminology Highlighting,
   Traversals, BST Simulator, Complexity, C Programs)
   ========================================================================== */

const TreeEngine = {
  activeView: 'viewTreeFoundations',
  root: null,
  
  // Terminology Highlighting State
  activeTerm: null,
  
  // Animation & Playback State
  steps: [],
  currentStepIdx: 0,
  isPlaying: false,
  playInterval: null,
  speedMs: 1200,
  playbackMode: 'manual', // 'auto' or 'manual'

  init() {
    // Default initial BST tree
    this.root = {
      val: 50,
      left: {
        val: 30,
        left: { val: 20, left: null, right: null },
        right: { val: 40, left: null, right: null }
      },
      right: {
        val: 70,
        left: { val: 60, left: null, right: null },
        right: { val: 80, left: null, right: null }
      }
    };

    this.renderTermStage();
    this.renderTraversalStage();
    this.renderStage();
    this.renderCCode();
  },

  switchSubView(viewId) {
    this.activeView = viewId;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active-view'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active-view');

    document.querySelectorAll('.sidebar-item[data-tree-view]').forEach(item => {
      item.classList.toggle('active', item.dataset.treeView === viewId);
    });

    if (viewId === 'viewTreeFoundations') {
      this.renderTermStage(this.activeTerm);
    } else if (viewId === 'viewTreeTraversals') {
      this.renderTraversalStage();
    } else if (viewId === 'viewTreeSim') {
      this.renderStage();
      this.renderCCode();
    }
  },

  setPlaybackMode(mode) {
    this.playbackMode = mode;
    const btnAuto = document.getElementById('treeBtnModeAuto');
    const btnManual = document.getElementById('treeBtnModeManual');
    if (btnAuto) btnAuto.classList.toggle('active', mode === 'auto');
    if (btnManual) btnManual.classList.toggle('active', mode === 'manual');
  },

  clearAlerts() {
    const alertEl = document.getElementById('treeAlertBanner');
    if (alertEl) alertEl.style.display = 'none';
  },

  showAlert(msg, type = 'info') {
    const alertEl = document.getElementById('treeAlertBanner');
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

  // CORE REUSABLE VISUAL TREE HTML BUILDER
  buildTreeCanvasHTML(node, highlightedVals = [], termKey = null) {
    if (!node) return '<div style="color:var(--text-muted); font-family:var(--font-code); text-align:center;">Tree is Empty (root == NULL)</div>';

    const buildNode = (n) => {
      if (!n) return '';
      const isHL = highlightedVals.includes(n.val);

      let badgeText = '';
      if (isHL && termKey === 'root' && n.val === 50) badgeText = 'ROOT';
      else if (isHL && termKey === 'leaf' && (n.val === 20 || n.val === 40 || n.val === 60 || n.val === 80)) badgeText = 'LEAF';

      return `
        <div style="display:flex; flex-direction:column; align-items:center; position:relative; margin:0 0.85rem;">
          <div style="
            width: 56px; 
            height: 56px; 
            border-radius: 50%; 
            background: ${isHL ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #1e293b, #0f172a)'}; 
            border: 3px solid ${isHL ? '#34d399' : '#3b82f6'}; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            font-family: var(--font-code); 
            font-weight: 800; 
            font-size: 1.2rem; 
            color: #ffffff; 
            box-shadow: ${isHL ? '0 0 25px rgba(16,185,129,0.85)' : '0 4px 15px rgba(0,0,0,0.6)'}; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            z-index: 2;
          ">
            ${n.val}
            ${badgeText ? `<span style="position:absolute; top:-24px; background:${termKey==='leaf'?'var(--accent-red)':'var(--primary)'}; color:#fff; font-size:0.65rem; font-weight:800; padding:0.15rem 0.45rem; border-radius:4px; font-family:var(--font-sans); white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.5);">${badgeText}</span>` : ''}
          </div>

          ${(n.left || n.right) ? `
            <div style="display:flex; justify-content:space-between; width:100%; margin-top:1rem; position:relative; padding-top:0.75rem;">
              <div style="position:absolute; top:0; left:22%; right:22%; height:2px; background:rgba(255,255,255,0.2);"></div>
              <div style="flex:1; display:flex; justify-content:center; position:relative;">${buildNode(n.left)}</div>
              <div style="flex:1; display:flex; justify-content:center; position:relative;">${buildNode(n.right)}</div>
            </div>
          ` : ''}
        </div>
      `;
    };

    return `
      <div style="display:flex; justify-content:center; align-items:flex-start; padding:1.5rem 0.5rem; width:100%; overflow-x:auto;">
        ${buildNode(node)}
      </div>
    `;
  },

  // TERMINOLOGY INTERACTIVE HIGHLIGHTING ENGINE
  highlightTerm(termKey, termTitle, descText) {
    this.activeTerm = termKey;

    document.querySelectorAll('.term-card').forEach(card => {
      card.classList.toggle('active-term-card', card.dataset.term === termKey);
    });

    const statusBanner = document.getElementById('termStatusBanner');
    if (statusBanner) {
      statusBanner.innerHTML = `
        <div style="background:rgba(59,130,246,0.15); border:1px solid var(--primary); padding:0.75rem 1.1rem; border-radius:var(--radius-md); font-size:0.9rem; line-height:1.5;">
          <strong style="color:var(--secondary);">🔍 Terminology Inspector: ${termTitle}</strong> — ${descText}
        </div>
      `;
    }

    this.renderTermStage(termKey);
  },

  renderTermStage(termKey = null) {
    const container = document.getElementById('termTreeStageContainer');
    if (!container) return;

    let highlightedVals = [];
    let badgeLabel = '';

    switch (termKey) {
      case 'root':
        highlightedVals = [50];
        badgeLabel = '👑 ROOT NODE (Node 50)';
        break;
      case 'parent':
        highlightedVals = [30, 70];
        badgeLabel = '👨‍👧 PARENT NODES (Nodes 30 & 70)';
        break;
      case 'child':
        highlightedVals = [20, 40, 60, 80];
        badgeLabel = '👶 CHILD NODES (Nodes 20, 40, 60, 80)';
        break;
      case 'siblings':
        highlightedVals = [20, 40];
        badgeLabel = '👯 SIBLINGS (Nodes 20 & 40 sharing Parent 30)';
        break;
      case 'leaf':
        highlightedVals = [20, 40, 60, 80];
        badgeLabel = '🍃 LEAF NODES (Nodes 20, 40, 60, 80 with 0 children)';
        break;
      case 'internal':
        highlightedVals = [50, 30, 70];
        badgeLabel = '🏛️ INTERNAL NODES (Nodes 50, 30, 70 with ≥1 child)';
        break;
      case 'ancestor':
        highlightedVals = [50, 30];
        badgeLabel = '👴 ANCESTORS OF NODE 20 (Nodes 50 & 30)';
        break;
      case 'descendant':
        highlightedVals = [20, 40];
        badgeLabel = '🧒 DESCENDANTS OF NODE 30 (Nodes 20 & 40)';
        break;
      case 'degree':
        highlightedVals = [50];
        badgeLabel = '📐 DEGREE = 2 (Node 50 has 2 children)';
        break;
      case 'depth':
        highlightedVals = [50, 30, 20];
        badgeLabel = '📏 DEPTH OF NODE 20 = 2 Edges from Root';
        break;
      case 'height':
        highlightedVals = [50, 30, 20];
        badgeLabel = '📐 HEIGHT OF TREE = 2 Edges (Longest path to leaf)';
        break;
      case 'level':
        highlightedVals = [50];
        badgeLabel = '📊 LEVEL 1 (Root Node 50)';
        break;
      case 'edge':
        highlightedVals = [50, 30];
        badgeLabel = '🔗 EDGE (Link connecting 50 ➔ 30)';
        break;
      case 'forest':
        highlightedVals = [30, 20, 40, 70, 60, 80];
        badgeLabel = '🌲🌲 FOREST (2 Disjoint Subtrees [30,20,40] and [70,60,80])';
        break;
      default:
        highlightedVals = [];
        badgeLabel = '👆 Click any terminology card below to inspect & highlight nodes!';
    }

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:0.85rem; width:100%;">
        <div style="font-size:0.92rem; color:var(--accent-green); font-weight:800; font-family:var(--font-sans); text-transform:uppercase; letter-spacing:0.04em;">${badgeLabel}</div>
        ${this.buildTreeCanvasHTML(this.root, highlightedVals, termKey)}
      </div>
    `;
  },

  // TRAVERSALS VISUAL ENGINE
  renderTraversalStage(highlightVal = null) {
    const container = document.getElementById('traversalTreeStageContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:0.85rem; width:100%;">
        <div style="font-size:0.88rem; color:var(--secondary); font-weight:700;">${highlightVal ? `Active Visited Node: ${highlightVal}` : 'Select a Traversal Mode below'}</div>
        ${this.buildTreeCanvasHTML(this.root, highlightVal ? [highlightVal] : [])}
      </div>
    `;
  },

  // BST SIMULATOR STAGE
  renderStage(highlightVal = null) {
    const container = document.getElementById('treeStageContainer');
    if (!container) return;

    container.innerHTML = this.buildTreeCanvasHTML(this.root, highlightVal ? [highlightVal] : []);
  },

  // BST OPERATIONS
  insertOp() {
    this.clearAlerts();
    const valInput = document.getElementById('treeValInput');
    const val = valInput ? parseInt(valInput.value) || 45 : 45;

    this.generateInsertSteps(val);
  },

  searchOp() {
    this.clearAlerts();
    const valInput = document.getElementById('treeValInput');
    const val = valInput ? parseInt(valInput.value) || 40 : 40;

    this.generateSearchSteps(val);
  },

  deleteOp() {
    this.clearAlerts();
    const valInput = document.getElementById('treeValInput');
    const val = valInput ? parseInt(valInput.value) || 30 : 30;

    this.generateDeleteSteps(val);
  },

  findMinOp() {
    this.clearAlerts();
    let curr = this.root;
    if (!curr) { this.showAlert('Tree is empty', 'warning'); return; }
    while (curr.left) curr = curr.left;
    this.showAlert(`⬇️ MINIMUM ELEMENT: Node ${curr.val} (Leftmost leaf)`, 'success');
    this.renderStage(curr.val);
  },

  findMaxOp() {
    this.clearAlerts();
    let curr = this.root;
    if (!curr) { this.showAlert('Tree is empty', 'warning'); return; }
    while (curr.right) curr = curr.right;
    this.showAlert(`⬆️ MAXIMUM ELEMENT: Node ${curr.val} (Rightmost leaf)`, 'success');
    this.renderStage(curr.val);
  },

  // BST STEP GENERATORS
  generateInsertSteps(val) {
    this.stopPlayback();
    this.steps = [];

    const cloneTree = (t) => JSON.parse(JSON.stringify(t));
    const snapshot = (treeState, currVal, desc, codeLineIdx, vars) => {
      return {
        tree: cloneTree(treeState),
        highlightVal: currVal,
        desc: desc,
        codeLineIdx: codeLineIdx,
        vars: vars
      };
    };

    let tempTree = cloneTree(this.root);
    if (!tempTree) {
      tempTree = { val: val, left: null, right: null };
      this.steps.push(snapshot(tempTree, val, `Root is NULL. Create new root node with value ${val}`, 1, { 'root': val }));
      this.root = tempTree;
    } else {
      let curr = tempTree;
      let parent = null;

      this.steps.push(snapshot(tempTree, curr.val, `Start BST insertion at root (${curr.val}) for target ${val}`, 1, { 'curr': curr.val, 'target': val }));

      while (curr) {
        parent = curr;
        if (val < curr.val) {
          this.steps.push(snapshot(tempTree, curr.val, `${val} < ${curr.val}: Move to LEFT child`, 2, { 'curr': curr.val, 'direction': 'LEFT' }));
          if (!curr.left) {
            curr.left = { val: val, left: null, right: null };
            this.steps.push(snapshot(tempTree, val, `Found empty left slot! Attach new node ${val} to parent ${parent.val}->left. Insert Complete!`, 3, { 'parent': parent.val, 'new_node': val }));
            break;
          }
          curr = curr.left;
        } else if (val > curr.val) {
          this.steps.push(snapshot(tempTree, curr.val, `${val} > ${curr.val}: Move to RIGHT child`, 2, { 'curr': curr.val, 'direction': 'RIGHT' }));
          if (!curr.right) {
            curr.right = { val: val, left: null, right: null };
            this.steps.push(snapshot(tempTree, val, `Found empty right slot! Attach new node ${val} to parent ${parent.val}->right. Insert Complete!`, 3, { 'parent': parent.val, 'new_node': val }));
            break;
          }
          curr = curr.right;
        } else {
          this.showAlert(`Duplicate value ${val} already exists in BST!`, 'warning');
          return;
        }
      }
      this.root = tempTree;
    }

    this.currentStepIdx = 0;
    this.playSteps();
  },

  generateSearchSteps(val) {
    this.stopPlayback();
    this.steps = [];

    const cloneTree = (t) => JSON.parse(JSON.stringify(t));
    const snapshot = (treeState, currVal, desc, codeLineIdx, vars) => {
      return {
        tree: cloneTree(treeState),
        highlightVal: currVal,
        desc: desc,
        codeLineIdx: codeLineIdx,
        vars: vars
      };
    };

    let curr = this.root;
    let found = false;

    while (curr) {
      this.steps.push(snapshot(this.root, curr.val, `Comparing target (${val}) with current node (${curr.val})`, 1, { 'curr': curr.val, 'target': val }));
      if (val === curr.val) {
        found = true;
        this.steps.push(snapshot(this.root, curr.val, `🎉 FOUND! Node ${val} exists in the BST!`, 2, { 'found': 'YES', 'val': val }));
        break;
      } else if (val < curr.val) {
        this.steps.push(snapshot(this.root, curr.val, `${val} < ${curr.val}: Go LEFT`, 3, { 'next': 'LEFT' }));
        curr = curr.left;
      } else {
        this.steps.push(snapshot(this.root, curr.val, `${val} > ${curr.val}: Go RIGHT`, 3, { 'next': 'RIGHT' }));
        curr = curr.right;
      }
    }

    if (!found) {
      this.steps.push(snapshot(this.root, null, `❌ NOT FOUND! Value ${val} is not present in BST.`, 4, { 'found': 'NO' }));
    }

    this.currentStepIdx = 0;
    this.playSteps();
  },

  generateDeleteSteps(val) {
    this.stopPlayback();
    this.steps = [];

    const cloneTree = (t) => JSON.parse(JSON.stringify(t));
    const snapshot = (treeState, currVal, desc, codeLineIdx, vars) => {
      return {
        tree: cloneTree(treeState),
        highlightVal: currVal,
        desc: desc,
        codeLineIdx: codeLineIdx,
        vars: vars
      };
    };

    const deleteHelper = (node, key) => {
      if (!node) return null;
      if (key < node.val) {
        this.steps.push(snapshot(this.root, node.val, `Search key ${key} < ${node.val}: Move Left`, 1, { 'curr': node.val }));
        node.left = deleteHelper(node.left, key);
      } else if (key > node.val) {
        this.steps.push(snapshot(this.root, node.val, `Search key ${key} > ${node.val}: Move Right`, 1, { 'curr': node.val }));
        node.right = deleteHelper(node.right, key);
      } else {
        this.steps.push(snapshot(this.root, node.val, `Target Node ${key} Found! Check deletion cases...`, 2, { 'target': key }));
        if (!node.left && !node.right) {
          this.steps.push(snapshot(this.root, node.val, `Case 1: Leaf node (0 children). Delete node ${key} directly!`, 3, { 'case': 'Leaf Node' }));
          return null;
        } else if (!node.left) {
          this.steps.push(snapshot(this.root, node.right.val, `Case 2: One child (Right child). Replace node ${key} with right child ${node.right.val}`, 4, { 'replace_with': node.right.val }));
          return node.right;
        } else if (!node.right) {
          this.steps.push(snapshot(this.root, node.left.val, `Case 2: One child (Left child). Replace node ${key} with left child ${node.left.val}`, 4, { 'replace_with': node.left.val }));
          return node.left;
        } else {
          let minRight = node.right;
          while (minRight.left) minRight = minRight.left;
          this.steps.push(snapshot(this.root, minRight.val, `Case 3: Two children. Find Inorder Successor (min in right subtree) = ${minRight.val}`, 5, { 'successor': minRight.val }));
          node.val = minRight.val;
          this.steps.push(snapshot(this.root, node.val, `Copied successor value ${minRight.val} into node ${key}. Delete successor from right subtree...`, 6, { 'node_val': node.val }));
          node.right = deleteHelper(node.right, minRight.val);
        }
      }
      return node;
    };

    let tempTree = cloneTree(this.root);
    tempTree = deleteHelper(tempTree, val);
    this.root = tempTree;

    this.currentStepIdx = 0;
    this.playSteps();
  },

  playSteps() {
    if (this.playbackMode === 'auto') {
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
    } else {
      this.isPlaying = false;
      this.updatePlaybackUI();
    }

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
    this.renderStage(step.highlightVal);

    const stepDescEl = document.getElementById('treeStepDescBanner');
    if (stepDescEl) {
      stepDescEl.innerHTML = `<strong>Step ${this.currentStepIdx + 1} of ${this.steps.length}:</strong> ${step.desc}`;
    }

    this.renderVariableWatch(step.vars);
    this.highlightCCodeLine(step.codeLineIdx);
    this.updatePlaybackUI();
  },

  renderVariableWatch(varsObj) {
    const watchEl = document.getElementById('treeVarWatchBox');
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

  highlightCCodeLine(lineIdx) {
    const codeView = document.getElementById('treeCCodeView');
    if (!codeView) return;

    const lines = codeView.querySelectorAll('.code-line');
    lines.forEach((line, idx) => {
      line.classList.toggle('active-code-line', idx + 1 === lineIdx);
    });
  },

  updatePlaybackUI() {
    const playBtn = document.getElementById('treeBtnPlayPause');
    if (playBtn) playBtn.innerHTML = this.isPlaying ? '⏸️ Pause' : '▶️ Play';

    const stepCounter = document.getElementById('treeStepCounter');
    if (stepCounter) {
      stepCounter.innerText = this.steps.length > 0 ? `Step ${this.currentStepIdx + 1} / ${this.steps.length}` : 'Ready';
    }
  },

  // TRAVERSALS RUNNER WITH STEP HIGHLIGHTING IN STAGE
  runTraversal(type) {
    this.clearAlerts();
    const result = [];
    const sequence = [];

    const traverseInorder = (n) => {
      if (!n) return;
      traverseInorder(n.left);
      result.push(n.val);
      sequence.push(n.val);
      traverseInorder(n.right);
    };

    const traversePreorder = (n) => {
      if (!n) return;
      result.push(n.val);
      sequence.push(n.val);
      traversePreorder(n.left);
      traversePreorder(n.right);
    };

    const traversePostorder = (n) => {
      if (!n) return;
      traversePostorder(n.left);
      traversePostorder(n.right);
      result.push(n.val);
      sequence.push(n.val);
    };

    const traverseLevelOrder = (n) => {
      if (!n) return;
      const q = [n];
      while (q.length > 0) {
        const curr = q.shift();
        result.push(curr.val);
        sequence.push(curr.val);
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
      }
    };

    if (type === 'inorder') traverseInorder(this.root);
    else if (type === 'preorder') traversePreorder(this.root);
    else if (type === 'postorder') traversePostorder(this.root);
    else if (type === 'levelorder') traverseLevelOrder(this.root);

    const resultBox = document.getElementById('treeTraversalResult');
    if (resultBox) {
      resultBox.innerHTML = `
        <div style="background:var(--bg-main); border:1.5px solid var(--accent-green); padding:0.85rem 1.1rem; border-radius:var(--radius-md); font-family:var(--font-code); font-size:0.95rem;">
          <span style="color:var(--text-muted); text-transform:uppercase; font-size:0.8rem; font-weight:700;">${type} Traversal Output: </span>
          <strong style="color:var(--accent-green);">${result.join(' ➔ ')}</strong>
        </div>
      `;
    }

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx >= sequence.length) {
        clearInterval(interval);
        return;
      }
      this.renderTraversalStage(sequence[stepIdx]);
      stepIdx++;
    }, 800);
  },

  codeViewMode: 'snippet',

  toggleCodeViewMode(mode) {
    this.codeViewMode = mode;
    const btnSnippet = document.getElementById('treeBtnCodeSnippet');
    const btnFull = document.getElementById('treeBtnCodeFull');
    if (btnSnippet) btnSnippet.classList.toggle('active', mode === 'snippet');
    if (btnFull) btnFull.classList.toggle('active', mode === 'full');
    this.renderCCode();
  },

  copyFullCCode() {
    const codeEl = document.getElementById('treeFullCCodeText');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      const btn = document.getElementById('treeBtnCopyCCode');
      if (btn) {
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy C Code'; }, 2000);
      }
    });
  },

  renderCCode() {
    const codeContainer = document.getElementById('treeCCodeView');
    if (!codeContainer) return;

    if (this.codeViewMode === 'full') {
      this.renderFullCCode(codeContainer);
      return;
    }

    const codeLines = [
      `if (root == NULL) return createNode(val);`,
      `if (val < root->data) root->left = insert(root->left, val);`,
      `else if (val > root->data) root->right = insert(root->right, val);`
    ];

    let codeHTML = `<div style="font-family:var(--font-code); font-size:0.85rem; line-height:1.6;">`;
    codeLines.forEach((lineText, idx) => {
      codeHTML += `<div class="code-line" style="padding:0.2rem 0.5rem; border-radius:var(--radius-sm); font-family:var(--font-code); transition:all 0.3s ease;"><span style="color:var(--text-dim); margin-right:0.75rem; user-select:none; font-size:0.75rem;">${idx + 1}</span><span style="color:var(--text-main);">${lineText}</span></div>`;
    });
    codeHTML += `</div>`;

    codeContainer.innerHTML = codeHTML;
  },

  renderFullCCode(container) {
    const fullCode = `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

struct Node* createNode(int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

struct Node* insert(struct Node* root, int val) {
    if (root == NULL) return createNode(val);
    if (val < root->data) root->left = insert(root->left, val);
    else if (val > root->data) root->right = insert(root->right, val);
    return root;
}

void inorder(struct Node* root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

int main() {
    struct Node* root = NULL;
    root = insert(root, 50);
    insert(root, 30);
    insert(root, 70);
    insert(root, 20);
    insert(root, 40);

    printf("Inorder Traversal: ");
    inorder(root);
    printf("\\n");
    return 0;
}`;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
        <span style="font-size:0.8rem; color:var(--accent-green); font-weight:700;">Complete Executable GCC C Source Code</span>
        <button class="btn btn-secondary btn-sm" id="treeBtnCopyCCode" onclick="TreeEngine.copyFullCCode()">📋 Copy C Code</button>
      </div>
      <pre id="treeFullCCodeText" style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem; font-family:var(--font-code); font-size:0.82rem; color:var(--secondary); overflow-x:auto; margin:0; line-height:1.5;"><code>${fullCode}</code></pre>
    `;
  }
};

// Aliases and Auto-initialization
var TreeSim = TreeEngine;

const initTreeAll = () => {
  TreeEngine.init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTreeAll);
} else {
  initTreeAll();
}
window.addEventListener('load', initTreeAll);
