(function (Drupal) {
  Drupal.behaviors.alimentiCalcolo = {
    attach(context) {
      context.querySelectorAll('.valore-nutrizionale[data-kcal]').forEach(container => {
        if (container.dataset.processed) return;
        container.dataset.processed = true;

        const input = container.querySelector('.js-grammi');
        if (!input) return;

        const base = {
          kcal: parseFloat(container.dataset.kcal),
          proteine: parseFloat(container.dataset.proteine),
          grassi: parseFloat(container.dataset.grassi),
          carboidrati: parseFloat(container.dataset.carboidrati),
        };

        const output = {
          kcal: container.querySelector('.js-kcal'),
          proteine: container.querySelector('.js-proteine'),
          grassi: container.querySelector('.js-grassi'),
          carboidrati: container.querySelector('.js-carboidrati'),
        };

        function aggiorna() {
          const grammi = parseFloat(input.value) || 0;

          output.kcal.textContent = Math.round(base.kcal / 100 * grammi);
          output.proteine.textContent = (base.proteine / 100 * grammi).toFixed(1);
          output.grassi.textContent = (base.grassi / 100 * grammi).toFixed(1);
          output.carboidrati.textContent = (base.carboidrati / 100 * grammi).toFixed(1);
        }

        input.addEventListener('input', aggiorna);
      });
    }
  };
})(Drupal);
