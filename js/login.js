$(document).on('click', '#kycje', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    let email = $('#email').val();
    let password = $('#password').val();

    $.ajax({
    url:"../php/login.php",
    method:"POST",
    data:{email:email,password:password},
    success:function(data){
        $('#error-p').addClass('alert alert-primary');
        $('#error-p').text(data);
        window.location.href = '../pages/profile.html';
        setTimeout(function(){ 
            $('#error-p').text('');
            $('#error-p').removeClass('alert alert-primary'); }, 3000);
    }
    });
});