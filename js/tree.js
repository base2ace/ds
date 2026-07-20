/* ==========================================================================
   Base2ace Technologies Education - Interactive Binary Search Tree Engine
   ========================================================================== */

const TreeSim = {
  activeView: 'viewTreeSim',
  root: null,

  init() {
    // Default sample BST
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
  },

  renderStage(highlightVal = null) {
    const container = document.getElementById('treeStageContainer');
    if (!container) return;

    if (!this.root) {
      container.innerHTML = `<div style="color:var(--text-muted);">Tree is Empty (root == NULL)</div>`;
      return;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:center; padding:1.5rem 0.5rem; overflow-x:auto;">
        ${this.renderNodeHTML(this.root, highlightVal)}
      </div>
    `;
  },

  renderNodeHTML(node, highlightVal) {
    if (!node) return '';

    const isHL = highlightVal === node.val;

    return `
      <div style="display:flex; flex-direction:column; align-items:center; margin:0 0.75rem;">
        <div style="background:${isHL ? 'rgba(16,185,129,0.3)' : 'var(--bg-surface)'}; border:2px solid ${isHL ? 'var(--accent-green)' : 'var(--primary)'}; border-radius:50%; width:48px; height:48px; display:flex; justify-content:center; align-items:center; font-family:var(--font-code); font-weight:800; font-size:1.05rem; color:var(--text-main); box-shadow:var(--shadow-card);">
          ${node.val}
        </div>

        ${(node.left || node.right) ? `
          <div style="display:flex; justify-content:space-between; width:100%; margin-top:0.5rem; border-top:2px solid var(--bg-surface-border); padding-top:0.5rem;">
            <div style="flex:1; display:flex; justify-content:center;">${this.renderNodeHTML(node.left, highlightVal)}</div>
            <div style="flex:1; display:flex; justify-content:center;">${this.renderNodeHTML(node.right, highlightVal)}</div>
          </div>
        ` : ''}
      </div>
    `;
  },

  insert() {
    const valInput = document.getElementById('treeValInput');
    const val = valInput ? parseInt(valInput.value) || Math.floor(Math.random() * 90 + 10) : 45;
    this.root = this.insertNode(this.root, val);
    this.renderStage(val);
    this.renderCCode('insert');
  },

  insertNode(node, val) {
    if (!node) return { val: val, left: null, right: null };
    if (val < node.val) node.left = this.insertNode(node.left, val);
    else if (val > node.val) node.right = this.insertNode(node.right, val);
    return node;
  },

  inorder() {
    const result = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.val);
      traverse(node.right);
    };
    traverse(this.root);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= result.length) {
        clearInterval(interval);
        this.renderStage();
        return;
      }
      this.renderStage(result[idx]);
      idx++;
    }, 800);

    this.renderCCode('inorder');
  },

  renderCCode(op = 'insert') {
    const codeContainer = document.getElementById('treeCCodeView');
    if (!codeContainer) return;

    let code = '';
    if (op === 'insert') {
      code = `// BST Node Insertion (C Language)
struct TreeNode* insert(struct TreeNode* node, int key) {
    if (node == NULL) return createNode(key);
    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);
    return node;
}`;
    } else {
      code = `// BST Inorder Traversal (Left - Root - Right)
void inorder(struct TreeNode* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->key);
        inorder(root->right);
    }
}`;
    }

    codeContainer.innerHTML = `<pre style="font-family:var(--font-code); font-size:0.85rem; color:var(--text-main); line-height:1.5;"><code>${code}</code></pre>`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  TreeSim.init();
});
