$(document).ready(function(){  
    $.ajax({
        type: 'GET',
        url:  '../php/offers.php',
        success: function(response) {
            $('#offer-cards').html(response);
        }
    });
});