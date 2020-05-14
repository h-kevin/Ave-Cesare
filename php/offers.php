<!-- Faqja e ofertave -->

<?php

    require_once('db_connect.php');

    $query = "SELECT * FROM Offer";  
    $result = mysqli_query($conn, $query); 

    echo '<div class="row justify-content-center">';

    while ($row = mysqli_fetch_array($result)) {
        echo '<div class="card col-lg-3 col-md-4 col-sm-12 ml-3 mb-3">';
        echo '<img src="../img/favicon.png" class="card-img-top h-50 img-fluid">';
        echo '<div class="card-body text-center d-flex flex-column">';
        echo '<h5 class="card-title">SUPER OFERTE!</h5>';
        echo '<p class="card-text">' . date('d-m-Y', strtotime($row['start_date'])) . ' - ' . date('d-m-Y', strtotime($row['end_date'])) . 
            '<br>'. $row['description']. '<br>';

            $stmt_ing = $conn->prepare("SELECT name FROM (Product INNER JOIN Prod_Offer ON Prod_Offer.prod_id=Product.id)
                         WHERE Prod_Offer.offer_id=?");
            $stmt_ing->bind_param('i', $row['id']);
            $stmt_ing->execute();
            $res_ing = $stmt_ing->get_result();

            $ing_list = '';
            while ($ing = mysqli_fetch_array($res_ing)) {
                $ing_list .= $ing['name'];
                $ing_list .= ', ';
            }
            echo substr($ing_list ,0,-2);
        //echo '<p>Ulje: ' . $row['sale'] . ' Lek</p>';
        echo '</p>';
        echo '<button type="button" class="btn btn-success mt-auto">Perfito</button>';
        echo '</div>';
        echo '</div>';
    }
    echo '</div>';
?>