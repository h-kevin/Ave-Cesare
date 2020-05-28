
/**
 * search profucts javascript page
 */
$(document).ready(function() {
    $("#search").keyup(function() {
        var search = $("#search").val();
        if(search.length > 0) {
            $.ajax({
                type: "post",
                url: "../php/search.php",
                data: {search: search},
                success: function (response) {
                    $('#result').html(response);
                }, 
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notify(xhr.responseText, "error");
                }
                });
        }
    });
});