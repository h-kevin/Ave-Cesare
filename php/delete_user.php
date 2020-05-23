<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["user_id"])){

        $stmt = $conn->prepare("SELECT admin FROM User WHERE id=" . $_POST["user_id"]);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_row();
        
        
        if($result->num_rows > 0){
            if($row[0] == 1){
                echo 'Nuk mund te fshini nje perdorues admin!';
            }

            else{

                $stmt = $conn->prepare("DELETE FROM User WHERE id=" . $_POST["user_id"]);
                $result = $stmt->execute();

                if($result){
                echo 'Perdoruesi u fshi me sukses!';
                }
                else{
                    header('HTTP/1.1 404 Not Found');
                    echo 'Perdoruesi nuk u gjet. Mund te jete fshire me pare';
                }
            }
        } else {
            echo 'Ky perdorues nuk u gjet. Mund te jete duke u modifikuar ne databaze ose eshte fshire me pare';
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }

?>