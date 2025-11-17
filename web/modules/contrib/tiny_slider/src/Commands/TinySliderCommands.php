<?php

namespace Drupal\tiny_slider\Commands;

use Drush\Commands\DrushCommands;
use Drupal\Core\File\FileSystemInterface;

class TinySliderCommands extends DrushCommands {

  /**
   * Downloads the Tiny Slider library to the libraries directory.
   *
   * @command tiny_slider:download
   * @aliases ts:dl
   * @usage tiny_slider:download
   *   Downloads the Tiny Slider library.
   */
  public function downloadTinySlider() {
    $url = 'https://github.com/ganlanyuan/tiny-slider/archive/refs/tags/v2.9.3.tar.gz';
    $libraries_path = DRUPAL_ROOT . '/libraries';
    $destination_folder = $libraries_path . '/tiny-slider';

    // Ensure libraries directory exists.
    if (!file_exists($libraries_path)) {
      mkdir($libraries_path, 0777, TRUE);
      $this->output()->writeln('Created libraries directory.');
    }

    // Temp file path.
    $temp_file = tempnam(sys_get_temp_dir(), 'tiny-slider') . '.tar.gz';

    // Download the file.
    file_put_contents($temp_file, file_get_contents($url));
    $this->output()->writeln('Downloaded Tiny Slider library.');

    // Extract the archive.
    $phar = new \PharData($temp_file);
    $phar->decompress(); // Create .tar

    $tar_path = str_replace('.gz', '', $temp_file);
    $phar_tar = new \PharData($tar_path);
    $phar_tar->extractTo($libraries_path, null, true);
    $this->output()->writeln('Extracted library.');

    // Rename extracted folder to 'tiny-slider'.
    $extracted_folder = $libraries_path . '/tiny-slider-2.9.3';
    if (file_exists($extracted_folder)) {
      if (file_exists($destination_folder)) {
        $this->output()->writeln('Removing old tiny-slider directory.');
        \Drupal::service('file_system')->deleteRecursive($destination_folder);
      }
      rename($extracted_folder, $destination_folder);
      $this->output()->writeln('Moved and renamed folder to tiny-slider.');
    }

    // Clean up.
    unlink($temp_file);
    unlink($tar_path);

    $this->output()->writeln('Tiny Slider library successfully installed to libraries/tiny-slider.');
  }
}
