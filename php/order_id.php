<?php
    require_once('db_connect.php');


    // check if session is active
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
  
    // check request method
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["offer_id"])) {

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
            $stmt = $conn->prepare('SELECT id FROM 
                            (Product INNER JOIN Prod_Offer ON Prod_Offer.prod_id=Product.id) 
                            WHERE Prod_Offer.offer_id=?');
            $stmt->bind_param('d', $_POST['offer_id']);

            $stmt->execute();
            $result = $stmt->get_result();
            
            foreach($result as $row) {

                //check if user has already ordered the same product in same order
                $stmt = $conn->prepare("SELECT quantity FROM `Prod_Order` WHERE order_num = ? AND prod_id = ?");
                $stmt->bind_param('ds', $order_id, $row['id']);

                $stmt->execute();
                $response = $stmt->get_result();

                if (!$response) {
                    $stmt = $conn->prepare("INSERT INTO `Prod_Order` (`prod_id`, `order_num`, `quantity`) VALUES (?, ?, 1)");
                    $stmt->bind_param('ds', $row['id'], $order_id);
                    $result = $stmt->execute();

                    if ($result) {

                    }
                    else {
                        header('HTTP/1.1 500 Internal Server Error');
                        exit("Problem ne server! Oferta nuk u shtua dot ne shporte! Provoni serish"); 
                    }
                }
                
            }
            echo 'Oferta u shtua me sukses.';
            
        } else {
            echo 'Nuk mund te shtoni produkte ne shporte pa hyre ne llogari! <a href="../pages/login.html">Kycuni dhe provoni serish.</a>';
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }

?>