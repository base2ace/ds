/* ==========================================================================
   base2ace Academy - C Code Snippets Library
   ========================================================================== */

const CSnippets = {
  traverse: {
    title: "Array Traversal in C",
    lines: [
      '<span class="syn-cmt">// Traversing all elements of an array</span>',
      '<span class="syn-kw">void</span> <span class="syn-fn">traverseArray</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
      '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i &lt; n; i++) {',
      '        <span class="syn-fn">printf</span>(<span class="syn-str">"arr[%d] = %d\\n"</span>, i, arr[i]);',
      '    }',
      '}'
    ],
    // Mapping from animation step index to C line number (1-based)
    stepLineMap: {
      init: 2,
      loop: 3,
      print: 4,
      done: 6
    }
  },

  access: {
    title: "Array Element Access in C",
    lines: [
      '<span class="syn-cmt">// O(1) Direct Access by Index</span>',
      '<span class="syn-kw">int</span> <span class="syn-fn">getElement</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> index, <span class="syn-kw">int</span> size) {',
      '    <span class="syn-kw">if</span> (index &lt; <span class="syn-num">0</span> || index &gt;= size) {',
      '        <span class="syn-fn">printf</span>(<span class="syn-str">"Index out of bounds!\\n"</span>);',
      '        <span class="syn-kw">return</span> -<span class="syn-num">1</span>;',
      '    }',
      '    <span class="syn-cmt">// Memory Offset = BaseAddress + index * sizeof(int)</span>',
      '    <span class="syn-kw">return</span> arr[index];',
      '}'
    ],
    stepLineMap: {
      check: 3,
      access: 8
    }
  },

  update: {
    title: "Update Element Value in C",
    lines: [
      '<span class="syn-cmt">// O(1) Update value at given index</span>',
      '<span class="syn-kw">void</span> <span class="syn-fn">updateElement</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> index, <span class="syn-kw">int</span> newVal, <span class="syn-kw">int</span> size) {',
      '    <span class="syn-kw">if</span> (index &lt; <span class="syn-num">0</span> || index &gt;= size) {',
      '        <span class="syn-fn">printf</span>(<span class="syn-str">"Invalid Index!\\n"</span>);',
      '        <span class="syn-kw">return</span>;',
      '    }',
      '    arr[index] = newVal;',
      '}'
    ],
    stepLineMap: {
      check: 3,
      assign: 7
    }
  },

  insert: {
    title: "Insert Element at Index in C",
    lines: [
      '<span class="syn-cmt">// Insert element & shift elements right O(n)</span>',
      '<span class="syn-kw">int</span> <span class="syn-fn">insertAtIndex</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> *size, <span class="syn-kw">int</span> index, <span class="syn-kw">int</span> val) {',
      '    <span class="syn-cmt">// Shift elements right from end to index</span>',
      '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = *size - <span class="syn-num">1</span>; i &gt;= index; i--) {',
      '        arr[i + <span class="syn-num">1</span>] = arr[i];',
      '    }',
      '    arr[index] = val;',
      '    (*size)++;',
      '    <span class="syn-kw">return</span> <span class="syn-num">1</span>;',
      '}'
    ],
    stepLineMap: {
      shiftLoop: 4,
      shifting: 5,
      placeVal: 7,
      incSize: 8
    }
  },

  delete: {
    title: "Delete Element at Index in C",
    lines: [
      '<span class="syn-cmt">// Delete element & shift elements left O(n)</span>',
      '<span class="syn-kw">int</span> <span class="syn-fn">deleteAtIndex</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> *size, <span class="syn-kw">int</span> index) {',
      '    <span class="syn-cmt">// Shift elements left to overwrite target</span>',
      '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = index; i &lt; *size - <span class="syn-num">1</span>; i++) {',
      '        arr[i] = arr[i + <span class="syn-num">1</span>];',
      '    }',
      '    (*size)--;',
      '    <span class="syn-kw">return</span> <span class="syn-num">1</span>;',
      '}'
    ],
    stepLineMap: {
      target: 2,
      shiftLoop: 4,
      shifting: 5,
      decSize: 7
    }
  },

  linearSearch: {
    title: "Linear Search in C",
    lines: [
      '<span class="syn-cmt">// Sequential Search O(n)</span>',
      '<span class="syn-kw">int</span> <span class="syn-fn">linearSearch</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> size, <span class="syn-kw">int</span> target) {',
      '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i &lt; size; i++) {',
      '        <span class="syn-kw">if</span> (arr[i] == target) {',
      '            <span class="syn-kw">return</span> i; <span class="syn-cmt">// Target found at index i</span>',
      '        }',
      '    }',
      '    <span class="syn-kw">return</span> -<span class="syn-num">1</span>; <span class="syn-cmt">// Not found</span>',
      '}'
    ],
    stepLineMap: {
      loop: 3,
      compare: 4,
      found: 5,
      notFound: 8
    }
  },

  binarySearch: {
    title: "Binary Search in C (Sorted Array)",
    lines: [
      '<span class="syn-cmt">// Binary Search O(log n) - requires sorted array</span>',
      '<span class="syn-kw">int</span> <span class="syn-fn">binarySearch</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> size, <span class="syn-kw">int</span> target) {',
      '    <span class="syn-kw">int</span> low = <span class="syn-num">0</span>, high = size - <span class="syn-num">1</span>;',
      '    <span class="syn-kw">while</span> (low &lt;= high) {',
      '        <span class="syn-kw">int</span> mid = low + (high - low) / <span class="syn-num">2</span>;',
      '        <span class="syn-kw">if</span> (arr[mid] == target) <span class="syn-kw">return</span> mid;',
      '        <span class="syn-kw">if</span> (arr[mid] &lt; target) low = mid + <span class="syn-num">1</span>;',
      '        <span class="syn-kw">else</span> high = mid - <span class="syn-num">1</span>;',
      '    }',
      '    <span class="syn-kw">return</span> -<span class="syn-num">1</span>;',
      '}'
    ],
    stepLineMap: {
      initPointers: 3,
      loopCheck: 4,
      calcMid: 5,
      checkEqual: 6,
      goRight: 7,
      goLeft: 8,
      notFound: 10
    }
  },

  bubbleSort: {
    title: "Bubble Sort in C",
    lines: [
      '<span class="syn-cmt">// Bubble Sort O(n²) - Swap adjacent elements if out of order</span>',
      '<span class="syn-kw">void</span> <span class="syn-fn">bubbleSort</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
      '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i &lt; n - <span class="syn-num">1</span>; i++) {',
      '        <span class="syn-kw">for</span> (<span class="syn-kw">int</span> j = <span class="syn-num">0</span>; j &lt; n - i - <span class="syn-num">1</span>; j++) {',
      '            <span class="syn-kw">if</span> (arr[j] &gt; arr[j + <span class="syn-num">1</span>]) {',
      '                <span class="syn-kw">int</span> temp = arr[j];',
      '                arr[j] = arr[j + <span class="syn-num">1</span>];',
      '                arr[j + <span class="syn-num">1</span>] = temp;',
      '            }',
      '        }',
      '    }',
      '}'
    ],
    stepLineMap: {
      outerLoop: 3,
      innerLoop: 4,
      compare: 5,
      swap: 7,
      done: 12
    }
  },

  selectionSort: {
    title: "Selection Sort in C",
    lines: [
      '<span class="syn-cmt">// Selection Sort O(n²) - Find minimum element & swap to front</span>',
      '<span class="syn-kw">void</span> <span class="syn-fn">selectionSort</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
      '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">0</span>; i &lt; n - <span class="syn-num">1</span>; i++) {',
      '        <span class="syn-kw">int</span> minIdx = i;',
      '        <span class="syn-kw">for</span> (<span class="syn-kw">int</span> j = i + <span class="syn-num">1</span>; j &lt; n; j++) {',
      '            <span class="syn-kw">if</span> (arr[j] &lt; arr[minIdx]) minIdx = j;',
      '        }',
      '        <span class="syn-kw">int</span> temp = arr[minIdx];',
      '        arr[minIdx] = arr[i];',
      '        arr[i] = temp;',
      '    }',
      '}'
    ],
    stepLineMap: {
      outerLoop: 3,
      initMin: 4,
      innerLoop: 5,
      newMin: 6,
      swap: 9,
      done: 12
    }
  },

  insertionSort: {
    title: "Insertion Sort in C",
    lines: [
      '<span class="syn-cmt">// Insertion Sort O(n²) - Insert key into sorted subarray</span>',
      '<span class="syn-kw">void</span> <span class="syn-fn">insertionSort</span>(<span class="syn-kw">int</span> arr[], <span class="syn-kw">int</span> n) {',
      '    <span class="syn-kw">for</span> (<span class="syn-kw">int</span> i = <span class="syn-num">1</span>; i &lt; n; i++) {',
      '        <span class="syn-kw">int</span> key = arr[i];',
      '        <span class="syn-kw">int</span> j = i - <span class="syn-num">1</span>;',
      '        <span class="syn-kw">while</span> (j &gt;= <span class="syn-num">0</span> &amp;&amp; arr[j] &gt; key) {',
      '            arr[j + <span class="syn-num">1</span>] = arr[j];',
      '            j--;',
      '        }',
      '        arr[j + <span class="syn-num">1</span>] = key;',
      '    }',
      '}'
    ],
    stepLineMap: {
      outerLoop: 3,
      setKey: 4,
      shiftLoop: 6,
      shift: 7,
      placeKey: 10,
      done: 12
    }
  }
};
