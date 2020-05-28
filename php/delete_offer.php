<?php

/**
 * php panel to delete offers
 */

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["offer_id"])){
        if ($_SESSION['admin'] == 1) {

            $stmt = $conn->prepare("SELECT id FROM Offer WHERE id=" . $_POST["offer_id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_row();
            
            
            if($result->num_rows > 0){

                    $stmt = $conn->prepare("DELETE FROM Offer WHERE id=" . $_POST["offer_id"]);
                    $result = $stmt->execute();

                    if($result){
                    echo 'Oferta u fshi me sukses!';
                    }
                    else{
                        header('HTTP/1.1 404 Not Found');
                        echo 'Oferta nuk u gjet. Mund te jete fshire me pare';
                    }
            } else {
                echo 'Kjo oferte nuk u gjet. Mund te jete duke u modifikuar ne databaze ose eshte fshire me pare';
            }
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }

?>