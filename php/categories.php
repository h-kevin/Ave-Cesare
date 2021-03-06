<?php

/**
 * PHP file to dynamically get menu categories
 */

    require_once('db_connect.php');

    $stmt = $conn->prepare("SELECT * FROM P_Category");
    $stmt->execute();
    $result = $stmt->get_result();
      
    echo '<div class="row justify-content-center" data-toggle="buttons">';

    while ($row = mysqli_fetch_array($result)) {
        echo '<button type="button" onclick="display('. $row['id'] .')" class="btn btn-danger button-md mr-2 mb-2 col-lg col-md-2 col-sm-2 col-5"> <img src="../img/favicon.png" height="50"> <br>' . $row['name'] . '</button>';
    }
    
    echo '</div>';
?>