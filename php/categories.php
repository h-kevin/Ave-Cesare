<!-- Get Categories -->

<?php

    require_once('db_connect.php');

    $stmt = $conn->prepare("SELECT * FROM P_category");
    $stmt->execute();
    $result = $stmt->get_result();
    
    while ($row = mysqli_fetch_array($result)) {
        echo '<button type="button" class="btn btn-primary btn-block">' . $row['name'] . '</button>';
    }
    
?>