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

$(document).ready(function () {
  // on document ready fetch open orders
  fetch_open_orders();
});

// function to fetch open orders
function fetch_open_orders () {
  $.ajax({
    type: "post",
    url: "../php/fetch_open_orders.php",
    dataType: "json",
    success: function (response) {
      fill_orders_table(response);
    }
  });
}

// function to fill orders table
function fill_orders_table (orders_obj) {

};

// set interval to update orders table
setInterval(function () {
	fetch_open_orders();
}, 300000);


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

/**
 * END SECTION 4
 */