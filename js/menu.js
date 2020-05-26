/* Menu js functions */

function navBarBackgroundScrollEffect () {
	$(window).scroll(function () {
		if ($(window).scrollTop() > 0) {
			$('.navigationbar').css('background-color', 'rgba(30, 30, 30, 0.8)');
		} else {
			$('.navigationbar').css('background-color', 'transparent');
		}
	});
};

navBarBackgroundScrollEffect();

//Function to fill the products section of the menu page from the db
$(document).ready(function(){

    $.ajax({
		type: 'POST',
		url: '../php/check_ulog.php',
		dataType: "json",
		success: function (response) {
			check_ulog(response);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			$.notify(xhr.responseText, "error");
		}
	});

    $('.modal').on('hidden.bs.modal', function() {
        $(this).find('form')[0].reset();
        $('[data-toggle="buttons"] label').removeClass('active');
        $(this).find('.collapse').collapse('hide');
        $(this).find('small').fadeOut();
    });

    $.ajax({
        type: 'GET',
        url:  '../php/menu.php',
        success: function(response) {
            $('#menu-cards').html(response);
        }
    });

    var id, sasia=1;

        $(document).on('click', '.shto', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        var prod_id = $(this).attr("id");
        id=prod_id;
        $.ajax({
            url:"../php/get_product.php",
            data:{prod_id:prod_id},
            method:"POST",
            dataType:"json",
            success:function(data){
                $('#chosenPizza').html('<img src="'+ data.img + '" class="rounded" width="30" height="30"> ' + data.name);
                $('#cmimi_add').attr('value', data.price);

                $(document).on('change', '#sasi_add', function(){
                var sasi = $('#sasi_add').val();
                sasia = sasi;
                var newprice = data.price * sasi;
                $('#cmimi_add').attr('value', newprice);

            });
                $('form').trigger('reset');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.responseText, "error");
            }
            });

        $(document).on('click', '#shto', function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            $.ajax({
                url:"../php/set_prodOrder.php",
                data:{prod_id:id,sasi:sasia},
                method:"POST",
                beforeSend: function () {
                    $('#menu .spinner-border').removeClass('d-none');
                },
                success:function(data){
                    var timeout = 3000;
                    if(data == 'Nuk mund te shtoni produkte ne shporte pa hyre ne llogari! <a href="../pages/login.html">Kycuni dhe provoni serish.</a>') {
                        timeout = 10000;
                    }
                    $('#menu .spinner-border').addClass('d-none');
                    $('#modal_msgAd').addClass('alert alert-primary');
                    $('#modal_msgAd').html(data);
                    setTimeout(function(){ 
                        $('#modal_msgAd').html('');
                        $('#modal_msgAd').removeClass('alert alert-primary');
                        $('#menuModalAdd').modal('hide');
                        $('form').trigger('reset'); }, timeout);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notify(xhr.responseText, "error");
                 }
                });
        })});


//Function to fill the category buttons from the db
    $.ajax({
                 type: 'GET',
                 url:  '../php/categories.php',
                 success: function(response) {
                     $('#category-buttons').html(response);
                  }
              });

    $("#search").keyup(function() {
    var search = $("#search").val();
    console.log(search);
    if(search.length > 0) {
        $.ajax({
            type: "post",
            url: "../php/search_prod.php",
            data: {search: search},
            success: function (response) {
                $('#menu-cards').html(response);
            }, 
            error: function (xhr, ajaxOptions, thrownError) {
                $.notify(xhr.responseText, "error");
            }
            });
    }
});
});

//Display product cards by category button clicked
function display(cat_id){
         $.ajax({  
              url:"../php/menu.php",  
              method:"post",  
              data:{cat_id:cat_id},  
              success:function(response){
                $('#menu-cards').html(response);
              }  
         });  
        }

$(document).ready(function(){  
    
});


//  func check_ulog
function check_ulog(obj) {
    var s_id=obj['id'];
    // nqs ka perdorues te loguar 
    if(s_id){
       $("a.check_ulog").text('Profili');
       $("a.check_ulog").attr('href','./profile.html');
     }
 }