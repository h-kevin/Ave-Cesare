/* Menu js functions */

//Function to fill the products section of the menu page from the db
$(document).ready(function(){  
    $.ajax({
                 type: 'GET',
                 url:  '../php/menu.php',
                 success: function(response) {
                     $('#menu-cards').html(response);
                  }
              });


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