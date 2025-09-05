<?php

namespace Drupal\to_do_list_updater\Controller;

use Drupal\node\Entity\Node;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ToDoController
{

  //https://www.drupal.org/docs/develop/creating-modules/create-a-custom-page-using-a-controller

  public function toggle($nid, Request $request)
  {
    $node = Node::load($nid);

    \Drupal::logger('to_do_list_updater')->notice(
      'Request completa: @req',
      ['@req' => json_encode([
        'query'   => $request->query->all(),//equivale a $_GET
        'request' => $request->request->all(),//equivale a $_POST
        'headers' => $request->headers->all(),
        'content' => $request->getContent(),
      ], JSON_PRETTY_PRINT)]
    );

    $reqToArray = $request->toArray();

    \Drupal::logger('to_do_list_updater')->notice(
      'Contenuto reqToArray: <pre>@dump</pre>',
      ['@dump' => print_r($reqToArray, TRUE)]
    );

    \Drupal::logger('to_do_list_updater')->notice(
      'Contenuto reqToArray in json: @json',
      ['@json' => json_encode($reqToArray, JSON_PRETTY_PRINT)]
    );

    $data = $request->getPayload()->all();

    \Drupal::logger('to_do_list_updater')->notice(
      'Contenuto data in json: @json',
      ['@json' => json_encode($data, JSON_PRETTY_PRINT)]
    );

    \Drupal::logger('to_do_list_updater')->notice(
      "Dump grezzo:\n<pre>@dump</pre>",
      ['@dump' => print_r($request->getPayload()->all(), TRUE)]
    );

    $new_value = $data['value'];

    if ($node && $node->bundle() === 'attivita') {
      $node->set('field_stato_attivita', $new_value);
      $node->save();
      return new JsonResponse(['status' => 'ok', 'nid' => $nid, 'new_value' => $new_value, 'label' => $new_value ? 'completata' : 'da fare']);
    }
    return new JsonResponse([
      'status' => 'error',
      'message' => 'Errore durante il salvataggio: ',
    ], 500);
  }
}
