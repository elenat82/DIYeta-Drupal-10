(function (Drupal, once) {
  Drupal.behaviors.simpleCarousel = {
    attach: function (context, settings) {
      // Find all carousels within the context
      let carousels = once('simple-carousel', '.simple-carousel', context);

      carousels.forEach(carousel => {
        // Get the full list and an array of items
        let list = carousel.querySelector(".simple-carousel-inner");
        let items = carousel.querySelectorAll(".simple-carousel-item");
        // Skip if there are no items
        if (items.length === 0) {
          return;
        }

        // Calculate the total width including margins
        let itemStyle = window.getComputedStyle(items[0]);
        let itemWidth = items[0].getBoundingClientRect().width;
        let itemMargin = parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight);
        let totalItemWidth = itemWidth + itemMargin;

        // Get the buttons
        let prevButtons = once('simple-carousel-button', carousel.querySelectorAll(".button--previous a"));
        let nextButtons = once('simple-carousel-button', carousel.querySelectorAll(".button--next a"));

        // Bind the event to the previous button (go back)
        prevButtons.forEach(button => {
          button.addEventListener("click", function() {
            if (list.scrollLeft === 0) {
              // Scroll to the end (loop)
              list.scrollTo({ left: list.scrollWidth, behavior: "smooth" });
            } else {
              // Scroll back one space
              list.scrollBy({ left: -totalItemWidth, behavior: "smooth" });
            }
          });
        });

        // Bind the event to the next button (go forward)
        nextButtons.forEach(button => {
          button.addEventListener("click", function() {
            if (list.scrollLeft + list.offsetWidth >= list.scrollWidth) {
              // Scroll back to the beginning (loop)
              list.scrollTo({ left: 0, behavior: "smooth" });
            } else {
              // Scroll forward one space
              list.scrollBy({ left: totalItemWidth, behavior: "smooth" });
            }
          });
        });
      });
    }
  };
})(Drupal, once);
