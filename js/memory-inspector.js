/* ==========================================================================
   base2ace Academy - Memory Layout Inspector Module
   ========================================================================== */

const MemoryInspector = {
  baseAddressHex: 0x7ffe00, // Simulated 32-bit stack base address for array
  elementSizeBytes: 4,     // Size of int in C standard (4 bytes)

  /**
   * Calculate memory address for array index i
   */
  getAddressForIndex(index) {
    const decAddress = this.baseAddressHex + (index * this.elementSizeBytes);
    return "0x" + decAddress.toString(16).toUpperCase();
  },

  /**
   * Renders memory layout table inside modal
   */
  renderMemoryInspector(arrayData) {
    const modalBody = document.getElementById('memoryInspectorContent');
    if (!modalBody) return;

    let html = `
      <div class="mem-formula-box">
        <div><strong>C Memory Offset Formula:</strong></div>
        <div class="mem-formula">Address(arr[i]) = Base_Address + (i × sizeof(int))</div>
        <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.4rem;">
          Base Address: <code>0x${this.baseAddressHex.toString(16).toUpperCase()}</code> | 
          Type: <code>int</code> (${this.elementSizeBytes} Bytes per element)
        </div>
      </div>

      <div class="mem-table-wrapper">
        <table class="mem-table">
          <thead>
            <tr>
              <th>Index (i)</th>
              <th>Hex Memory Address</th>
              <th>Stored Value</th>
              <th>Memory Calculation Offset</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
    `;

    arrayData.forEach((val, i) => {
      const hexAddr = this.getAddressForIndex(i);
      const offsetBytes = i * this.elementSizeBytes;

      html += `
        <tr>
          <td><strong style="color:var(--text-main);">[${i}]</strong></td>
          <td><code style="color:var(--secondary); font-weight:700;">${hexAddr}</code></td>
          <td><span class="badge badge-primary">${val !== null ? val : 'NULL'}</span></td>
          <td style="color:var(--text-muted); font-size:0.78rem;">
            0x${this.baseAddressHex.toString(16).toUpperCase()} + (${i} × 4) = +${offsetBytes} B
          </td>
          <td><code>4 Bytes</code></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>

      <div style="margin-top:1.5rem; background:rgba(255,255,255,0.03); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--bg-surface-border);">
        <h4 style="font-size:0.95rem; margin-bottom:0.4rem; color:var(--primary);">💡 Why Contiguous Memory Matters in C?</h4>
        <p style="font-size:0.85rem; color:var(--text-muted);">
          Because array elements are stored back-to-back in contiguous memory bytes, the CPU can calculate the memory location of 
          <code>arr[100]</code> instantly in <strong>O(1) constant time</strong> without looping through preceding elements!
        </p>
      </div>
    `;

    modalBody.innerHTML = html;
  }
};
