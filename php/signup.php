<!-- Create an account -->

<?php

    require_once('db_connect.php');
    require_once('../vendors/PHPMailer/PHPMailerAutoload.php');

    if (isset($_POST['register']) && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $name = $_POST['name'];
        $surname = $_POST['surname'];
        $email = $_POST['email'];
        $pass1 = $_POST['pass1'];
        $pass2 = $_POST['pass2'];

        $vkey = md5(time() . $email);
        $password = password_hash($pass1, PASSWORD_DEFAULT);
    
        echo "<h3>Duke shtuar perdoruesin $name $surname ...</h3>";
    
        $stmt = $conn->prepare("SELECT * FROM User WHERE email = ?");
        $stmt->bind_param('s', $email);
    
        $stmt->execute();
        $stmt->store_result();
    
        if ($stmt->num_rows > 0) {
            echo "Kjo adrese i perket nje perdoruesi tjeter.";
            $stmt->close();
            $conn->close();
            exit(1);
        }
    
        $stmt = $conn->prepare("INSERT INTO User 
            SET email = ?, name = ?, surname = ?, password = ?, vkey = ?");
        $stmt->bind_param('sssss', $email, $name, $surname, $password, $vkey);
        
        $result = $stmt->execute();
    
        if ($result) {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->SMTPAuth = true;
            $mail->SMTPSecure = 'ssl';
            $mail->Host = 'smtp.gmail.com';
            $mail->Port = '465';
            $mail->isHTML(true);
            $mail->Username = 'avecesarepizza@gmail.com';
            $mail->Password = 'GST4DEm65X6a';
            $mail->setFrom('no-reply@avecesare.com', 'Ave Cesare');
            $mail->Subject = 'Email verification';
            $mail->Body = "<a href='http://localhost:3000/php/verify.php?vkey=$vkey'>
                    Klikoni ketu per te verifikuar llogarine</a>";
            $mail->AddAddress($email);

            try {
                $mail->Send();
                echo "<p>Faleminderit per regjistrimin.
                    Kontrolloni E-mail per verifikimin e llogarise.</p>";
                $stmt->close();
                $conn->close();
                exit(0);
            } catch (phpmailerException $e) {
                echo "<p>E-mail nuk u dergua me sukses. Ju lutem provoni me vone." . $e->errorMessage() . "</p>";
                $stmt->close();
                $conn->close();
                exit(1);
            }
        } else {
            echo "<p>$conn->error</p>";
            $stmt->close();
            $conn->close();
            exit(1);
        }
    } else {
        echo "<p>Kerkesa nuk u pranua.</p>";
        $conn->close();
        exit(1);
    }

?>