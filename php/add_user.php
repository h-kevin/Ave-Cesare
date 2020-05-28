<?php

/**
 * PHP file to add user from user panel
 */
    require_once('db_connect.php');

    // check if session is active
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["name"]) && isset($_POST["surname"]) && isset($_POST["email"]) && isset($_POST["pass"])) {
        //data visible only to admins
        if ($_SESSION['admin'] == 1) {
            $name = $_POST["name"];
            $surname = $_POST["surname"];
            $email = $_POST["email"];
            $pass = $_POST["pass"];

            //select user by email
            $stmt = $conn->prepare("SELECT * FROM User WHERE email = ?");
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $stmt->store_result();
            
            //if it already exists, stop
            if ($stmt->num_rows > 0) {
                echo "Kjo adrese i perket nje perdoruesi tjeter.";
            }

            //if not, continue adding to db
            else{
                $vkey = md5(time() . $email);
                $password = password_hash($pass, PASSWORD_DEFAULT);

                $stmt = $conn->prepare("INSERT INTO User 
                    SET email = ?, name = ?, surname = ?, password = ?, vkey = ?, verified = 1");
                $stmt->bind_param('sssss', $email, $name, $surname, $password, $vkey);
                
                $result = $stmt->execute();
            
                if ($result) {
                    echo 'Perdoruesi u shtua me sukses!';
                }
            }
        }
    }
?>