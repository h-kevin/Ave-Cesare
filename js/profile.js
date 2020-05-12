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
            $.notify(xhr.responseText, "error");
        }
    });
});

// fill in the information on ajax response
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

// on save profile image upload to db
$('.pimgs').click(function () {
    // create a file variable
    let imgfile = document.getElementById('imgin').files[0];

    // if no file was selected
    if (!imgfile) {
        $('.piw').text('Fotoja e re nuk eshte perzgjedhur!');
        $('.piw').fadeIn();
    } else {
        let extensions = ['jpg', 'jpeg', 'png', 'gif'];
        let filename = imgfile.name;
        let filesize = imgfile.size;

        // if not allowed file type or above allowed size
        if (!extensions.includes(filename.split('.').pop())) {
            $('.piw').text('Formati i gabuar!');
            $('.piw').fadeIn();
        } else if (filesize > 5000000) {
            $('.piw').text('Imazhi nuk mund te jete me shume se 5MB!');
            $('.piw').fadeIn();
        } else {
            // create form data
            let inputData = new FormData();
            inputData.append('profimg', imgfile);

            // send data and receive url
            $.ajax({
                type: "post",
                url: "../php/changeprof.php",
                data: inputData,
                contentType: false,
                cache: false,
                processData: false,
                beforeSend: function () {
                    $('.pimgs .spinner-border').removeClass('d-none');
                },
                success: function (response) {
                    $('.pimgs .spinner-border').addClass('d-none');
                    changeImg(response);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $('.pimgs .spinner-border').addClass('d-none');
                    $.notify(xhr.responseText, 'error');
                } 
            });        
        }
    }
});

// change image on ajax response
function changeImg (link) {
    $('.prof-img').css('background-image', `url(${ link })`);
    $('#modal2').modal('hide');
    $('#modal2 .custom-file-input').val('');
    $('#modal2 .custom-file-label').text('Choose file');
    $.notify('Fotoja u ndryshua me sukses!', 'success');
};

// on upload input field change fade out warning and get file name
$('.custom-file-input').on('change', function () {
    if ($('.piw').is(':visible'))
        $('.piw').fadeOut();

    let filen = '';

    if ($(this).get(0).files[0])
        filen = $(this).get(0).files[0].name;

    if (filen.length != 0)
        $(this).next().text(filen);
    else
        $(this).next().text('Choose file');
});

// on logout button clicked logout
$('.logout').click(function () {
    $.ajax({
        type: "get",
        url: "../php/logout.php",
        beforeSend: function () {
            $('.logout .spinner-border').removeClass('d-none');
        },
        success: function (response) {
            if (response == 'loggedOut') {
                $('.logout .spinner-border').addClass('d-none');
                window.location.replace('login.html');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('.pimgs .spinner-border').addClass('d-none');
            $.notify(xhr.responseText, "error");
        }
    });
});

// change profile collapse and reset on modal dismissed
$('.modal').on('hidden.bs.modal', function() {
    $(this).find('form')[0].reset();
    $(this).find('.collapse').collapse('hide');
});

// upload image form reset on modal dismissed
$('#modal2').on('hidden.bs.modal', function () {
    $('#modal2 .custom-file-input').val('');
    $('#modal2 .custom-file-label').text('Choose file');
    $('.piw').fadeOut();
});
