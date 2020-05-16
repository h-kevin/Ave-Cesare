/* Admin panel js functions */

//Function to fetch all users
$(document).ready(function getAll(){  
    $.ajax({
                 type: 'GET',
                 url:  '../php/get_users.php',
                 success: function(response) {
                     $('#tblHolder').html(response);
                  }
              });


$('.modal').on('hidden.bs.modal', function() {
    $(this).find('form')[0].reset();
    $(this).find('.collapse').collapse('hide');
    $(this).find('small').fadeOut();
});

$(document).on('click', '.delete', function(){
    var user_id = $(this).attr("id");
    $(document).on('click', '#delete_mod', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
     $.ajax({
      url:"../php/delete_user.php",
      method:"POST",
      data:{user_id:user_id},
      success:function(data){
        $("#delete_mod").hide();
        $('#modal_msgDel').addClass('alert alert-primary');
        $('#modal_msgDel').html(data);
        getAll();
        setTimeout(function(){ 
            $('#modal_msgDel').html('');
            $('#modal_msgDel').removeClass('alert alert-primary');
            $('#userModalDelete').modal('hide'); }, 2500);
        }   
     });
    });
   });


$(document).on('click', '#add', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    let name = $('#name_add').val();
    let surname = $('#surname_add').val();
    let email = $('#email_add').val();
    let pass = $('#pass1_add').val();
    let pass2 = $('#pass2_add').val();
    
    if(name == "" || surname == "" || email == "" || pass == "" || pass2 == ""){
        $('#modal_msgAd').html('Duhen shtuar te gjitha te dhenat e kerkuara!');
        $('#modal_msgAd').addClass('alert alert-primary');
    }

    else if(pass != pass2){
        $('#modal_msgAd').html('Fjalekalimet nuk perputhen!');
        $('#modal_msgAd').addClass('alert alert-primary');
    }

    else{     
            $.ajax({
            url:"../php/add_user.php",
            method:"POST",
            data:{name:name,surname:surname,email:email,pass:pass},
            success:function(data){
                $('#modal_msgAd').addClass('alert alert-primary');
                $('#modal_msgAd').html(data);
                getAll();
                $('form').trigger('reset');
                setTimeout(function(){ 
                    $('#modal_msgAd').html('');
                    $('#modal_msgAd').removeClass('alert alert-primary');
                    $('#userModalAdd').modal('hide'); }, 2500);
            }
            });
    }
});

   
   $(document).on('click', '.update', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    var user_id = $(this).attr("id");

    $(document).on('click', '#update_mod', function(){
    var name = $('#name_up').val();
    var surname = $('#surname_up').val();
    var type_user = $("input[name='user_type']:checked").val()

    if(name == "" && surname == "" && type_user == undefined){
        $('#modal_msgUp').html('Ju nuk keni modifikuar asnje te dhene!');
        $('#modal_msgUp').addClass('alert alert-primary');
    }
    else{

            $.ajax({
             url:"../php/update_user.php",
             method:"POST",
             data:{user_id:user_id,name:name,surname:surname,type_user:type_user},
             success:function(data){
                $('#modal_msgUp').html(data);
                $('#modal_msgUp').addClass('alert alert-primary');
                getAll();
                $('form').trigger('reset');
                setTimeout(function(){ 
                    $('#modal_msgUp').html('');
                    $('#modal_msgUp').removeClass('alert alert-primary');
                    $('#userModalUpdate').modal('hide'); }, 2000);
             }
            });
    }
});
});
});