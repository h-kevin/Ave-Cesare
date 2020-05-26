<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
        $query = "SELECT * FROM P_Category";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();

        $res = '';
        foreach($result as $row){
            $res = $res . '<option value="' . $row['id'] . '">' . $row['name'] . '</option>';
        }
        echo $res;
    }


?>