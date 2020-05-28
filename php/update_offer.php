<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["offer_id"])) {
        // check if user is authorized
        if ($_SESSION['admin'] == 1) {

            $offer_id = $_POST["offer_id"];
            $name = $_POST["name"];
            $discount = $_POST["discount"];
            $start_date = $_POST["start_date"];
            $end_date = $_POST["end_date"];
            $description = $_POST["description"];

            //get offer by id
            $stmt = $conn->prepare("SELECT * FROM Offer WHERE id = ?");
            $stmt->bind_param('s', $offer_id);
            $stmt->execute();
            $stmt->store_result();
            
            //if found
            if ($stmt->num_rows > 0) {
                //check for changed input fields, update where there are changes
                if($name != ""){

                    $stmt = $conn->prepare("UPDATE Offer SET name = ? where id = ?");
                    $stmt->bind_param('sd', $name, $offer_id);
                    $result = $stmt->execute();
                    if(!$result){
                        header('HTTP/1.1 500 Internal Server Error');
                        exit("Problem ne modifikimin e ofertes! Modifikimi i emrit deshtoi!");
                    }
                }

                if($discount != ""){
                    
                    $stmt = $conn->prepare("UPDATE Offer SET discount = ? where id = ?");
                    $stmt->bind_param('dd', $discount, $offer_id);
                    $result = $stmt->execute();
                    if(!$result){
                        header('HTTP/1.1 500 Internal Server Error');
                        exit("Problem ne modifikimin e ofertes! Modifikimi i uljes deshtoi!");
                    }
                }

                if($start_date != ""){

                    $stmt = $conn->prepare("UPDATE Offer SET start_date = ? where id = ?");
                    $stmt->bind_param('sd', $start_date, $offer_id);
                    $result = $stmt->execute();
                    if(!$result){
                        header('HTTP/1.1 500 Internal Server Error');
                        exit("Problem ne modifikimin e produktit! Modifikimi i dates fillestare deshtoi!");
                    }
                }

                if($end_date != ""){

                    $stmt = $conn->prepare("UPDATE Offer SET end_date = ? where id = ?");
                    $stmt->bind_param('sd', $end_date, $offer_id);
                    $result = $stmt->execute();
                    if(!$result){
                        header('HTTP/1.1 500 Internal Server Error');
                        exit("Problem ne modifikimin e produktit! Modifikimi i dates perfundoi deshtoi!");
                    }
                }

                if($description != ""){

                    $stmt = $conn->prepare("UPDATE Offer SET description = ? where id = ?");
                    $stmt->bind_param('sd', $description, $offer_id);
                    $result = $stmt->execute();
                    if(!$result){
                        header('HTTP/1.1 500 Internal Server Error');
                        exit("Problem ne modifikimin e produktit! Modifikimi i dates fillestare deshtoi!");
                    }
                }

                echo 'Oferta u modifikua me sukses!';

            } else {
                header('HTTP/1.1 404 Not Found');
                echo 'Kjo oferte nuk ekziston. Mund te jete fshire!';
            }
        }
    }
    else{
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }

?>