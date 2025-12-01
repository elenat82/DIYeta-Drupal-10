<?php

namespace Drupal\simple_carousel\Plugin\views\style;

use Drupal\views\Plugin\views\style\StylePluginBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin for the Simple Carousel style.
 *
 * @ViewsStyle(
 *   id = "simple_carousel",
 *   title = @Translation("Simple Carousel"),
 *   help = @Translation("Displays items in a custom simple carousel."),
 *   theme = "views_view_simple_carousel",
 *   display_types = {"normal"}
 * )
 */
class SimpleCarousel extends StylePluginBase {

  /**
   * Does the style plugin allow to use style plugins.
   *
   * @var bool
   */
  protected $usesRowPlugin = TRUE;

  /**
   * Does the style plugin allow to use fields.
   *
   * @var bool
   */
  protected $usesFields = TRUE;

  /**
   * {@inheritdoc}
   */
  protected function defineOptions() {
    $options = parent::defineOptions();
    $options['items_per_viewport'] = ['default' => 3];
    $options['item_classes'] = ['default' => ''];
    $options['wrapper_classes'] = ['default' => ''];
    $options['prev_button_text'] = ['default' => '<'];
    $options['next_button_text'] = ['default' => '>'];
    return $options;
  }

  /**
   * {@inheritdoc}
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);

    // Remove the 'grouping' option from the form.
    if (isset($form['grouping'])) {
      unset($form['grouping']);
    }
    $form['items_per_viewport'] = [
      '#type' => 'select',
      '#title' => $this->t('Items per viewport'),
      '#default_value' => $this->options['items_per_viewport'],
      '#options' => [1 => 1, 2 => 2, 3 => 3, 4 => 4, 5 => 5, 6 => 6],
      '#description' => $this->t('The number of items to display per viewport.'),
    ];
    $form['item_classes'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Classes for item wrapper'),
      '#default_value' => $this->options['item_classes'],
      '#description' => $this->t('Additional classes to add to each item wrapper.'),
    ];
    $form['wrapper_classes'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Classes for full wrapper'),
      '#default_value' => $this->options['wrapper_classes'],
      '#description' => $this->t('Additional classes to add to the full wrapper.'),
    ];
    $form['prev_button_text'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Text for previous button'),
      '#default_value' => $this->options['prev_button_text'],
      '#description' => $this->t('Text for the previous button.'),
    ];
    $form['next_button_text'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Text for next button'),
      '#default_value' => $this->options['next_button_text'],
      '#description' => $this->t('Text for the next button.'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function render() {
    $rows = [];
    foreach ($this->view->result as $row_index => $row) {
      $rows[] = [
        'content' => $this->view->rowPlugin->render($row),
      ];
    }

    $items_per_viewport_class = 'items-per-viewport-' . $this->options['items_per_viewport'];
    $wrapper_classes = $this->options['wrapper_classes'] . ' ' . $items_per_viewport_class;

    return [
      '#theme' => $this->themeFunctions(),
      '#view' => $this->view,
      '#style_plugin' => $this,
      '#rows' => $rows,
      '#wrapper_classes' => $wrapper_classes,
      '#item_classes' => $this->options['item_classes'],
      '#prev_button_text' => $this->options['prev_button_text'],
      '#next_button_text' => $this->options['next_button_text'],
      '#attached' => [
        'library' => [
          'simple_carousel/simple-carousel',
        ],
      ],
    ];
  }
}
