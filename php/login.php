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

        $tabletop = "<table>";
        $tablebottom = "</table>";
    
        if (password_verify($pass, $hash)) { // if password matches
    
            if ($verified == 1) { 
                $_SESSION['email'] = $email;
                $_SESSION['name'] = $name;
                $_SESSION['surname'] = $surname;
                $_SESSION['password'] = $pass;
                $_SESSION['verified'] = $verified;
                $_SESSION['prof_img'] = $prof_img;
                $_SESSION['admin'] = $admin;

                echo "<h2><img src='" . $_SESSION['prof_img'] . "' width='35px' height ='35px'>";
                echo "&ensp;Llogaria juaj u kyc me sukses!</h2>";
                echo $tabletop;
                echo "<tr><th>Emri</th><td>" . $_SESSION['name'] . "</td></tr>";
                echo "<tr><th>Mbiemri</th><td>" . $_SESSION['surname'] . "</td></tr>";
                echo "<tr><th>Admin</th><td>" . ($_SESSION['admin'] ? "Po" : "Jo") . "</td></tr>";
                echo $tablebottom;

                $stmt->close();
                $conn->close();
                exit(0);
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