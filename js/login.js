
/**
 * login javascript page
 */
$(document).on('click', '#kycje', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    let email = $('#email').val();
    let password = $('#password').val();

    $.ajax({
    url:"../php/login.php",
    method:"POST",
    data:{email:email,password:password},
    beforeSend: function () {
        $('#login-body .spinner-border').removeClass('d-none');
      },
    success:function(data){
        $('#login-body .spinner-border').addClass('d-none');
        if (data == 'Success') {
            window.location.href = '../index.html';
        }
        else {
            $('#error-p').addClass('alert alert-light');
            $('#error-p').text(data); 
            setTimeout(function(){ 
                $('#error-p').text('');
                $('#error-p').removeClass('alert alert-light'); }, 3000);
        }
    }
    });
});