<?php

/**
 * php panel to delete offers
 */

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    if($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($_SESSION['admin'] == 1) {

            // check foreign keys and remove them
            $stmt = $conn->prepare("DELETE FROM `Prod_Offer` WHERE offer_id=?");
            $stmt->bind_param("d", $_POST['offer_id']);
            $stmt->execute();
            
            $stmt = $conn->prepare("DELETE FROM `Offer` WHERE id=?");
            $stmt->bind_param("d", $_POST["offer_id"]);

            if($stmt->execute() && $stmt->affected_rows != 0){
                echo 'Oferta u fshi me sukses!';
            } else{
                header('HTTP/1.1 500 Internal Server Error');
                exit("Fshirja e ofertes deshtoi!");
            }
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }

?>