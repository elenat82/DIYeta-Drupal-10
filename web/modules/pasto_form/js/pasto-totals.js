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
    } else {
      console.log('ERRORE: primo fieldset non trovato');
    }

    // Funzione per calcolare i totali
    function updateTotals() {
      let totalKcal = 0;
      let totalCarbGrams = 0;
      let totalFatGrams = 0;
      let totalProtGrams = 0;

      // Trova tutti i radio selezionati
      const selectedRadios = document.querySelectorAll('input[type="radio"]:checked');
      
      selectedRadios.forEach(function (radio) {
        const value = radio.value;
        console.log('  - Radio selezionato: nid=' + value + ', field=' + radio.name);
        
        // Cerca il div dei dettagli corrispondente
        const detailsDiv = document.querySelector('div.pasto-details[data-pasto-nid="' + value + '"]');
        if (detailsDiv) {
          console.log('Trovato div dettagli per nid=' + value);
          // Estrai i valori dal testo HTML
          const content = detailsDiv.innerHTML;
          
          // Regex per estrarre i valori
          const kcalMatch = content.match(/(\d+(?:\.\d+)?)\s*kcal/);
          const carbMatch = content.match(/Carboidrati:.*?(\d+(?:\.\d+)?)g\s*\(\s*(\d+(?:\.\d+)?)/);
          const fatMatch = content.match(/Grassi:.*?(\d+(?:\.\d+)?)g\s*\(\s*(\d+(?:\.\d+)?)/);
          const protMatch = content.match(/Proteine:.*?(\d+(?:\.\d+)?)g\s*\(\s*(\d+(?:\.\d+)?)/);

          if (kcalMatch) {
            totalKcal += parseFloat(kcalMatch[1]);
            console.log('Kcal: ' + kcalMatch[1]);
          }
          if (carbMatch) {
            totalCarbGrams += parseFloat(carbMatch[1]);
            console.log('Carb g: ' + carbMatch[1]);
          }
          if (fatMatch) {
            totalFatGrams += parseFloat(fatMatch[1]);
            console.log('Fat g: ' + fatMatch[1]);
          }
          if (protMatch) {
            totalProtGrams += parseFloat(protMatch[1]);
            console.log('Prot g: ' + protMatch[1]);
          }
        } else {
          console.log('ERRORE: div dettagli NON trovato per nid=' + value);
        }
      });

      const carbCal = totalCarbGrams * 4;
      const fatCal = totalFatGrams * 9;
      const protCal = totalProtGrams * 4;

      if (totalKcal === 0) {
        totalKcal = carbCal + fatCal + protCal;
      }

      const carbPerc = totalKcal > 0 ? (carbCal / totalKcal) * 100 : 0;
      const fatPerc = totalKcal > 0 ? (fatCal / totalKcal) * 100 : 0;
      const protPerc = totalKcal > 0 ? (protCal / totalKcal) * 100 : 0;

      console.log('Totali: Kcal=' + totalKcal + ', Carb g=' + totalCarbGrams + ', Fat g=' + totalFatGrams + ', Prot g=' + totalProtGrams);
      console.log('Percentuali: Carb=' + carbPerc.toFixed(2) + '%, Fat=' + fatPerc.toFixed(2) + '%, Prot=' + protPerc.toFixed(2) + '%');

      // Aggiorna il display
      const kcalSpan = document.getElementById('total-kcal');
      const carbSpan = document.getElementById('total-carb');
      const fatSpan = document.getElementById('total-fat');
      const protSpan = document.getElementById('total-prot');
      
      if (kcalSpan) {
        kcalSpan.textContent = Math.round(totalKcal);
        console.log('Span kcal aggiornato');
      } else {
        console.log('ERRORE: span total-kcal non trovato');
      }
      if (carbSpan) {
        carbSpan.textContent = carbPerc.toFixed(2);
        console.log('Span carb aggiornato');
      }
      if (fatSpan) {
        fatSpan.textContent = fatPerc.toFixed(2);
        console.log('Span fat aggiornato');
      }
      if (protSpan) {
        protSpan.textContent = protPerc.toFixed(2);
        console.log('Span prot aggiornato');
      }

      // Popola i campi nascosti del form con i totali
      const kcalInput = document.querySelector('input[name="field_kcal_giornata_totale[0][value]"]');
      const carbInput = document.querySelector('input[name="field_carboidrati_giornata_total[0][value]"]');
      const fatInput = document.querySelector('input[name="field_grassi_giornata_totale[0][value]"]');
      const protInput = document.querySelector('input[name="field_proteine_giornata_totale[0][value]"]');
      
      console.log('Campi form nascosti:');
      if (kcalInput) {
        kcalInput.value = Math.round(totalKcal);
        console.log('field_kcal_giornata_totale = ' + Math.round(totalKcal));
      } else {
        console.log('ERRORE: field_kcal_giornata_totale NON trovato');
      }
      if (carbInput) {
        carbInput.value = carbPerc.toFixed(2);
        console.log('field_carboidrati_giornata_total = ' + carbPerc.toFixed(2));
      } else {
        console.log('ERRORE: field_carboidrati_giornata_total NON trovato');
      }
      if (fatInput) {
        fatInput.value = fatPerc.toFixed(2);
        console.log('field_grassi_giornata_totale = ' + fatPerc.toFixed(2));
      } else {
        console.log('ERRORE: field_grassi_giornata_totale NON trovato');
      }
      if (protInput) {
        protInput.value = protPerc.toFixed(2);
        console.log('field_proteine_giornata_totale = ' + protPerc.toFixed(2));
      } else {
        console.log('ERRORE: field_proteine_giornata_totale NON trovato');
      }

      // Salva i totali in data attributes per accesso da PHP
      summaryDiv.setAttribute('data-total-kcal', totalKcal);
      summaryDiv.setAttribute('data-total-carb', carbPerc);
      summaryDiv.setAttribute('data-total-fat', fatPerc);
      summaryDiv.setAttribute('data-total-prot', protPerc);
      
      console.log('updateTotals() - completato\n');
    }

    // Aggiungi event listener a tutti i radio button
    const allRadios = document.querySelectorAll('input[type="radio"]');
    console.log('Radio button trovati:', allRadios.length);
    allRadios.forEach(function (radio) {
      radio.addEventListener('change', function() {
        console.log('Radio change event: ' + radio.name + ' = ' + radio.value);
        updateTotals();
      });
    });

    // Calcola i totali iniziali
    console.log('Calcolo iniziale dei totali...');
    updateTotals();
    console.log('pasto-totals.js - inizializzazione completata\n');
  });
})();

