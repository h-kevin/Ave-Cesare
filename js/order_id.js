$(document).ready(function(){
    $(document).on('click', '.buton-karte', function(){
        var ofertaid = $(this).attr('id');
        console.log(ofertaid);
        $.ajax({
            type: "post",
            url: "../php/order_id.php",
            data: {offer_id: ofertaid},
            success: function (response) {
                $('#notif').addClass('alert alert-primary');
                $('#notif').text(response); 
                setTimeout(function(){ 
                    $('#notif').text('');
                    $('#notif').removeClass('alert alert-primary'); }, 3000);
                },
            error: function (xhr, ajaxOptions, thrownError) {
                $.notify(xhr.responseText, "error");
            }
        });
    });
});