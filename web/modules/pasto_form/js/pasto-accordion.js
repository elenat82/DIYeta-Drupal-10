(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Seleziona tutti i fieldset con i campi dei pasti
    const fieldsets = document.querySelectorAll('fieldset[data-drupal-selector*="edit-field-colazione"], fieldset[data-drupal-selector*="edit-field-pranzo"], fieldset[data-drupal-selector*="edit-field-spuntino"], fieldset[data-drupal-selector*="edit-field-merenda"], fieldset[data-drupal-selector*="edit-field-cena"], fieldset[data-drupal-selector*="edit-field-extra"]');

    fieldsets.forEach(function (fieldset) {
      // Rendi il fieldset collapsibile
      fieldset.classList.add('collapsible-fieldset');
      
      // Aggiungi aria-expanded per accessibilità
      fieldset.setAttribute('aria-expanded', 'true');
      
      // Crea un button toggle
      const legend = fieldset.querySelector('legend');
      if (legend) {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'fieldset-toggle-btn';
        toggleBtn.innerHTML = '-'; // Simbolo meno per indicare "clicca per chiudere"
        toggleBtn.setAttribute('aria-label', 'Toggle ' + legend.textContent);
        
        legend.appendChild(toggleBtn);
        
        // Event listener per toggle
        toggleBtn.addEventListener('click', function (e) {
          e.preventDefault();
          const wrapper = fieldset.querySelector('.fieldset__wrapper');
          const isExpanded = fieldset.getAttribute('aria-expanded') === 'true';
          
          if (isExpanded) {
            // Chiudi
            wrapper.style.display = 'none';
            fieldset.setAttribute('aria-expanded', 'false');
            toggleBtn.innerHTML = '+'; // Simbolo più per indicare "clicca per aprire"
            fieldset.classList.add('collapsed');
          } else {
            // Apri
            wrapper.style.display = 'block';
            fieldset.setAttribute('aria-expanded', 'true');
            toggleBtn.innerHTML = '-'; // Simbolo meno per indicare "clicca per chiudere"
            fieldset.classList.remove('collapsed');
          }
        });
      }
    });
  });
})();
