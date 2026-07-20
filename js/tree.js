/* ==========================================================================
   Base2ace Technologies Education - Interactive Trees Engine
   Module 4: Trees (Binary Trees, BST, Traversals, Complexity, C Programs)
   ========================================================================== */

const TreeEngine = {
  activeView: 'viewTreeFoundations',
  root: null,
  
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

    if (viewId === 'viewTreeSim') {
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
        // Node found
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
          // Case 3: Two children
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
    this.renderTreeHTMLWithState(step.tree, step.highlightVal);

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

  renderTreeHTMLWithState(rootObj, highlightVal = null) {
    const container = document.getElementById('treeStageContainer');
    if (!container) return;

    if (!rootObj) {
      container.innerHTML = `<div style="color:var(--text-muted); font-family:var(--font-code); text-align:center;">root ➔ NULL (Tree is Empty)</div>`;
      return;
    }

    const renderNode = (node) => {
      if (!node) return '';
      const isHL = highlightVal === node.val;

      return `
        <div style="display:flex; flex-direction:column; align-items:center; margin:0 0.6rem;">
          <div style="background:${isHL ? 'rgba(16,185,129,0.35)' : 'var(--bg-surface)'}; border:2px solid ${isHL ? 'var(--accent-green)' : 'var(--primary)'}; border-radius:50%; width:50px; height:50px; display:flex; justify-content:center; align-items:center; font-family:var(--font-code); font-weight:800; font-size:1.1rem; color:var(--text-main); box-shadow:${isHL ? '0 0 16px rgba(16,185,129,0.6)' : 'var(--shadow-card)'}; transition:all 0.3s ease;">
            ${node.val}
          </div>

          ${(node.left || node.right) ? `
            <div style="display:flex; justify-content:space-between; width:100%; margin-top:0.6rem; border-top:2px solid var(--bg-surface-border); padding-top:0.6rem;">
              <div style="flex:1; display:flex; justify-content:center;">${renderNode(node.left)}</div>
              <div style="flex:1; display:flex; justify-content:center;">${renderNode(node.right)}</div>
            </div>
          ` : ''}
        </div>
      `;
    };

    container.innerHTML = `
      <div style="display:flex; justify-content:center; padding:1.5rem 0.5rem; overflow-x:auto;">
        ${renderNode(rootObj)}
      </div>
    `;
  },

  renderStage(highlightVal = null) {
    this.renderTreeHTMLWithState(this.root, highlightVal);
  },

  // TRAVERSALS RUNNER
  runTraversal(type) {
    this.clearAlerts();
    const result = [];

    const traverseInorder = (n) => {
      if (!n) return;
      traverseInorder(n.left);
      result.push(n.val);
      traverseInorder(n.right);
    };

    const traversePreorder = (n) => {
      if (!n) return;
      result.push(n.val);
      traversePreorder(n.left);
      traversePreorder(n.right);
    };

    const traversePostorder = (n) => {
      if (!n) return;
      traversePostorder(n.left);
      traversePostorder(n.right);
      result.push(n.val);
    };

    const traverseLevelOrder = (n) => {
      if (!n) return;
      const q = [n];
      while (q.length > 0) {
        const curr = q.shift();
        result.push(curr.val);
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
        <div style="background:var(--bg-main); border:1px solid var(--accent-green); padding:0.85rem 1.1rem; border-radius:var(--radius-md); font-family:var(--font-code); font-size:0.95rem;">
          <span style="color:var(--text-muted); text-transform:uppercase; font-size:0.8rem; font-weight:700;">${type} Traversal Output: </span>
          <strong style="color:var(--accent-green);">${result.join(' ➔ ')}</strong>
        </div>
      `;
    }
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

document.addEventListener('DOMContentLoaded', () => {
  TreeEngine.init();
});
