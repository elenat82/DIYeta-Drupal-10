(function (Drupal, once) {
  Drupal.behaviors.toDoListUpdater = {
    attach: function (context, settings) {
      once('to-do-checkbox', '.todo-checkbox', context).forEach(function (element) {
        element.addEventListener('change', function () {
          const nid = element.getAttribute('data-nid'); 
          const checked = element.checked ? 1 : 0;
          console.log('checked: ', checked);
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
            } else {
              console.error('Errore nell\'aggiornamento', data);
            }
          })
          .catch(error => console.error('Errore fetch:', error));
        });
      });
    }
  };
})(Drupal, once);
