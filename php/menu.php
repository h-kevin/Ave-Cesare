<!-- Menu page -->

<?php

    require_once('db_connect.php');

    //Get all products from db display in a card deck
    $query = "SELECT * FROM Product";

    if(isset($_POST["cat_id"])) { 
        $query .= " WHERE cat_id='" . $_POST["cat_id"] . "'";
    }

    $stmt_prod = $conn->prepare($query);
    $stmt_prod->execute();
    $res_prod = $stmt_prod->get_result();

    echo '<div class="row justify-content-center">';
    
    while ($row = mysqli_fetch_array($res_prod)) {
        echo '<div class="card col-lg-3 col-md-4 col-sm-12 ml-2 mr-2 mb-3 px-0">';
        echo '<img src="' . $row['image'] . '" class="card-img-top h-50">';
        echo '<div class="card-body text-center d-flex flex-column">';
        echo '<h5 class="card-title">' . $row['name'] . '</h5>';
        echo '<p class="card-text">' . $row['description']. '</p>';
        echo '<p class="card-text"><small class="text-muted">';

            //for each product get all the ingredients
            $stmt_ing = $conn->prepare("SELECT name FROM (Ingredient INNER JOIN Prod_Ingredient ON Prod_Ingredient.ing_id=Ingredient.id) WHERE Prod_Ingredient.prod_id=?");
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
        echo '<button type="button" class="btn btn-success mt-auto">' . $row['price'] . ' Leke</button>';
        echo '</div>';
        echo '</div>';
    }

    echo '</div>';
    
?>