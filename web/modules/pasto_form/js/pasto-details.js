(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    
    const detailsDivs = document.querySelectorAll('div.pasto-details[data-pasto-nid]');
    const radioButtonMap = {}; // Mappa nid -> radio button

    detailsDivs.forEach(function (detailsDiv) {
      const pastoNid = detailsDiv.getAttribute('data-pasto-nid');
      const fieldName = detailsDiv.getAttribute('data-pasto-field');
      
      // Cerca il radio dentro il wrapper del field per evitare match globali
      let radioButton = null;
      if (fieldName) {
        // wrapper potrebbe avere data-drupal-selector="edit-field_<name>" oppure id
        const wrapper = document.querySelector('[data-drupal-selector="edit-' + fieldName + '"]') || document.getElementById('edit-' + fieldName) || detailsDiv.closest('[data-drupal-selector*="edit-field-"]');
        if (wrapper) {
          radioButton = wrapper.querySelector('input[type="radio"][value="' + pastoNid + '"]');
        }
      }
      // Fallback: cerca solo per value (vecchio comportamento)
      if (!radioButton) {
        radioButton = document.querySelector('input[type="radio"][value="' + pastoNid + '"]');
      }
      
      if (radioButton) {
        radioButtonMap[pastoNid] = radioButton;
        const formItem = radioButton.closest('.js-form-item.form-item');
        
        if (formItem) {
          const clonedDetails = detailsDiv.cloneNode(true);
          formItem.insertAdjacentElement('afterend', clonedDetails);
          detailsDiv.remove();
          
          // Aggiungi la classe selected se il radio è già selezionato
          if (radioButton.checked) {
            clonedDetails.classList.add('selected');
          }
          
          // Aggiungi event listener al div dei dettagli clonato
          clonedDetails.addEventListener('click', function () {
            radioButton.checked = true;
            radioButton.dispatchEvent(new Event('change', { bubbles: true }));
          });
          
          // Ascolta il cambio di tutti i radio button con lo stesso name
          const allRadios = document.querySelectorAll('input[type="radio"][name="' + radioButton.name + '"]');
          allRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
              // Rimuovi la classe selected SOLO dai dettagli dello stesso field
              document.querySelectorAll('div.pasto-details[data-pasto-field="' + radio.name + '"].selected').forEach(function (details) {
                details.classList.remove('selected');
              });
              
              // Aggiungi la classe selected solo al radio selezionato
              if (radio.checked) {
                const selectedNid = radio.value;
                // preferisci dettagli che corrispondono anche al field
                let selectedDetails = document.querySelector('div.pasto-details[data-pasto-nid="' + selectedNid + '"][data-pasto-field="' + radio.name + '"]');
                if (!selectedDetails) {
                  selectedDetails = document.querySelector('div.pasto-details[data-pasto-nid="' + selectedNid + '"]');
                }
                if (selectedDetails) {
                  selectedDetails.classList.add('selected');
                }
              }
            });
          });
        }
      }
    });
  });
})();
