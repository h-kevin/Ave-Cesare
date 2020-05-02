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
});

$(document).ready(function(){  
    $.ajax({
                 type: 'GET',
                 url:  '../php/categories.php',
                 success: function(response) {
                     $('#category-buttons').html(response);
                  }
              });
});