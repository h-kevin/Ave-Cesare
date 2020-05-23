/**
 * change navbar background color and transparency on scroll
 */

function navBarBackgroundScrollEffect () {
	$(window).scroll(function () {
		if ($(window).scrollTop() > 0) {
			$('.navigationbar').css('background-color', 'rgba(30, 30, 30, 0.8)');
		} else {
			$('.navigationbar').css('background-color', 'transparent');
		}
	});
};

navBarBackgroundScrollEffect();

/**
 * koment
 */

$(document).ready(function(){  
    $.ajax({
        type: 'GET',
        url:  '../php/offers.php',
        success: function(response) {
            $('#offer-cards').html(response);
        }
    });
});