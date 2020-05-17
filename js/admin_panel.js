/* Admin panel js functions */

//Function to fetch all users
$(document).ready(function getAll(){  
    $.ajax({
                 type: 'POST',
                 url:  '../php/get_users.php',
                 dataType: "json",
                 success: function(response) {
                    console.log(response);
                    getAllFormat(response);
                  },
                  error: function (xhr, ajaxOptions, thrownError) {
                    $.notify(xhr.responseText, "error");
                }
              });

//on success fill table with results
function getAllFormat (response) {

    var tblVar = '<table id="user_data" class="table table-bordered table-responsive">';
    tblVar += '<thead>';
    tblVar += '<tr>';
    tblVar += '<th width="10%">IMAZH</th>';
    tblVar += '<th width="30%">EMER</th>';
    tblVar += '<th width="30%">MBIEMER</th>';
    tblVar += '<th width="10%">ADMIN</th>';
    tblVar += '<th width="10%">MODIFIKO</th>';
    tblVar += '<th width="10%">FSHI</th>';

    for (i in response) {
        tblVar += '<tr>';
        tblVar += '<td><img src="' + response[i].prof_img + '" class="rounded-circle" width="50" height="50"</td>';
        tblVar += '<td>' + response[i].name + '</td>';
        tblVar += '<td>' + response[i].surname + '</td>';
        tblVar += '<td>' + response[i].admin + '</td>';
        tblVar += '<td><button type="button" name="update" id="'+response[i].id+'" data-target="#userModalUpdate" data-toggle="modal" class="btn btn-success btn-lg update">Modifiko</button></td>';
        tblVar += '<td><button type="button" name="delete" id="'+response[i].id+'" data-target="#userModalDelete" data-toggle="modal" class="btn btn-danger btn-lg delete">Fshi</button></td>';
        tblVar += '</tr>';
    }

    tblVar += '</tr>';
    tblVar += '</thead>';
    tblVar += '</table>';

    $('#tblHolder').html(tblVar);
}

//ne klikimin jashte modalit i bejm reset cdo inputi
$('.modal').on('hidden.bs.modal', function() {
    $(this).find('form')[0].reset();
    $('[data-toggle="buttons"] :radio').prop('checked', false);
    $('[data-toggle="buttons"] label').removeClass('active');
    $(this).find('.collapse').collapse('hide');
    $(this).find('small').fadeOut();
});


$(document).on('click', '.delete', function(){
    var user_id = $(this).attr("id");
    $("#delete_mod").show();

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
            $('#userModalDelete').modal('hide'); }, 2000);
        }   
     });
    });
   });


$(document).on('click', '#add', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    const regex1 = new RegExp(/^[A-Za-z]+$/);
    let name = $('#name_add').val();
    let surname = $('#surname_add').val();
    let email = $('#email_add').val();
    let pass = $('#pass1_add').val();
    let pass2 = $('#pass2_add').val();
    
    if (name != "" && !regex1.test(name)) {
        $('#modal_msgAd').html('Vendosni emrin ne formatin e kerkuar!');
        $('#modal_msgAd').addClass('alert alert-primary');
    }
    else if (surname != "" && !regex1.test(surname)) {
        $('#modal_msgAd').html('Vendosni mbiemrin ne formatin e kerkuar!');
        $('#modal_msgAd').addClass('alert alert-primary');
    }
    else if(name == "" || surname == "" || email == "" || pass == "" || pass2 == ""){
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
                    $('#userModalAdd').modal('hide'); }, 1800);
            }
            });
    }
});

   
   $(document).on('click', '.update', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    var user_id = $(this).attr("id");

    $(document).on('click', '#update_mod', function(){
    const regex1 = new RegExp(/^[A-Za-z]+$/);
    var name = $('#name_up').val();
    var surname = $('#surname_up').val();
    var type_user = $("input[name='user_type']:checked").val()

    if (name != "" && !regex1.test(name)) {
        $('#modal_msgUp').html('Vendosni emrin ne formatin e kerkuar!');
        $('#modal_msgUp').addClass('alert alert-primary');
    }
    else if (surname != "" && !regex1.test(surname)) {
        $('#modal_msgUp').html('Vendosni mbiemrin ne formatin e kerkuar!');
        $('#modal_msgUp').addClass('alert alert-primary');
    }
    else if(name == "" && surname == "" && type_user == undefined){
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
                    $('#userModalUpdate').modal('hide'); }, 1800);
             }
            });
    }
});
});
});