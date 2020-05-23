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
  // deklarimi i func ne ajax
  
  $.ajax({
    type: 'POST',
    url:  '../php/fetch_offer_home.php',
    dataType: "json",
    success: function(response) {
       console.log(response);
       formCards(response);
     },
     error: function (xhr, ajaxOptions, thrownError) {
       $.notify(xhr.responseText, "error");
   }
 });
 function formCards(response){
  var i, karusel='';
  for (i=0;i<response.length;i++){
    console.log(i);
    if(i%3==0){
      console.log('un plotpjestohem me tre');
      if(i==0){
        console.log('un jam i pari');
        karusel+='<div class="carousel-item active">';
      }
      else {
        console.log('nuk jam')
        karusel+='<div class="carousel-item">';
      }
      karusel+='<div class="row">'; 
      karusel+='<div class="col-md-4">';
    }  
    else {
      karusel+='<div class="col-md-4 clearfix d-none d-md-block">';
    }
    karusel+='<div class="card mb-2 karta">';
    karusel+=' <img class="card-img-top oferta" src="' + response[i].foto + '" alt="Foto oferta">';
    karusel+='<div class="card-body permbajtja">';
    karusel+='<h4 class="card-title">' + response[i].emri + '!</h4>';
    karusel+='<p class="card-text">' + response[i].pershkrimi + '</p>';
    karusel+='<a class="btn buton-karte">Përfito!</a>';
    karusel+='</div>';
    karusel+='</div>';
    karusel+='</div>';
    if(i%3==2){
      karusel+='</div>';
      karusel+='</div>';
    }  
  }
  // karusel+='</div>';
  // karusel+='</div>';

  console.log(karusel); 
  // fut brenda mbajtesit tgjitha tdhenat qe kemi te karusel
  $('#mbajtesi').html(karusel);
                  
}
})

// func shuffle cdo 30min
var today=new Date();
if(today.getMinutes()==0 || today.getMinutes()==30){
response = shuffle(response);
}
          