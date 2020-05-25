<?php

/**
 * fetch order info for user with ip in the active session
 */

require_once('db_connect.php');

// check if session is active
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

// check request method
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["prod_id"]) && isset($_POST["sasi"])) {

    // check if user has a session id
    if(isset($_SESSION['id'])){
        $stmt = $conn->prepare("SELECT number FROM `Order` WHERE usr_id = ? AND status = 'new'");
        $stmt->bind_param('d', $_SESSION['id']);

        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_row();
        
        //if yes, get the current order id
        if(isset($row[0])) {
            $order_id = $row[0];
        }
        //if not, create new order
        else {
            $stmt = $conn->prepare("INSERT INTO `Order`(`usr_id`) VALUES (?)");
            $stmt->bind_param('d', $_SESSION['id']);
            $stmt->execute();
            if($result) {
                $order_id = $stmt->insert_id;
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                exit("Problem ne server! Nuk u krijua nje porosi e re per ju!");
            }

        }

        //check if user has already ordered the same product in same order
        $stmt = $conn->prepare("SELECT quantity FROM `Prod_Order` WHERE order_num = ? AND prod_id = ?");
        $stmt->bind_param('ds', $order_id, $_POST['prod_id']);

        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_row();

        //if yes and ordering again, get the current quantity in order and add to it
        if(isset($row[0])) {
            $quantity = $_POST['sasi'] + $row[0];

            $stmt = $conn->prepare("UPDATE `Prod_Order` SET quantity = ? WHERE order_num = ? AND prod_id = ?");
            $stmt->bind_param('dds', $quantity, $order_id, $_POST['prod_id']);
            $result = $stmt->execute();

            if($result) {
                echo 'Produkti u shtua ne shporte!';
            } else {
                    header('HTTP/1.1 500 Internal Server Error');
                    exit("Problem ne server! Produkti nuk u shtua dot ne shporte! Provoni serish");                
            }

        //if not, add new product to order
        } else {
            $quantity = $_POST['sasi'];

            $stmt = $conn->prepare("INSERT INTO `Prod_Order` (`prod_id`, `order_num`, `quantity`) VALUES (?, ?, ?)");
            $stmt->bind_param('dss', $_POST['prod_id'], $order_id, $quantity);
            $result = $stmt->execute();

            if($result) {
                echo 'Produkti u shtua ne shporte!';
            } else {
                    header('HTTP/1.1 500 Internal Server Error');
                    exit("Problem ne server! Produkti nuk u shtua dot ne shporte! Provoni serish");                
            }
        }
        
    } else {
        echo 'Nuk mund te shtoni produkte ne shporte pa hyre ne llogari! <a href="../pages/login.html">Kycuni dhe provoni serish.</a>';
    }
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u refuzua!");
}

?>