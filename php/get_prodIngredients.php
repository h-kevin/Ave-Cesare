<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
        $query = "SELECT * FROM Ingredient";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();

        $res = '';
        foreach($result as $row){
            $res .= '<div class="form-check form-check-inline">';
            $res .= '<input class="form-check-input" type="checkbox" id="inlineCheckbox' . $row["id"] . '" value="' . $row["id"] . '">';
            $res .= '<label class="form-check-label" for="inlineCheckbox' . $row["id"] . '">' . $row["name"] . '</label>';
            $res .= '</div>';
        }
        echo $res;
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
}



?>