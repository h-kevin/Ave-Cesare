<?php
/**
 * php add ofers page
 */

    require_once('db_connect.php');
    require_once('uploadimg.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    if($_SERVER['REQUEST_METHOD'] == 'POST' ){
        if ($_SESSION['admin'] == 1) {

            $name = $_POST["name"];
            $discount = $_POST["discount"];
            $start_date = $_POST["start_date"];
            $end_date = $_POST["end_date"];
            $description = $_POST["description"];
            $adm_id = $_SESSION["id"];
            $url = uploadImage('offerimg');

            if ($url != '') {
                $stmt = $conn->prepare("INSERT INTO `Offer`
                        SET name = ?, discount = ?, start_date = ?, end_date = ?, description = ?, image = ?, adm_id = ?");
                $stmt->bind_param('sdssssd', $name, $discount, $start_date, $end_date, $description, $url, $adm_id);
                
                $result = $stmt->execute();
            
                if ($result) {
                    echo 'Oferta u shtua me sukses!';
                }
            }
            else {
                echo 'Problem ne shtimin e ofertes.';
            }
        }
    }
    else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }

?>