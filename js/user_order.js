/* Javascript & jQuery for user_order page. */


/**
 * call to function setTime on document load
 */

$(document).on('load', function () {
	setTime();
});


/**
 * implementation of setTime function
 */

function setTime () {
	let d = new Date();
	let h = d.getHours();
	let m = d.getMinutes();
	let s = d.getSeconds();
	let ms = d.getMilliseconds();

	let hour = 360 * (h / 12);
	let minute = 360 * (m / 60);
	let second = 360 * ((s + ms / 1000) / 60);

	document.getElementById("hour").style.transform = 'rotate(' + hour + 'deg)';
	document.getElementById("minute").style.transform = 'rotate(' + minute + 'deg)';
	document.getElementById("second").style.transform = 'rotate(' + second + 'deg)';

	// change sign depending on hours
	let sign = $('.sign');
	let textcls = 'Mbyllur, hapet perseri ne oren 8:00!';
	let textopn = 'Jemi Hapur!';

	if ((h >= 23 || h < 8) && sign.text() != textcls && !sign.hasclass('isclosed')) {
		sign.addClass('isclosed');
		sign.removeClass('isopen');
		sign.fadeOut(function () {
			sign.text(textcls);
		});
		$('.sign').fadeIn();
	}

	if (h >= 8 && h < 23 && sign.text() != textopn && !sign.hasClass('isopen')) {
		sign.addClass('isopen');
		sign.removeClass('isclosed');
		sign.fadeOut(function () {
			sign.text(textopn);
		});
		$('.sign').fadeIn();
	}
}


/**
 * execution of setTime function on a 1 millisecond interval
 * (needed to update time for every millisecond)
 */

setInterval(function () {
	setTime();
}, 1);








// $('#location-picker-map').locationpicker({
// enableAutocomplete: true,
//     enableReverseGeocode: true,
//   radius: 0,
//   inputBinding: {
//     latitudeInput: $('#event-lat'),
//     longitudeInput: $('#event-lon'),
//     locationNameInput: $('#event-address')
//   },
//   onchanged: function (currentLocation, radius, isMarkerDropped) {
//         var addressComponents = $(this).locationpicker('map').location.addressComponents;
//     console.log($(this).locationpicker('map').location);  //latlon  
//     updateControls(addressComponents); //Data
//     }
// });

// function updateControls(addressComponents) {
//   $('#event-address-val').val(addressComponents.formattedAddress);
//   console.log(addressComponents);
// }