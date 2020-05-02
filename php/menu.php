<!-- Menu page -->

<?php

    require_once('db_connect.php');

    //Get all products from db display in a card deck
    $stmt_prod = $conn->prepare("SELECT * FROM Product");
    $stmt_prod->execute();
    $res_prod = $stmt_prod->get_result();

    echo '<div class="card-deck">';
    
    while ($row = mysqli_fetch_array($res_prod)) {
        echo '<div class="card">';
        echo '<img src="' . $row['image'] . '" height="300px" width="300px" object-fit="cover" class="card-img-top">';
        echo '<div class="card-body">';
        echo '<h5 class="card-title">' . $row['name'] . '</h5>';
        echo '<p class="card-text">' . $row['description']. '</p>';
        echo '<p class="card-text"><small class="text-muted">';

            //for each product get all the ingredients
            $stmt_ing = $conn->prepare("SELECT name FROM (Ingredient INNER JOIN Prod_ingredient ON Prod_ingredient.ing_id=Ingredient.id) WHERE Prod_Ingredient.prod_id=?");
            $stmt_ing->bind_param('i', $row['id']);
            $stmt_ing->execute();
            $res_ing = $stmt_ing->get_result();

            $ing_list = '';
            while ($ing = mysqli_fetch_array($res_ing)) {
                $ing_list .= $ing['name'];
                $ing_list .= ', ';
            }
            echo substr($ing_list ,0,-2);

        echo '</small></p>';
        echo '<button type="button" class="btn btn-success">' . $row['price'] . 'Lek</button>';
        echo '</div>';
        echo '</div>';
    }

    echo '</div>';
    
?>