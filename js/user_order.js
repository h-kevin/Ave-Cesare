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

	let hour = 360 * ((h + m / 60) / 12);
	let minute = 360 * (m / 60);
	let second = 360 * ((s + ms / 1000) / 60);

	document.getElementById("hour").style.transform = 'rotate(' + hour + 'deg)';
	document.getElementById("minute").style.transform = 'rotate(' + minute + 'deg)';
	document.getElementById("second").style.transform = 'rotate(' + second + 'deg)';

	// change sign depending on hours
	let sign = $('.sign-012');
	let textcls = 'Mbyllur, hapet perseri ne oren 8:00!';
	let textopn = 'Jemi Hapur!';

	if ((h >= 23 || h < 8) && sign.text() != textcls && !sign.hasClass('isclosed')) {
		sign.addClass('isclosed');
		sign.removeClass('isopen');
		sign.fadeOut(function () {
			sign.text(textcls);
		});
		sign.fadeIn();
	}

	if (h >= 8 && h < 23 && sign.text() != textopn && !sign.hasClass('isopen')) {
		sign.addClass('isopen');
		sign.removeClass('isclosed');
		sign.fadeOut(function () {
			sign.text(textopn);
		});
		sign.fadeIn();
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

	// set up retro style for map
	let styledMapType = new google.maps.StyledMapType(
		[
			{ elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
			{ elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
			{ elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
			{
				featureType: 'administrative',
				elementType: 'geometry.stroke',
				stylers: [{ color: '#c9b2a6' }]
			},
			{
				featureType: 'administrative.land_parcel',
				elementType: 'geometry.stroke',
				stylers: [{ color: '#dcd2be' }]
			},
			{
				featureType: 'administrative.land_parcel',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#ae9e90' }]
			},
			{
				featureType: 'landscape.natural',
				elementType: 'geometry',
				stylers: [{ color: '#dfd2ae' }]
			},
			{
				featureType: 'poi',
				elementType: 'geometry',
				stylers: [{ color: '#dfd2ae' }]
			},
			{
				featureType: 'poi',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#93817c' }]
			},
			{
				featureType: 'poi.park',
				elementType: 'geometry.fill',
				stylers: [{ color: '#a5b076' }]
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#447530' }]
			},
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [{ color: '#f5f1e6' }]
			},
			{
				featureType: 'road.arterial',
				elementType: 'geometry',
				stylers: [{ color: '#fdfcf8' }]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [{ color: '#f8c967' }]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [{ color: '#e9bc62' }]
			},
			{
				featureType: 'road.highway.controlled_access',
				elementType: 'geometry',
				stylers: [{ color: '#e98d58' }]
			},
			{
				featureType: 'road.highway.controlled_access',
				elementType: 'geometry.stroke',
				stylers: [{ color: '#db8555' }]
			},
			{
				featureType: 'road.local',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#806b63' }]
			},
			{
				featureType: 'transit.line',
				elementType: 'geometry',
				stylers: [{ color: '#dfd2ae' }]
			},
			{
				featureType: 'transit.line',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#8f7d77' }]
			},
			{
				featureType: 'transit.line',
				elementType: 'labels.text.stroke',
				stylers: [{ color: '#ebe3cd' }]
			},
			{
				featureType: 'transit.station',
				elementType: 'geometry',
				stylers: [{ color: '#dfd2ae' }]
			},
			{
				featureType: 'water',
				elementType: 'geometry.fill',
				stylers: [{ color: '#b9d3c2' }]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#92998d' }]
			}
		]
	);

	// set center to Tirana
	let my_center = new google.maps.LatLng(41.327953, 19.819025);

	// set map properties
	let properties = {
		center: my_center,
		zoom: 14,
		disableDoubleClickZoom: true,
		clickableIcons: false,
		mapTypeControl: false
	};

	// initialize map
	let map = new google.maps.Map($('#mapmodal .modal-body')[0], properties);

	// set mapTypeId
	map.mapTypes.set('styled_map', styledMapType);
	map.setMapTypeId('styled_map');

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
	$('#mapmodal').modal('hide');
});


/**
 * fetch list of ordered products and mobile phone
 * for current user on page load
 */

$(document).on('load', function () {
	$.ajax({
		type: "post",
		url: "../php/fetch_order.php",
		dataType: "json",
		success: function (response) {
			updateOrder(response);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			$.notify(xhr.responseText, "error");
		}
	});
});


/**
 * insert data into cart and mobile number input
 */

function updateOrder (order) {
	if (order['pinfo'].length == 0) {
		// if cart empty, hide and display message
		$('.usro .cart').addClass('d-none');
		$('.usro .order-summary').addClass('d-none');
		$('.usro .cart-empty').removeClass('d-none');
		$('.usro .sent-order').attr('disabled', true);
	} else {
		// set up the cart table rows
		let rnum = order['pinfo'].length;
		let dbutton = `<td><span class="material-icons">highlight_off</span></td>`;
		let total = `<td></td>`;
		let image, name, price, quantity;
		for (let i = 0; i < rnum; i++) {
			// initialize variables
			image = `<td><img src="${order['pinfo'][i]['image']}" 
				class="img-fluid rounded" alt="Responsive image"></td>`;
			name = `<td>${order['pinfo'][i]['name']}</td>`;
			price = `<td>${order['pinfo'][i]['price']}</td>`;
			quantity = `<td><div class="btn-group" role="group" aria-label="Basic example">
				<button type="button" class="btn border-dark">-</button>
				<span class="btn border-dark">${order['pinfo'][i]['quantity']}</span>
				<button type="button" class="btn border-dark">+</button></div></td>`;

			// build row
			$('.cart-table tbody').append(`<tr>${dbutton} ${image} ${name}
				${price} ${quantity} ${total}</tr>`);
		}
	}
};