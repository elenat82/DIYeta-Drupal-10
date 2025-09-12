<?php

namespace Drupal\Tests\twig_field\Functional;

/**
 * Test description.
 *
 * @group twig_field
 */
class AlterHookTest extends TestBase {

  /**
   * The module installer service.
   *
   * @var \Drupal\Core\Extension\ModuleInstaller
   */
  protected $moduleInstaller;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->createTwigField('twig_test', 'node', 'test');
    $this->moduleInstaller = \Drupal::service('module_installer');
  }

  /**
   * Test hook_twig_field_widget_variable_alter() function.
   */
  public function testAlterHooks() {
    // Test twig_field widget: normal operation.
    $this->drupalGet('node/add/test');
    $this->assertSession()->optionExists('edit-twig-test-0-footer-variables', 'theme_directory');
    $this->assertSession()->optionNotExists('edit-twig-test-0-footer-variables', 'user');
    $node = $this->drupalCreateNode([
      'type' => 'test',
      'twig_test' => 'FOO {{theme_directory}} BAR {{user.name.value}} BAZ',
    ]);
    // Test twig_field formatter: normal operation.
    $this->drupalGet('node/' . $node->id());
    $this->assertSession()->pageTextContains('FOO core/themes/stark BAR BAZ');
    // Enable twig_field_alter_hook_test test module.
    $this->moduleInstaller->install(['twig_field_alter_hook_test']);
    // Test twig_field widget: hook_twig_field_widget_variable_alter hook.
    $this->drupalGet('node/' . $node->id() . '/edit');
    $this->assertSession()->optionNotExists('edit-twig-test-0-footer-variables', 'theme_directory');
    $this->assertSession()->optionExists('edit-twig-test-0-footer-variables', 'user');
    $this->submitForm([], 'Save');
    // Test twig_field formatter: hook_twig_field_formatter_variable_alter hook.
    $this->drupalGet('node/' . $node->id());
    $this->assertSession()->pageTextContains('FOO core/themes/stark BAR ' . $this->adminUser->getAccountName() . ' BAZ');
  }
}
