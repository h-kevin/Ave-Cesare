<!-- Login page -->

<?php

    require_once('db_connect.php');

    if (isset($_POST['register']) && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $email = $_POST['email'];
        $pass = $_POST['pass'];
    
        $stmt = $conn->prepare("SELECT id, name, surname, password, verified FROM user WHERE email = ?");
        $stmt->bind_param('s', $email);
    
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id, $name, $surname, $hash, $verified);
        $stmt->fetch();
    
        if (password_verify($pass, $hash)) { // if password matches
    
            if ($verified == 1) { 
                echo "<h3>Llogaria juaj u kyc me sukses!</h3>";
                echo "<p>Emri: $name $surname, E-mail: $email, Password: $pass</p>";
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