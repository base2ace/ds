/* ==========================================================================
   Base2ace Technologies Education - Introduction to DS & Complexity Module
   Student-Friendly Engineering Syllabus with Intuitive Explanations
   ========================================================================== */

const IntroDS = {
  activeTab: 'linearVsNonlinear',

  init() {
    this.renderModule();
  },

  renderModule() {
    const container = document.getElementById('viewIntroDS');
    if (!container) return;

    let html = `
      <div style="background:var(--bg-card); border:1px solid var(--bg-surface-border); border-radius:var(--radius-lg); padding:1.75rem; box-shadow:var(--shadow-card);">
        
        <!-- Header Banner -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; border-bottom:1px solid var(--bg-surface-border); padding-bottom:1.25rem; margin-bottom:1.5rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
              <span style="background:rgba(59,130,246,0.15); color:var(--primary); font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:var(--radius-sm); border:1px solid rgba(59,130,246,0.3);">MODULE 0 — FOUNDATIONAL CONCEPTS</span>
              <span class="badge badge-success">Beginner Friendly</span>
            </div>
            <h2 style="font-size:1.6rem; font-weight:800; display:flex; align-items:center; gap:0.6rem; color:var(--text-main);">
              <span>📘</span> Introduction to Data Structures & Complexity Analysis
            </h2>
            <p style="color:var(--text-muted); font-size:0.95rem; margin-top:0.4rem; line-height:1.6; max-width:850px;">
              Welcome! This guide explains how data is organized in computer memory, how Abstract Data Types (ADTs) work, and how we measure code efficiency using Big-O notation with simple real-world analogies.
            </p>
          </div>

          <div style="display:flex; gap:0.5rem; align-items:center;">
            <a href="array.html" class="btn btn-primary btn-sm" id="introLaunchArrayBtn">⚡ Launch Array Visualizer ➔</a>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display:flex; gap:0.6rem; overflow-x:auto; padding-bottom:0.75rem; border-bottom:1px solid var(--bg-surface-border); margin-bottom:1.5rem;" role="tablist">
          <button class="op-tab ${this.activeTab === 'linearVsNonlinear' ? 'active' : ''}" onclick="IntroDS.switchTab('linearVsNonlinear')">
            🌐 1. Linear vs Non-Linear DS
          </button>
          <button class="op-tab ${this.activeTab === 'adt' ? 'active' : ''}" onclick="IntroDS.switchTab('adt')">
            🧩 2. Abstract Data Types (ADT)
          </button>
          <button class="op-tab ${this.activeTab === 'complexity' ? 'active' : ''}" onclick="IntroDS.switchTab('complexity')">
            ⏱️ 3. Big-O, Omega & Theta Notations
          </button>
          <button class="op-tab ${this.activeTab === 'cases' ? 'active' : ''}" onclick="IntroDS.switchTab('cases')">
            📊 4. Best, Worst & Average Cases
          </button>
          <button class="op-tab ${this.activeTab === 'searchingSorting' ? 'active' : ''}" onclick="IntroDS.switchTab('searchingSorting')">
            🔍 5. Searching & Sorting Overview
          </button>
        </div>

        <!-- Content Area -->
        <div id="introTabContent">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.renderTabContent();
  },

  switchTab(t) {
    this.activeTab = t;
    this.renderModule();

    // Update active class on left sidebar items
    document.querySelectorAll('.sidebar-item[data-intro-tab]').forEach(item => {
      item.classList.toggle('active', item.dataset.introTab === t);
    });
  },

  renderTabContent() {
    const container = document.getElementById('introTabContent');
    if (!container) return;

    if (this.activeTab === 'linearVsNonlinear') {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.75rem;">
          
          <!-- Friendly Intro Callout -->
          <div style="background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.25); border-radius:var(--radius-md); padding:1.25rem;">
            <h4 style="color:var(--primary); font-size:1.05rem; font-weight:700; margin-bottom:0.4rem; display:flex; align-items:center; gap:0.4rem;">
              <span>💡</span> What is a Data Structure?
            </h4>
            <p style="font-size:0.92rem; color:var(--text-main); line-height:1.6;">
              A <strong>Data Structure</strong> is simply a specific way of arranging and storing data in computer memory (RAM) so that we can search, insert, update, or delete values efficiently. Data structures are broadly divided into <strong>Linear</strong> and <strong>Non-Linear</strong> structures.
            </p>
          </div>

          <!-- Side by Side Definitions Box -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;" class="matrix-layout-grid">
            
            <!-- Linear DS -->
            <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
                <h3 style="font-size:1.2rem; color:var(--secondary); font-weight:700; display:flex; align-items:center; gap:0.5rem;">
                  <span>📏</span> 1. Linear Data Structures
                </h3>
                <span class="comp-badge comp-o1" style="font-size:0.75rem;">Single Line Sequence</span>
              </div>
              
              <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1rem;">
                In a <strong>Linear Data Structure</strong>, elements are stored sequentially one after another in a single line. Every element has one immediate neighbor before it and one immediate neighbor after it.
              </p>

              <div style="background:rgba(255,255,255,0.03); border-left:3px solid var(--secondary); padding:0.75rem 1rem; border-radius:var(--radius-sm); margin-bottom:1rem; font-size:0.88rem; color:var(--text-main);">
                <strong>🙋 Real-World Analogy:</strong> A queue of people standing in line at an ATM machine, or books placed side-by-side on a shelf.
              </div>

              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--bg-surface-border); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-main);">⚡ Array:</strong> A continuous block of memory boxes placed side by side. Quick lookup by position number (index).
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--bg-surface-border); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-main);">🔗 Linked List:</strong> Memory boxes connected using pointers (arrows), like a treasure hunt where each box tells you where the next box is located.
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--bg-surface-border); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-main);">📚 Stack (LIFO):</strong> Like a stack of dinner plates — you add new plates to the top and remove plates from the top (Last In, First Out).
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--bg-surface-border); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-main);">🚶 Queue (FIFO):</strong> Like a movie ticket line — the first person to join the line gets served first (First In, First Out).
                </div>
              </div>
            </div>

            <!-- Non-Linear DS -->
            <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
                <h3 style="font-size:1.2rem; color:var(--primary); font-weight:700; display:flex; align-items:center; gap:0.5rem;">
                  <span>🌲</span> 2. Non-Linear Data Structures
                </h3>
                <span class="comp-badge comp-ologn" style="font-size:0.75rem;">Multi-Level Connections</span>
              </div>

              <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1rem;">
                In a <strong>Non-Linear Data Structure</strong>, elements are NOT in a straight line. Instead, elements are connected across multiple levels in a hierarchy or network. One element can connect to multiple other elements.
              </p>

              <div style="background:rgba(255,255,255,0.03); border-left:3px solid var(--primary); padding:0.75rem 1rem; border-radius:var(--radius-sm); margin-bottom:1rem; font-size:0.88rem; color:var(--text-main);">
                <strong>🙋 Real-World Analogy:</strong> A family tree (parents & children) or a roadmap connecting different cities across a country.
              </div>

              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--bg-surface-border); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-main);">🌲 Tree:</strong> Organizes data in a root-and-branches hierarchy (like folders and sub-folders on your computer).
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--bg-surface-border); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-main);">🕸️ Graph:</strong> Networks of nodes connected by lines, like social media networks (friends connected to friends) or Google Maps.
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--bg-surface-border); padding:0.85rem; border-radius:var(--radius-sm);">
                  <strong style="color:var(--text-main);">🔑 Hash Table:</strong> Works like a dictionary where you look up a word (Key) to instantly find its definition (Value).
                </div>
              </div>
            </div>

          </div>

          <!-- Comparison Table -->
          <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
            <h4 style="font-size:1.1rem; color:var(--text-main); font-weight:700; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
              <span>📊</span> Quick Comparison: Linear vs Non-Linear Data Structures
            </h4>

            <table class="complexity-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Linear Data Structure</th>
                  <th>Non-Linear Data Structure</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Element Arrangement</strong></td>
                  <td>Single sequential line (level by level)</td>
                  <td>Hierarchical or multi-level network</td>
                </tr>
                <tr>
                  <td><strong>Traversal (Visiting Elements)</strong></td>
                  <td>Easy single pass from start to end</td>
                  <td>Requires special techniques (like Depth-First or Breadth-First search)</td>
                </tr>
                <tr>
                  <td><strong>Memory Utilization</strong></td>
                  <td>Simple & direct memory allocation</td>
                  <td>Requires pointers/references to link multiple children</td>
                </tr>
                <tr>
                  <td><strong>Best Used For</strong></td>
                  <td>Sequential data, simple lists, undo operations</td>
                  <td>Hierarchies, network routing, fast searches</td>
                </tr>
                <tr>
                  <td><strong>Key Examples</strong></td>
                  <td>Array, Linked List, Stack, Queue</td>
                  <td>Tree, Binary Search Tree, Graph, Hash Table</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      `;
    } else if (this.activeTab === 'adt') {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.75rem;">
          
          <!-- ADT Concept Box -->
          <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <h3 style="font-size:1.2rem; color:var(--accent-amber); font-weight:700; display:flex; align-items:center; gap:0.5rem;">
                <span>🧩</span> What is an Abstract Data Type (ADT)?
              </h3>
              <span class="badge badge-warning">Interface vs Implementation</span>
            </div>

            <p style="font-size:0.95rem; color:var(--text-main); line-height:1.65; margin-bottom:1.25rem;">
              An <strong>Abstract Data Type (ADT)</strong> is a concept that separates <strong>WHAT operations</strong> a data structure can do from <strong>HOW those operations are coded</strong>.
            </p>

            <div style="background:rgba(245,158,11,0.08); border-left:4px solid var(--accent-amber); padding:1rem 1.25rem; border-radius:var(--radius-sm); margin-bottom:1.5rem;">
              <strong style="color:var(--accent-amber); font-size:0.95rem;">🚗 Real-World Analogy: Driving a Car</strong>
              <p style="font-size:0.88rem; color:var(--text-muted); margin-top:0.4rem; line-height:1.5;">
                When you drive a car, you use the steering wheel, gas pedal, and brakes (this is the <strong>ADT Interface</strong>). You do NOT need to know how the internal engine, pistons, or fuel injectors work (that is the <strong>Implementation</strong>). As long as pressing the gas pedal makes the car move forward, the internal engine details don't change how you drive!
              </p>
            </div>

            <!-- Side-by-Side Breakdown -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;" class="matrix-layout-grid">
              
              <div style="background:rgba(59,130,246,0.08); border:1.5px solid rgba(59,130,246,0.3); padding:1.25rem; border-radius:var(--radius-md);">
                <h4 style="color:var(--primary); font-size:1.05rem; font-weight:700; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem;">
                  <span>📋</span> 1. The ADT Interface (WHAT it does)
                </h4>
                <ul style="font-size:0.88rem; color:var(--text-muted); padding-left:1.2rem; display:flex; flex-direction:column; gap:0.55rem; line-height:1.5;">
                  <li>Lists the available function names (e.g. <code>insert()</code>, <code>delete()</code>, <code>search()</code>).</li>
                  <li>Specifies what inputs the function expects and what result it returns.</li>
                  <li>Independent of programming language — works conceptually in C, Java, or Python.</li>
                </ul>
              </div>

              <div style="background:rgba(16,185,129,0.08); border:1.5px solid rgba(16,185,129,0.3); padding:1.25rem; border-radius:var(--radius-md);">
                <h4 style="color:var(--accent-green); font-size:1.05rem; font-weight:700; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem;">
                  <span>💻</span> 2. The Implementation (HOW it works)
                </h4>
                <ul style="font-size:0.88rem; color:var(--text-muted); padding-left:1.2rem; display:flex; flex-direction:column; gap:0.55rem; line-height:1.5;">
                  <li>The actual C code that stores data in RAM (using arrays or pointers).</li>
                  <li>Handles internal array indexing, pointer connections, and memory allocation.</li>
                  <li>Can be modified or optimized without changing the user-facing interface code.</li>
                </ul>
              </div>

            </div>
          </div>

          <!-- Stack ADT Example -->
          <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
            <h4 style="font-size:1.1rem; color:var(--text-main); font-weight:700; margin-bottom:0.75rem;">
              📚 Example: One Stack ADT, Two Different C Implementations
            </h4>
            <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.25rem; line-height:1.5;">
              A <strong>Stack ADT</strong> defines two main operations: <code>push(val)</code> to add an element and <code>pop()</code> to remove the top element. Notice how we can code this exact same Stack ADT using either an <strong>Array</strong> or a <strong>Linked List</strong>:
            </p>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;" class="matrix-layout-grid">
              
              <div>
                <div style="font-weight:700; color:var(--secondary); font-size:0.9rem; margin-bottom:0.4rem;">
                  Option A: Array-Based Stack Implementation
                </div>
                <pre style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem; font-family:var(--font-code); font-size:0.8rem; color:var(--text-main); overflow-x:auto;"><code>// Uses a fixed array block in memory
typedef struct {
    int data[100];
    int top;
} ArrayStack;

void push(ArrayStack* s, int val) {
    s->data[++(s->top)] = val;
}</code></pre>
              </div>

              <div>
                <div style="font-weight:700; color:var(--accent-green); font-size:0.9rem; margin-bottom:0.4rem;">
                  Option B: Linked-List-Based Stack Implementation
                </div>
                <pre style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:0.85rem; font-family:var(--font-code); font-size:0.8rem; color:var(--text-main); overflow-x:auto;"><code>// Uses dynamic nodes linked by pointers
typedef struct Node {
    int data;
    struct Node* next;
} Node;

void push(Node** top, int val) {
    Node* newNode = malloc(sizeof(Node));
    newNode->data = val;
    newNode->next = *top;
    *top = newNode;
}</code></pre>
              </div>

            </div>
          </div>

        </div>
      `;
    } else if (this.activeTab === 'complexity') {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.75rem;">
          
          <!-- Big-O Simple Overview Header -->
          <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <h3 style="font-size:1.2rem; color:var(--secondary); font-weight:700; display:flex; align-items:center; gap:0.5rem;">
                <span>⏱️</span> What are Big-O, Omega (Ω), and Theta (Θ) Notations?
              </h3>
              <span class="badge badge-primary">Core Topic</span>
            </div>
            <p style="font-size:0.93rem; color:var(--text-main); line-height:1.6; margin-bottom:1.25rem;">
              When programmers write code, we need a standard way to answer: <em>"How fast will this code run as the amount of input data (N) grows?"</em> Asymptotic notations (Big-O, Omega, and Theta) give us a mathematical way to measure performance bounds.
            </p>

            <!-- 3 Clean Cards with Generous Spacing -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
              
              <!-- Big O Card -->
              <div style="background:rgba(239,68,68,0.08); border:1.5px solid rgba(239,68,68,0.3); border-radius:var(--radius-md); padding:1.35rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                  <h4 style="color:var(--accent-red); font-size:1.15rem; font-weight:800;">Big-O &nbsp; ( O )</h4>
                  <span class="badge badge-danger" style="font-size:0.75rem;">Upper Bound</span>
                </div>
                <div style="font-size:0.9rem; color:var(--text-main); font-weight:700; margin-bottom:0.6rem; font-family:var(--font-code);">
                  f(n) = O(g(n))
                </div>
                <div style="font-size:0.86rem; color:var(--text-main); line-height:1.6;">
                  <strong>🎯 What it means:</strong> The <strong>Worst-Case Scenario</strong> (Maximum Speed Limit).<br>
                  Guarantees that your code will <em>never take longer</em> than this limit.<br><br>
                  <span style="color:var(--text-muted); font-size:0.82rem;"><strong>Mathematical Definition:</strong> There exist constants <em>c &gt; 0</em> and <em>n₀ &gt; 0</em> such that 0 ≤ f(n) ≤ c · g(n) for all n ≥ n₀.</span>
                </div>
              </div>

              <!-- Big Omega Card -->
              <div style="background:rgba(16,185,129,0.08); border:1.5px solid rgba(16,185,129,0.3); border-radius:var(--radius-md); padding:1.35rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                  <h4 style="color:var(--accent-green); font-size:1.15rem; font-weight:800;">Big-Omega &nbsp; ( Ω )</h4>
                  <span class="badge badge-success" style="font-size:0.75rem;">Lower Bound</span>
                </div>
                <div style="font-size:0.9rem; color:var(--text-main); font-weight:700; margin-bottom:0.6rem; font-family:var(--font-code);">
                  f(n) = Ω(g(n))
                </div>
                <div style="font-size:0.86rem; color:var(--text-main); line-height:1.6;">
                  <strong>🎯 What it means:</strong> The <strong>Best-Case Scenario</strong> (Minimum Time Limit).<br>
                  Guarantees that your code will <em>take at least</em> this much time.<br><br>
                  <span style="color:var(--text-muted); font-size:0.82rem;"><strong>Mathematical Definition:</strong> There exist constants <em>c &gt; 0</em> and <em>n₀ &gt; 0</em> such that 0 ≤ c · g(n) ≤ f(n) for all n ≥ n₀.</span>
                </div>
              </div>

              <!-- Big Theta Card -->
              <div style="background:rgba(245,158,11,0.08); border:1.5px solid rgba(245,158,11,0.3); border-radius:var(--radius-md); padding:1.35rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                  <h4 style="color:var(--accent-amber); font-size:1.15rem; font-weight:800;">Big-Theta &nbsp; ( Θ )</h4>
                  <span class="badge badge-warning" style="font-size:0.75rem;">Tight Bound</span>
                </div>
                <div style="font-size:0.9rem; color:var(--text-main); font-weight:700; margin-bottom:0.6rem; font-family:var(--font-code);">
                  f(n) = Θ(g(n))
                </div>
                <div style="font-size:0.86rem; color:var(--text-main); line-height:1.6;">
                  <strong>🎯 What it means:</strong> The <strong>Exact / Tight Bound</strong>.<br>
                  When Best-Case and Worst-Case grow at the exact same rate.<br><br>
                  <span style="color:var(--text-muted); font-size:0.82rem;"><strong>Mathematical Definition:</strong> There exist constants <em>c₁, c₂ &gt; 0</em> and <em>n₀ &gt; 0</em> such that c₁ · g(n) ≤ f(n) ≤ c₂ · g(n) for all n ≥ n₀.</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Growth Rates Comparison Table -->
          <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
            <h4 style="font-size:1.1rem; color:var(--text-main); font-weight:700; margin-bottom:0.75rem;">
              📈 Time Complexity Growth Chart (Fastest to Slowest)
            </h4>
            <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.25rem;">
              See how the number of required CPU steps grows as the input size (N) increases:
            </p>

            <table class="complexity-table">
              <thead>
                <tr>
                  <th>Big-O Notation</th>
                  <th>Name</th>
                  <th>N = 10 items</th>
                  <th>N = 100 items</th>
                  <th>N = 1,000 items</th>
                  <th>N = 1,000,000 items</th>
                  <th>Speed Verdict</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="comp-badge comp-o1">O(1)</span></td>
                  <td>Constant Time</td>
                  <td>1 step</td>
                  <td>1 step</td>
                  <td>1 step</td>
                  <td>1 step</td>
                  <td><strong style="color:var(--accent-green);">⚡ Ultra Fast (Instant)</strong></td>
                </tr>
                <tr>
                  <td><span class="comp-badge comp-ologn">O(log N)</span></td>
                  <td>Logarithmic Time</td>
                  <td>~3 steps</td>
                  <td>~7 steps</td>
                  <td>~10 steps</td>
                  <td>~20 steps</td>
                  <td><strong style="color:var(--accent-green);">🚀 Extremely Efficient</strong></td>
                </tr>
                <tr>
                  <td><span class="comp-badge comp-on">O(N)</span></td>
                  <td>Linear Time</td>
                  <td>10 steps</td>
                  <td>100 steps</td>
                  <td>1,000 steps</td>
                  <td>1,000,000 steps</td>
                  <td><strong style="color:var(--secondary);">👍 Fair / Standard Pass</strong></td>
                </tr>
                <tr>
                  <td><span class="badge badge-warning">O(N log N)</span></td>
                  <td>Linearithmic Time</td>
                  <td>33 steps</td>
                  <td>664 steps</td>
                  <td>9,965 steps</td>
                  <td>~20,000,000 steps</td>
                  <td><strong style="color:var(--secondary);">⚖️ Good for Sorting</strong></td>
                </tr>
                <tr>
                  <td><span class="badge badge-danger">O(N²)</span></td>
                  <td>Quadratic Time</td>
                  <td>100 steps</td>
                  <td>10,000 steps</td>
                  <td>1,000,000 steps</td>
                  <td>1,000,000,000,000 steps</td>
                  <td><strong style="color:var(--accent-red);">⚠️ Slow for large N</strong></td>
                </tr>
                <tr>
                  <td><span class="badge badge-danger">O(2ⁿ)</span></td>
                  <td>Exponential Time</td>
                  <td>1,024 steps</td>
                  <td>1.26 × 10³⁰ steps</td>
                  <td>Astronomical</td>
                  <td>Too large for computers</td>
                  <td><strong style="color:var(--accent-red);">❌ Infeasible</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      `;
    } else if (this.activeTab === 'cases') {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.75rem;">
          
          <!-- Best, Worst, Average Intro -->
          <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
            <h3 style="font-size:1.2rem; color:var(--primary); font-weight:700; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
              <span>📊</span> Best Case, Worst Case, and Average Case
            </h3>
            <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.25rem;">
              Depending on how the input data is arranged when your program starts, your code might finish instantly or take a long time.
            </p>

            <!-- Friendly Case Cards -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.25rem;">
              
              <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-sm); padding:1.1rem;">
                <h4 style="color:var(--accent-green); font-size:1.05rem; margin-bottom:0.4rem; font-weight:700;">1. Best Case Scenario (Ω)</h4>
                <div style="font-size:0.86rem; color:var(--text-main); line-height:1.6;">
                  The luckiest arrangement of input data.<br>
                  <em>Example:</em> Looking for a name in an array and finding it right at the very first index (index 0). Only <strong>1 step</strong> needed!
                </div>
              </div>

              <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:var(--radius-sm); padding:1.1rem;">
                <h4 style="color:var(--accent-amber); font-size:1.05rem; margin-bottom:0.4rem; font-weight:700;">2. Average Case Scenario (Θ)</h4>
                <div style="font-size:0.86rem; color:var(--text-main); line-height:1.6;">
                  The typical, expected work across random data inputs.<br>
                  <em>Example:</em> Looking for a name and finding it somewhere around the middle of the array (takes about <strong>N/2 steps</strong>).
                </div>
              </div>

              <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.3); border-radius:var(--radius-sm); padding:1.1rem;">
                <h4 style="color:var(--accent-red); font-size:1.05rem; margin-bottom:0.4rem; font-weight:700;">3. Worst Case Scenario (O)</h4>
                <div style="font-size:0.86rem; color:var(--text-main); line-height:1.6;">
                  The unluckiest arrangement forcing maximum work.<br>
                  <em>Example:</em> The name is at the very end of the array, or missing completely. You must check all <strong>N items</strong>!
                </div>
              </div>

            </div>
          </div>

          <!-- Amortized Analysis Box -->
          <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <h4 style="font-size:1.1rem; color:var(--accent-amber); font-weight:700; display:flex; align-items:center; gap:0.5rem;">
                <span>⚡</span> Special Concept: What is Amortized Analysis?
              </h4>
              <span class="badge badge-warning">Easy Explanation</span>
            </div>

            <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1rem;">
              Sometimes, an operation is very fast (O(1)) most of the time, but occasionally causes one expensive step (O(N)). <strong>Amortized Analysis</strong> calculates the average cost over a series of many operations.
            </p>

            <div style="background:var(--bg-main); border:1px solid var(--bg-surface-border); border-radius:var(--radius-sm); padding:1rem;">
              <strong style="color:var(--secondary); font-size:0.9rem;">🍰 Analogy: Buying a Box of Chocolates</strong>
              <p style="font-size:0.86rem; color:var(--text-muted); margin-top:0.4rem; line-height:1.6;">
                Suppose you buy a box of 10 chocolates for $10. Eating a chocolate takes 0 seconds of effort. Buying a new box takes 10 seconds. Even though buying a new box is occasionally slow, the average effort per chocolate eaten is very small! Similarly, dynamic arrays expand occasionally, but their average insert time is <strong>O(1) Amortized Time</strong>.
              </p>
            </div>
          </div>

        </div>
      `;
    } else if (this.activeTab === 'searchingSorting') {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.75rem;">
          
          <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h3 style="font-size:1.2rem; color:var(--secondary); font-weight:700; display:flex; align-items:center; gap:0.5rem;">
                <span>🔍</span> Searching & Sorting Algorithms Master Chart
              </h3>
              <span class="badge badge-success">Reference Table</span>
            </div>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.25rem; line-height:1.5;">
              Here is how popular algorithms compare in terms of speed (Time Complexity) and memory usage (Space Complexity):
            </p>

            <table class="complexity-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Best Case</th>
                  <th>Average Case</th>
                  <th>Worst Case</th>
                  <th>Memory (Space)</th>
                  <th>What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Linear Search</strong></td>
                  <td><span class="comp-badge comp-o1">O(1)</span></td>
                  <td><span class="comp-badge comp-on">O(N)</span></td>
                  <td><span class="comp-badge comp-on">O(N)</span></td>
                  <td><span class="comp-badge comp-o1">O(1)</span></td>
                  <td>Checks elements one by one from start to finish.</td>
                </tr>
                <tr>
                  <td><strong>Binary Search</strong></td>
                  <td><span class="comp-badge comp-o1">O(1)</span></td>
                  <td><span class="comp-badge comp-ologn">O(log N)</span></td>
                  <td><span class="comp-badge comp-ologn">O(log N)</span></td>
                  <td><span class="comp-badge comp-o1">O(1)</span></td>
                  <td>Repeatedly halves a sorted list to find item quickly.</td>
                </tr>
                <tr>
                  <td><strong>Bubble Sort</strong></td>
                  <td><span class="comp-badge comp-on">O(N)</span></td>
                  <td><span class="badge badge-danger">O(N²)</span></td>
                  <td><span class="badge badge-danger">O(N²)</span></td>
                  <td><span class="comp-badge comp-o1">O(1)</span></td>
                  <td>Compares adjacent pairs & bubbles largest value to end.</td>
                </tr>
                <tr>
                  <td><strong>Selection Sort</strong></td>
                  <td><span class="badge badge-danger">O(N²)</span></td>
                  <td><span class="badge badge-danger">O(N²)</span></td>
                  <td><span class="badge badge-danger">O(N²)</span></td>
                  <td><span class="comp-badge comp-o1">O(1)</span></td>
                  <td>Finds the smallest item and swaps it to the front.</td>
                </tr>
                <tr>
                  <td><strong>Insertion Sort</strong></td>
                  <td><span class="comp-badge comp-on">O(N)</span></td>
                  <td><span class="badge badge-danger">O(N²)</span></td>
                  <td><span class="badge badge-danger">O(N²)</span></td>
                  <td><span class="comp-badge comp-o1">O(1)</span></td>
                  <td>Inserts each item into its correct sorted position (like playing cards).</td>
                </tr>
                <tr>
                  <td><strong>Merge Sort</strong></td>
                  <td><span class="badge badge-warning">O(N log N)</span></td>
                  <td><span class="badge badge-warning">O(N log N)</span></td>
                  <td><span class="badge badge-warning">O(N log N)</span></td>
                  <td><span class="comp-badge comp-on">O(N)</span></td>
                  <td>Divides array in half recursively and merges sorted halves.</td>
                </tr>
                <tr>
                  <td><strong>Quick Sort</strong></td>
                  <td><span class="badge badge-warning">O(N log N)</span></td>
                  <td><span class="badge badge-warning">O(N log N)</span></td>
                  <td><span class="badge badge-danger">O(N²)</span></td>
                  <td><span class="comp-badge comp-ologn">O(log N)</span></td>
                  <td>Picks a pivot element and partitions smaller items left, larger right.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Quick Interactive Launch Buttons -->
          <div style="background:var(--bg-surface); border:1px solid var(--bg-surface-border); border-radius:var(--radius-md); padding:1.5rem;">
            <h4 style="font-size:1.05rem; color:var(--text-main); font-weight:700; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.5rem;">
              <span>🚀</span> Try Algorithms in the Interactive Array Visualizer
            </h4>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
              Click any button below to see how memory blocks move step by step:
            </p>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem;">
              <button class="btn btn-secondary" onclick="IntroDS.launchOp('linearSearch')">🔍 Linear Search O(n)</button>
              <button class="btn btn-secondary" onclick="IntroDS.launchOp('binarySearch')">⚡ Binary Search O(log n)</button>
              <button class="btn btn-secondary" onclick="IntroDS.launchOp('bubbleSort')">🫧 Bubble Sort O(n²)</button>
              <button class="btn btn-secondary" onclick="IntroDS.launchOp('selectionSort')">🎯 Selection Sort O(n²)</button>
              <button class="btn btn-secondary" onclick="IntroDS.launchOp('insertionSort')">📥 Insertion Sort O(n²)</button>
            </div>
          </div>

        </div>
      `;
    }
  },

  launchOp(opName) {
    if (window.location.pathname.endsWith('array.html')) {
      if (typeof switchView === 'function') {
        switchView('viewOperations', 'Array Operations & C Code', document.querySelector('[data-view="viewOperations"]'));
      }
      if (typeof selectOperation === 'function') {
        selectOperation(opName);
      }
    } else {
      window.location.href = `array.html#${opName}`;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  IntroDS.init();
});
