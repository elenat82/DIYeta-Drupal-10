# Simple Carousel

## Overview

The Simple Carousel module provides a clean and efficient solution for creating a carousel of items in a Drupal site. It leverages native CSS scroll behavior for smooth scrolling and minimal dependencies. This module is designed to be lightweight, easy to use, and highly customizable, making it an ideal choice for developers looking for a simple carousel implementation without the overhead of additional libraries.

## Features

- **Customizable items per viewport**: Configure the number of items visible at once.
- **CSS-based scrolling**: Utilizes native CSS scroll for smooth and efficient scrolling.
- **No extra dependencies**: Purely relies on CSS and minimal JavaScript, avoiding the need for bulky libraries.
- **Flexible customization**: Easily add custom classes to item wrappers and the full carousel wrapper.
- **Responsive design**: Adjusts the number of visible items based on screen size.

## How It Works

The Simple Carousel module creates a custom Views style plugin that renders items in a horizontally scrollable container. It uses CSS Flexbox for layout and JavaScript for scroll control, providing a seamless and smooth user experience.

### Key Components

1. **CSS**:
    - Flexbox layout for the carousel items.
    - Gradient backgrounds for navigation buttons.
    - Responsive design with media queries to adjust item width based on viewport size.

2. **JavaScript**:
    - Handles the scrolling behavior for the previous and next buttons.
    - Automatically scrolls back to the beginning when the end is reached.

## Usage

1. **Create a View**:
    - Go to Structure > Views > Add new view.
    - Configure your view to display the desired content.
    - Under the "Format" section, select "Simple Carousel" as the style.

2. **Configure the Carousel**:
    - Set the number of items per viewport.
    - Add custom classes for item wrappers and the full wrapper if needed.
    - Customize the text for the previous and next buttons.

3. **Place the View**:
    - Add the view to a block or a page as needed.

