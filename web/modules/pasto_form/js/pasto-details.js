(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    
    const detailsDivs = document.querySelectorAll('div.pasto-details[data-pasto-nid]');

    detailsDivs.forEach(function (detailsDiv) {
      const pastoNid = detailsDiv.getAttribute('data-pasto-nid');
      
      const radioButton = document.querySelector('input[type="radio"][value="' + pastoNid + '"]');
      
      if (radioButton) {
        const formItem = radioButton.closest('.js-form-item.form-item');
        
        if (formItem) {
          const clonedDetails = detailsDiv.cloneNode(true);
          formItem.insertAdjacentElement('afterend', clonedDetails);
          detailsDiv.remove();
          
          // Aggiungi event listener al div dei dettagli clonato
          clonedDetails.addEventListener('click', function () {
            radioButton.checked = true;
            radioButton.dispatchEvent(new Event('change', { bubbles: true }));
          });
        }
      }
    });
  });
})();
