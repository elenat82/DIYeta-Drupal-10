<?php

namespace Drupal\Tests\twig_field\Functional;

use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\Tests\BrowserTestBase;

/**
 * Common test methods.
 *
 * @group twig_field
 */
abstract class TestBase extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'node',
    'field',
    'twig_field',
  ];

  /**
   * Admin user.
   *
   * @var \Drupal\user\Entity\User
   */
  protected $adminUser;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->adminUser = $this->drupalCreateUser([], $this->randomMachineName(), TRUE);
    $this->drupalLogin($this->adminUser);
    $this->drupalCreateContentType(['type' => 'test', 'name' => 'Test Content Type']);
  }

  /**
   * Creates a new twig field.
   *
   * @param string $name
   *   The name of the new field (all lowercase), exclude the "field_" prefix.
   * @param string $entity_type
   *   The entity type.
   * @param string $bundle
   *   The bundle that this field will be added to.
   * @param array $storage_settings
   *   A list of field storage settings that will be added to the defaults.
   * @param array $field_settings
   *   A list of instance settings that will be added to the instance defaults.
   * @param string $widget_type
   *   The field widget type identifier.
   * @param array $widget_settings
   *   A list of widget settings that will be added to the widget defaults.
   * @param string $formatter_type
   *   The field formatter identifier.
   *
   * @return \Drupal\field\FieldStorageConfigInterface
   *   The twig field.
   */
  protected function createTwigField($name, $entity_type, $bundle, $storage_settings = [], $field_settings = [], $widget_type = 'twig', $widget_settings = [], $formatter_type = 'twig') {
    $field_storage = FieldStorageConfig::create([
      'entity_type' => $entity_type,
      'field_name' => $name,
      'type' => 'twig',
      'settings' => $storage_settings,
      'cardinality' => !empty($storage_settings['cardinality']) ? $storage_settings['cardinality'] : 1,
    ]);
    $field_storage->save();
    $this->attachTwigField($name, $entity_type, $bundle, $field_settings, $widget_type, $widget_settings, $formatter_type);
    return $field_storage;
  }

  /**
   * Attaches a twig field to an entity.
   *
   * @param string $name
   *   The name of the new field (all lowercase), exclude the "field_" prefix.
   * @param string $entity_type
   *   The entity type this field will be added to.
   * @param string $bundle
   *   The bundle this field will be added to.
   * @param array $field_settings
   *   A list of field settings that will be added to the defaults.
   * @param string $widget_type
   *   The field widget type identifier.
   * @param array $widget_settings
   *   A list of widget settings that will be added to the widget defaults.
   * @param string $formatter_type
   *   The field formatter identifier.
   */
  protected function attachTwigField($name, $entity_type, $bundle, $field_settings = [], $widget_type = 'twig', $widget_settings = [], $formatter_type = 'twig') {
    $field = [
      'field_name' => $name,
      'label' => $name,
      'entity_type' => $entity_type,
      'bundle' => $bundle,
      'required' => !empty($field_settings['required']),
      'settings' => $field_settings,
    ];
    FieldConfig::create($field)->save();
    // Assign form settings.
    \Drupal::service('entity_display.repository')->getFormDisplay($entity_type, $bundle)
      ->setComponent($name, [
        'type' => $widget_type,
        'settings' => $widget_settings,
      ])
      ->save();
    // Assign display settings.
    \Drupal::service('entity_display.repository')->getViewDisplay($entity_type, $bundle)
      ->setComponent($name, [
        'type' => $formatter_type,
        'label' => 'hidden',
      ])
      ->save();
  }
}
