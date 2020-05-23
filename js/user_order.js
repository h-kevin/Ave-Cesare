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
		$('.usro .send-order button').attr('disabled', true);
	}

	if (h >= 8 && h < 23 && sign.text() != textopn && !sign.hasClass('isopen')) {
		sign.addClass('isopen');
		sign.removeClass('isclosed');
		sign.fadeOut(function () {
			sign.text(textopn);
		});
		sign.fadeIn();
		$('.usro .send-order button').removeAttr('disabled');
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

$(document).ready(function () {
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
		$('.usro .send-order button').attr('disabled', true);
	} else {
		// set up the cart table rows
		let rnum = order['pinfo'].length;
		let dbutton = `<td><span class="delb material-icons">highlight_off</span></td>`;
		let total = `<td></td>`;
		let image, name, price, quantity;

		for (let i = 0; i < rnum; i++) {
			// set up table data
			image = `<td><img src="${order['pinfo'][i]['image']}" 
				class="img-fluid rounded" alt="Responsive image"></td>`;
			name = `<td>${order['pinfo'][i]['name']}</td>`;
			price = `<td>${order['pinfo'][i]['price']}</td>`;
			quantity = `<td><div class="btn-group" role="group" aria-label="Basic example">
				<button type="button" class="btn border-dark minusb">-</button>
				<span class="btn border-dark showqt">${order['pinfo'][i]['quantity']}</span>
				<button type="button" class="btn border-dark plusb">+</button></div></td>`;

			// get subtotal
			let subt = order['pinfo'][i]['price'] * order['pinfo'][i]['quantity'];
			total = `<td>${subt}</td>`;

			// build row
			$('.cart-table tbody').append(`<tr>${dbutton} ${image} ${name} 
				${price} ${quantity} ${total}</tr>`);
		}

		// get discount
		let discount = 0;

		if (order['discount'])
			discount = order['discount'];

		// set up mobile number
		let mobile = order['mobile'];

		if (mobile != '') {
			$('.order-mnum input').val(mobile);
		}

		// set up order summary
		let subval, transval, tval;

		subval = 0;

		for (let i = 0; i < rnum; i++) {
			subval += order['pinfo'][i]['price'] * order['pinfo'][i]['quantity'];
		}

		transval = $('.delivery-form .selectpicker option:selected').val();

		if (transval == 'Ne Shtepi (50 Lek)')
			transval = 50;
		else
			transval = 0;

		tval = subval + transval - discount;

		$('.order-summary .subtotal h4:nth-child(2)').text(subval);
		$('.order-summary .transport h4:nth-child(2)').text(transval);
		$('.order-summary .discount h4:nth-child(2)').text(discount);
		$('.order-summary .total h4:nth-child(2) b').text(tval);
	}
};


/**
 * order summary on change
 */

$(".order-summary div h4:nth-child(2)").on('change', function () {
	// update total
	let subtotal = parseInt($('.order-summary .subtotal h4:nth-child(2)').text());
	let transport = parseInt($('.order-summary .transport h4:nth-child(2)').text());
	let discount = parseInt($('.order-summary .discount h4:nth-child(2)').text());

	$('.order-summary .total h4:nth-child(2) b').text(subtotal + transport - discount);
});


/**
 * detect change on select
 */

$('.delivery-form .selectpicker').on('change', function () {
	if ($('.delivery-form .selectpicker option:selected').val() == 'Ne Shtepi (50 Lek)') {
		$('.usro .order-location').removeClass('d-none');
		$('.order-summary .transport h4:nth-child(2)').text(50);
		$('.order-summary div h4:nth-child(2)').change();
	} else {
		$('.usro .order-location').addClass('d-none');
		$('.order-summary .transport h4:nth-child(2)').text(0);
		$('.order-summary div h4:nth-child(2)').change();
	}
});


/**
 * handle changes of quantity (+)
 */

$('.cart-table tbody').on('click', '.plusb', function () {
	// get the row
	let trnum = parseInt($(this).closest('tr').index()) + 1;

	// get name of product
	let pname = $(this).closest('tr').find('td:nth-child(3)').text();

	// get quantity
	let qt = $(this).closest('div').find('.showqt');

	// increment
	qt = parseInt(qt.text()) + 1;

	// create data object
	let data = {
		'trnum': trnum,
		'pname': pname,
		'quantity': qt
	};

	data = JSON.stringify(data);

	// send request for database update
	$.ajax({
		type: "post",
		url: "../php/orderqt.php",
		data: { qt: data },
		dataType: "json",
		success: function (response) {
			incrementQt(response);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			$.notify(xhr.responseText, 'error');
		}
	});
});


/**
 * increment quantity
 */

function incrementQt (upinfo) {
	// update value of showqt
	let trnum = upinfo['trnum'];
	$(`.cart-table tbody tr:nth-child(${trnum}) .showqt`).text(upinfo['quantity']);

	// update product subtotal
	let oldst = parseInt($(`.cart-table tbody tr:nth-child(${trnum}) td:nth-child(6)`).text());
	let newst = upinfo['price'] * upinfo['quantity'];
	let diff = newst - oldst;
	$(`.cart-table tbody tr:nth-child(${trnum}) td:nth-child(6)`).text(newst);

	// update order summary
	let curr_subtotal = parseInt($('.order-summary .subtotal h4:nth-child(2)').text());
	let new_subtotal = curr_subtotal + diff;
	$('.order-summary .subtotal h4:nth-child(2)').text(new_subtotal);
	$('.order-summary div h4:nth-child(2)').change();
};


/**
 * handle changes of quantity (-)
 */

$('.cart-table tbody').on('click', '.minusb', function () {
	// get the row
	let trnum = parseInt($(this).closest('tr').index()) + 1;

	// get name of product
	let pname = $(this).closest('tr').find('td:nth-child(3)').text();

	// get quantity
	let qt = $(this).closest('div').find('.showqt');

	// decrement
	if (parseInt(qt.text()) > 1) {
		qt = parseInt(qt.text()) - 1;

		// create data object
		let data = {
			'trnum': trnum,
			'pname': pname,
			'quantity': qt
		};

		data = JSON.stringify(data);

		// send request for database update
		$.ajax({
			type: "post",
			url: "../php/orderqt.php",
			data: { qt: data },
			dataType: "json",
			success: function (response) {
				decrementQt(response);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				$.notify(xhr.responseText, 'error');
			}
		});
	}
});


/**
 * decrement quantity
 */

function decrementQt (upinfo) {
	// update value of showqt
	let trnum = upinfo['trnum'];
	$(`.cart-table tbody tr:nth-child(${trnum}) .showqt`).text(upinfo['quantity']);

	// update product subtotal
	let oldst = parseInt($(`.cart-table tbody tr:nth-child(${trnum}) td:nth-child(6)`).text());
	let newst = upinfo['price'] * upinfo['quantity'];
	let diff = newst - oldst;
	$(`.cart-table tbody tr:nth-child(${trnum}) td:nth-child(6)`).text(newst);

	// update order summary
	let curr_subtotal = parseInt($('.order-summary .subtotal h4:nth-child(2)').text());
	let new_subtotal = curr_subtotal + diff;
	$('.order-summary .subtotal h4:nth-child(2)').text(new_subtotal);
	$('.order-summary div h4:nth-child(2)').change();
};


/**
 * delete item from cart
 */

$('.cart-table tbody').on('click', '.delb', function () {
	// get the row
	let trnum = parseInt($(this).closest('tr').index()) + 1;

	// get name of product
	let pname = $(this).closest('tr').find('td:nth-child(3)').text();

	// create data object
	let rown = {
		'trnum': trnum,
		'pname': pname
	};

	rown = JSON.stringify(rown);

	// send request to delete item from order in the database
	$.ajax({
		type: "post",
		url: "../php/delfromorder.php",
		data: { rowd: rown },
		dataType: "json",
		success: function (response) {
			delItemFromOrder(response);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			$.notify(xhr.responseText, 'error');
		}
	});
});


/**
 * function to delete item from order
 */

function delItemFromOrder (rowd) {
	// get the row
	let rown = rowd['rownum'];

	// remove the row
	$(`.cart-table tbody tr:nth-child(${rown})`).remove();

	// if cart is empty
	if ($('.cart-table tbody').children().length == 0) {
		$('.usro .cart').addClass('d-none');
		$('.usro .order-summary').addClass('d-none');
		$('.usro .cart-empty').removeClass('d-none');
		$('.usro .send-order button').attr('disabled', true);
	}
};