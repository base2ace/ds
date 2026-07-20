/* ==========================================================================
   Base2ace Technologies Education - Interactive Graph Algorithms Engine
   ========================================================================== */

const GraphSim = {
  activeView: 'viewGraphSim',
  repMode: 'matrix', // 'matrix' or 'list'
  vertices: ['A', 'B', 'C', 'D', 'E'],
  matrix: [
    [0, 1, 1, 0, 0], // A connected to B, C
    [1, 0, 0, 1, 0], // B connected to A, D
    [1, 0, 0, 1, 1], // C connected to A, D, E
    [0, 1, 1, 0, 1], // D connected to B, C, E
    [0, 0, 1, 1, 0]  // E connected to C, D
  ],

  init() {
    this.renderStage();
    this.renderCCode();
  },

  switchSubView(viewId) {
    this.activeView = viewId;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active-view'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active-view');

    document.querySelectorAll('.sidebar-item[data-graph-view]').forEach(item => {
      item.classList.toggle('active', item.dataset.graphView === viewId);
    });
  },

  setRepMode(m) {
    this.repMode = m;
    document.getElementById('btnRepMatrix').classList.toggle('active', m === 'matrix');
    document.getElementById('btnRepList').classList.toggle('active', m === 'list');
    this.renderStage();
    this.renderCCode();
  },

  renderStage(highlightIdx = null) {
    const container = document.getElementById('graphStageContainer');
    if (!container) return;

    let html = '';

    if (this.repMode === 'matrix') {
      html += `
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:1.25rem; border-radius:var(--radius-md); max-width:450px; margin:0 auto;">
          <h4 style="font-size:0.95rem; color:var(--secondary); margin-bottom:0.75rem; text-align:center;">Adjacency Matrix Representation (2D Array)</h4>
          <table class="complexity-table" style="text-align:center;">
            <thead>
              <tr>
                <th></th>
                ${this.vertices.map(v => `<th>${v}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${this.matrix.map((row, r) => `
                <tr style="${highlightIdx === r ? 'background:rgba(16,185,129,0.2);' : ''}">
                  <td><strong>${this.vertices[r]}</strong></td>
                  ${row.map(val => `<td style="${val ? 'color:var(--accent-green); font-weight:700;' : 'color:var(--text-dim);'}">${val}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      html += `
        <div style="display:flex; flex-direction:column; gap:0.75rem; max-width:480px; margin:0 auto;">
          <h4 style="font-size:0.95rem; color:var(--primary); margin-bottom:0.4rem; text-align:center;">Adjacency List Representation (Array of Linked Lists)</h4>
          ${this.vertices.map((v, r) => {
            const neighbors = [];
            for (let c = 0; c < this.matrix[r].length; c++) {
              if (this.matrix[r][c]) neighbors.push(this.vertices[c]);
            }
            const isHL = highlightIdx === r;
            return `
              <div style="background:${isHL ? 'rgba(16,185,129,0.2)' : 'var(--bg-surface)'}; border:1px solid var(--bg-surface-border); padding:0.65rem 1rem; border-radius:var(--radius-sm); display:flex; align-items:center; gap:0.5rem; font-family:var(--font-code); font-size:0.85rem;">
                <span style="background:var(--primary); color:#fff; font-weight:700; padding:0.2rem 0.6rem; border-radius:var(--radius-sm);">${v}</span>
                <span style="color:var(--text-muted);">➔</span>
                ${neighbors.map(n => `<span style="background:var(--bg-main); border:1px solid var(--bg-surface-border); padding:0.2rem 0.5rem; border-radius:var(--radius-sm); color:var(--accent-green); font-weight:700;">${n}</span> ➔`).join(' ')}
                <span style="color:var(--text-dim);">NULL</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    container.innerHTML = html;
  },

  runBFS() {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= this.vertices.length) {
        clearInterval(interval);
        this.renderStage();
        return;
      }
      this.renderStage(idx);
      idx++;
    }, 800);
    this.renderCCode('bfs');
  },

  runDFS() {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= this.vertices.length) {
        clearInterval(interval);
        this.renderStage();
        return;
      }
      this.renderStage(idx);
      idx++;
    }, 800);
    this.renderCCode('dfs');
  },

  renderCCode(op = 'bfs') {
    const codeContainer = document.getElementById('graphCCodeView');
    if (!codeContainer) return;

    let code = '';
    if (op === 'bfs') {
      code = `// Breadth-First Search (BFS) in C
void BFS(int startVertex) {
    struct Queue* q = createQueue();
    visited[startVertex] = 1;
    enqueue(q, startVertex);

    while (!isEmpty(q)) {
        int currentVertex = dequeue(q);
        printf("Visited %d\\n", currentVertex);
        // Visit all adjacent unvisited vertices
    }
}`;
    } else {
      code = `// Depth-First Search (DFS) in C
void DFS(int vertex) {
    visited[vertex] = 1;
    printf("Visited %d\\n", vertex);

    struct Node* temp = adjLists[vertex];
    while (temp != NULL) {
        int connectedVertex = temp->vertex;
        if (visited[connectedVertex] == 0) {
            DFS(connectedVertex); // Recursive call
        }
        temp = temp->next;
    }
}`;
    }

    codeContainer.innerHTML = `<pre style="font-family:var(--font-code); font-size:0.85rem; color:var(--text-main); line-height:1.5;"><code>${code}</code></pre>`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  GraphSim.init();
});
