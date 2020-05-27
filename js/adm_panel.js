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

$(document).ready(function () {
  statistika();
});

function statistika () {
  $.ajax({
    type: 'GET',
    url: '../php/nr_perdoruesish.php',
    success: function (response) {
      $('#nr_perdoruesish').html(response);
    }
  });

  $.ajax({
    type: 'GET',
    url: '../php/nr_produktesh.php',
    success: function (response) {
      $('#nr_produktesh').html(response);
    }
  });

  $.ajax({
    type: 'GET',
    url: '../php/nr_ofertash.php',
    success: function (response) {
      $('#nr_ofertash').html(response);
    }
  });

  $.ajax({
    type: 'GET',
    url: '../php/nr_porosish.php',
    success: function (response) {
      $('#nr_porosish').html(response);
    }
  });

  $.ajax({
    type: 'GET',
    url: '../php/fitimi.php',
    success: function (response) {
      $('#fitimi').html(response);

    }
  });
}

// set interval to update stats
setInterval(function () {
  statistika();
}, 10000);


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
    },
    error: function (xhr, ajaxOptions, thrownError) {
      $.notify(xhr.responseText, 'error');
    }
  });
};

// function to fill orders table
function fill_orders_table (orders_obj) {
  // orders
  let orders = orders_obj['orders'];

  // products
  let products = orders_obj['products'];

  // reset table data
  $('#list-section .olist-table tbody').html('');

  // if there are no orders placed
  if (orders.length == 0) {
    $('#list-section .olist-table tbody').append(
      `<tr>
        <td colspan="5">
          Nuk ka porosi te hapura per momentin.
        </td>
      </tr>`
    );
  } else {
    // progress bar for top order
    let progressbar = `<tr><td colspan="6">
      <div class="progress bg-transparent border border-dark">
      <div class="progress-bar progress-bar-striped progress-bar-animated bg-success"
      role="progressbar" style="width: 25%">25%</div></div></td></tr>`;

    // insert progressbar
    $('#list-section .olist-table tbody').append(progressbar);

    // table columns
    let client, date, destination, prod, total, status;

    for (let i = 0; i < orders.length; i++) {
      // order client
      client = `<td>${orders[i]['name']}</td>`;

      // order date
      date = `<td>${orders[i]['time']}</td>`;

      // order destination
      if (orders[i]['o_loc'])
        destination = `<td>${orders[i]['o_loc']}</td>`;
      else
        destination = `<td>Take Away</td>`;

      // order total
      total = `<td>${orders[i]['total']}</td>`;

      // order status
      status = `<td><select
        class="bg-transparent border-dark text-body custom-select custom-select-sm status">
        <option selected vlaue="open">Vendosur</option>
        <option value="cooking">Duke pergatitur</option>
        <option value="delivering">Duke shperndare</option>
        <option value="delivered">Perfunduar</option></select></td>`;

      // order products
      prod = `<td>`;

      for (let j = 0; j < products[i].length; j++) {
        prod += `(${products[i][j]['pquantity']})&nbsp;${products[i][j]['pname']}`;

        if (j != products[i].length - 1) {
          prod += `, `;
        }
      }

      prod += `</td>`;

      // create table row
      let row = `<tr>${client} ${date} ${destination} ${prod} ${total} ${status}</tr>`;

      // insert rows
      $('#list-section .olist-table tbody').append(row);
    }
  }
};

// set interval to update orders table
setInterval(function () {
  fetch_open_orders();
}, 10000);


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