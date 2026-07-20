/* ==========================================================================
   base2ace Academy - Global JS Utilities & Navigation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModals();
});

/**
 * Handles dropdown navigation between Data Structures and hash parameters
 */
function initNavigation() {
  const dropdownSelect = document.getElementById('dsSelectNav');
  if (dropdownSelect) {
    dropdownSelect.addEventListener('change', (e) => {
      const selectedDS = e.target.value;
      if (selectedDS) {
        window.location.href = selectedDS;
      }
    });
  }

  // Handle URL hash operation selection on load (e.g. array.html#binarySearch)
  const hash = window.location.hash.replace('#', '');
  if (hash && typeof selectOperation === 'function') {
    setTimeout(() => {
      selectOperation(hash);
    }, 100);
  }
}


/**
 * Universal Modal open/close listeners
 */
function initModals() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}
