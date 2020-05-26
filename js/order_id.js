$(document).ready(function(){
    $(document).on('click', '.buton-karte', function(){
        var ofertaid = $(this).attr('id');
        console.log(ofertaid);
        $.ajax({
            type: "post",
            url: "../php/order_id.php",
            data: {offer_id: ofertaid},
            success: function (response) {
                window.location.replace('./user_order.html');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $.notify(xhr.responseText, "error");
            }
        });
    });
});