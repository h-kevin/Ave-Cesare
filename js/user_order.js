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
}


/**
 * execution of setTime function on a 1 millisecond interval
 * (needed to update time for every millisecond)
 */

setInterval(function () {
	setTime();
}, 1);