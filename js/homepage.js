/* Change navbar background color and transparency on scroll */

function navBarBackgroundScrollEffect () {
  $(window).scroll(function () {
    if ($(window).width() < 767) {
      if ($(window).scrollTop() >= 90) {
        $('.navigationbar').css('background-color', 'rgba(30, 30, 30, 0.8)');
      } else {
        $('.navigationbar').css('background-color', 'transparent');
      }
    }
    else {
      if ($(window).scrollTop() >= 500) {
        $('.navigationbar').css('background-color', 'rgba(30, 30, 30, 0.8)');
      } else {
        $('.navigationbar').css('background-color', 'transparent');
      }
    }
  });
};

navBarBackgroundScrollEffect();
          