(function (Drupal, once) {
  Drupal.behaviors.alimentiFilter = {
    attach(context) {
      const input = once('alimenti-filter', '#alimenti-filter-input', context)[0];
      if (!input) return;

      const rows = document.querySelectorAll('.alimento-row');
      const clearButton = document.querySelector('.clear-button');

      function filterRows() {
        const value = input.value.toLowerCase().trim();
        
        rows.forEach(row => {
          const nome = row.dataset.nome || '';
          const displayStyle = nome.includes(value) ? '' : 'none';
          const gridItem = row.closest('.views-row');
          if (gridItem) gridItem.style.display = displayStyle;
        });
      }

      input.addEventListener('input', filterRows);

      if (clearButton) {
        clearButton.addEventListener('click', () => {
          input.value = '';
          filterRows();
          input.focus();
        });
      }
    }
  };
})(Drupal, once);
