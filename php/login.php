<!-- Login page -->

<?php

    session_start();

    require_once('db_connect.php');

    if (isset($_POST['login']) && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $email = $_POST['email'];
        $pass = $_POST['pass'];
    
        $stmt = $conn->prepare("SELECT id, name, surname, password, verified, prof_img, admin
            FROM `User` WHERE email = ?");
        $stmt->bind_param('s', $email);
    
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id, $name, $surname, $hash, $verified, $prof_img, $admin);
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

                $stmt->close();
                $conn->close();
                header('Location: ../pages/profile.html');
            } else {
                echo "<p>Ju lutem kontrolloni emailin per te bere verifikimin. </p>";

                $stmt->close();
                $conn->close();
                exit(1);
            }
        } else {
            echo "<p>Email ose password i gabuar</p>";

            $stmt->close();
            $conn->close();
            exit(1);
        }
    }

?>