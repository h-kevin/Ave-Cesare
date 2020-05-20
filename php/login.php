<?php

    session_start();

    require_once('db_connect.php');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $email = $_POST['email'];
        $pass = $_POST['password'];
    
        $stmt = $conn->prepare("SELECT id, name, surname, password, verified, prof_img, mobile, admin
            FROM `User` WHERE email = ?");
        $stmt->bind_param('s', $email);
    
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id, $name, $surname, $hash, $verified, $prof_img, $mobile, $admin);
        $stmt->fetch();
    
        if (password_verify($pass, $hash)) { // if password matches
    
            if ($verified == 1) { 
                $_SESSION['id'] = $id;
                $_SESSION['email'] = $email;
                $_SESSION['name'] = $name;
                $_SESSION['surname'] = $surname;
                $_SESSION['password'] = $pass;
                $_SESSION['verified'] = $verified;
                $_SESSION['prof_img'] = $prof_img;
                $_SESSION['admin'] = $admin;

                if ($mobile != null)
                    $_SESSION['mobile'] = $mobile;
                else
                    $_SESSION['mobile'] = '';

                $stmt->close();
                $conn->close();
            } else {
                echo "Ju lutem kontrolloni emailin per te bere verifikimin.";

                $stmt->close();
                $conn->close();
            }
        } else {
            echo "Email ose password i gabuar";

            $stmt->close();
            $conn->close();
        }
    }

?>