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


/**
 * generate google map that listens to double click events
 * allowing users to set their location in map
 */

$('#mbut').on('click', function () {
	// disable modal save button
	$('#savemap').attr('disabled', true);

	// set center to Tirana
	let my_center = new google.maps.LatLng(41.327953, 19.819025);

	// set map properties
	let properties = {
		center: my_center,
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDoubleClickZoom: true,
		clickableIcons: false
	};

	// initialize map
	let map = new google.maps.Map($('#modal1 .modal-body')[0], properties);

	// create default marker
	let marker = new google.maps.Marker({
		position: map.getCenter(),
		draggable: true,
		icon: {
			url: '../img/map-marker.png',
			scaledSize: new google.maps.Size(35, 35)
		},
		title: 'Tiranë, Albania',
		map: map
	});

	// latlng object
	let latlng = {};

	// create listener for click
	map.addListener('click', function (e) {
		// change marker position
		marker.setPosition(e.latLng);
		map.panTo(e.latLng);
		latlng['lat'] = e.latLng.lat();
		latlng['lng'] = e.latLng.lng();
		latlng = new google.maps.LatLng(latlng);

		// set up directions' service
		let directionsService = new google.maps.DirectionsService();

		// set up route properties
		let markerpos = {
			origin: latlng,
			destination: latlng,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		}

		// start directions' service and test if marker is on road
		directionsService.route(markerpos, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				latlng = response.routes[0].legs[0].start_location;
				marker.setPosition(latlng);
			}
		});

		// call for geocoder
		let geocoder = new google.maps.Geocoder;
		geocodeLatLng(geocoder, latlng, marker);
	});

	// create listener for position change
	google.maps.event.addListener(marker, 'dragend', function () {
		map.panTo(marker.getPosition());
		latlng['lat'] = marker.getPosition().lat();
		latlng['lng'] = marker.getPosition().lng();
		latlng = new google.maps.LatLng(latlng);

		// set up directions' service
		let directionsService = new google.maps.DirectionsService();

		// set up route properties
		let markerpos = {
			origin: latlng,
			destination: latlng,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		}

		// start directions' service and test if marker is on road
		directionsService.route(markerpos, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				latlng = response.routes[0].legs[0].start_location;
				marker.setPosition(latlng);
			}
		});

		// call for geocoder
		let geocoder = new google.maps.Geocoder;
		geocodeLatLng(geocoder, latlng, marker);
	});

	// get street name with geocoder
	function geocodeLatLng (geocoder, coords, marker) {
		geocoder.geocode({ 'location': coords }, function (results, status) {
			if (status === 'OK') {
				if (results[0]) {
					marker.setTitle(results[0].formatted_address);
					
					let streetname = results[0].formatted_address.replace(', Tirana, Albania', '');
					streetname = streetname.replace(', Tiranë, Albania', '');

					$('#locname').val(streetname);
					$('#savemap').removeAttr('disabled');
				} else {
					$.notify('Vendndodhja e paqarte!', 'error');
				}
			} else {
				$.notify('Problem ne regjistrimin e vendndodhjes. Provoni perseri!', 'error');
			}
		});
	}
});


/**
 * dismiss map modal on save
 */

$('#savemap').on('click', function () {
	$('#modal1').modal('hide');
});