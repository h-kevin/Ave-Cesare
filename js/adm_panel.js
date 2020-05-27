/* Javascript & jQuery file for admin panel. */


/**
 * navigator links
 */

$('.admin_panel .nav div').click(function () {
  let link = $(this).find('a').attr('href');
  window.location.href = link;
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

  //ne klikimin jashte modalit i bejm reset cdo inputi ose alerti
  $('.modal').on('hidden.bs.modal', function () {
    $(this).find('form')[0].reset();
    $('[data-toggle="buttons"] :radio').prop('checked', false);
    $('[data-toggle="buttons"] label').removeClass('active');
    $(this).find('.collapse').collapse('hide');
    $(this).find('small').fadeOut();
    $('#modal_msgDel').html('');
    $('#modal_msgDel').removeClass('alert alert-primary');
    $('#userModalDelete').modal('hide');
    $('#modal_msgAd').html('');
    $('#modal_msgAd').removeClass('alert alert-primary');
    $('#userModalAdd').modal('hide');
    $('#modal_msgUp').html('');
    $('#modal_msgUp').removeClass('alert alert-primary');
    $('#userModalUpdate').modal('hide');
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
$(document).ready(function getAllProds () {

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


  //on success fill table with results
  function getAllProdsFormat (response) {

    var tblVar;

    for (i in response) {
      tblVar += '<tr>';
      tblVar += '<td><img src="' + response[i].prof_img + '" class="rounded-circle" width="50" height="50"></td>';
      tblVar += '<td>' + response[i].name + '</td>';
      tblVar += '<td>' + response[i].cat + '</td>';
      tblVar += '<td>' + response[i].price + '</td>';
      tblVar += '<td><button type="button" name="update" id="' + response[i].id + '" data-target="#prodModalUpdate" data-toggle="modal" class="btn btn-success btn-lg update_prod">Modifiko</button></td>';
      tblVar += '<td><button type="button" name="delete" id="' + response[i].id + '" data-target="#prodModalDelete" data-toggle="modal" class="btn btn-danger btn-lg delete_prod">Fshi</button></td>';
      tblVar += '</tr>';
    }

    $('#kuti_p table tbody').html(tblVar);
  }


  //ne klikimin jashte modalit i bejm reset cdo inputi ose alerti
  $('.modal').on('hidden.bs.modal', function () {
    $(this).find('form')[0].reset();
    $('[data-toggle="buttons"] :radio').prop('checked', false);
    $('[data-toggle="buttons"] label').removeClass('active');
    $(this).find('.collapse').collapse('hide');
    $(this).find('small').fadeOut();
    $('#modal_prod_msgDel').html('');
    $('#modal_prod_msgDel').removeClass('alert alert-primary');
    $('#prodModalDelete').modal('hide');
    $('#modal_prod_msgAd').html('');
    $('#modal_prod_msgAd').removeClass('alert alert-primary');
    $('#prodModalAdd').modal('hide');
    $('#modal_prod_msgUp').html('');
    $('#modal_prod_msgUp').removeClass('alert alert-primary');
    $('#prodModalUpdate').modal('hide');
  });

  var prod_id;
  //ne klikimin jashte modalit i bejm reset cdo inputi
  $('.modal').on('hidden.bs.modal', function () {
    $(this).find('form')[0].reset();
    $('[data-toggle="buttons"] :radio').prop('checked', false);
    $('[data-toggle="buttons"] label').removeClass('active');
    $(this).find('.collapse').collapse('hide');
    $(this).find('small').fadeOut();
  });

  //function to delete selected product
$(document).on('click', '.delete_prod', function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  prod_id = $(this).attr("id");
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
        getAllProds();
        $('.manage-products .spinner-border').addClass('d-none');
        $("#prod_delete_mod").hide();
        $('#modal_prod_msgDel').addClass('alert alert-primary');
        $('#modal_prod_msgDel').html(data);
        setTimeout(function () {
          $('#modal_prod_msgDel').html('');
          $('#modal_prod_msgDel').removeClass('alert alert-primary');
          $('#prodModalDelete').modal('hide');
        }, 2000);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $.notify(xhr.responseText, "error");
        $('.manage-products .spinner-border').addClass('d-none');
      }
    });
  });
});

//function to add product
$(document).on('click', '#prod_add', function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  
  var i=0;
  let name = $('#prod_name_add').val();
  let price = $('#prod_price_add').val();
  let category = $('#kategAdd').children("option:selected").val();
  let ingredients = [];
  $('.form-check-input:checked').each(function () {
      ingredients[i++] = $(this).val();
  });  

  if (name == "" || price == "" || category == "") {
    $('#modal_prod_msgAd').html('Duhen shtuar te gjitha te dhenat e domosdoshme! (Emri, cmimi dhe kategoria)');
    $('#modal_prod_msgAd').addClass('alert alert-primary');
  }

  else  {
    $.ajax({
      url: "../php/add_prod.php",
      method: "POST",
      data: { name: name, price: price, category: category, ingredients: ingredients },
      beforeSend: function () {
        $('#admp .spinner-border').removeClass('d-none');
      },
      success: function (data) {
        getAllProds();
        $('#admp .spinner-border').addClass('d-none');
        $('#modal_prod_msgAd').addClass('alert alert-primary');
        $('#modal_prod_msgAd').html(data);
        $('form').trigger('reset');
        setTimeout(function () {
          $('#modal_prod_msgAd').html('');
          $('#modal_prod_msgAd').removeClass('alert alert-primary');
          $('#prodModalAdd').modal('hide');
        }, 1800);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $.notify(xhr.responseText, "error");
        $('#admp .spinner-border').addClass('d-none');
      }
    });
  }
});

//function to update product
$(document).on('click', '.update_prod', function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  prod_id = $(this).attr("id");

  $(document).on('click', '#prod_update_mod', function () {

    var i=0;
    let name = $('#prod_name_up').val();
    let price = $('#prod_price_up').val();
    let category = $('#kategUp').children("option:selected").val();
    let ingredients = [];
    $('.form-check-input:checked').each(function () {
        ingredients[i++] = $(this).val();
    });  

    if (name == "" && price == "" && category == "" && jQuery.isEmptyObject(ingredients)) {
      $('#modal_prod_msgUp').html('Ju nuk keni modifikuar asnje te dhene!');
      $('#modal_prod_msgUp').addClass('alert alert-primary');
    } 
    
    else {
      $.ajax({
        url: "../php/update_prod.php",
        method: "POST",
        data: { prod_id: prod_id, name: name, price: price, category: category, ingredients: ingredients },
        beforeSend: function () {
          $('#admp .spinner-border').removeClass('d-none');
        },
        success: function (data) {
          getAllProds();
          $('#admp .spinner-border').addClass('d-none');
          $('#modal_prod_msgUp').html(data);
          $('#modal_prod_msgUp').addClass('alert alert-primary');
          $('form').trigger('reset');
          setTimeout(function () {
            $('#modal_prod_msgUp').html('');
            $('#modal_prod_msgUp').removeClass('alert alert-primary');
            $('#prodModalUpdate').modal('hide');
          }, 1800);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          $.notify(xhr.responseText, "error");
          $('#admp .spinner-border').addClass('d-none');
        }
      });
    }
    });
  });

});
/**
 * END SECTION 4
 */