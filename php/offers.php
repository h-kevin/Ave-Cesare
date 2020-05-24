<!-- Faqja e ofertave -->

<?php

    require_once('db_connect.php');

    $query = "SELECT * FROM Offer";  
    $result = mysqli_query($conn, $query); 

    echo '<div class="row justify-content-center">';

    while ($row = mysqli_fetch_array($result)) {
        echo '<div class="card col-lg-3 col-md-4 col-sm-12 ml-3 mb-3 px-0 mr-3">';
        echo '<img class="card-img-top h-50 oferta" src="' . $row['image'] . '" alt="Foto oferta">';
        echo '<div class="card-body permbajtja">';
        echo '<h4 class="card-title">' . $row['name'] . '</h4>';
        echo '<p class="card-text mb-1">' . $row['description'] . '<br>';

        echo 'Kurse: ' . $row['discount'] . ' Lek';
        echo '</p>';
        echo '<a class="btn buton-karte">Përfito!</a>';
        echo '</div>';
        echo '</div>';
    }
    echo '</div>';
?>