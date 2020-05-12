<?php

    require_once('db_connect.php');
    require_once('../vendors/PHPMailer/PHPMailerAutoload.php');

    
        $name = $_POST['name'];
        $surname = $_POST['surname'];
        $email = $_POST['email'];
        $pass1 = $_POST['pass1'];

        if($pass1 != $pass2){
            exit("Fjalekalimet nuk perputhen. Kontrolloni dhe provoni serish.");
        }

        $vkey = md5(time() . $email);
        $password = password_hash($pass1, PASSWORD_DEFAULT);
    
        $stmt = $conn->prepare("SELECT * FROM User WHERE email = ?");
        $stmt->bind_param('s', $email);
    
        $stmt->execute();
        $stmt->store_result();
    
        if ($stmt->num_rows > 0) {
            $stmt->close();
            $conn->close();
            echo "Kjo adrese i perket nje perdoruesi tjeter.";
        }
    
        $stmt = $conn->prepare("INSERT INTO User 
            SET email = ?, name = ?, surname = ?, password = ?, vkey = ?");
        $stmt->bind_param('sssss', $email, $name, $surname, $password, $vkey);
        
        $result = $stmt->execute();
    
        if ($result) {
            $mail = new PHPMailer(true);
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
                echo "Faleminderit per regjistrimin.
                    Kontrolloni E-mail per verifikimin e llogarise.";
                $stmt->close();
                $conn->close();
                exit(0);
            } catch (phpmailerException $e) {
                echo "E-mail nuk u dergua me sukses. Ju lutem provoni me vone." . $e->errorMessage();
                $stmt->close();
                $conn->close();
                exit(1);
            }
        } else {
            echo $conn->error;
            $stmt->close();
            $conn->close();
            exit(1);
        }

?>