/* ==========================================================================
   base2ace Academy - Interactive Array Visualizer Engine
   ========================================================================== */

let arrayData = [12, 45, 67, 23, 89, 34, 78]; // Default sample array
let maxCapacity = 10;
let activeOperation = 'traverse'; // Default tab

// Playback state
let animationSteps = [];
let currentStepIndex = 0;
let isPlaying = false;
let playbackTimer = null;
let animationSpeedMs = 1600; // Default comfortable learning speed (1.6s)

document.addEventListener('DOMContentLoaded', () => {
  initVisualizer();
});

function initVisualizer() {
  renderArrayStage();
  selectOperation(activeOperation);
  setupEventListeners();
}

/**
 * Renders the visual array blocks in the stage
 */
function renderArrayStage(highlights = {}) {
  const container = document.getElementById('arrayNodesContainer');
  if (!container) return;

  container.innerHTML = '';

  for (let i = 0; i < arrayData.length; i++) {
    const val = arrayData[i];
    const hexAddr = MemoryInspector.getAddressForIndex(i);

    const nodeEl = document.createElement('div');
    nodeEl.className = 'array-node';

    // Highlight classes check
    if (highlights.current === i) nodeEl.classList.add('highlight-current');
    if (highlights.success === i) nodeEl.classList.add('highlight-success');
    if (highlights.target === i) nodeEl.classList.add('highlight-target');
    if (highlights.pointer === i) nodeEl.classList.add('highlight-pointer');

    let pointerBadge = '';
    if (highlights.pointerName && highlights.pointerIndex === i) {
      pointerBadge = `<div class="node-pointer">${highlights.pointerName}</div>`;
    }

    nodeEl.innerHTML = `
      ${pointerBadge}
      <div class="node-box">${val !== null ? val : ''}</div>
      <div class="node-index">i = ${i}</div>
      <div class="node-address">${hexAddr}</div>
    `;

    container.appendChild(nodeEl);
  }

  // Update Size & Capacity info
  const sizeBadge = document.getElementById('arraySizeBadge');
  if (sizeBadge) {
    sizeBadge.innerText = `Size: ${arrayData.length} / ${maxCapacity}`;
  }
}

/**
 * Sets up tab selection for array operations & algorithms
 */
function selectOperation(opKey) {
  activeOperation = opKey;
  stopPlayback();

  // Update dropdown selection if present
  const dropdown = document.getElementById('opDropdownSelect');
  if (dropdown && dropdown.value !== opKey) {
    dropdown.value = opKey;
  }

  // Update active tab buttons
  document.querySelectorAll('.op-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.op === opKey);
  });

  // Render input controls for selected operation
  renderOpControls(opKey);

  // Render C Code panel
  renderCCodePanel(opKey);

  // Reset steps
  resetSteps();
}

/**
 * Category filter for array operation tabs (All vs Basic Operations vs Algorithms)
 */
function filterOpCategory(categoryKey) {
  // Update category pill active states
  const catPills = {
    'all': 'catPillAll',
    'basic': 'catPillBasic',
    'algorithms': 'catPillAlgorithms'
  };

  Object.keys(catPills).forEach(k => {
    const pill = document.getElementById(catPills[k]);
    if (pill) {
      pill.classList.toggle('active', k === categoryKey);
    }
  });

  // Show / hide operation tabs based on data-category
  document.querySelectorAll('.op-tab[data-category]').forEach(tab => {
    if (categoryKey === 'all') {
      tab.style.display = 'inline-flex';
    } else {
      tab.style.display = (tab.dataset.category === categoryKey) ? 'inline-flex' : 'none';
    }
  });
}


function renderOpControls(opKey) {
  const controlsContainer = document.getElementById('opControlsContainer');
  if (!controlsContainer) return;

  let html = '';

  switch (opKey) {
    case 'traverse':
      html = `
        <span style="font-size:0.85rem; color:var(--text-muted);">Loop through all elements and display values in C.</span>
        <button class="btn btn-primary btn-sm" onclick="runTraverse(true)">▶ Run Traversal</button>
        <button class="btn btn-secondary btn-sm" onclick="runTraverse(false)">🖐️ Step Manually</button>
      `;
      break;

    case 'access':
      html = `
        <div class="op-input-group">
          <label>Index (0..${arrayData.length - 1}):</label>
          <input type="number" id="accessIndexInput" class="op-input" value="2" min="0" max="${arrayData.length - 1}">
        </div>
        <button class="btn btn-primary btn-sm" onclick="runAccess(true)">▶ Access Element</button>
        <button class="btn btn-secondary btn-sm" onclick="runAccess(false)">🖐️ Step Manually</button>
      `;
      break;

    case 'update':
      html = `
        <div class="op-input-group">
          <label>Index:</label>
          <input type="number" id="updateIndexInput" class="op-input" value="3" min="0" max="${arrayData.length - 1}">
        </div>
        <div class="op-input-group">
          <label>New Value:</label>
          <input type="number" id="updateValueInput" class="op-input" value="99">
        </div>
        <button class="btn btn-primary btn-sm" onclick="runUpdate(true)">▶ Update Value</button>
        <button class="btn btn-secondary btn-sm" onclick="runUpdate(false)">🖐️ Step Manually</button>
      `;
      break;

    case 'insert':
      html = `
        <div class="op-input-group">
          <label>Insert Value:</label>
          <input type="number" id="insertValInput" class="op-input" value="50">
        </div>
        <div class="op-input-group">
          <label>At Index:</label>
          <input type="number" id="insertIdxInput" class="op-input" value="2" min="0" max="${arrayData.length}">
        </div>
        <button class="btn btn-primary btn-sm" onclick="runInsert(true)">▶ Insert Element</button>
        <button class="btn btn-secondary btn-sm" onclick="runInsert(false)">🖐️ Step Manually</button>
      `;
      break;

    case 'delete':
      html = `
        <div class="op-input-group">
          <label>Delete at Index:</label>
          <input type="number" id="deleteIdxInput" class="op-input" value="2" min="0" max="${arrayData.length - 1}">
        </div>
        <button class="btn btn-primary btn-sm" onclick="runDelete(true)">▶ Delete Element</button>
        <button class="btn btn-secondary btn-sm" onclick="runDelete(false)">🖐️ Step Manually</button>
      `;
      break;

    case 'linearSearch':
      html = `
        <div class="op-input-group">
          <label>Search Target:</label>
          <input type="number" id="searchTargetInput" class="op-input" value="23">
        </div>
        <button class="btn btn-primary btn-sm" onclick="runLinearSearch(true)">▶ Linear Search</button>
        <button class="btn btn-secondary btn-sm" onclick="runLinearSearch(false)">🖐️ Step Manually</button>
      `;
      break;

    case 'binarySearch':
      html = `
        <div class="op-input-group">
          <label>Search Target:</label>
          <input type="number" id="binSearchTargetInput" class="op-input" value="45">
        </div>
        <button class="btn btn-accent btn-sm" onclick="runBinarySearch(true)">▶ Binary Search</button>
        <button class="btn btn-secondary btn-sm" onclick="runBinarySearch(false)">🖐️ Step Manually</button>
        <span style="font-size:0.75rem; color:var(--text-dim);">(Auto-sorts array first)</span>
      `;
      break;

    case 'bubbleSort':
      html = `
        <button class="btn btn-primary btn-sm" onclick="runBubbleSort(true)">▶ Run Bubble Sort</button>
        <button class="btn btn-secondary btn-sm" onclick="runBubbleSort(false)">🖐️ Step Manually</button>
      `;
      break;

    case 'selectionSort':
      html = `
        <button class="btn btn-primary btn-sm" onclick="runSelectionSort(true)">▶ Run Selection Sort</button>
        <button class="btn btn-secondary btn-sm" onclick="runSelectionSort(false)">🖐️ Step Manually</button>
      `;
      break;

    case 'insertionSort':
      html = `
        <button class="btn btn-primary btn-sm" onclick="runInsertionSort(true)">▶ Run Insertion Sort</button>
        <button class="btn btn-secondary btn-sm" onclick="runInsertionSort(false)">🖐️ Step Manually</button>
      `;
      break;
  }

  controlsContainer.innerHTML = html;
}

/**
 * Renders C Code Editor panel
 */
function renderCCodePanel(opKey, activeLineNum = null) {
  const snippet = CSnippets[opKey];
  if (!snippet) return;

  const codeView = document.getElementById('cCodeView');
  const titleEl = document.getElementById('cCodeTitle');
  if (titleEl) titleEl.innerText = snippet.title;

  if (codeView) {
    let linesHtml = '';
    snippet.lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const isActive = lineNum === activeLineNum ? 'active-line' : '';
      linesHtml += `
        <div class="code-line ${isActive}">
          <span class="line-num">${lineNum}</span>
          <span class="line-text">${lineText}</span>
        </div>
      `;
    });
    codeView.innerHTML = linesHtml;
  }
}

/**
 * Updates variables tracker below code view
 */
/**
 * Updates variables tracker below code view with enlarged chips
 */
function updateVarTracker(varObj = {}) {
  const container = document.getElementById('varTrackerList');
  if (!container) return;

  let html = '';
  for (const [key, val] of Object.entries(varObj)) {
    html += `
      <div class="var-item">
        <span class="var-name">${key}</span>
        <span class="var-equals">=</span>
        <span class="var-val">${val}</span>
      </div>
    `;
  }
  container.innerHTML = html || '<span style="color:var(--text-dim); font-size:0.9rem;">No active variables</span>';
}

/* ==========================================================================
   Step Generation Engines for Operations
   ========================================================================== */

function finishStepGeneration(autoPlay = true) {
  if (autoPlay) {
    startPlayback();
  } else {
    startManualMode();
  }
}

function runTraverse(autoPlay = true) {
  animationSteps = [];
  animationSteps.push({
    msg: "Initializing traversal: setting loop counter i = 0",
    highlights: { current: 0 },
    cLine: 3,
    vars: { i: 0, n: arrayData.length }
  });

  for (let i = 0; i < arrayData.length; i++) {
    animationSteps.push({
      msg: `Visiting index [${i}] -> arr[${i}] = ${arrayData[i]}`,
      highlights: { current: i },
      cLine: 4,
      vars: { i: i, "arr[i]": arrayData[i] }
    });
  }

  animationSteps.push({
    msg: "Traversal completed successfully!",
    highlights: { success: arrayData.length - 1 },
    cLine: 6,
    vars: { i: arrayData.length }
  });

  finishStepGeneration(autoPlay);
}

function runAccess(autoPlay = true) {
  const idx = parseInt(document.getElementById('accessIndexInput').value, 10);
  if (isNaN(idx) || idx < 0 || idx >= arrayData.length) {
    alert(`Invalid Index! Please enter an index between 0 and ${arrayData.length - 1}`);
    return;
  }

  const addr = MemoryInspector.getAddressForIndex(idx);
  animationSteps = [
    {
      msg: `Checking bounds for index ${idx}... Valid!`,
      highlights: { pointer: idx, pointerName: "index" },
      cLine: 3,
      vars: { index: idx, size: arrayData.length }
    },
    {
      msg: `Accessing memory address ${addr} directly! arr[${idx}] = ${arrayData[idx]}`,
      highlights: { success: idx },
      cLine: 8,
      vars: { index: idx, "arr[index]": arrayData[idx], address: addr }
    }
  ];

  finishStepGeneration(autoPlay);
}

function runUpdate(autoPlay = true) {
  const idx = parseInt(document.getElementById('updateIndexInput').value, 10);
  const newVal = parseInt(document.getElementById('updateValueInput').value, 10);

  if (isNaN(idx) || idx < 0 || idx >= arrayData.length || isNaN(newVal)) {
    alert("Please provide valid index and numeric new value!");
    return;
  }

  const oldVal = arrayData[idx];
  animationSteps = [
    {
      msg: `Validating index ${idx}... OK!`,
      highlights: { pointer: idx, pointerName: "target" },
      cLine: 3,
      vars: { index: idx, newVal: newVal }
    },
    {
      msg: `Updating value at arr[${idx}]: ${oldVal} ➔ ${newVal}`,
      highlights: { success: idx },
      cLine: 7,
      vars: { index: idx, "arr[index]": newVal },
      action: () => { arrayData[idx] = newVal; renderArrayStage({ success: idx }); }
    }
  ];

  finishStepGeneration(autoPlay);
}

function runInsert(autoPlay = true) {
  const val = parseInt(document.getElementById('insertValInput').value, 10);
  const idx = parseInt(document.getElementById('insertIdxInput').value, 10);

  if (isNaN(val) || isNaN(idx) || idx < 0 || idx > arrayData.length) {
    alert(`Index must be between 0 and ${arrayData.length}`);
    return;
  }

  if (arrayData.length >= maxCapacity) {
    alert(`Array reached max capacity (${maxCapacity})! Please increase array capacity first.`);
    return;
  }

  animationSteps = [];

  // Step 1: Traverse from start of array (index 0) forward to target position idx
  for (let i = 0; i < idx; i++) {
    animationSteps.push({
      msg: `Traversing array from start: checking index [${i}] (val: ${arrayData[i]})... moving to insertion position [${idx}]`,
      highlights: { current: i },
      cLine: 4,
      vars: { i: i, "arr[i]": arrayData[i], targetIndex: idx }
    });
  }

  // Step 2: Insert new element at index idx
  animationSteps.push({
    msg: `Reached target index [${idx}]! Inserting new value ${val} into arr[${idx}]`,
    highlights: { success: idx },
    cLine: 7,
    vars: { index: idx, val: val },
    action: () => {
      arrayData.splice(idx, 0, val);
      renderArrayStage({ success: idx });
    }
  });

  finishStepGeneration(autoPlay);
}

function runDelete(autoPlay = true) {
  const idx = parseInt(document.getElementById('deleteIdxInput').value, 10);

  if (isNaN(idx) || idx < 0 || idx >= arrayData.length) {
    alert(`Invalid index for deletion!`);
    return;
  }

  if (arrayData.length <= 1) {
    alert("Array must have at least 1 element.");
    return;
  }

  const targetVal = arrayData[idx];
  animationSteps = [];

  // Step 1: Traverse from start of array (index 0) forward to deletion target index
  for (let i = 0; i < idx; i++) {
    animationSteps.push({
      msg: `Traversing array from start: checking index [${i}] (val: ${arrayData[i]})... searching for deletion index [${idx}]`,
      highlights: { current: i },
      cLine: 4,
      vars: { i: i, "arr[i]": arrayData[i], targetIndex: idx }
    });
  }

  // Step 2: Delete element at index idx
  animationSteps.push({
    msg: `Target element found at index [${idx}] (value ${targetVal})! Deleting element and updating size to ${arrayData.length - 1}`,
    highlights: { target: idx, pointerName: "DELETE" },
    cLine: 8,
    vars: { index: idx, targetVal: targetVal, newSize: arrayData.length - 1 },
    action: () => {
      arrayData.splice(idx, 1);
      renderArrayStage();
    }
  });

  finishStepGeneration(autoPlay);
}

function runLinearSearch(autoPlay = true) {
  const target = parseInt(document.getElementById('searchTargetInput').value, 10);
  if (isNaN(target)) return;

  animationSteps = [];
  let found = false;

  for (let i = 0; i < arrayData.length; i++) {
    const matches = arrayData[i] === target;
    animationSteps.push({
      msg: `Comparing arr[${i}] (${arrayData[i]}) with target (${target})... ${matches ? 'MATCH FOUND! 🎉' : 'No match'}`,
      highlights: matches ? { success: i } : { current: i },
      cLine: 4,
      vars: { i: i, "arr[i]": arrayData[i], target: target }
    });

    if (matches) {
      found = true;
      animationSteps.push({
        msg: `Linear search complete: Element ${target} found at index [${i}]!`,
        highlights: { success: i },
        cLine: 5,
        vars: { resultIndex: i }
      });
      break;
    }
  }

  if (!found) {
    animationSteps.push({
      msg: `Element ${target} was not found in array. Return -1`,
      highlights: {},
      cLine: 8,
      vars: { result: -1 }
    });
  }

  finishStepGeneration(autoPlay);
}

function runBinarySearch(autoPlay = true) {
  const target = parseInt(document.getElementById('binSearchTargetInput').value, 10);
  if (isNaN(target)) return;

  // Auto-sort array for binary search
  arrayData.sort((a, b) => a - b);
  renderArrayStage();

  animationSteps = [];
  let low = 0;
  let high = arrayData.length - 1;
  let found = false;

  animationSteps.push({
    msg: `Array sorted for Binary Search. Initializing low = 0, high = ${high}`,
    highlights: { pointer: low, pointerName: "L..H", pointerIndex: low },
    cLine: 3,
    vars: { low: low, high: high, target: target }
  });

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let midVal = arrayData[mid];

    animationSteps.push({
      msg: `Calculating mid = (${low} + ${high}) / 2 = ${mid}. Checking arr[${mid}] (${midVal})`,
      highlights: { pointer: mid, pointerName: "MID", pointerIndex: mid },
      cLine: 5,
      vars: { low: low, high: high, mid: mid, "arr[mid]": midVal }
    });

    if (midVal === target) {
      animationSteps.push({
        msg: `MATCH FOUND! arr[mid] (${midVal}) == target (${target}) at index [${mid}]!`,
        highlights: { success: mid },
        cLine: 6,
        vars: { mid: mid, result: mid }
      });
      found = true;
      break;
    } else if (midVal < target) {
      animationSteps.push({
        msg: `arr[mid] (${midVal}) < target (${target}). Search right half -> low = mid + 1 (${mid + 1})`,
        highlights: { current: mid },
        cLine: 7,
        vars: { newLow: mid + 1 }
      });
      low = mid + 1;
    } else {
      animationSteps.push({
        msg: `arr[mid] (${midVal}) > target (${target}). Search left half -> high = mid - 1 (${mid - 1})`,
        highlights: { current: mid },
        cLine: 8,
        vars: { newHigh: mid - 1 }
      });
      high = mid - 1;
    }
  }

  if (!found) {
    animationSteps.push({
      msg: `Target ${target} not found in array. Return -1`,
      highlights: {},
      cLine: 10,
      vars: { result: -1 }
    });
  }

  finishStepGeneration(autoPlay);
}

function runBubbleSort(autoPlay = true) {
  animationSteps = [];
  let arr = [...arrayData];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const idxA = j;
      const idxB = j + 1;
      const valA = arr[idxA];
      const valB = arr[idxB];

      animationSteps.push({
        msg: `Comparing adjacent elements arr[${idxA}] (${valA}) and arr[${idxB}] (${valB})`,
        highlights: { current: idxA, target: idxB },
        cLine: 5,
        vars: { i: i, j: j, "arr[j]": valA, "arr[j+1]": valB }
      });

      if (valA > valB) {
        let temp = arr[idxA];
        arr[idxA] = arr[idxB];
        arr[idxB] = temp;

        const snapArr = [...arr];
        animationSteps.push({
          msg: `SWAP! arr[${idxA}] (${valA}) > arr[${idxB}] (${valB}) -> Swapping elements!`,
          highlights: { current: idxA, success: idxB },
          cLine: 7,
          vars: { temp: valA, "arr[j]": valB, "arr[j+1]": valA },
          action: () => {
            arrayData = [...snapArr];
            renderArrayStage({ current: idxA, success: idxB });
          }
        });
      }
    }
  }

  const finalArr = [...arr];
  animationSteps.push({
    msg: "Bubble Sort completed! Array is fully sorted.",
    highlights: { success: 0 },
    cLine: 12,
    vars: { status: "SORTED" },
    action: () => {
      arrayData = [...finalArr];
      renderArrayStage({ success: 0 });
    }
  });

  finishStepGeneration(autoPlay);
}

function runSelectionSort(autoPlay = true) {
  animationSteps = [];
  let arr = [...arrayData];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    animationSteps.push({
      msg: `Outer pass i = ${i}. Assuming min element is arr[${i}] (${arr[i]})`,
      highlights: { pointer: i, pointerName: "MIN", pointerIndex: i },
      cLine: 4,
      vars: { i: i, minIdx: minIdx, minVal: arr[minIdx] }
    });

    for (let j = i + 1; j < n; j++) {
      animationSteps.push({
        msg: `Comparing arr[${j}] (${arr[j]}) with current min arr[${minIdx}] (${arr[minIdx]})`,
        highlights: { current: j, pointer: minIdx, pointerName: "MIN", pointerIndex: minIdx },
        cLine: 5,
        vars: { j: j, "arr[j]": arr[j], minVal: arr[minIdx] }
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        animationSteps.push({
          msg: `Found new minimum value ${arr[minIdx]} at index [${minIdx}]`,
          highlights: { success: minIdx, pointer: minIdx, pointerName: "NEW MIN", pointerIndex: minIdx },
          cLine: 6,
          vars: { minIdx: minIdx, newMinVal: arr[minIdx] }
        });
      }
    }

    if (minIdx !== i) {
      let temp = arr[minIdx];
      arr[minIdx] = arr[i];
      arr[i] = temp;

      const snapArr = [...arr];
      animationSteps.push({
        msg: `Swapping minimum element arr[${minIdx}] (${temp}) into sorted position index [${i}]`,
        highlights: { success: i, target: minIdx },
        cLine: 9,
        vars: { temp: temp, "arr[i]": temp },
        action: () => {
          arrayData = [...snapArr];
          renderArrayStage({ success: i });
        }
      });
    }
  }

  const finalArr = [...arr];
  animationSteps.push({
    msg: "Selection Sort completed! Array is fully sorted.",
    highlights: { success: 0 },
    cLine: 12,
    vars: { status: "SORTED" },
    action: () => {
      arrayData = [...finalArr];
      renderArrayStage({ success: 0 });
    }
  });

  finishStepGeneration(autoPlay);
}

function runInsertionSort(autoPlay = true) {
  animationSteps = [];
  let arr = [...arrayData];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    animationSteps.push({
      msg: `Picking key = arr[${i}] (${key}). Inserting into sorted subarray [0..${i-1}]`,
      highlights: { current: i, pointer: i, pointerName: "KEY", pointerIndex: i },
      cLine: 4,
      vars: { i: i, key: key }
    });

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      const snapArr = [...arr];

      animationSteps.push({
        msg: `arr[${j}] (${arr[j]}) > key (${key}) -> Shifting arr[${j}] right to index [${j + 1}]`,
        highlights: { current: j, target: j + 1 },
        cLine: 7,
        vars: { j: j, "arr[j]": arr[j], key: key },
        action: () => {
          arrayData = [...snapArr];
          renderArrayStage({ current: j, target: j + 1 });
        }
      });
      j--;
    }

    arr[j + 1] = key;
    const snapArr = [...arr];
    animationSteps.push({
      msg: `Placed key (${key}) into correct sorted position at index [${j + 1}]`,
      highlights: { success: j + 1 },
      cLine: 10,
      vars: { "placedAtIndex": j + 1, key: key },
      action: () => {
        arrayData = [...snapArr];
        renderArrayStage({ success: j + 1 });
      }
    });
  }

  const finalArr = [...arr];
  animationSteps.push({
    msg: "Insertion Sort completed! Array is fully sorted.",
    highlights: { success: 0 },
    cLine: 12,
    vars: { status: "SORTED" },
    action: () => {
      arrayData = [...finalArr];
      renderArrayStage({ success: 0 });
    }
  });

  finishStepGeneration(autoPlay);
}

/* ==========================================================================
   Playback Controls & State Machine
   ========================================================================== */

function finishStepGeneration(autoPlay = true) {
  if (autoPlay) {
    startPlayback();
  } else {
    startManualMode();
  }
}

function startPlayback() {
  if (animationSteps.length === 0) return;
  currentStepIndex = 0;
  executeStep(0);

  const playBtn = document.getElementById('playPauseBtn');
  if (playBtn) {
    playBtn.innerText = '⏸ Pause';
    playBtn.classList.add('playing');
  }
  isPlaying = true;
  updateStepCounterBadge();

  clearInterval(playbackTimer);
  playbackTimer = setInterval(() => {
    if (currentStepIndex < animationSteps.length - 1) {
      currentStepIndex++;
      executeStep(currentStepIndex);
    } else {
      stopPlayback();
    }
  }, animationSpeedMs);
}

function startManualMode() {
  if (animationSteps.length === 0) return;
  stopPlayback();
  currentStepIndex = 0;
  executeStep(0);
}

function stopPlayback() {
  isPlaying = false;
  clearInterval(playbackTimer);
  const playBtn = document.getElementById('playPauseBtn');
  if (playBtn) {
    playBtn.innerText = '▶ Play';
    playBtn.classList.remove('playing');
  }
  updateStepCounterBadge();
}

function togglePlayPause() {
  if (isPlaying) {
    stopPlayback();
  } else {
    if (animationSteps.length === 0) return;
    if (currentStepIndex >= animationSteps.length - 1) {
      currentStepIndex = 0;
    }
    isPlaying = true;
    const playBtn = document.getElementById('playPauseBtn');
    if (playBtn) {
      playBtn.innerText = '⏸ Pause';
      playBtn.classList.add('playing');
    }
    updateStepCounterBadge();

    playbackTimer = setInterval(() => {
      if (currentStepIndex < animationSteps.length - 1) {
        currentStepIndex++;
        executeStep(currentStepIndex);
      } else {
        stopPlayback();
      }
    }, animationSpeedMs);
  }
}

function stepForward() {
  stopPlayback();
  if (currentStepIndex < animationSteps.length - 1) {
    currentStepIndex++;
    executeStep(currentStepIndex);
  }
}

function stepBackward() {
  stopPlayback();
  if (currentStepIndex > 0) {
    currentStepIndex--;
    executeStep(currentStepIndex);
  }
}

function jumpToStart() {
  if (animationSteps.length === 0) return;
  stopPlayback();
  currentStepIndex = 0;
  executeStep(0);
}

function jumpToEnd() {
  if (animationSteps.length === 0) return;
  stopPlayback();
  currentStepIndex = animationSteps.length - 1;
  executeStep(currentStepIndex);
}

function resetSteps() {
  stopPlayback();
  currentStepIndex = 0;
  animationSteps = [];
  renderArrayStage();
  updateStepBanner("Select an operation and choose Auto Play or Step Manually.");
  renderCCodePanel(activeOperation, null);
  updateVarTracker({});
  updateStepCounterBadge();
}

function executeStep(index) {
  const step = animationSteps[index];
  if (!step) return;

  // Execute mutative action if present at this step
  if (typeof step.action === 'function') {
    step.action();
  } else {
    renderArrayStage(step.highlights || {});
  }

  // Update step text banner
  updateStepBanner(step.msg);

  // Highlight C code line
  renderCCodePanel(activeOperation, step.cLine);

  // Update variables window
  updateVarTracker(step.vars || {});

  // Update step counter badge
  updateStepCounterBadge();
}

function updateStepCounterBadge() {
  const badge = document.getElementById('stepCounterBadge');
  if (!badge) return;

  if (animationSteps.length === 0) {
    badge.innerText = 'Step 0 / 0';
    badge.classList.remove('manual');
  } else {
    badge.innerText = `Step ${currentStepIndex + 1} / ${animationSteps.length}`;
    if (!isPlaying) {
      badge.classList.add('manual');
    } else {
      badge.classList.remove('manual');
    }
  }
}

function updateStepBanner(msg) {
  const banner = document.getElementById('stepBannerText');
  if (banner) banner.innerText = msg;
}

/* ==========================================================================
   Data Customization Helpers (Random Data, Custom Input, Sizing)
   ========================================================================== */

function setupEventListeners() {
  // Speed slider
  const speedSlider = document.getElementById('speedSlider');
  const speedBadge = document.getElementById('speedLabelBadge');

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      animationSpeedMs = parseInt(e.target.value, 10);
      if (speedBadge) {
        speedBadge.innerText = (animationSpeedMs / 1000).toFixed(1) + 's / step';
      }
      if (isPlaying) {
        stopPlayback();
        togglePlayPause();
      }
    });
  }

  // Array Size Selector
  const sizeInput = document.getElementById('arraySizeInput');
  if (sizeInput) {
    sizeInput.addEventListener('change', (e) => {
      const newSize = parseInt(e.target.value, 10);
      if (newSize >= 3 && newSize <= 12) {
        setArraySize(newSize);
      }
    });
  }
}

function setArraySize(newSize) {
  if (newSize > arrayData.length) {
    while (arrayData.length < newSize) {
      arrayData.push(Math.floor(Math.random() * 89) + 10);
    }
  } else if (newSize < arrayData.length) {
    arrayData = arrayData.slice(0, newSize);
  }
  resetSteps();
}

function generateRandomArray() {
  const size = arrayData.length || 7;
  arrayData = [];
  for (let i = 0; i < size; i++) {
    arrayData.push(Math.floor(Math.random() * 89) + 10);
  }
  resetSteps();
}

function fillSequentialArray() {
  const size = arrayData.length || 7;
  arrayData = [];
  for (let i = 0; i < size; i++) {
    arrayData.push((i + 1) * 10);
  }
  resetSteps();
}

function promptCustomArray() {
  const inputStr = prompt("Enter comma-separated numbers (e.g. 15, 42, 8, 99):", arrayData.join(", "));
  if (inputStr !== null) {
    const parsed = inputStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      arrayData = parsed.slice(0, 12); // limit max 12
      const sizeInput = document.getElementById('arraySizeInput');
      if (sizeInput) sizeInput.value = arrayData.length;
      resetSteps();
    } else {
      alert("Invalid input format!");
    }
  }
}

function openMemoryModal() {
  MemoryInspector.renderMemoryInspector(arrayData);
  openModal('memoryModalOverlay');
}
