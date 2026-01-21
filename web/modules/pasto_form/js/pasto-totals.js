(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Carica i target dell'utente da drupalSettings
    const settings = typeof drupalSettings !== 'undefined' ? drupalSettings.pasto_form : {};
    const userKcalTarget = settings.user_kcal_target || 0;
    const userCarbTarget = settings.user_carb_target || 0;
    const userFatTarget = settings.user_fat_target || 0;
    const userProtTarget = settings.user_prot_target || 0;

    // Crea il div del riepilogo nutrizionale
    const summaryDiv = document.createElement('div');
    summaryDiv.id = 'pasto-summary';
    summaryDiv.className = 'pasto-summary';
    summaryDiv.innerHTML = `
      <h3>Riepilogo Giornaliero</h3>
      <div class="summary-values">
        <p><strong>Calorie:</strong> <span id="total-kcal">0</span> / ${userKcalTarget} kcal</p>
        <p><strong>Carboidrati:</strong> <span id="total-carb">0</span>% / ${userCarbTarget}%</p>
        <p><strong>Grassi:</strong> <span id="total-fat">0</span>% / ${userFatTarget}%</p>
        <p><strong>Proteine:</strong> <span id="total-prot">0</span>% / ${userProtTarget}%</p>
      </div>
    `;

    // Inserisci il riepilogo prima del primo fieldset
    const firstFieldset = document.querySelector('fieldset[data-drupal-selector*="edit-field-"]');
    if (firstFieldset) {
      firstFieldset.parentNode.insertBefore(summaryDiv, firstFieldset);
    }

    // Funzione per calcolare i totali
    function updateTotals() {
      let totalKcal = 0;
      let totalCarb = 0;
      let totalFat = 0;
      let totalProt = 0;

      // Trova tutti i radio selezionati
      const selectedRadios = document.querySelectorAll('input[type="radio"]:checked');
      selectedRadios.forEach(function (radio) {
        const value = radio.value;
        
        // Cerca il div dei dettagli corrispondente
        const detailsDiv = document.querySelector('div.pasto-details[data-pasto-nid="' + value + '"]');
        if (detailsDiv) {
          // Estrai i valori dal testo HTML
          const content = detailsDiv.innerHTML;
          
          // Regex per estrarre i valori
          const kcalMatch = content.match(/Calorie:<\/strong>\s*(\d+(?:\.\d+)?)\s*kcal/);
          const carbMatch = content.match(/Carboidrati:<\/strong>\s*(\d+(?:\.\d+)?)g\s*\((\d+(?:\.\d+)?)/);
          const fatMatch = content.match(/Grassi:<\/strong>\s*(\d+(?:\.\d+)?)g\s*\((\d+(?:\.\d+)?)/);
          const protMatch = content.match(/Proteine:<\/strong>\s*(\d+(?:\.\d+)?)g\s*\((\d+(?:\.\d+)?)/);

          if (kcalMatch) totalKcal += parseFloat(kcalMatch[1]);
          if (carbMatch) totalCarb += parseFloat(carbMatch[2]); // Prendi la %
          if (fatMatch) totalFat += parseFloat(fatMatch[2]); // Prendi la %
          if (protMatch) totalProt += parseFloat(protMatch[2]); // Prendi la %
        }
      });

      // Aggiorna il display
      document.getElementById('total-kcal').textContent = Math.round(totalKcal);
      document.getElementById('total-carb').textContent = totalCarb.toFixed(2);
      document.getElementById('total-fat').textContent = totalFat.toFixed(2);
      document.getElementById('total-prot').textContent = totalProt.toFixed(2);

      // Salva i totali in data attributes per accesso da PHP
      summaryDiv.setAttribute('data-total-kcal', totalKcal);
      summaryDiv.setAttribute('data-total-carb', totalCarb);
      summaryDiv.setAttribute('data-total-fat', totalFat);
      summaryDiv.setAttribute('data-total-prot', totalProt);
    }

    // Aggiungi event listener a tutti i radio button
    const allRadios = document.querySelectorAll('input[type="radio"]');
    allRadios.forEach(function (radio) {
      radio.addEventListener('change', updateTotals);
    });

    // Calcola i totali iniziali
    updateTotals();
  });
})();

