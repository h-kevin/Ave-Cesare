<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
        $query = "SELECT * FROM Product";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();

        $responseArray = array ();

        foreach($result as $row){

            $responseObj = new stdClass();

            $responseObj->id = $row["id"];
            $responseObj->prof_img = $row["image"];
            $responseObj->name = $row["name"];
            $responseObj->price = $row["price"];
            
            $stmt = $conn->prepare("SELECT name FROM P_Category WHERE id=" . $row["cat_id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_row();

            $responseObj->cat = $row[0];

            array_push($responseArray, $responseObj);
        }

        echo json_encode($responseArray);

    } else {
            header('HTTP/1.1 400 Bad Request');
            exit("Kerkesa u refuzua!");
    }


?>