/* Javascript & jQuery file for profile page. */


/**
 * globals
 */

let p;


/**
 * on document ready request for user info
 */

$(document).ready(function () {

    $.ajax({
        type: "post",
        url: "../php/fetch_profile.php",
        dataType: "json",
        success: function (response) {
            updateProf(response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $.notify(xhr.responseText, "error");
        }
    });
});


/**
 * fill in the user info into the proper fields
 */

function updateProf (pinfo) {
    // the displayed fields
    $('.ribbon-content').html(`<p><b>Pershendetje ${ pinfo['name'] }!</b></p>`);
    $('.liname').text(`Emri: ${ pinfo['name'] }`);
    $('.lisur').text(`Mbiemri: ${ pinfo['surname'] }`);
    $('.limail').text(`E-mail: ${ pinfo['email'] }`);
    $('.prof-img').css('background-image', `url('${ pinfo['prof_img'] }'`);

    if (pinfo['mobile'] == '')
        $('.litel').text(`Telefon: jo`);
    else
        $('.litel').text(`Telefon: (+355) ${ pinfo['mobile'] }`);

    // initialize password
    p = pinfo['password'];
};


/**
 * profile image on click open modal2
 */

$('.prof-img').click(function () {
    $('#modal2').modal('toggle');
});


/**
 * on save profile image upload to db
 */

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
                url: "../php/prof_img.php",
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


/**
 * change image on ajax response
 */

function changeImg (link) {
    $('.prof-img').css('background-image', `url(${ link })`);
    $('#modal2').modal('hide');
    $('#modal2 .custom-file-input').val('');
    $('#modal2 .custom-file-label').text('Choose file');
    $.notify('Fotoja u ndryshua me sukses!', 'success');
};


/**
 * on upload input field change fade out warning and get file name
 */

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


/**
 * on logout button clicked logout
 */

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
                window.location.replace('login.html?logout=ok');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('.pimgs .spinner-border').addClass('d-none');
            $.notify(xhr.responseText, "error");
        }
    });
});


/**
 * change profile collapse and reset on modal dismissed
 */

$('.modal').on('hidden.bs.modal', function() {
    $(this).find('form')[0].reset();
    $(this).find('.collapse').collapse('hide');
    $(this).find('small').fadeOut();
});


/**
 * profile change info collapse forms when clicked out of form body
 */

$(document).click(function (e) {
    if (!$(e.target).is('.collapse *, .ps-changes')) {
        $('.collapse').collapse('hide');
    }
});


/**
 * upload image form reset on modal dismissed
 */

$('#modal2').on('hidden.bs.modal', function () {
    $('#modal2 .custom-file-input').val('');
    $('#modal2 .custom-file-label').text('Choose file');
    $('.piw').fadeOut();
});


/**
 * save changes to profile info
 */

$('#modal1 .ps-changes').click(function () {
    // validate name & surname not empty, only latin letters allowed
    let regex1 = new RegExp(/^[A-Za-z]+$/);
    let regex2 = new RegExp(/^[0-9]+$/);
    let no_warnings = '.ns-coll, .tel-coll, .pass-coll, .rem-coll';
    let name = '';
    let surname = '';
    let tel = '';
    let newpass = '';

    if ($('.ns-coll input:nth-child(1)').val() != '') {
        if ($('.ns-coll input:nth-child(2)').val() == '') {
            $('.ns-coll').collapse('show');
            $('.ns-warn').text('Ju lutem vendosni mbiemrin e ri!');
            $('.ns-warn').fadeIn();
            no_warnings = no_warnings.replace('.ns-coll,', '');
        } else {
            if (!regex1.test($('.ns-coll input:nth-child(1)').val())) {
                $('.ns-coll').collapse('show');
                $('.ns-warn').text('Emri nuk ka formatin e duhur!');
                $('.ns-warn').fadeIn();
                no_warnings = no_warnings.replace('.ns-coll,', '');
            } else if (!regex1.test($('.ns-coll input:nth-child(2)').val())) {
                $('.ns-coll').collapse('show');
                $('.ns-warn').text('Mbiemri nuk ka formatin e duhur!');
                $('.ns-warn').fadeIn();
                no_warnings = no_warnings.replace('.ns-coll,', '');
            } else {
                $('.ns-warn').fadeOut();
                name = $('.ns-coll input:nth-child(1)').val();
                surname = $('.ns-coll input:nth-child(2)').val();
            }
        }
    } else if ($('.ns-coll input:nth-child(2)').val() != '') {
        if ($('.ns-coll input:nth-child(1)').val() == '') {
            $('.ns-coll').collapse('show');
            $('.ns-warn').text('Ju lutem vendosni emrin e ri!');
            $('.ns-warn').fadeIn();
            no_warnings = no_warnings.replace('.ns-coll,', '');
        } else {
            if (!regex1.test($('.ns-coll input:nth-child(1)').val())) {
                $('.ns-coll').collapse('show');
                $('.ns-warn').text('Emri nuk ka formatin e duhur!');
                $('.ns-warn').fadeIn();
                no_warnings = no_warnings.replace('.ns-coll,', '');
            } else if (!regex1.test($('.ns-coll input:nth-child(2)').val())) {
                $('.ns-coll').collapse('show');
                $('.ns-warn').text('Mbiemri nuk ka formatin e duhur!');
                $('.ns-warn').fadeIn();
                no_warnings = no_warnings.replace('.ns-coll,', '');
            } else {
                $('.ns-warn').fadeOut();
                name = $('.ns-coll input:nth-child(1)').val();
                surname = $('.ns-coll input:nth-child(2)').val();
            }
        }
    } 

    // validate phone number length 9, only digits
    if ($('.tel-coll input').val() != '') {
        if (!regex2.test($('.tel-coll input').val())) {
            $('.tel-coll').collapse('show');
            $('.tel-warn').text('Numri nuk ka formatin e duhur!');
            $('.tel-warn').fadeIn();
            no_warnings = no_warnings.replace('.tel-coll,', '');
        } else {
            if ($('.tel-coll input').val().length != 9) {
                $('.tel-coll').collapse('show');
                $('.tel-warn').text('Numri nuk ka gjatesine e duhur!');
                $('.tel-warn').fadeIn();
                no_warnings = no_warnings.replace('.tel-coll,', '');
            } else {
                $('.tel-warn').fadeOut();
                tel = $('.tel-coll input').val();
            }
        }
    }

    // validate password match old and match new on repeat
    let f1 = $('.pass-coll input:nth-child(1)');
    let f2 = $('.pass-coll input:nth-child(2)');
    let f3 = $('.pass-coll input:nth-child(3)');

    if (f1.val() != '' || f2.val() != '' || f3.val() != '') {
        if (f1.val() == '' || f2.val() == '' || f3.val() == '') {
            $('.pass-coll').collapse('show');
            $('.pass-warn').text('Duhen plotesuar te gjitha fushat!');
            $('.pass-warn').fadeIn();
            no_warnings = no_warnings.replace('.pass-coll,', '');
        } else {
            if (f1.val() != p) {
                $('.pass-coll').collapse('show');
                $('.pass-warn').text('Gabim fjalekalimi i vjeter!');
                $('.pass-warn').fadeIn();
                no_warnings = no_warnings.replace('.pass-coll,', '');
            } else if (f2.val() != f3.val()) {
                $('.pass-coll').collapse('show');
                $('.pass-warn').text('Fjalekalimet nuk perputhen!');
                $('.pass-warn').fadeIn();
                no_warnings = no_warnings.replace('.pass-coll,', '');
            } else {
                $('.pass-warn').fadeOut();
                newpass = f2.val();
            }
        }
    }

    // collapse fields that are ok
    $(no_warnings).collapse('hide');

    // if no warnings and at least one field changed send request
    if (no_warnings == '.ns-coll, .tel-coll, .pass-coll, .rem-coll'
        && (name != '' || surname != '' || tel != '' || newpass != '')) {
        // create json object
        let obj = {
            name: name,
            surname: surname,
            mobile: tel,
            password: newpass
        };

        obj = JSON.stringify(obj);

        $.ajax({
            type: "post",
            url: "../php/updateprof.php",
            data: { profinf: obj },
            dataType: "json",
            beforeSend: function () {
                $('.ps-changes .spinner-border').removeClass('d-none');
            },
            success: function (response) {
                $('.ps-changes .spinner-border').addClass('d-none');
                updateProf(response);
                $.notify('Te dhenat u perditesuan me sukses!', 'success');
                $('#modal1').modal('hide');
            },
            error: function () {
                $('.ps-changes .spinner-border').addClass('d-none');
                $.notify(xhr.responseText, "error");
            }
        });
    } else if (no_warnings == '.ns-coll, .tel-coll, .pass-coll, .rem-coll'
        && (name == '' && surname == '' && tel == '' && newpass == '')) {
        $.notify('Ju lutem plotesoni te pakten njeren nga fushat!', 'error');
    }
});


/**
 * remove account
 */

$('.rem-coll input').on('keyup', function () {
    // validate match old password
    if ($('.rem-coll input').val() == p) {
        $('.rem-coll button').removeAttr('disabled');
        $('.rem-warn').text('Ky veprim eshte i pakthyeshem!');
        $('.rem-warn').fadeIn();
    } else {
        $('.rem-coll button').attr('disabled', true);
        $('.rem-warn').fadeOut();
    }

    // send remove request
    $('.rem-coll button').click(function () {
        $.ajax({
            type: "get",
            url: "../php/rem_account.php",
            beforeSend: function () {
                $('.rem-coll button .spinner-border').removeClass('d-none');
            },
            success: function (response) {
                if (response == 'removedAccount') {
                    $('.rem-coll button .spinner-border').addClass('d-none');
                    window.location.replace('login.html?remaccount=done');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('.rem-coll button .spinner-border').addClass('d-none');
                $.notify(xhr.responseText, "error");
            }
        });
    });
});