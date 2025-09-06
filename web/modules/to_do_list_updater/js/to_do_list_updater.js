(function (Drupal, once) {
  Drupal.behaviors.toDoListUpdater = {
    attach: function (context, settings) {
      once('to-do-checkbox', '.todo-checkbox', context).forEach(function (element) {
        element.addEventListener('change', function () {
          const nid = element.getAttribute('data-nid'); 
          const checked = element.checked ? 1 : 0;
          const parent = element.closest('.todo-item');
          const loader = parent.querySelector('.todo-loader');
          const label = parent.querySelector('.todo-label');

          // Mostra loader, disabilita checkbox e cambia label
          loader.style.display = 'inline-block';
          element.disabled = true;
          label.textContent = 'attendi...';

          fetch(Drupal.url('to-do-list/update/' + nid), {//url definito in to_do_list_updater.routing.yml campo path
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': drupalSettings.csrf_token
            },
            body: JSON.stringify({ value: checked })
          })
          .then(response => response.json())
          .then(data => {
            console.log('data: ', data);
            if (data.status === 'ok') {
              console.log('Aggiornato con successo', data);
              label.textContent = data.label;
            } else {
              console.error('Errore nell\'aggiornamento', data);
              element.checked = !checked; // rollback
              label.textContent = 'errore';
            }
          })
          .catch(error => {
            console.error('Errore fetch:', error);
            element.checked = !checked; // rollback
            label.textContent = 'errore';
          })
          .finally(() => {
            // Nasconde loader e riabilita checkbox
            loader.style.display = 'none';
            element.disabled = false;
          });
        });
      });
    }
  };
})(Drupal, once);
