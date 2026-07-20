/* ==========================================================================
   base2ace Academy - Collapsible Sidebar Controller & View Switcher
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarController();
});

function initSidebarController() {
  const sidebar = document.getElementById('sidebarNav');
  const toggleBtn = document.getElementById('toggleSidebarBtn');

  // Toggle Collapse
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      toggleBtn.innerText = isCollapsed ? '▶' : '◀';
      localStorage.setItem('b2a_sidebar_collapsed', isCollapsed ? 'true' : 'false');
    });

    // Restore saved state
    if (localStorage.getItem('b2a_sidebar_collapsed') === 'true') {
      sidebar.classList.add('collapsed');
      toggleBtn.innerText = '▶';
    }
  }

  // Sidebar Menu Item Clicks (View Switcher)
  const navItems = document.querySelectorAll('.sidebar-item[data-view]');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.dataset.view;
      const targetTitle = item.dataset.title || item.innerText.trim();
      switchView(targetView, targetTitle, item);

      // Auto-close drawer on mobile devices (< 768px)
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.add('collapsed');
      }
    });
  });
}

/**
 * Switches the active main workspace view panel
 */
function switchView(viewId, titleText, activeItemEl) {
  // Hide all view panels
  const panels = document.querySelectorAll('.view-panel');
  panels.forEach(p => p.classList.remove('active-view'));

  // Show target panel
  const targetPanel = document.getElementById(viewId);
  if (targetPanel) {
    targetPanel.classList.add('active-view');
  }

  // Trigger view specific renderers
  if (viewId === 'viewIntroDS' && typeof IntroDS !== 'undefined') {
    IntroDS.renderModule();
  } else if (viewId === 'viewStackHeap' && typeof StackHeapSim !== 'undefined') {
    StackHeapSim.renderSimulator();
  } else if (viewId === 'viewPointerSandbox' && typeof PointerSandbox !== 'undefined') {
    PointerSandbox.renderSandbox();
  } else if (viewId === 'viewMatrix2D' && typeof MatrixInteractive !== 'undefined') {
    MatrixInteractive.renderMatrixInteractive();
  } else if (viewId === 'viewBugHunter' && typeof BugHunter !== 'undefined') {
    BugHunter.renderBugHunter();
  } else if (viewId === 'viewCommonPrograms' && typeof CPrograms !== 'undefined') {
    CPrograms.renderPrograms();
  }

  // Update active sidebar item
  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  if (activeItemEl) {
    activeItemEl.classList.add('active');
  }

  // Update breadcrumb header
  const breadcrumbActive = document.getElementById('breadcrumbActiveTitle');
  if (breadcrumbActive && titleText) {
    breadcrumbActive.innerText = titleText;
  }

  // Scroll to top of main workspace
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
