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
          formItem.insertAdjacentElement('afterend', detailsDiv.cloneNode(true));
          detailsDiv.remove();
        }
      }
    });
  });
})();
