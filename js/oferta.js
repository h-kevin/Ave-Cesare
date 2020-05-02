$(document).ready(function(){  
    $.ajax({
                 type: 'GET',
                 url:  '../php/oferta.php',
                 success: function(response) {
                     $('.carousel-inner').html(response);
                  }
              });
});