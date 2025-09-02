<?php

namespace Drupal\to_do_list_updater\Controller;

use Drupal\node\Entity\Node;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ToDoController {

  //https://www.drupal.org/docs/develop/creating-modules/create-a-custom-page-using-a-controller

  public function toggle($nid, Request $request) {
    $node = Node::load($nid);
    // Log utile per debug.
    \Drupal::logger('to_do_list_updater')->notice(
      'Nodo @nid',
      ['@nid' => $nid]
    );

    if ($node && $node->bundle() === 'attivita') {
      $current = $node->get('field_stato_attivita')->value;
      $new_value = $request->request->get('checked') === 'true' ? 0 : 1;
      
      // Log utile per debug.
    \Drupal::logger('to_do_list_updater')->notice(
      'Valore corrente @current e nuovo @new_value',
      ['@current' => $current, '@new_value' => $new_value]
    );

      $node->set('field_stato_attivita', $new_value);
      $node->save();
      

      return new JsonResponse(['status' => 'ok', 'nid' => $nid, 'value' => $new_value]);
    }

    return new JsonResponse([
      'status' => 'error',
      'message' => 'Errore durante il salvataggio: ',
    ], 500);
  }
}
