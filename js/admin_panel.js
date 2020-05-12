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


$(document).on('click', '.delete', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    var user_id = $(this).attr("id");
    if(confirm("Jeni te sigurt qe doni ta fshini kete perdorues?")){
     $.ajax({
      url:"../php/delete_user.php",
      method:"POST",
      data:{user_id:user_id},
      success:function(data){
       alert(data);
       getAll();
      }
     });
    }
    else{
     return false; 
    }
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
    }

    else if(pass != pass2){
        $('#modal_msgAd').html('Fjalekalimet nuk perputhen!');
    }

    else{
        if(confirm("Jeni te sigurt qe doni ta shtoni kete perdorues?")){ 
                    
            $.ajax({
            url:"../php/add_user.php",
            method:"POST",
            data:{name:name,surname:surname,email:email,pass:pass},
            success:function(data){
                $('#modal_msgAd').html(data);
                getAll();
                $('form').trigger('reset');
            }
            });
        }
        else{
            return false; 
            }
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
    }
    else{
        if(confirm("Jeni te sigurt qe doni ta modifikoni kete perdorues?")){
            $.ajax({
             url:"../php/update_user.php",
             method:"POST",
             data:{user_id:user_id,name:name,surname:surname,type_user:type_user},
             success:function(data){
                $('#modal_msgUp').html(data);
                getAll();
                $('form').trigger('reset');
             }
            });
           }
           else{
            return false; 
           }
    }
});
});
});