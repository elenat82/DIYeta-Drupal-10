(function ($, Drupal) {
    Drupal.behaviors.toDoListUpdater = {
      attach: function (context, settings) {
  
        // Imposta lo stato iniziale delle checkbox al caricamento della pagina
        $('.todo-checkbox', context).once('toDoListUpdaterInit').each(function () {
          var value = $(this).data('value'); // legge field_stato_attivita dalla riscrittura output
          if (value === 'completata') {
            $(this).prop('checked', true);
            $(this).siblings('.todo-label').text('completata');
          } else {
            $(this).prop('checked', false);
            $(this).siblings('.todo-label').text('da_fare');
          }
        });
  
        // Gestione click AJAX
        $('.todo-checkbox', context).once('toDoListUpdaterClick').on('change', function () {
          var nid = $(this).data('nid');
          var checkbox = $(this);
  
          $.ajax({
            url: '/to-do-list/toggle/' + nid,
            method: 'POST',
            success: function (res) {
              if (res.status === 'ok') {
                // Aggiorna il valore della checkbox e del testo accanto
                if (res.new_value === 'completata') {
                  checkbox.prop('checked', true);
                  checkbox.siblings('.todo-label').text('completata');
                } else {
                  checkbox.prop('checked', false);
                  checkbox.siblings('.todo-label').text('da_fare');
                }
              } else {
                console.error('Errore aggiornamento attività');
              }
            },
            error: function () {
              console.error('Chiamata AJAX fallita');
            }
          });
        });
      }
    };
  })(jQuery, Drupal);
  