/* ==========================================================================
   Base2ace Technologies Education - Interactive Graph Algorithms Engine
   Module 5: Graphs (Foundations, 12 Types Lightbox Modal, Matrix vs List, BFS/DFS, Cycle Detection, C Code)
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
    this.bindModalEvents();
  },

  bindModalEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeGraphTypeModal();
    });
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

  // 12 GRAPH TYPES DETAILED DATA DICTIONARY FOR LIGHTBOX MODAL
  graphTypeDetails: {
    'undirected': {
      title: '1. Undirected Graph ↔️',
      badge: 'Bidirectional Links',
      desc: 'An Undirected Graph is a graph in which edges have no orientation or direction. If an edge exists between vertex u and vertex v, traversal is bidirectional: (u, v) is identical to (v, u).',
      apps: 'Facebook Friendships, Two-way road networks, Physical ethernet network cables.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="70" y1="90" x2="170" y2="40" stroke="#3b82f6" stroke-width="4"/>
          <line x1="170" y1="40" x2="270" y2="90" stroke="#3b82f6" stroke-width="4"/>
          <line x1="70" y1="90" x2="270" y2="90" stroke="#3b82f6" stroke-width="4"/>
          <circle cx="70" cy="90" r="26" fill="#1e293b" stroke="#3b82f6" stroke-width="3.5"/>
          <text x="70" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">A</text>
          <circle cx="170" cy="40" r="26" fill="#1e293b" stroke="#3b82f6" stroke-width="3.5"/>
          <text x="170" y="46" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">B</text>
          <circle cx="270" cy="90" r="26" fill="#1e293b" stroke="#3b82f6" stroke-width="3.5"/>
          <text x="270" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">C</text>
        </svg>
      `
    },
    'directed': {
      title: '2. Directed Graph (Digraph) ➔',
      badge: 'One-Way Arrows',
      desc: 'A Directed Graph (Digraph) contains edges that have a specific direction pointing from a source vertex u to a destination vertex v (u ➔ v). Traversal from v to u is only possible if an explicit reverse edge exists.',
      apps: 'Twitter/Instagram Followers, Web page hyperlinks (Google PageRank), One-way traffic streets.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="93" y1="78" x2="147" y2="52" stroke="#06b6d4" stroke-width="4"/>
          <polygon points="147,52 133,44 142,58" fill="#06b6d4"/>
          <line x1="193" y1="52" x2="247" y2="78" stroke="#06b6d4" stroke-width="4"/>
          <polygon points="247,78 233,72 242,86" fill="#06b6d4"/>
          <line x1="244" y1="90" x2="96" y2="90" stroke="#06b6d4" stroke-width="4"/>
          <polygon points="96,90 110,83 110,97" fill="#06b6d4"/>
          <circle cx="70" cy="90" r="26" fill="#1e293b" stroke="#06b6d4" stroke-width="3.5"/>
          <text x="70" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">A</text>
          <circle cx="170" cy="40" r="26" fill="#1e293b" stroke="#06b6d4" stroke-width="3.5"/>
          <text x="170" y="46" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">B</text>
          <circle cx="270" cy="90" r="26" fill="#1e293b" stroke="#06b6d4" stroke-width="3.5"/>
          <text x="270" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">C</text>
        </svg>
      `
    },
    'weighted': {
      title: '3. Weighted Graph ⚖️',
      badge: 'Edge Costs & Distances',
      desc: 'A Weighted Graph assigns a numerical weight to every edge. The weight represents distance, duration, monetary cost, or network latency between connected vertices.',
      apps: 'Google Maps GPS navigation (Dijkstra algorithm), Airline ticket pricing, Network bandwidth routing.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="70" y1="90" x2="170" y2="40" stroke="#f59e0b" stroke-width="4"/>
          <text x="105" y="55" fill="#f59e0b" font-family="JetBrains Mono" font-weight="800" font-size="14">w=5</text>
          <line x1="170" y1="40" x2="270" y2="90" stroke="#f59e0b" stroke-width="4"/>
          <text x="235" y="55" fill="#f59e0b" font-family="JetBrains Mono" font-weight="800" font-size="14">w=12</text>
          <line x1="70" y1="90" x2="270" y2="90" stroke="#f59e0b" stroke-width="4"/>
          <text x="170" y="122" text-anchor="middle" fill="#f59e0b" font-family="JetBrains Mono" font-weight="800" font-size="14">w=8</text>
          <circle cx="70" cy="90" r="26" fill="#1e293b" stroke="#f59e0b" stroke-width="3.5"/>
          <text x="70" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">A</text>
          <circle cx="170" cy="40" r="26" fill="#1e293b" stroke="#f59e0b" stroke-width="3.5"/>
          <text x="170" y="46" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">B</text>
          <circle cx="270" cy="90" r="26" fill="#1e293b" stroke="#f59e0b" stroke-width="3.5"/>
          <text x="270" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">C</text>
        </svg>
      `
    },
    'unweighted': {
      title: '4. Unweighted Graph ⚪',
      badge: 'Uniform Unit Weights',
      desc: 'An Unweighted Graph treats all edges as having equal unit weight (weight = 1). The shortest path between any two vertices in an unweighted graph is computed efficiently using Breadth-First Search (BFS).',
      apps: 'Degrees of separation games, Unweighted mazes, Peer-to-peer contact lists.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="70" y1="90" x2="170" y2="40" stroke="#10b981" stroke-width="4"/>
          <line x1="170" y1="40" x2="270" y2="90" stroke="#10b981" stroke-width="4"/>
          <line x1="70" y1="90" x2="270" y2="90" stroke="#10b981" stroke-width="4"/>
          <circle cx="70" cy="90" r="26" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="70" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">A</text>
          <circle cx="170" cy="40" r="26" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="170" y="46" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">B</text>
          <circle cx="270" cy="90" r="26" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="270" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">C</text>
        </svg>
      `
    },
    'cyclic': {
      title: '5. Cyclic Graph 🔄',
      badge: 'Contains Closed Loops',
      desc: 'A Cyclic Graph contains at least one cycle — a path sequence starting and ending at the exact same vertex without repeating any edge.',
      apps: 'Circular routing loops, Deadlock detection in OS process graphs, Chemical molecular ring bonds.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="93" y1="78" x2="147" y2="52" stroke="#ef4444" stroke-width="4"/>
          <polygon points="147,52 133,44 142,58" fill="#ef4444"/>
          <line x1="193" y1="52" x2="247" y2="78" stroke="#ef4444" stroke-width="4"/>
          <polygon points="247,78 233,72 242,86" fill="#ef4444"/>
          <line x1="244" y1="90" x2="96" y2="90" stroke="#ef4444" stroke-width="4"/>
          <polygon points="96,90 110,83 110,97" fill="#ef4444"/>
          <text x="170" y="150" text-anchor="middle" fill="#ef4444" font-family="JetBrains Mono" font-weight="800" font-size="13">LOOP DETECTED (A ➔ B ➔ C ➔ A)</text>
          <circle cx="70" cy="90" r="26" fill="#1e293b" stroke="#ef4444" stroke-width="3.5"/>
          <text x="70" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">A</text>
          <circle cx="170" cy="40" r="26" fill="#1e293b" stroke="#ef4444" stroke-width="3.5"/>
          <text x="170" y="46" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">B</text>
          <circle cx="270" cy="90" r="26" fill="#1e293b" stroke="#ef4444" stroke-width="3.5"/>
          <text x="270" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="16">C</text>
        </svg>
      `
    },
    'acyclic': {
      title: '6. Acyclic Graph ➡️',
      badge: 'Loop-Free Network',
      desc: 'An Acyclic Graph is completely free of cycles or closed paths. In an acyclic graph, there is at most one simple path connecting any pair of vertices.',
      apps: 'Decision trees, Family genealogy trees, File system directory trees.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="60" y1="90" x2="170" y2="40" stroke="#8b5cf6" stroke-width="4"/>
          <line x1="60" y1="90" x2="170" y2="140" stroke="#8b5cf6" stroke-width="4"/>
          <line x1="170" y1="40" x2="280" y2="90" stroke="#8b5cf6" stroke-width="4"/>
          <circle cx="60" cy="90" r="25" fill="#1e293b" stroke="#8b5cf6" stroke-width="3.5"/>
          <text x="60" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">A</text>
          <circle cx="170" cy="40" r="25" fill="#1e293b" stroke="#8b5cf6" stroke-width="3.5"/>
          <text x="170" y="46" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">B</text>
          <circle cx="170" cy="140" r="25" fill="#1e293b" stroke="#8b5cf6" stroke-width="3.5"/>
          <text x="170" y="146" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">C</text>
          <circle cx="280" cy="90" r="25" fill="#1e293b" stroke="#8b5cf6" stroke-width="3.5"/>
          <text x="280" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">D</text>
        </svg>
      `
    },
    'dag': {
      title: '7. Directed Acyclic Graph (DAG) ⚡',
      badge: 'Topological Order & Build Systems',
      desc: 'A Directed Acyclic Graph (DAG) is a directed graph containing zero directed cycles. DAGs are essential because they admit a Topological Sorting — a linear ordering of vertices such that for every directed edge u ➔ v, vertex u comes before v.',
      apps: 'Build systems (Bazel, Webpack, Makefiles), Course prerequisite chains, Git commit history graphs.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="82" y1="80" x2="148" y2="50" stroke="#10b981" stroke-width="4"/>
          <polygon points="148,50 134,43 142,57" fill="#10b981"/>
          <line x1="82" y1="100" x2="148" y2="130" stroke="#10b981" stroke-width="4"/>
          <polygon points="148,130 134,137 142,123" fill="#10b981"/>
          <line x1="192" y1="50" x2="258" y2="80" stroke="#10b981" stroke-width="4"/>
          <polygon points="258,80 244,73 252,87" fill="#10b981"/>
          <line x1="192" y1="130" x2="258" y2="100" stroke="#10b981" stroke-width="4"/>
          <polygon points="258,100 244,107 252,93" fill="#10b981"/>
          <circle cx="60" cy="90" r="25" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="60" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">A</text>
          <circle cx="170" cy="40" r="25" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="170" y="46" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">B</text>
          <circle cx="170" cy="140" r="25" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="170" y="146" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">C</text>
          <circle cx="280" cy="90" r="25" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="280" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">D</text>
        </svg>
      `
    },
    'connected': {
      title: '8. Connected Graph 🌐',
      badge: 'Unbroken Network',
      desc: 'A Connected Graph is an undirected graph where a path exists between every single pair of vertices. No vertex or sub-network is isolated.',
      apps: 'Electrical power grids, Fully integrated computer networks, Interstate highway grids.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="70" y1="45" x2="270" y2="45" stroke="#38bdf8" stroke-width="4"/>
          <line x1="70" y1="135" x2="270" y2="135" stroke="#38bdf8" stroke-width="4"/>
          <line x1="70" y1="45" x2="70" y2="135" stroke="#38bdf8" stroke-width="4"/>
          <line x1="270" y1="45" x2="270" y2="135" stroke="#38bdf8" stroke-width="4"/>
          <line x1="70" y1="45" x2="270" y2="135" stroke="#38bdf8" stroke-width="4"/>
          <circle cx="70" cy="45" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3.5"/>
          <text x="70" y="51" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">A</text>
          <circle cx="270" cy="45" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3.5"/>
          <text x="270" y="51" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">B</text>
          <circle cx="70" cy="135" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3.5"/>
          <text x="70" y="141" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">C</text>
          <circle cx="270" cy="135" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3.5"/>
          <text x="270" y="141" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">D</text>
        </svg>
      `
    },
    'disconnected': {
      title: '9. Disconnected Graph 🧩',
      badge: 'Isolated Sub-networks',
      desc: 'A Disconnected Graph consists of two or more separate connected components. Vertices in one component have zero paths connecting them to vertices in another component.',
      apps: 'Island archipelago ferry routes, Partitioned database clusters during network splits.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="50" y1="90" x2="125" y2="90" stroke="#f59e0b" stroke-width="4"/>
          <circle cx="50" cy="90" r="24" fill="#1e293b" stroke="#f59e0b" stroke-width="3.5"/>
          <text x="50" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">A</text>
          <circle cx="125" cy="90" r="24" fill="#1e293b" stroke="#f59e0b" stroke-width="3.5"/>
          <text x="125" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">B</text>

          <line x1="170" y1="20" x2="170" y2="160" stroke="rgba(255,255,255,0.3)" stroke-dasharray="6,6" stroke-width="2.5"/>

          <line x1="215" y1="90" x2="290" y2="90" stroke="#f59e0b" stroke-width="4"/>
          <circle cx="215" cy="90" r="24" fill="#1e293b" stroke="#f59e0b" stroke-width="3.5"/>
          <text x="215" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">C</text>
          <circle cx="290" cy="90" r="24" fill="#1e293b" stroke="#f59e0b" stroke-width="3.5"/>
          <text x="290" y="96" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">D</text>
        </svg>
      `
    },
    'complete': {
      title: '10. Complete Graph (Kn) 🕸️',
      badge: 'Maximum Density (E = V*(V-1)/2)',
      desc: 'A Complete Graph Kn is a graph where every vertex is connected directly to every other vertex by a unique edge. A complete graph with V vertices has exactly V*(V-1)/2 edges.',
      apps: 'Peer-to-peer (P2P) mesh networks, All-pairs shortest path benchmarking, Traveling Salesperson Problem (TSP).',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="80" y1="40" x2="260" y2="40" stroke="#3b82f6" stroke-width="3.5"/>
          <line x1="80" y1="140" x2="260" y2="140" stroke="#3b82f6" stroke-width="3.5"/>
          <line x1="80" y1="40" x2="80" y2="140" stroke="#3b82f6" stroke-width="3.5"/>
          <line x1="260" y1="40" x2="260" y2="140" stroke="#3b82f6" stroke-width="3.5"/>
          <line x1="80" y1="40" x2="260" y2="140" stroke="#3b82f6" stroke-width="3.5"/>
          <line x1="260" y1="40" x2="80" y2="140" stroke="#3b82f6" stroke-width="3.5"/>
          <circle cx="80" cy="40" r="24" fill="#1e293b" stroke="#3b82f6" stroke-width="3.5"/>
          <text x="80" y="46" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">A</text>
          <circle cx="260" cy="40" r="24" fill="#1e293b" stroke="#3b82f6" stroke-width="3.5"/>
          <text x="260" y="46" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">B</text>
          <circle cx="80" cy="140" r="24" fill="#1e293b" stroke="#3b82f6" stroke-width="3.5"/>
          <text x="80" y="146" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">C</text>
          <circle cx="260" cy="140" r="24" fill="#1e293b" stroke="#3b82f6" stroke-width="3.5"/>
          <text x="260" y="146" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="15">D</text>
        </svg>
      `
    },
    'bipartite': {
      title: '11. Bipartite Graph 🎨',
      badge: '2-Colorable Graph',
      desc: 'A Bipartite Graph is a graph whose vertices can be divided into two disjoint sets U and V such that every edge connects a vertex in U to a vertex in V. No edge connects two vertices in the same set.',
      apps: 'Job-applicant matching, Recommendation systems (User-Movie recommendations), Doctor-hospital matching.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="80" y1="45" x2="260" y2="45" stroke="#06b6d4" stroke-width="4"/>
          <line x1="80" y1="45" x2="260" y2="135" stroke="#06b6d4" stroke-width="4"/>
          <line x1="80" y1="135" x2="260" y2="45" stroke="#06b6d4" stroke-width="4"/>
          <line x1="80" y1="135" x2="260" y2="135" stroke="#06b6d4" stroke-width="4"/>
          <circle cx="80" cy="45" r="24" fill="#1e293b" stroke="#3b82f6" stroke-width="3.5"/>
          <text x="80" y="51" text-anchor="middle" fill="#3b82f6" font-family="JetBrains Mono" font-weight="800" font-size="15">U1</text>
          <circle cx="80" cy="135" r="24" fill="#1e293b" stroke="#3b82f6" stroke-width="3.5"/>
          <text x="80" y="141" text-anchor="middle" fill="#3b82f6" font-family="JetBrains Mono" font-weight="800" font-size="15">U2</text>
          <circle cx="260" cy="45" r="24" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="260" y="51" text-anchor="middle" fill="#10b981" font-family="JetBrains Mono" font-weight="800" font-size="15">V1</text>
          <circle cx="260" cy="135" r="24" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="260" y="141" text-anchor="middle" fill="#10b981" font-family="JetBrains Mono" font-weight="800" font-size="15">V2</text>
        </svg>
      `
    },
    'tree': {
      title: '12. Tree (Special Graph) 🌲',
      badge: 'Connected Acyclic (E = V - 1)',
      desc: 'A Tree is a connected, acyclic undirected graph with exactly V - 1 edges. Adding any single edge creates a cycle, while removing any single edge disconnects the graph into a forest.',
      apps: 'Organizational hierarchy, DOM tree in web browsers, Abstract Syntax Trees (AST) in compilers.',
      svg: `
        <svg width="340" height="180" viewBox="0 0 340 180">
          <line x1="170" y1="35" x2="90" y2="90" stroke="#10b981" stroke-width="4"/>
          <line x1="170" y1="35" x2="250" y2="90" stroke="#10b981" stroke-width="4"/>
          <line x1="90" y1="90" x2="50" y2="145" stroke="#10b981" stroke-width="4"/>
          <line x1="90" y1="90" x2="130" y2="145" stroke="#10b981" stroke-width="4"/>
          <circle cx="170" cy="35" r="22" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="170" y="41" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="14">R</text>
          <circle cx="90" cy="90" r="20" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="90" y="95" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="13">A</text>
          <circle cx="250" cy="90" r="20" fill="#1e293b" stroke="#10b981" stroke-width="3.5"/>
          <text x="250" y="95" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="13">B</text>
          <circle cx="50" cy="145" r="18" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
          <text x="50" y="149" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="12">C</text>
          <circle cx="130" cy="145" r="18" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
          <text x="130" y="149" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-weight="800" font-size="12">D</text>
        </svg>
      `
    }
  },

  openGraphTypeModal(typeKey) {
    const details = this.graphTypeDetails[typeKey];
    if (!details) return;

    const modal = document.getElementById('graphTypeModal');
    const content = document.getElementById('graphTypeModalBody');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; margin-bottom:1.5rem;">
        <span class="badge badge-primary" style="font-size:0.85rem; padding:0.4rem 1rem; text-transform:uppercase; margin-bottom:0.75rem; display:inline-block;">${details.badge}</span>
        <h2 style="font-size:1.75rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">${details.title}</h2>
      </div>

      <div style="background:rgba(0,0,0,0.55); border:1.5px solid var(--primary); border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:1.5rem; display:flex; justify-content:center; align-items:center; box-shadow:0 0 30px rgba(59,130,246,0.25);">
        ${details.svg}
      </div>

      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:1.25rem; border-radius:var(--radius-md);">
          <h4 style="font-size:1rem; font-weight:800; color:var(--primary); margin-bottom:0.4rem;">💡 Comprehensive Technical Overview</h4>
          <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.7; margin:0;">${details.desc}</p>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:1.25rem; border-radius:var(--radius-md);">
          <h4 style="font-size:1rem; font-weight:800; color:var(--accent-green); margin-bottom:0.4rem;">🌍 Real-World Industry Applications</h4>
          <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.7; margin:0;">${details.apps}</p>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  },

  closeGraphTypeModal() {
    const modal = document.getElementById('graphTypeModal');
    if (modal) modal.style.display = 'none';
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
        ${badgeText ? `<div style="font-size:0.88rem; color:var(--accent-green); font-weight:800; font-family:var(--font-sans); margin-bottom:0.75rem; text-transform:uppercase; text-align:center;">${badgeText}</div>` : ''}
        <svg viewBox="0 0 440 310" style="width:100%; max-width:420px; height:auto; display:block; overflow:visible;">
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

    let highlightedVertices = [];
    let highlightedEdges = [];
    if (highlightIdx !== null && highlightIdx !== undefined) {
      const v = this.vertices[highlightIdx];
      highlightedVertices = [v];
      for (let c = 0; c < this.matrix[highlightIdx].length; c++) {
        if (this.matrix[highlightIdx][c]) {
          highlightedVertices.push(this.vertices[c]);
          highlightedEdges.push([v, this.vertices[c]]);
        }
      }
    }

    const visualGraphSVG = this.buildGraphSVG(highlightedVertices, highlightedEdges, highlightIdx !== null ? `Highlighted Vertex: ${this.vertices[highlightIdx]}` : 'Graph Topology G = (V, E)');

    let repHTML = '';

    if (this.repMode === 'matrix') {
      repHTML = `
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:1.25rem; border-radius:var(--radius-md); width:100%;">
          <h4 style="font-size:0.98rem; font-weight:800; color:var(--secondary); margin-bottom:1rem; text-align:center;">Adjacency Matrix (2D Array: adj[5][5])</h4>
          <div style="overflow-x:auto;">
            <table class="mem-table" style="text-align:center; width:100%;">
              <thead>
                <tr>
                  <th></th>
                  ${this.vertices.map(v => `<th>${v}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${this.matrix.map((row, r) => `
                  <tr onmouseenter="GraphEngine.renderRepStage(${r})" onmouseleave="GraphEngine.renderRepStage()" style="cursor:pointer; ${highlightIdx === r ? 'background:rgba(16,185,129,0.25);' : ''}">
                    <td><strong style="color:var(--primary);">${this.vertices[r]}</strong></td>
                    ${row.map(val => `<td style="${val ? 'color:var(--accent-green); font-weight:800;' : 'color:var(--text-dim);'}">${val}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div style="font-size:0.8rem; color:var(--text-muted); text-align:center; margin-top:0.75rem;">
            💡 Hover over any row to highlight that vertex & its connections in the graph!
          </div>
        </div>
      `;
    } else if (this.repMode === 'list') {
      repHTML = `
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:1.25rem; border-radius:var(--radius-md); width:100%;">
          <h4 style="font-size:0.98rem; font-weight:800; color:var(--primary); margin-bottom:0.85rem; text-align:center;">Adjacency List (Array of Linked Lists)</h4>
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            ${this.vertices.map((v, r) => {
              const neighbors = [];
              for (let c = 0; c < this.matrix[r].length; c++) {
                if (this.matrix[r][c]) neighbors.push(this.vertices[c]);
              }
              return `
                <div onmouseenter="GraphEngine.renderRepStage(${r})" onmouseleave="GraphEngine.renderRepStage()" style="background:${highlightIdx === r ? 'rgba(16,185,129,0.2)' : 'var(--bg-main)'}; border:1px solid var(--bg-surface-border); padding:0.5rem 0.85rem; border-radius:var(--radius-sm); display:flex; align-items:center; gap:0.4rem; font-family:var(--font-code); font-size:0.85rem; cursor:pointer; transition:all 0.2s ease;">
                  <span style="background:var(--primary); color:#fff; font-weight:800; padding:0.15rem 0.55rem; border-radius:var(--radius-sm);">${v}</span>
                  <span style="color:var(--text-muted);">➔</span>
                  ${neighbors.map(n => `<span style="background:var(--bg-card); border:1px solid var(--bg-surface-border); padding:0.15rem 0.45rem; border-radius:var(--radius-sm); color:var(--accent-green); font-weight:800;">${n}</span> ➔`).join(' ')}
                  <span style="color:var(--text-dim); font-size:0.78rem;">NULL</span>
                </div>
              `;
            }).join('')}
          </div>
          <div style="font-size:0.8rem; color:var(--text-muted); text-align:center; margin-top:0.75rem;">
            💡 Hover over any list node to highlight that vertex & its neighbors!
          </div>
        </div>
      `;
    } else {
      // Edge List
      repHTML = `
        <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); padding:1.25rem; border-radius:var(--radius-md); width:100%;">
          <h4 style="font-size:0.98rem; font-weight:800; color:var(--accent-amber); margin-bottom:0.85rem; text-align:center;">Edge List (Tuples: (u, v))</h4>
          <div style="display:flex; flex-wrap:wrap; gap:0.6rem; justify-content:center; font-family:var(--font-code);">
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main); font-weight:700;">(A, B)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main); font-weight:700;">(A, C)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main); font-weight:700;">(B, D)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main); font-weight:700;">(C, D)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main); font-weight:700;">(C, E)</span>
            <span style="background:var(--bg-main); border:1px solid var(--primary); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-main); font-weight:700;">(D, E)</span>
          </div>
          <div style="font-size:0.8rem; color:var(--text-muted); text-align:center; margin-top:0.85rem;">
            Array of 6 edge pairs representing all connections in G = (V, E).
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:1.5rem; align-items:flex-start; width:100%;">
        <div style="flex:1 1 300px; min-width:280px; background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.25rem; display:flex; flex-direction:column; align-items:center;">
          <h4 style="font-size:1rem; font-weight:800; color:var(--accent-green); margin-bottom:0.75rem;">🕸️ Visual Network Graph G = (V, E)</h4>
          ${visualGraphSVG}
        </div>
        <div style="flex:1 1 300px; min-width:280px;">
          ${repHTML}
        </div>
      </div>
    `;
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
