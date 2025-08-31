<?php

namespace Drupal\to_do_list_updater\Controller;

use Drupal\node\Entity\Node;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ToDoController {

  public function toggle($nid, Request $request) {
    $node = Node::load($nid);

    if ($node && $node->bundle() === 'attivita') {
      $current = $node->get('field_stato_attivita')->value;

      // Toggle tra da_fare (0) e completata (1).
      $new_value = $current == 1 ? 0 : 1;

      $node->set('field_stato_attivita', $new_value);
      $node->save();

      return new JsonResponse([
        'status' => 'ok',
        'nid' => $nid,
        'new_value' => $new_value ? 'completata' : 'da_fare',
      ]);
    }

    return new JsonResponse(['status' => 'error'], 400);
  }
}
