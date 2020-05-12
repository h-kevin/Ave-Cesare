<!-- Faqja e ofertave -->

<?php

    require_once('db_connect.php');

    $query = "SELECT * FROM Offer";  
    $result = mysqli_query($conn, $query); 

    echo '<div class="row justify-content-center">';

    while ($row = mysqli_fetch_array($result)) {
        echo '<div class="card col-lg-3 col-md-2 col-sm-12 ml-3 mb-3">';
        echo '<img src="../img/favicon.png" class="card-img-top h-50">';
        echo '<div class="card-body text-center d-flex flex-column">';
        echo '<h5 class="card-title">' . $row['start_date'] . '-' . $row['end_date'] . '</h5>';
        echo '<p class="card-text">' . $row['description']. '</p>';
        echo '<button type="button" class="btn btn-success mt-auto">' . $row['sale'] . ' Lek</button>';
        echo '</div>';
        echo '</div>';
    }
    echo '</div>';
?>