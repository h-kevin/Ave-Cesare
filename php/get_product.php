<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['prod_id'])) {

        $query = "SELECT name, price, image FROM Product WHERE id=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('s', $_POST["prod_id"]);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_row();

        
        if($result->num_rows > 0){
            
            $responseObj = new stdClass();
            $responseObj->name = $row[0];
            $responseObj->price = $row[1];
            $responseObj->img = $row[2];
            
            echo json_encode($responseObj);

        } else {
            header('HTTP/1.1 404 Not Found');
            echo 'Produkti nuk u gjet. Mund te jete fshire nga menuja';
        }

    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }
?>