// Javascript/jQuery file for profile page

// on document ready request for user info
$(document).ready(function () {

    $.ajax({
        type: "post",
        url: "../php/profile.php",
        dataType: "json",
        success: function (response) {
            onResponse(response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
});

// function to execute on ajax response
function onResponse (pinfo) {
    $('.ribbon-content').html(`<p><b>Pershendetje ${ pinfo['name'] }!</b></p>`);
    $('.liname').text(`Emri: ${ pinfo['name'] }`);
    $('.lisur').text(`Mbiemri: ${ pinfo['surname'] }`);
    $('.limail').text(`E-mail: ${ pinfo['email'] }`);
    $('.prof-img').css('background-image', `url('${ pinfo['prof_img'] }'`);

    if (!pinfo['mobile'])
        $('.litel').text(`Telefon: jo`);
    else
        $('.litel').text(`Telefon: ${ pinfo['mobile'] }`);
};

// profile image on click open modal2
$('.prof-img').click(function () {
    $('#modal2').modal('toggle');
});

// on logout button clicked logout
$('.logout').click(function () {
    $.ajax({
        type: "get",
        url: "../php/logout.php",
        success: function (response) {
            if (response == 'loggedOut') {
                window.location.replace('login.html');
                $('.logout .spinner-border').removeClass('d-none');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(`Ndodhi nje problem: ${ xrh.status }`);
            alert(thrownError);
        }
    }).done(function () {
        $('.logout .spinner-border').addClass('d-none');
    });
});