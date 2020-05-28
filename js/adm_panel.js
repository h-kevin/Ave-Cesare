/* Javascript & jQuery file for admin panel. */


/**
 * navigator links
 */

$('.admin_panel .nav div').click(function () {
  let link = $(this).find('a').attr('href');
  window.location.href = link;
});


/**
 * control section update
 */

let switchExecution = -1;

$(document).ready(function () {
  // get link
  let link = document.location.href;
  // get section
  if (link.search('#') == -1 || link.search('#stats-section') != -1) {
    switchExecution = 1;
  } else if (link.search('#list-section') != -1) {
    switchExecution = 2;
  } else if (link.search('#mgu-section') != -1) {
    switchExecution = 3;
  } else if (link.search('#mgp-section') != -1) {
    switchExecution = 4;
  } else {
    switchExecution = 5;
  }
});

$('nav').click(function () {
  // get link
  let link = document.location.href;
  // get section
  if (link.search('#') == -1 || link.search('#stats-section') != -1) {
    switchExecution = 1;
  } else if (link.search('#list-section') != -1) {
    switchExecution = 2;
  } else if (link.search('#mgu-section') != -1) {
    switchExecution = 3;
  } else if (link.search('#mgp-section') != -1) {
    switchExecution = 4;
  } else {
    switchExecution = 5;
  }
});


/**
 * SECTION 1
 */

$(document).ready(function () {
  if (switchExecution == 1) {
    statistika();
  }
});

$('nav').click(function () {
  if (switchExecution == 1)
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
  if (switchExecution == 1) {
    statistika();
  }
}, 10000);


/**
 * END SECTION 1
 */


/**
 * SECTION 2
 */

$(document).ready(function () {
  // on document ready fetch open orders
  if (switchExecution == 2) {
    fetch_open_orders();
  }
});

$('nav').click(function () {
  if (switchExecution == 2)
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

    // table columns
    let oid, client, date, destination, prod, total, status;

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
        <option selected value="open">Vendosur</option>
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

      // order id
      oid = orders[i]['o_id'];

      // create table row
      let row = `<tr data-id="${oid}">${client} ${date} ${destination} ${prod} ${total} ${status}</tr>`;

      // insert rows
      $('#list-section .olist-table tbody').append(row);

      // update selected
      $('#list-section .olist-table tbody tr:last-child .status').val(orders[i]['status']);

      // insert row progressbar
      $('#list-section .olist-table tbody').append(progressbar);

      // update progressbar
      let stat_v = orders[i]['status'];
      let progress = stat_v == 'open' ? '25' : stat_v == 'cooking' ? '50'
        : stat_v == 'delivering' ? '75' : '100';

      $('#list-section .olist-table tbody tr:last-child .progress-bar').css('width', `${progress}%`);
      $('#list-section .olist-table tbody tr:last-child .progress-bar').text(`${progress}%`);
    }
  }
};

// set interval to update orders table
setInterval(function () {
  if (switchExecution == 2) {
    fetch_open_orders();
  }
}, 10000);

// handle status change
$('#list-section .olist-table').on('change', '.status', function () {
  // get value
  let status = $(this).val();

  // get order id
  let oid = $(this).closest('tr').attr('data-id');

  // set up data object
  let data = {
    oid: oid,
    status: status
  }

  data = JSON.stringify(data);

  // update database
  $.ajax({
    type: "POST",
    url: "../php/update_order_status.php",
    data: { statusObj: data },
    success: function (response) {
      if (response == 'success') {
        fetch_open_orders();
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      $.notify(xhr.responseText, 'error');
    }
  });
});

/**
 * END SECTION 2
 */


/**
 * SECTION 3
 */

$(document).ready(function () {
  if (switchExecution == 3)
    getAll();
});

$('nav').click(function () {
  if (switchExecution == 3) {
    getAll();
  }
});

function getAll () {
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
};

let user_id;

//on success fill table with results
function getAllFormat (response) {

  let tblVar;

  for (i in response) {
    tblVar += '<tr>';
    tblVar += '<td><img src="' + response[i].prof_img + '" class="rounded-circle" width="50" height="50"></td>';
    tblVar += '<td>' + response[i].name + '</td>';
    tblVar += '<td>' + response[i].surname + '</td>';
    tblVar += '<td>' + response[i].admin + '</td>';
    tblVar += '<td><button type="button" name="update" data-id="' + response[i].id + '" data-target="#userModalUpdate" data-toggle="modal" class="btn btn-success btn-lg update">Modifiko</button></td>';
    tblVar += '<td><button type="button" name="delete" data-id="' + response[i].id + '" data-target="#userModalDelete" data-toggle="modal" class="btn btn-danger btn-lg delete">Fshi</button></td>';
    tblVar += '</tr>';
  }

  $('#kuti table tbody').html(tblVar);
};

//ne klikimin jashte modalit i bejm reset cdo inputi ose alerti
$('#mgu-section').on('hidden.bs.modal', '.modal', function () {
  if ($(this).attr('id') != 'userModalDelete') {
    $(this).find('form')[0].reset();
    $('#modal_msgAd').html('');
    $('#modal_msgAd').removeClass('alert alert-primary');
    $('#userModalAdd').modal('hide');
    $('#modal_msgUp').html('');
    $('#modal_msgUp').removeClass('alert alert-primary');
    $('#userModalUpdate').modal('hide');
  } else {
    $('#modal_msgDel').html('');
    $('#modal_msgDel').removeClass('alert alert-primary');
    $('#userModalDelete').modal('hide');
  }
});

$(document).on('click', '.delete', function () {
  user_id = $(this).attr("data-id");
  $("#delete_mod").show();

  $(document).on('click', '#delete_mod', function () {
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
          $('#userModalDelete').modal('hide');
        }, 1000);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $.notify(xhr.responseText, "error");
      }
    });
  });
});

$(document).on('click', '#add', function () {
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
        setTimeout(function () {
          $('#userModalAdd').modal('hide');
        }, 1000);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $.notify(xhr.responseText, "error");
        $('#modal_msgAd').addClass('alert alert-primary');
      }
    });
  }
});

$(document).on('click', '.update', function () {
  user_id = $(this).attr("data-id");

  $(document).on('click', '#update_mod', function () {
    const regex1 = new RegExp(/^[A-Za-z]+$/);
    let name = $('#name_up').val();
    let surname = $('#surname_up').val();
    let type_user = $("input[name='user_type']:checked").val()

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
          setTimeout(function () {
            $('#userModalUpdate').modal('hide');
          }, 1000);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          $.notify(xhr.responseText, "error");
        }
      });
    }
  });
});

/**
 * END SECTION 3
 */


/**
 * SECTION 4
 */

$('nav').click(function () {
  if (switchExecution == 4) {
    getAllProds();
  }
});

$(document).ready(function () {
  if (switchExecution == 4) {
    getAllProds();
  }
});

$('.custom-file-input').on('change', function () {
  if ($('#modal_prod_msgUp').is(':visible'))
    $('#modal_prod_msgUp').fadeOut();

  let filen = '';

  if ($(this).get(0).files[0])
    filen = $(this).get(0).files[0].name;

  if (filen.length != 0)
    $(this).next().text(filen);
  else
    $(this).next().text('Zgjidh imazhin');
});

$('#prodModalAdd').on('hidden.bs.modal', function () {
  $('#prodModalAdd .custom-file-input').val('');
  $('#prodModalAdd .custom-file-label').text('Zgjidh imazhin');
  $('#modal_prod_msgUp').fadeOut();
});

$('#prodModalUpdate').on('hidden.bs.modal', function () {
  $('#prodModalUpdate .custom-file-input').val('');
  $('#prodModalUpdate .custom-file-label').text('Zgjidh imazhin');
  $('#modal_prod_msgUp').fadeOut();
});

$('#prodModalDelete').on('hidden.bs.modal', function () {
  $('#prodModalDelete .custom-file-input').val('');
  $('#prodModalDelete .custom-file-label').text('Zgjidh imazhin');
  $('#modal_prod_msgUp').fadeOut();
});

function getAllProds () {
  //  function to fetch all products
  $.ajax({
    type: 'POST',
    url: '../php/get_prods.php',
    dataType: "json",
    success: function (response) {
      getAllProdsFormat(response);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      $.notify(xhr.responseText, "error");
    }
  });

  //  function to get all products categories into dropdown lists
  $.ajax({
    type: 'POST',
    url: '../php/get_prodCat.php',
    success: function (response) {
      $('#kategAdd').html(response);
      $('#kategUp').html(response);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      $.notify(xhr.responseText, "error");
    }
  });

  //  function to get all products ingredients into checkbox
  $.ajax({
    type: 'POST',
    url: '../php/get_prodIngredients.php',
    success: function (response) {
      $('#checkIngredientAdd').html(response);
      $('#checkIngredientUp').html(response);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      $.notify(xhr.responseText, "error");
    }
  });
};

//on success fill table with results
function getAllProdsFormat (response) {

  let tblVar;

  for (i in response) {
    tblVar += '<tr>';
    tblVar += '<td><img src="' + response[i].prof_img + '" class="rounded-circle" width="50" height="50"></td>';
    tblVar += '<td>' + response[i].name + '</td>';
    tblVar += '<td>' + response[i].cat + '</td>';
    tblVar += '<td>' + response[i].price + '</td>';
    tblVar += '<td><button type="button" name="update" data-id="' + response[i].id + '" data-target="#prodModalUpdate" data-toggle="modal" class="btn btn-success btn-lg update_prod">Modifiko</button></td>';
    tblVar += '<td><button type="button" name="delete" data-id="' + response[i].id + '" data-target="#prodModalDelete" data-toggle="modal" class="btn btn-danger btn-lg delete_prod">Fshi</button></td>';
    tblVar += '</tr>';
  }

  $('#kuti_p table tbody').html(tblVar);
}

//ne klikimin jashte modalit i bejm reset cdo inputi ose alerti
$('#mgp-section').on('hidden.bs.modal', '.modal', function () {
  if ($(this).attr('id') != 'prodModalDelete') {
    $(this).find('form')[0].reset();
    $('[data-toggle="buttons"] :radio').prop('checked', false);
    $('[data-toggle="buttons"] label').removeClass('active');
    $('#modal_prod_msgAd').html('');
    $('#modal_prod_msgAd').removeClass('alert alert-primary');
    $('#prodModalAdd').modal('hide');
    $('#modal_prod_msgUp').html('');
    $('#modal_prod_msgUp').removeClass('alert alert-primary');
    $('#prodModalUpdate').modal('hide');
  } else {
    $('#prodModalDelete').modal('hide');
    $('#modal_prod_msgDel').html('');
    $('#modal_prod_msgDel').removeClass('alert alert-primary');
  }
});

let prod_id;

//function to delete selected product
$(document).on('click', '.delete_prod', function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  prod_id = $(this).attr("data-id");
  $("#prod_delete_mod").show();

  $(document).on('click', '#prod_delete_mod', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $.ajax({
      url: "../php/delete_prod.php",
      method: "POST",
      data: { prod_id: prod_id },
      beforeSend: function () {
        $('.manage-products .spinner-border').removeClass('d-none');
      },
      success: function (data) {
        $('.manage-products .spinner-border').addClass('d-none');
        $('#modal_prod_msgDel').addClass('alert alert-primary');
        $('#modal_prod_msgDel').html(data);
        getAllProds();
        setTimeout(function () {
          $('#prodModalDelete').modal('hide');
        }, 1000);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $.notify(xhr.responseText, "error");
        $('.manage-products .spinner-border').addClass('d-none');
      }
    });
  });
});

//function to add product
$(document).on('click', '#prod_add', function () {
  let i = 0;
  let name = $('#prod_name_add').val();
  let price = $('#prod_price_add').val();
  let category = $('#kategAdd').children("option:selected").val();
  let ingredients = [];
  $('.form-check-input:checked').each(function () {
    ingredients[i++] = $(this).val();
  });

  let imgfile = document.getElementById('prodimgin2').files[0];

  if (imgfile) {
    let extensions = ['jpg', 'jpeg', 'png', 'gif'];
    let filename = imgfile.name;
    let filesize = imgfile.size;

    // if not allowed file type or above allowed size
    if (!extensions.includes(filename.split('.').pop())) {
      $('#modal_prod_msgAd').text('Formati i gabuar!');
      $('#modal_prod_msgAd').addClass('alert alert-primary');
    } else if (filesize > 5000000) {
      $('#modal_prod_msgAd').text('Imazhi nuk mund te jete me shume se 5MB!');
      $('#modal_prod_msgAd').addClass('alert alert-primary');
    } else {

      let inputData = new FormData();
      inputData.append('prodimg', imgfile);
      inputData.append('name', name);
      inputData.append('price', price);
      inputData.append('category', category);
      inputData.append('ingredients', ingredients);

      if (name == "" || price == "" || category == "" || !imgfile) {
        $('#modal_prod_msgAd').html('Duhen shtuar te gjitha te dhenat e domosdoshme! (Emri, cmimi, imazhi dhe kategoria)');
        $('#modal_prod_msgAd').addClass('alert alert-primary');
      }

      else {
        $.ajax({
          url: "../php/add_prod.php",
          method: "POST",
          data: inputData,
          contentType: false,
          cache: false,
          processData: false,
          beforeSend: function () {
            $('#admp .spinner-border').removeClass('d-none');
          },
          success: function (data) {
            $('#admp .spinner-border').addClass('d-none');
            $('#modal_prod_msgAd').addClass('alert alert-primary');
            $('#modal_prod_msgAd').html(data);
            $('#prodModalAdd .custom-file-input').val('');
            $('#prodModalAdd .custom-file-label').text('Zgjidh imazhin');
            getAllProds();
            setTimeout(function () {
              $('#prodModalAdd').modal('hide');
            }, 1000);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            $.notify(xhr.responseText, "error");
            $('#admp .spinner-border').addClass('d-none');
          }
        });
      }
    }
  } else {
    $('#modal_prod_msgAd').html('Duhen plotesuar te gjitha fushat.');
    $('#modal_prod_msgAd').addClass('alert alert-primary');
  }
});

//function to update product
$(document).on('click', '.update_prod', function () {
  prod_id = $(this).attr("data-id");
});

$(document).on('click', '#prod_update_mod', function () {
  let i = 0;
  let name = $('#prod_name_up').val();
  let price = $('#prod_price_up').val();
  let category = $('#kategUp').children("option:selected").val();
  let ingredients = [];

  $('.form-check-input:checked').each(function () {
    ingredients[i++] = $(this).val();
  });

  let imgfile = document.getElementById('prodimgin').files[0];

  if (name == "" && price == "" && category == "" && !imgfile && ingredients.length == 0) {
    $('#modal_prod_msgUp').html('Ju nuk keni modifikuar asnje te dhene!');
    $('#modal_prod_msgUp').addClass('alert alert-primary');
  } else {
    if (imgfile || name != "" || price != "" || category != "" || ingredients.length != 0) {
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
        inputData.append('prodimg', imgfile);
        inputData.append('prod_id', prod_id);
        inputData.append('name', name);
        inputData.append('price', price);
        inputData.append('category', category);
        inputData.append('ingredients', JSON.stringify(ingredients));

        $.ajax({
          url: "../php/update_prod.php",
          method: "post",
          data: inputData,
          contentType: false,
          cache: false,
          processData: false,
          beforeSend: function () {
            $('#admp .spinner-border').removeClass('d-none');
          },
          success: function (data) {
            $('#admp .spinner-border').addClass('d-none');
            $('#modal_prod_msgUp').html(data);
            $('#modal_prod_msgUp').addClass('alert alert-primary');
            getAllProds();
            setTimeout(function () {
              $('#prodModalUpdate').modal('hide');
            }, 1000);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            $.notify(xhr.responseText, "error");
            $('#admp .spinner-border').addClass('d-none');
          }
        });
      }
    } else if (imgfile && (name == "" && price == "" && category == "" && ingredients.length == 0)) {
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
        inputData.append('prodimg', imgfile);
        inputData.append('prod_id', prod_id);
      }

      // send data and receive url
      $.ajax({
        type: "post",
        url: "../php/prod_img.php",
        data: inputData,
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: function () {
          $('#admp .spinner-border').removeClass('d-none');
        },
        success: function (response) {
          $('#admp .spinner-border').addClass('d-none');
          $('#modal_prod_msgUp').html(response);
          $('#modal_prod_msgUp').addClass('alert alert-primary');
          getAllProds();
          setTimeout(function () {
            $('#prodModalUpdate').modal('hide');
          }, 1000);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          $('#admp .spinner-border').addClass('d-none');
          $.notify(xhr.responseText, 'error');
        }
      });
    }
  }
});

/**
 * END SECTION 4
 */


/**
 * SECTION 5
 */

$(document).ready(function () {
  if (switchExecution == 5)
    getAllOffers();
});

$('nav').click(function () {
  if (switchExecution == 5) {
    getAllOffers();
  }
});

function getAllOffers () {
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
};

let offer_id;

//on success fill table with results
function getAllFormatOffer (response) {

  let tblVar;

  for (i in response) {
    tblVar += '<tr>';
    tblVar += '<td><img src="' + response[i].image + '" class="rounded-circle" width="50" height="50"></td>';
    tblVar += '<td>' + response[i].name + '</td>';
    tblVar += '<td>' + response[i].discount + '</td>';
    tblVar += '<td>' + response[i].description + '</td>';
    tblVar += '<td><button type="button" name="update" data-id="' + response[i].id + '" data-target="#offerModalUpdate" data-toggle="modal" class="btn btn-success btn-lg updateo">Modifiko</button></td>';
    tblVar += '<td><button type="button" name="delete" data-id="' + response[i].id + '" data-target="#offerModalDelete" data-toggle="modal" class="btn btn-danger btn-lg deleteo">Fshi</button></td>';
    tblVar += '</tr>';
  }

  $('#kuti_offer table tbody').html(tblVar);
}

// ne zgjedhje te imazhit
$('.custom-file-input').on('change', function () {
  if ($('#modal_offer_msgUp').is(':visible'))
    $('#modal_offer_msgUp').fadeOut();

  let filen = '';

  if ($(this).get(0).files[0])
    filen = $(this).get(0).files[0].name;

  if (filen.length != 0)
    $(this).next().text(filen);
  else
    $(this).next().text('Zgjidh imazhin');
});

$('#offerModalAdd').on('hidden.bs.modal', function () {
  $('#offerModalAdd .custom-file-input').val('');
  $('#offerModalAdd .custom-file-label').text('Zgjidh imazhin');
  $('#modal_offer_msgUp').fadeOut();
});

$('#offerModalUpdate').on('hidden.bs.modal', function () {
  $('#offerModalUpdate .custom-file-input').val('');
  $('#offerModalUpdate .custom-file-label').text('Zgjidh imazhin');
  $('#modal_offer_msgUp').fadeOut();
});

$('#offerModalDelete').on('hidden.bs.modal', function () {
  $('#offerModalDelete .custom-file-input').val('');
  $('#offerModalDelete .custom-file-label').text('Zgjidh imazhin');
  $('#modal_offer_msgUp').fadeOut();
});

//ne klikimin jashte modalit i bejm reset cdo inputi
$('#mgo-section').on('hidden.bs.modal', '.modal', function () {
  if ($(this).attr('id') != 'offerModalDelete') {
    $(this).find('form')[0].reset();
    $('#modal_offer_msgAd').html('');
    $('#modal_offer_msgAd').removeClass('alert alert-primary');
    $('#offerModalAdd').modal('hide');
    $('#modal_offer_msgUp').html('');
    $('#modal_offer_msgUp').removeClass('alert alert-primary');
    $('#offerModalUpdate').modal('hide');
    console.log('pwor');
  } else {
    $('#modal_offer_msgDel').html('');
    $('#modal_offer_msgDel').removeClass('alert alert-primary');
    $('#offerModalDelete').modal('hide');
  }
});

$(document).on('click', '.deleteo', function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  offer_id = $(this).attr("data-id");
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
          $('#offerModalDelete').modal('hide');
        }, 1000);
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
          $('#add_offer .spinner-border').addClass('d-none');
          $('#modal_offer_msgAd').addClass('alert alert-primary');
          $('#modal_offer_msgAd').html(response);
          getAllOffers();
          setTimeout(function () {
            $('#offerModalAdd').modal('hide');
          }, 1000);
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
  offer_id = $(this).attr("data-id");

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
            $('#modal_offer_msgUp').html('Perditesimi u krye me sukses!');
            $('#modal_offer_msgUp').addClass('alert alert-primary');
            $('#modal_offer_msgUp').addClass('alert alert-primary');
            getAllOffers();
            setTimeout(function () {
              $('#offerModalUpdate').modal('hide');
            }, 1000);

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
        $('#kuti_offer .spinner-border').addClass('d-none');
        $('#modal_offer_msgUp').html(data);
        $('#modal_offer_msgUp').addClass('alert alert-primary');
        getAllOffers();
        setTimeout(function () {
          $('#offerModalUpdate').modal('hide');
        }, 1000);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $.notify(xhr.responseText, "error");
      }
    });
  });
});

/**
 * END SECTION 5
 */