

$(document).ready(function() {
    
    
        console.log('im here 1');
        $("#search").keyup(function() {
            var search = $("#search").val();
            console.log(search);
            if(search.length > 0) {
                console.log('im here 2');
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
    console.log('im here 3');
});