<?php

/**
 * php get offers page
 */

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($_SESSION['admin'] == 1) {
        
            $query = "SELECT * FROM Offer";

            $stmt = $conn->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result();

            $responseArray = array ();

            foreach($result as $row){

                $responseObj = new stdClass();
                $image = '';

                if($row["image"] != ''){
                    $image = $row["image"];
                }

                $responseObj->id = $row["id"];
                $responseObj->image = $image;
                $responseObj->name = $row["name"];
                $responseObj->discount = $row["discount"];
                $responseObj->description = $row["description"];

                array_push($responseArray, $responseObj);
            }

            echo json_encode($responseArray);
        }

    } else {
            header('HTTP/1.1 400 Bad Request');
            exit("Kerkesa u refuzua!");
    }


?>
   