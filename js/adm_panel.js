/* Javascript & jQuery file for admin panel. */


/**
 * navigator links
 */

$('.admin_panel .nav div').click(function () {
  let link = $(this).find('a').attr('href');
  window.location.replace(link);
});


/**
 * SECTION 1
 */

/**
 * END SECTION 1
 */


/**
 * SECTION 2
 */

/**
 * END SECTION 2
 */


/**
 * SECTION 3
 */

$(document).ready(function getAll () {
  //  function to fetch all users
  $.ajax({
    type: 'POST',
    url: '../php/get_users.php',
    dataType: "json",
    success: function (response) {
      getAllFormat(response);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      $.notify(xhr.responseText, "error");
    }
  });

  var user_id;

  //on success fill table with results
  function getAllFormat (response) {

    var tblVar;

    for (i in response) {
      tblVar += '<tr>';
      tblVar += '<td><img src="' + response[i].prof_img + '" class="rounded-circle" width="50" height="50"></td>';
      tblVar += '<td>' + response[i].name + '</td>';
      tblVar += '<td>' + response[i].surname + '</td>';
      tblVar += '<td>' + response[i].admin + '</td>';
      tblVar += '<td><button type="button" name="update" id="' + response[i].id + '" data-target="#userModalUpdate" data-toggle="modal" class="btn btn-success btn-lg update">Modifiko</button></td>';
      tblVar += '<td><button type="button" name="delete" id="' + response[i].id + '" data-target="#userModalDelete" data-toggle="modal" class="btn btn-danger btn-lg delete">Fshi</button></td>';
      tblVar += '</tr>';
    }

    $('#kuti table tbody').html(tblVar);
  }

  //ne klikimin jashte modalit i bejm reset cdo inputi
  $('.modal').on('hidden.bs.modal', function () {
    $(this).find('form')[0].reset();
    $('[data-toggle="buttons"] :radio').prop('checked', false);
    $('[data-toggle="buttons"] label').removeClass('active');
    $(this).find('.collapse').collapse('hide');
    $(this).find('small').fadeOut();
  });

  $(document).on('click', '.delete', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    user_id = $(this).attr("id");
    $("#delete_mod").show();

    $(document).on('click', '#delete_mod', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      $.ajax({
        url: "../php/delete_user.php",
        method: "POST",
        data: { user_id: user_id },
        beforeSend: function () {
          $('#admp .spinner-border').removeClass('d-none');
        },
        success: function (data) {
          $('#admp .spinner-border').addClass('d-none');
          $("#delete_mod").hide();
          $('#modal_msgDel').addClass('alert alert-primary');
          $('#modal_msgDel').html(data);
          getAll();
          setTimeout(function () {
            $('#modal_msgDel').html('');
            $('#modal_msgDel').removeClass('alert alert-primary');
            $('#userModalDelete').modal('hide');
          }, 2000);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          $.notify(xhr.responseText, "error");
        }
      });
    });
  });

  $(document).on('click', '#add', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const regex1 = new RegExp(/^[A-Za-z]+$/);
    let name = $('#name_add').val();
    let surname = $('#surname_add').val();
    let email = $('#email_add').val();
    let pass = $('#pass1_add').val();
    let pass2 = $('#pass2_add').val();

    if (name != "" && !regex1.test(name)) {
      $('#modal_msgAd').html('Vendosni emrin ne formatin e kerkuar!');
      $('#modal_msgAd').addClass('alert alert-primary');
    }
    else if (surname != "" && !regex1.test(surname)) {
      $('#modal_msgAd').html('Vendosni mbiemrin ne formatin e kerkuar!');
      $('#modal_msgAd').addClass('alert alert-primary');
    }
    else if (name == "" || surname == "" || email == "" || pass == "" || pass2 == "") {
      $('#modal_msgAd').html('Duhen shtuar te gjitha te dhenat e kerkuara!');
      $('#modal_msgAd').addClass('alert alert-primary');
    }

    else if (pass != pass2) {
      $('#modal_msgAd').html('Fjalekalimet nuk perputhen!');
      $('#modal_msgAd').addClass('alert alert-primary');
    }

    else {
      $.ajax({
        url: "../php/add_user.php",
        method: "POST",
        data: { name: name, surname: surname, email: email, pass: pass },
        beforeSend: function () {
          $('#admp .spinner-border').removeClass('d-none');
        },
        success: function (data) {
          $('#admp .spinner-border').addClass('d-none');
          $('#modal_msgAd').addClass('alert alert-primary');
          $('#modal_msgAd').html(data);
          getAll();
          $('form').trigger('reset');
          setTimeout(function () {
            $('#modal_msgAd').html('');
            $('#modal_msgAd').removeClass('alert alert-primary');
            $('#userModalAdd').modal('hide');
          }, 1800);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          $.notify(xhr.responseText, "error");
        }
      });
    }
  });


  $(document).on('click', '.update', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    user_id = $(this).attr("id");

    $(document).on('click', '#update_mod', function () {
      const regex1 = new RegExp(/^[A-Za-z]+$/);
      var name = $('#name_up').val();
      var surname = $('#surname_up').val();
      var type_user = $("input[name='user_type']:checked").val()

      if (name != "" && !regex1.test(name)) {
        $('#modal_msgUp').html('Vendosni emrin ne formatin e kerkuar!');
        $('#modal_msgUp').addClass('alert alert-primary');
      }
      else if (surname != "" && !regex1.test(surname)) {
        $('#modal_msgUp').html('Vendosni mbiemrin ne formatin e kerkuar!');
        $('#modal_msgUp').addClass('alert alert-primary');
      }
      else if (name == "" && surname == "" && type_user == undefined) {
        $('#modal_msgUp').html('Ju nuk keni modifikuar asnje te dhene!');
        $('#modal_msgUp').addClass('alert alert-primary');
      }
      else {

        $.ajax({
          url: "../php/update_user.php",
          method: "POST",
          data: { user_id: user_id, name: name, surname: surname, type_user: type_user },
          beforeSend: function () {
            $('#admp .spinner-border').removeClass('d-none');
          },
          success: function (data) {
            $('#admp .spinner-border').addClass('d-none');
            $('#modal_msgUp').html(data);
            $('#modal_msgUp').addClass('alert alert-primary');
            getAll();
            $('form').trigger('reset');
            setTimeout(function () {
              $('#modal_msgUp').html('');
              $('#modal_msgUp').removeClass('alert alert-primary');
              $('#userModalUpdate').modal('hide');
            }, 1800);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            $.notify(xhr.responseText, "error");
          }
        });
      }
    });
  });
});

/**
 * END SECTION 3
 */


/**
 * SECTION 4
 */

$(document).ready(function getAllOffers () {
  //  function to fetch all offers
  $.ajax({
    type: 'POST',
    url: '../php/get_offers.php',
    dataType: "json",
    success: function (response) {
      getAllFormatOffer(response);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      $.notify(xhr.responseText, "error");
    }
  });

  var offer_id;

  //on success fill table with results
  function getAllFormatOffer (response) {

    var tblVar;

    for (i in response) {
      tblVar += '<tr>';
      tblVar += '<td><img src="' + response[i].image + '" class="rounded-circle" width="50" height="50"></td>';
      tblVar += '<td>' + response[i].name + '</td>';
      tblVar += '<td>' + response[i].discount + '</td>';
      tblVar += '<td>' + response[i].description + '</td>';
      tblVar += '<td><button type="button" name="update" id="' + response[i].id + '" data-target="#offerModalUpdate" data-toggle="modal" class="btn btn-success btn-lg updateo">Modifiko</button></td>';
      tblVar += '<td><button type="button" name="delete" id="' + response[i].id + '" data-target="#offerModalDelete" data-toggle="modal" class="btn btn-danger btn-lg deleteo">Fshi</button></td>';
      tblVar += '</tr>';
    }

    $('#kuti_offer table tbody').html(tblVar);
  }

  //ne klikimin jashte modalit i bejm reset cdo inputi
  $('.modal').on('hidden.bs.modal', function () {
    $(this).find('form')[0].reset();
    $('[data-toggle="buttons"] :radio').prop('checked', false);
    $('[data-toggle="buttons"] label').removeClass('active');
    $(this).find('.collapse').collapse('hide');
    $(this).find('small').fadeOut();
    $('#offerModalUpdate .custom-file-input').val('');
    $('#offerModalUpdate .custom-file-label').text('Zgjidh imazhin');
  });

  $(document).on('click', '.deleteo', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    offer_id = $(this).attr("id");
    $("#delete_offer_mod").show();

    $(document).on('click', '#delete_offer_mod', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      $.ajax({
        url: "../php/delete_offer.php",
        method: "POST",
        data: { offer_id: offer_id },
        beforeSend: function () {
          $('#kuti_offer .spinner-border').removeClass('d-none');
        },
        success: function (data) {
          $('#kuti_offer .spinner-border').addClass('d-none');
          $("#delete_offer_mod").hide();
          $('#modal_offer_msgDel').addClass('alert alert-primary');
          $('#modal_offer_msgDel').html(data);
          getAllOffers();
          setTimeout(function () {
            $('#modal_offer_msgDel').html('');
            $('#modal_offer_msgDel').removeClass('alert alert-primary');
            $('#offerModalDelete').modal('hide');
          }, 2000);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          $.notify(xhr.responseText, "error");
        }
      });
    });
  });

  $(document).on('click', '#add_offer', function (e) {
    let name = $('#name_addo').val();
    let discount = $('#discount_addo').val();
    let start_date = $('#start_date_addo').val();
    let end_date = $('#end_date_addo').val();
    let description = $('#description_addo').val();
    let imgfile = document.getElementById('offerimg1').files[0];
    
    if (imgfile) {
      let extensions = ['jpg', 'jpeg', 'png', 'gif'];
      let filename = imgfile.name;
      let filesize = imgfile.size;
      
      // if not allowed file type or above allowed size
      if (!extensions.includes(filename.split('.').pop())) {
        $('#modal_offer_msgUp').text('Formati i gabuar!');
        $('#modal_offer_msgUp').addClass('alert alert-primary');
      } else if (filesize > 5000000) {
        $('#modal_offer_msgUp').text('Imazhi nuk mund te jete me shume se 5MB!');
        $('#modal_offer_msgUp').addClass('alert alert-primary');
      } else {
        let inputData = new FormData();
        inputData.append('offerimg', imgfile);
        inputData.append('name', name);
        inputData.append('discount', discount);
        inputData.append('start_date', start_date);
        inputData.append('end_date', end_date);
        inputData.append('description', description);

        // send data and receive url
        $.ajax({
          type: "post",
          url: "../php/add_offers.php",
          data: inputData,
          contentType: false,
          cache: false,
          processData: false,
          beforeSend: function () {
            $('#add_offer .spinner-border').removeClass('d-none');
          },
          success: function (response) {
            $('#offerModalUpdate .custom-file-input').val('');
          $('#offerModalUpdate .custom-file-label').text('Zgjidh imazhin');
          $('#add_offer .spinner-border').addClass('d-none');
          $('#modal_offer_msgAd').addClass('alert alert-primary');
          $('#modal_offer_msgAd').html(response);
          getAllOffers();
          $('form').trigger('reset');
          setTimeout(function () {
            $('#modal_offer_msgAd').html('');
            $('#modal_offer_msgAd').removeClass('alert alert-primary');
            $('#offerModalAdd').modal('hide');
          }, 1800);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            $('#add_offer .spinner-border').addClass('d-none');
            $.notify(xhr.responseText, 'error');
          }
        });
    }
  }
  });

  $(document).on('click', '.updateo', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    offer_id = $(this).attr("id");
    
    $(document).on('click', '#update_offer_mod', function (e) {
      let name = $('#name_upo').val();
      let discount = $('#discount_upo').val();
      let start_date = $('#start_date_upo').val();
      let end_date = $('#end_date_upo').val();
      let description = $('#description_upo').val();
      let imgfile = document.getElementById('offerimg2').files[0];
    
    // if file was selected
    if (imgfile) {
      let extensions = ['jpg', 'jpeg', 'png', 'gif'];
      let filename = imgfile.name;
      let filesize = imgfile.size;
      
      // if not allowed file type or above allowed size
      if (!extensions.includes(filename.split('.').pop())) {
        $('#modal_prod_msgUp').text('Formati i gabuar!');
        $('#modal_prod_msgUp').addClass('alert alert-primary');
      } else if (filesize > 5000000) {
        $('#modal_prod_msgUp').text('Imazhi nuk mund te jete me shume se 5MB!');
        $('#modal_prod_msgUp').addClass('alert alert-primary');
      } else {

      let inputData = new FormData();
        inputData.append('offerimg', imgfile);
        inputData.append('offer_id', offer_id);
        // send data and receive url
        $.ajax({
          type: "post",
          url: "../php/offer_img.php",
          data: inputData,
          contentType: false,
          cache: false,
          processData: false,
          beforeSend: function () {
            $('#update_offer_mod .spinner-border').removeClass('d-none');
          },
          success: function (response) {
            $('#update_offer_mod .spinner-border').addClass('d-none');
            $('#modal_offer_msgUp').html(response);
            $('#modal_offer_msgUp').addClass('alert alert-primary');
            $('form').trigger('reset');
            $('#modal_offer_msgUp').addClass('alert alert-primary');
            getAllOffers();
            $('#offerModalUpdate .custom-file-input').val('');
            $('#offerModalUpdate .custom-file-label').text('Zgjidh imazhin');
          },
          error: function (xhr, ajaxOptions, thrownError) {
            $('#update_offer_mod .spinner-border').addClass('d-none');
            $.notify(xhr.responseText, 'error');
          }
        });
      }
    }
        $.ajax({
          url: "../php/update_offer.php",
          method: "POST",
          data: { offer_id: offer_id, name: name, discount: discount, start_date: start_date, end_date: end_date, description: description },
          
          beforeSend: function () {
            $('#update_offer_mod .spinner-border').removeClass('d-none');
          },
          success: function (data) {
            $('#offerModalUpdate .custom-file-input').val('');
            $('#offerModalUpdate .custom-file-label').text('Zgjidh imazhin');
            $('#kuti_offer .spinner-border').addClass('d-none');
            $('#modal_offer_msgUp').html(data);
            $('#modal_offer_msgUp').addClass('alert alert-primary');
            getAllOffers();
            $('form').trigger('reset');
            setTimeout(function () {
              $('#modal_offer_msgUp').html('');
              $('#modal_offer_msgUp').removeClass('alert alert-primary');
              $('#offerModalUpdate').modal('hide');
            }, 1800);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            $.notify(xhr.responseText, "error");
          }
        });
    });
  });
});


/**
 * END SECTION 4
 */