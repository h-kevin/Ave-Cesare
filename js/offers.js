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

    $.ajax({
		type: 'POST',
		url: '../php/check_ulog.php',
		dataType: "json",
		success: function (response) {
			check_ulog(response);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			$.notify(xhr.responseText, "error");
		}
	});
});

//  func check_ulog
function check_ulog(obj) {
    var s_id=obj['id'];
    // nqs ka perdorues te loguar 
    if(s_id){
       $("a.check_ulog").text('Profili');
       $("a.check_ulog").attr('href','./profile.html');
     }
 }