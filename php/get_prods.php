<?php

/**
 * PHP file to populate product table for product panel
 */
    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        //data only visible to admins
        if ($_SESSION['admin'] == 1) {
        
            $query = "SELECT * FROM Product";

            $stmt = $conn->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result();

            $responseArray = array ();

            //for all rows found
            foreach($result as $row){
                //create an object for each row, save id, image, name and price of product
                $responseObj = new stdClass();

                $responseObj->id = $row["id"];
                $responseObj->prof_img = $row["image"];
                $responseObj->name = $row["name"];
                $responseObj->price = $row["price"];
                
                //get corresponding product category name from id in db to make category more readable
                $stmt = $conn->prepare("SELECT name FROM P_Category WHERE id=" . $row["cat_id"]);
                $stmt->execute();
                $result = $stmt->get_result();
                $row = $result->fetch_row();

                $responseObj->cat = $row[0];

                //add each object to results array
                array_push($responseArray, $responseObj);
            }
            //send array as json
            echo json_encode($responseArray);
        }

    } else {
            header('HTTP/1.1 400 Bad Request');
            exit("Kerkesa u refuzua!");
    }


?>