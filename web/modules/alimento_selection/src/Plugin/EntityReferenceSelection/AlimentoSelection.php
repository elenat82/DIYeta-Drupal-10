<?php

namespace Drupal\alimento_selection\Plugin\EntityReferenceSelection;

use Drupal\Core\Entity\Plugin\EntityReferenceSelection\DefaultSelection;
use Drupal\Core\Entity\EntityReferenceSelection\SelectionInterface;
use Drupal\node\NodeInterface;

/**
 * Provides custom selection for Alimento with marca.
 *
 * @EntityReferenceSelection(
 *   id = "alimento_selection",
 *   label = @Translation("Alimento con marca"),
 *   entity_types = {"node"},
 *   group = "alimento_selection",
 *   weight = 0
 * )
 */
class AlimentoSelection extends DefaultSelection implements SelectionInterface {

  /**
   * {@inheritdoc}
   */
  public function getReferenceableEntities($match = NULL, $match_operator = 'CONTAINS', $limit = 0) {
    $results = parent::getReferenceableEntities($match, $match_operator, $limit);

    foreach ($results as $bundle => &$entities) {
      foreach ($entities as $id => &$label) {
        //type hint per far capire che si tratta di un nodo
        /** @var \Drupal\node\Entity\Node $entity */
        $entity = $this->entityTypeManager->getStorage('node')->load($id);

        if ($entity && $entity->bundle() === 'alimento') {
          $marca = '';
          if ($entity->hasField('field_marca') && !$entity->get('field_marca')->isEmpty()) {
            $term = $entity->get('field_marca')->entity;
            if ($term) {
              $marca = $term->label();
              $label .= ' (' . $marca . ')';
            }
          }

          // Log nel watchdog.
          \Drupal::logger('alimento_selection')->notice(
            'ID: @id - Nome: @nome - Marca: @marca - Etichetta finale: @label',
            [
              '@id' => $id,
              '@nome' => $entity->label(),
              '@marca' => $marca,
              '@label' => $label,
            ]
          );


        //   \Drupal::messenger()->addMessage("ID: {$id} - Nome: {$entity->label()} - Marca: {$marca} - Etichetta finale: {$label}");
        }
      }
    }

    return $results;
  }

}