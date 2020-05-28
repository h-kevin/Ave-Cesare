<?php

/**
 * php offer orders page
 */
    require_once('db_connect.php');


    // check if session is active
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
  
    
    // check request method
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["offer_id"])) {
        $order_id;
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
            $stmt->close();
            
            $stmt = $conn->prepare('DELETE FROM Prod_Order WHERE order_num = ?');
            $stmt->bind_param('d', $order_id);
            $stmt->execute();

            $stmt->close();

            //fetch products from offer
            $stmt = $conn->prepare('SELECT id FROM 
                            Product INNER JOIN Prod_Offer ON Prod_Offer.prod_id=Product.id 
                            WHERE Prod_Offer.offer_id=?');
            $stmt->bind_param('d', $_POST['offer_id']);

            
            $stmt->execute();
            $prod_arr = $stmt->get_result();
            $stmt->close();
            
            while ($row = $prod_arr->fetch_array())
            {
                foreach ($row as $prod_id)
                {
                    $stmt = $conn->prepare('INSERT INTO Prod_Order VALUES (?, ?, 1)');
                    $stmt->bind_param('dd', $prod_id, $order_id);
                    $stmt->execute();
                    $stmt->close();
                }
            }
            $conn->close();

            echo 'success';
            
        } else {
            echo 'Nuk mund te shtoni produkte ne shporte pa hyre ne llogari! Kycuni dhe provoni serish.';
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }

?>