/* Change navbar background color and transparency on scroll */

function navBarBackgroundScrollEffect () {
  $(window).scroll(function () {
    if ($(window).width() < 767) {
      if ($(window).scrollTop() >= 90) {
        $('.navigationbar').css('background-color', 'rgba(30, 30, 30, 0.8)');
      } else {
        $('.navigationbar').css('background-color', 'transparent');
      }
    }
    else {
      if ($(window).scrollTop() >= 500) {
        $('.navigationbar').css('background-color', 'rgba(30, 30, 30, 0.8)');
      } else {
        $('.navigationbar').css('background-color', 'transparent');
      }
    }
  });
};

navBarBackgroundScrollEffect();



$(document).ready(function getOfferCards(){
  // ofertat
  $.ajax({
    type: 'POST',
    url:  '../php/fetch_offer_home.php',
    dataType: "json",
    success: function(response) {
       formCards(response);
     },
     error: function (xhr, ajaxOptions, thrownError) {
       $.notify(xhr.responseText, "error");
   }
 });

// produktet
 $.ajax({
  type: 'POST',
  url:  '../php/fetch_product_home.php',
  dataType: "json",
  success: function(response) {
     formcarousel(response);
   },
   error: function (xhr, ajaxOptions, thrownError) {
     $.notify(xhr.responseText, "error");
     alert(xhr.responseText, "error");
 }
});

// check_ulog
$.ajax({
  type: 'POST',
  url:  '../php/check_ulog.php',
  dataType: "json",
  success: function(response) {
     check_ulog(response);
   },
   error: function (xhr, ajaxOptions, thrownError) {
     $.notify(xhr.responseText, "error");
 }
});

// func per produktet ne karusel
 function formcarousel(response){
   var fotoja1="url('" + response[Math.floor(Math.random() * (response.length))].foto +"')";
   var fotoja2="url('" + response[Math.floor(Math.random() * (response.length))].foto +"')";
   var fotoja3="url('" + response[Math.floor(Math.random() * (response.length))].foto +"')";
   while((fotoja1==fotoja2) || (fotoja1==fotoja3) || (fotoja2==fotoja3)) {
    fotoja1="url('" + response[Math.floor(Math.random() * (response.length))].foto +"')";
    fotoja2="url('" + response[Math.floor(Math.random() * (response.length))].foto +"')";
    fotoja3="url('" + response[Math.floor(Math.random() * (response.length))].foto +"')";
   }
  document.getElementsByClassName("fst")[0].style.backgroundImage = fotoja1;
  document.getElementsByClassName("scnd")[0].style.backgroundImage = fotoja2;
  document.getElementsByClassName("third")[0].style.backgroundImage = fotoja3; 
};

 //  func check_ulog
 function check_ulog(obj) {
   var s_id=obj['id'];
   // nqs ka perdorues te loguar 
   if(s_id){
      $(".homepage a.check_ulog").text('Profili');
      $(".homepage a.check_ulog").attr('href','./pages/profile.html');
    }
}

// func per ofertat ne seksionin e kartave
 function formCards(response){
  
  var i, karusel='';
  var n=response["oferta"].length;
  var m=n-(n%3);

  // nqs ka 3 ose me sh oferta , shfaqen ne karusel
  if(response["oferta"].length>=3){
    response["oferta"].length=m;
    
    let i=0;
    for (let offer of response["oferta"]){
        if(i%3==0){
          if(i==0){
            karusel+='<div class="carousel-item active">';
          }
          else {
            karusel+='<div class="carousel-item">';
          }
          karusel+='<div class="row">'; 
          karusel+='<div class="col-md-4">';
        }  
        else {
          karusel+='<div class="col-md-4 clearfix d-none d-md-block">';
        }
        karusel+='<div class="card mb-2 karta" id="' + offer[0] + '">';
        karusel+=' <img class="card-img-top oferta" src="'+ offer[3] + '" alt="Foto oferta">';
        karusel+='<div class="card-body permbajtja">';
        karusel+='<h4 class="card-title">' + offer[1] + '!</h4>';
        karusel+='<p class="card-text">' + offer[2] + '</p>';
        karusel+='<a class="btn buton-karte">Përfito!</a>';
        karusel+='</div>';
        karusel+='</div>';
        karusel+='</div>';
        if(i%3==2){
          karusel+='</div>';
          karusel+='</div>';
        }
      i++;
    }
    
  }

  // fut brenda mbajtesit tgjitha tdhenat qe kemi te karusel
  $('#mbajtesi').html(karusel);
                  
}
})

          