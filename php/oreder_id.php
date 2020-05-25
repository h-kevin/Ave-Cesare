<?php
    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
      }

    $stmt = $conn->prepare('SELECT name FROM 
                            (Product INNER JOIN Prod_Offer ON Prod_Offer.prod_id=Product.id) 
                            WHERE Prod_Offer.offer_id=?');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // check if user has a session id
    if(isset($_SESSION['id'])){
        $stmt = $conn->prepare("SELECT number FROM `Order` WHERE usr_id = ? AND status = 'new'");
        $stmt->bind_param('d', $_SESSION['id']);

        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_row();
        
        if(isset($row[0])) {
            echo 'uii paske porosit re';
        }
        else {
            $stmt = $conn->prepare("INSERT INTO `Order`(`usr_id`) VALUES (?)");
            $stmt->bind_param('d', $_SESSION['id']);
            $stmt->execute();
            if($stmt) {

                $order_id = $stmt->insert_id;
                echo $order_id;
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                exit("Problem ne server! Nuk u krijua nje porosi e re per ju!");
            }

        }
        // array to save info
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Nuk mund te shtoni produkte ne shporte pa hyre ne llogari! Kycuni dhe provoni serish.");
    }
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}

?>