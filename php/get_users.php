<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
        $query = "SELECT * FROM User";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();

        $responseArray = array ();

        foreach($result as $row){

            $responseObj = new stdClass();
            $prof_img = '';
            $admin = false;

            if($row["prof_img"] != ''){
                $prof_img = $row["prof_img"];
            }

            if($row["admin"] == 1){
                $admin = true;
            }

            $responseObj->id = $row["id"];
            $responseObj->prof_img = $prof_img;
            $responseObj->name = $row["name"];
            $responseObj->surname = $row["surname"];
            $responseObj->admin = $admin;

            array_push($responseArray, $responseObj);
        }

        echo json_encode($responseArray);

    } else {
            header('HTTP/1.1 400 Bad Request');
            exit("Kerkesa u refuzua!");
    }


?>
   