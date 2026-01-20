(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    
    const detailsDivs = document.querySelectorAll('div.pasto-details[data-pasto-nid]');
    const radioButtonMap = {}; // Mappa nid -> radio button

    detailsDivs.forEach(function (detailsDiv) {
      const pastoNid = detailsDiv.getAttribute('data-pasto-nid');
      const fieldName = detailsDiv.getAttribute('data-pasto-field');
      
      // Cerca il radio corrispondente usando sia name (field) che value (nid)
      let radioButton = null;
      if (fieldName) {
        radioButton = document.querySelector('input[type="radio"][name="' + fieldName + '"][value="' + pastoNid + '"]');
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
              // Rimuovi la classe selected da tutti i dettagli
              document.querySelectorAll('div.pasto-details.selected').forEach(function (details) {
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
