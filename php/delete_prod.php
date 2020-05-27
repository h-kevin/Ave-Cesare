<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["prod_id"])){

        $stmt = $conn->prepare("DELETE FROM `Prod_Ingredient` WHERE prod_id = " . $_POST["prod_id"]);
        $stmt->execute();
        $stmt = $conn->prepare("DELETE FROM Product WHERE id=" . $_POST["prod_id"]);
        $result = $stmt->execute();

        if($result){
        echo 'Produkti u fshi me sukses!';
        }
        else{
            header('HTTP/1.1 500 Internal Server Error');
            exit("Problem ne fshirjen e produktit!");
        }

    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }

?>