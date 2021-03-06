/* Signup js functions */

$(document).ready(function(){ 

    //regex to only accept alphabetic characters, 1+ char
    const regex1 = new RegExp(/^[A-Za-z]+$/);

    //real time check if name is fitting to the formatting
    $('#name').keyup(function() {
        let name = $('#name').val();

        //if not disable button until correct
        if (name != "" && !regex1.test(name)) {
            $('#errBox').html('Vendosni emrin ne formatin e kerkuar! Vetem karaktere alfabetike, pa hapesira ose simbole');
            $('#errBox').addClass('alert alert-light');
            $('#regjistrohu').addClass('disabled');
            $('#regjistrohu').attr('disabled',true);
        }
        else{
            $('#errBox').html('');
            $('#errBox').removeClass('alert alert-light');
            $('#regjistrohu').removeClass('disabled');
            $('#regjistrohu').attr('disabled',false);
        }
    });

    $('#surname').keyup(function() {
        let surname = $('#surname').val();

        if (surname != "" && !regex1.test(surname)) {
            $('#errBox').html('Vendosni mbiemrin ne formatin e kerkuar! Vetem karaktere alfabetike, pa hapesira ose simbole');
            $('#errBox').addClass('alert alert-light');
            $('#regjistrohu').addClass('disabled');
            $('#regjistrohu').attr('disabled',true);
        }
        else{
            $('#errBox').html('');
            $('#errBox').removeClass('alert alert-light');
            $('#regjistrohu').removeClass('disabled');
            $('#regjistrohu').attr('disabled',false);
        }
    });

    //check if password is at least 4 characters long and its written the same both times
    $('#password1').keyup(function() {
        let pass1 = $('#password1').val();

        if(pass1.length < 4){
            $('#errBox').addClass('alert alert-light');
            $('#errBox').html('Fjalekalimi duhet te kete te pakten 4 karaktere');
            $('#regjistrohu').addClass('disabled');
            $('#regjistrohu').attr('disabled',true);
        }
        else{
            $('#errBox').html('');
            $('#errBox').removeClass('alert alert-light');
            $('#regjistrohu').removeClass('disabled');
            $('#regjistrohu').attr('disabled',false);
        }
    });
    $('#password2').keyup(function() {
        let pass1 = $('#password1').val();
        let pass2 = $('#password2').val();
        
        if(pass1 != pass2){
            $('#errBox').addClass('alert alert-light');
            $('#errBox').html('Rishkruani te njejtin fjalekalim');
            $('#regjistrohu').addClass('disabled');
            $('#regjistrohu').attr('disabled',true);
        }
        else{
            $('#errBox').html('');
            $('#errBox').removeClass('alert alert-light');
            $('#regjistrohu').removeClass('disabled');
            $('#regjistrohu').attr('disabled',false);
        }
    });

    //if all is correct, do php request
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        let name = $('#name').val();
        let surname = $('#surname').val();
        let email = $('#email').val();
        let pass1 = $('#password1').val();
        let pass2 = $('#password2').val();
            $('#errBox').addClass('alert alert-light');
            $('#errBox').html('Duke shtuar perdoruesin...  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            $.ajax({
                url:"../php/signup.php",
                method:"POST",
                data:{name:name,surname:surname,email:email,pass1:pass1},
                beforeSend: function () {
                    $('#signup .spinner-border').removeClass('d-none');
                  },
                success:function(data){
                    $('form').trigger('reset');
                    $('#errBox').html(data);
                    $('#signup .spinner-border').addClass('d-none');
                    setTimeout(function(){ 
                        $('#errBox').html('');
                        $('#errBox').removeClass('alert alert-light');}, 5000);
                    setTimeout(function(){ 
                        window.location.replace('login.html?register=ok');}, 5000);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                  $('#signup .spinner-border').addClass('d-none');
                  $.notify(xhr.responseText, "error");
                }
                });
    });
});