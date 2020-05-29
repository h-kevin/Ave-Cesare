<?php

/**
 * PHP file to delete user from user panel
 */

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["user_id"])){

        //data visible only to admins
        if ($_SESSION['admin'] == 1) {

            //select user to check data
            $stmt = $conn->prepare("SELECT admin FROM `User` WHERE id=?");
            $stmt->bind_param("d", $_POST["user_id"]);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($admin);
            $stmt->fetch();
            
            //if user exists
            if($stmt->affected_rows != 0){
                //if user is admin, you cant delete him
                if($admin == 1){
                    exit('Nuk mund te fshini nje perdorues admin!');
                }

                //if not, continue
                else{
                    // check foreign keys and remove them
                    $stmt = $conn->prepare("DELETE FROM `Prod_Order`
                    WHERE order_num IN (SELECT o.number FROM `Order` o WHERE o.usr_id = ?)");
                    $stmt->bind_param("d", $_POST['user_id']);
                    if (!$stmt->execute())
                        exit ("Problem ne server..");

                    $stmt = $conn->prepare("DELETE FROM `Order` WHERE usr_id = ?");
                    $stmt->bind_param("d", $_POST['user_id']);
                    $stmt->execute();
                    if (!$stmt->execute())
                        exit ("Problem ne server..");

                    $stmt = $conn->prepare("DELETE FROM `Prod_Offer`
                    WHERE offer_id IN (SELECT o.id FROM `Offer` o WHERE o.adm_id = ?)");
                    $stmt->bind_param("d", $_POST['user_id']);
                    $stmt->execute();
                    if (!$stmt->execute())
                        exit ("Problem ne server..");

                    $stmt = $conn->prepare("DELETE FROM `Offer` WHERE adm_id = ?");
                    $stmt->bind_param("d", $_POST['user_id']);
                    $stmt->execute();
                    if (!$stmt->execute())
                        exit ("Problem ne server..");

                    $stmt = $conn->prepare("DELETE FROM `Prod_Ingredient`
                    WHERE prod_id IN (SELECT p.id FROM `Product` p WHERE p.adm_id = ?)");
                    $stmt->bind_param("d", $_POST['user_id']);
                    $stmt->execute();
                    if (!$stmt->execute())
                        exit ("Problem ne server..");

                    $stmt = $conn->prepare("DELETE FROM `Product` WHERE adm_id = ?");
                    $stmt->bind_param("d", $_POST['user_id']);
                    $stmt->execute();
                    if (!$stmt->execute())
                        exit ("Problem ne server..");

                    $stmt = $conn->prepare("DELETE FROM `User` WHERE id=?");
                    $stmt->bind_param("d", $_POST['user_id']);

                    if($stmt->execute() && $stmt->affected_rows != 0){
                        echo 'Perdoruesi u fshi me sukses!';
                    }
                    else {
                        header('HTTP/1.1 500 Internal Server Error');
                        exit('Nuk mundem te fshinim perdoruesin..');
                    }
                }
            } else {
                header('HTTP/1.1 404 Not Found');
                exit("Perdoruesi nuk u gjet!");
            }
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }

?>