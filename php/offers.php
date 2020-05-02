<!-- Faqja e ofertave -->

<?php

    require_once('db_connect.php');

    $query = "SELECT * FROM Offer";  
    $result = mysqli_query($conn, $query); 

    //$stmt = "SELECT admin FROM User";
    //$res = mysqli_query($conn, $stmt);

    $i = 0;
    while ($row = mysqli_fetch_array($result)) {
        if ($i == 0 ) {
            echo '<div class="carousel-item active">';
            echo '<img class="d-block w-100" src="../img/favicon.png" alt="First slide">';
            echo '<div class="carousel-caption d-none d-md-block">';
            echo '<h3>' .  $row['sale'] . '</h3>';
            echo '<p>' . $row['description'] . '</p>';
            echo '<p>' . $row['start_date'] . '</p>';
            echo '<p>' . $row['end_date'] . '</p>';
            echo '<button type="button" class="btn btn-success">Porosit</button>';
            echo '</div>';
            echo '</div>';
        } else {
            echo '<div class="carousel-item">';
            echo '<img class="d-block w-100" src="../img/favicon.png" >';
            echo '<div class="carousel-caption d-none d-md-block">';
            echo '<h3>' .  $row['sale'] . '</h3>';
            echo '<p>' . $row['description'] . '</p>';
            echo '<p>' . $row['start_date'] . '</p>';
            echo '<p>' . $row['end_date'] . '</p>';
            echo '<button type="button" class="btn btn-success">Porosit</button>';
            echo '</div>';
            echo '</div>';
        }
        $i++;
    }
?>