/* Signup js functions */

$(document).ready(function(){  

    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        let pass1 = $('#password1').val();
        let pass2 = $('#password2').val();
        
        if(pass1 != pass2){
            $('#errBox').addClass('alert alert-primary');
            $('#errBox').html('Fjalekalimet nuk perputhen. Provoni serish! <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        }
        else{

            let name = $('#name').val();
            let surname = $('#surname').val();
            let email = $('#email').val();
            $('#errBox').addClass('alert alert-primary');
            $('#errBox').html('Duke shtuar perdoruesin...  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            $.ajax({
                url:"../php/signup.php",
                method:"POST",
                data:{name:name,surname:surname,email:email,pass1:pass1},
                success:function(data){
                    $('form').trigger('reset');
                    $('#errBox').html(data);
                }
                });
        }
    });
});