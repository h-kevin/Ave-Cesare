<?php
    require_once('db_connect.php');

    if (isset($_POST['search'])) {
        $search = $_POST['search'];
        $search = '%' . $search . '%';

            $stmt = $conn->prepare("SELECT * FROM Product WHERE name LIKE ?");
            $stmt->bind_param('s', $search);
            $stmt->execute();
            $res = $stmt->get_result();

            echo '<div class="row justify-content-center">';
    
            foreach($res as $row) {
                echo '<div class="card col-lg-3 col-md-4 col-sm-12 ml-3 mb-3">';
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
                echo '<button type="button" class="btn btn-success mt-auto">' . $row['price'] . 'Lek</button>';
                echo '</div>';
                echo '</div>';
            }

            echo '</div>';
    }
?>