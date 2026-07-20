/* ==========================================================================
   Base2ace Technologies Education - Interactive Graph Algorithms Engine
   Module 5: Graphs (Foundations, 12 Types, Matrix vs List, BFS/DFS, Cycle Detection, C Code)
   ========================================================================== */

const GraphEngine = {
  activeView: 'viewGraphFoundations',
  repMode: 'matrix', // 'matrix' or 'list' or 'edgelist'
  
  // Graph Network Data
  vertices: ['A', 'B', 'C', 'D', 'E'],
  matrix: [
    [0, 1, 1, 0, 0], // A ➔ B, C
    [1, 0, 0, 1, 0], // B ➔ A, D
    [1, 0, 0, 1, 1], // C ➔ A, D, E
    [0, 1, 1, 0, 1], // D ➔ B, C, E
    [0, 0, 1, 1, 0]  // E ➔ C, D
  ],

  // Terminology Highlighting State
  activeTerm: null,

  init() {
    this.renderTermStage();
    this.renderTraversalStage();
    this.renderRepStage();
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

    if (viewId === 'viewGraphFoundations') {
      this.renderTermStage(this.activeTerm);
    } else if (viewId === 'viewGraphRep') {
      this.renderRepStage();
      this.renderCCode();
    } else if (viewId === 'viewGraphTraversals') {
      this.renderTraversalStage();
    }
  },

  setRepMode(m) {
    this.repMode = m;
    const btnMatrix = document.getElementById('btnRepMatrix');
    const btnList = document.getElementById('btnRepList');
    const btnEdgeList = document.getElementById('btnRepEdgeList');
    if (btnMatrix) btnMatrix.classList.toggle('active', m === 'matrix');
    if (btnList) btnList.classList.toggle('active', m === 'list');
    if (btnEdgeList) btnEdgeList.classList.toggle('active', m === 'edgelist');

    this.renderRepStage();
    this.renderCCode();
  },

  // TERMINOLOGY INTERACTIVE HIGHLIGHTING ENGINE
  highlightTerm(termKey, termTitle, descText) {
    this.activeTerm = termKey;

    document.querySelectorAll('.term-card').forEach(card => {
      card.classList.toggle('active-term-card', card.dataset.term === termKey);
    });

    const statusBanner = document.getElementById('graphTermStatusBanner');
    if (statusBanner) {
      statusBanner.innerHTML = `
        <div style="background:rgba(59,130,246,0.15); border:1px solid var(--primary); padding:0.75rem 1.1rem; border-radius:var(--radius-md); font-size:0.9rem; line-height:1.5;">
          <strong style="color:var(--secondary);">🔍 Terminology Inspector: ${termTitle}</strong> — ${descText}
        </div>
      `;
    }

    this.renderTermStage(termKey);
  },

  // BUILD VISUAL GRAPH SVG CANVAS
  buildGraphSVG(highlightedVertices = [], highlightedEdges = [], badgeText = '') {
    const coords = {
      'A': { x: 220, y: 50 },
      'B': { x: 90,  y: 140 },
      'C': { x: 350, y: 140 },
      'D': { x: 130, y: 260 },
      'E': { x: 310, y: 260 }
    };

    const edges = [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
      { from: 'C', to: 'E' },
      { from: 'D', to: 'E' }
    ];

    let svgLines = '';
    edges.forEach(e => {
      const p1 = coords[e.from];
      const p2 = coords[e.to];
      const isEdgeHL = highlightedEdges.some(he => (he[0]===e.from && he[1]===e.to) || (he[0]===e.to && he[1]===e.from));

      svgLines += `
        <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" 
              stroke="${isEdgeHL ? '#34d399' : 'rgba(255,255,255,0.2)'}" 
              stroke-width="${isEdgeHL ? '4' : '2'}" 
              stroke-dasharray="${isEdgeHL ? 'none' : 'none'}" />
      `;
    });

    let svgNodes = '';
    Object.keys(coords).forEach(v => {
      const p = coords[v];
      const isHL = highlightedVertices.includes(v);

      svgNodes += `
        <g transform="translate(${p.x}, ${p.y})">
          <circle r="26" 
                  fill="${isHL ? 'url(#greenGlow)' : 'url(#blueGlow)'}" 
                  stroke="${isHL ? '#34d399' : '#3b82f6'}" 
                  stroke-width="3" 
                  filter="${isHL ? 'drop-shadow(0 0 12px rgba(16,185,129,0.8))' : 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))'}" />
          <text text-anchor="middle" dy="0.35em" fill="#ffffff" font-family="JetBrains Mono" font-weight="800" font-size="16">${v}</text>
        </g>
      `;
    });

    return `
      <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
        ${badgeText ? `<div style="font-size:0.9rem; color:var(--accent-green); font-weight:800; font-family:var(--font-sans); margin-bottom:0.75rem; text-transform:uppercase;">${badgeText}</div>` : ''}
        <svg width="440" height="310" viewBox="0 0 440 310" style="overflow:visible;">
          <defs>
            <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </radialGradient>
            <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#059669"/>
              <stop offset="100%" stop-color="#10b981"/>
            </radialGradient>
          </defs>
          ${svgLines}
          ${svgNodes}
        </svg>
      </div>
    `;
  },

  renderTermStage(termKey = null) {
    const container = document.getElementById('graphTermStageContainer');
    if (!container) return;

    let highlightedVertices = [];
    let highlightedEdges = [];
    let badgeText = '';

    switch (termKey) {
      case 'vertex':
        highlightedVertices = ['A', 'B', 'C', 'D', 'E'];
        badgeText = '📍 VERTICES (Nodes A, B, C, D, E)';
        break;
      case 'edge':
        highlightedEdges = [['A','B'], ['A','C'], ['B','D'], ['C','D'], ['C','E'], ['D','E']];
        badgeText = '🔗 EDGES (Connecting Links between Vertices)';
        break;
      case 'adjacent':
        highlightedVertices = ['B', 'C'];
        highlightedEdges = [['A','B'], ['A','C']];
        badgeText = '🤝 ADJACENT VERTICES OF A (Nodes B & C)';
        break;
      case 'degree':
        highlightedVertices = ['C'];
        highlightedEdges = [['A','C'], ['C','D'], ['C','E']];
        badgeText = '📐 DEGREE OF C = 3 (Connected to A, D, E)';
        break;
      case 'path':
        highlightedVertices = ['A', 'B', 'D', 'E'];
        highlightedEdges = [['A','B'], ['B','D'], ['D','E']];
        badgeText = '🛤️ PATH FROM A TO E (A ➔ B ➔ D ➔ E)';
        break;
      case 'cycle':
        highlightedVertices = ['C', 'D', 'E'];
        highlightedEdges = [['C','D'], ['D','E'], ['C','E']];
        badgeText = '🔄 CYCLE DETECTED (Sub-network C ➔ D ➔ E ➔ C)';
        break;
      case 'connected':
        highlightedVertices = ['A', 'B', 'C', 'D', 'E'];
        badgeText = '🌐 CONNECTED GRAPH (Path exists between all pairs)';
        break;
      case 'disconnected':
        highlightedVertices = ['A', 'B'];
        badgeText = '🧩 DISCONNECTED GRAPH (Isolated Sub-networks)';
        break;
      case 'components':
        highlightedVertices = ['C', 'D', 'E'];
        badgeText = '🧱 CONNECTED COMPONENT (Sub-network [C, D, E])';
        break;
      default:
        badgeText = '👆 Click any terminology card below to inspect graph vertices & edges!';
    }

    container.innerHTML = this.buildGraphSVG(highlightedVertices, highlightedEdges, badgeText);
  },

  renderTraversalStage(highlightedVertex = null) {
    const container = document.getElementById('graphTraversalStageContainer');
    if (!container) return;

    container.innerHTML = this.buildGraphSVG(highlightedVertex ? [highlightedVertex] : [], [], highlightedVertex ? `Active Traversal Node: ${highlightedVertex}` : 'Select a Traversal Mode below');
  },

  renderRepStage(highlightIdx = null) {
    const container = document.getElementById('graphRepStageContainer');
    if (!container) return;

    let html = '';

    if (this.repMode === 'matrix') {
      html += `
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:1.5rem; border-radius:var(--radius-md); max-width:480px; margin:0 auto;">
          <h4 style="font-size:0.95rem; color:var(--secondary); margin-bottom:1rem; text-align:center;">Adjacency Matrix Representation (2D Array: adj[5][5])</h4>
          <table class="mem-table" style="text-align:center; width:100%;">
            <thead>
              <tr>
                <th></th>
                ${this.vertices.map(v => `<th>${v}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${this.matrix.map((row, r) => `
                <tr style="${highlightIdx === r ? 'background:rgba(16,185,129,0.2);' : ''}">
                  <td><strong style="color:var(--primary);">${this.vertices[r]}</strong></td>
                  ${row.map(val => `<td style="${val ? 'color:var(--accent-green); font-weight:800;' : 'color:var(--text-dim);'}">${val}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (this.repMode === 'list') {
      html += `
        <div style="display:flex; flex-direction:column; gap:0.75rem; max-width:500px; margin:0 auto; width:100%;">
          <h4 style="font-size:0.95rem; color:var(--primary); margin-bottom:0.4rem; text-align:center;">Adjacency List Representation (Array of Linked Lists)</h4>
          ${this.vertices.map((v, r) => {
            const neighbors = [];
            for (let c = 0; c < this.matrix[r].length; c++) {
              if (this.matrix[r][c]) neighbors.push(this.vertices[c]);
            }
            return `
              <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:0.65rem 1rem; border-radius:var(--radius-sm); display:flex; align-items:center; gap:0.5rem; font-family:var(--font-code); font-size:0.85rem;">
                <span style="background:var(--primary); color:#fff; font-weight:700; padding:0.2rem 0.6rem; border-radius:var(--radius-sm);">${v}</span>
                <span style="color:var(--text-muted);">➔</span>
                ${neighbors.map(n => `<span style="background:var(--bg-main); border:1px solid var(--bg-surface-border); padding:0.2rem 0.5rem; border-radius:var(--radius-sm); color:var(--accent-green); font-weight:700;">${n}</span> ➔`).join(' ')}
                <span style="color:var(--text-dim);">NULL</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      // Edge List
      html += `
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:1.5rem; border-radius:var(--radius-md); max-width:480px; margin:0 auto;">
          <h4 style="font-size:0.95rem; color:var(--accent-amber); margin-bottom:0.85rem; text-align:center;">Edge List Representation (List of Tuples: (u, v))</h4>
          <div style="display:flex; flex-wrap:wrap; gap:0.6rem; justify-content:center; font-family:var(--font-code);">
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main);">(A, B)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main);">(A, C)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main);">(B, D)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main);">(C, D)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main);">(C, E)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main);">(D, E)</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  // TRAVERSALS RUNNER
  runBFS() {
    const sequence = ['A', 'B', 'C', 'D', 'E'];
    const resultBox = document.getElementById('graphTraversalResult');
    if (resultBox) {
      resultBox.innerHTML = `
        <div style="background:var(--bg-main); border:1.5px solid var(--accent-green); padding:0.85rem 1.1rem; border-radius:var(--radius-md); font-family:var(--font-code); font-size:0.95rem;">
          <span style="color:var(--text-muted); text-transform:uppercase; font-size:0.8rem; font-weight:700;">BFS (Queue) Traversal Output: </span>
          <strong style="color:var(--accent-green);">${sequence.join(' ➔ ')}</strong>
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

  runDFS() {
    const sequence = ['A', 'B', 'D', 'C', 'E'];
    const resultBox = document.getElementById('graphTraversalResult');
    if (resultBox) {
      resultBox.innerHTML = `
        <div style="background:var(--bg-main); border:1.5px solid var(--primary); padding:0.85rem 1.1rem; border-radius:var(--radius-md); font-family:var(--font-code); font-size:0.95rem;">
          <span style="color:var(--text-muted); text-transform:uppercase; font-size:0.8rem; font-weight:700;">DFS (Stack / Recursion) Traversal Output: </span>
          <strong style="color:var(--primary);">${sequence.join(' ➔ ')}</strong>
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

  runCycleDetection(graphType) {
    const resultBox = document.getElementById('graphTraversalResult');
    if (resultBox) {
      if (graphType === 'undirected') {
        resultBox.innerHTML = `
          <div style="background:rgba(239,68,68,0.12); border:1.5px solid var(--accent-red); padding:0.85rem 1.1rem; border-radius:var(--radius-md); font-family:var(--font-code); font-size:0.95rem; color:var(--text-main);">
            <strong style="color:var(--accent-red);">🔄 Undirected Cycle Detection Result:</strong> 
            CYCLE DETECTED! Sub-network <code>C ➔ D ➔ E ➔ C</code> contains a back-edge. (Algorithm: DFS visited back-edge & Union-Find Disjoint Set).
          </div>
        `;
        this.renderTermStage('cycle');
      } else {
        resultBox.innerHTML = `
          <div style="background:rgba(239,68,68,0.12); border:1.5px solid var(--accent-red); padding:0.85rem 1.1rem; border-radius:var(--radius-md); font-family:var(--font-code); font-size:0.95rem; color:var(--text-main);">
            <strong style="color:var(--accent-red);">⚡ Directed Cycle Detection Result:</strong> 
            CYCLE DETECTED! Recursion Stack contains node currently active in DFS back-edge. (Algorithm: DFS Visited Array + Recursion Stack Array).
          </div>
        `;
        this.renderTermStage('cycle');
      }
    }
  },

  codeViewMode: 'snippet',

  toggleCodeViewMode(mode) {
    this.codeViewMode = mode;
    const btnSnippet = document.getElementById('graphBtnCodeSnippet');
    const btnFull = document.getElementById('graphBtnCodeFull');
    if (btnSnippet) btnSnippet.classList.toggle('active', mode === 'snippet');
    if (btnFull) btnFull.classList.toggle('active', mode === 'full');
    this.renderCCode();
  },

  copyFullCCode() {
    const codeEl = document.getElementById('graphFullCCodeText');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      const btn = document.getElementById('graphBtnCopyCCode');
      if (btn) {
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy C Code'; }, 2000);
      }
    });
  },

  renderCCode() {
    const codeContainer = document.getElementById('graphCCodeView');
    if (!codeContainer) return;

    if (this.codeViewMode === 'full') {
      this.renderFullCCode(codeContainer);
      return;
    }

    let codeLines = [];
    if (this.repMode === 'matrix') {
      codeLines = [
        `int adj[V][V] = {0};`,
        `adj[u][v] = 1; adj[v][u] = 1; // Undirected Edge`,
        `if (adj[u][v] == 1) printf("Edge Exists\\n");`
      ];
    } else {
      codeLines = [
        `struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));`,
        `newNode->dest = v; newNode->next = adj[u];`,
        `adj[u] = newNode;`
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
    const fullCode = `#include <stdio.h>
#include <stdlib.h>
#define V 5

// Adjacency Matrix Representation
int adj[V][V] = {0};

void addEdge(int u, int v) {
    adj[u][v] = 1;
    adj[v][u] = 1; // Undirected graph
}

void printMatrix() {
    printf("Adjacency Matrix:\\n");
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            printf("%d ", adj[i][j]);
        }
        printf("\\n");
    }
}

int main() {
    addEdge(0, 1); addEdge(0, 2);
    addEdge(1, 3); addEdge(2, 3);
    addEdge(2, 4); addEdge(3, 4);
    printMatrix();
    return 0;
}`;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
        <span style="font-size:0.8rem; color:var(--accent-green); font-weight:700;">Complete Executable GCC C Source Code</span>
        <button class="btn btn-secondary btn-sm" id="graphBtnCopyCCode" onclick="GraphEngine.copyFullCCode()">📋 Copy C Code</button>
      </div>
      <pre id="graphFullCCodeText" style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem; font-family:var(--font-code); font-size:0.82rem; color:var(--secondary); overflow-x:auto; margin:0; line-height:1.5;"><code>${fullCode}</code></pre>
    `;
  }
};

// Aliases and Auto-initialization
var GraphSim = GraphEngine;

const initGraphAll = () => {
  GraphEngine.init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGraphAll);
} else {
  initGraphAll();
}
window.addEventListener('load', initGraphAll);
