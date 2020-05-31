<?php

/**
 * PHP file signup
 */
    require_once('db_connect.php');
    require_once('../vendors/PHPMailer/PHPMailerAutoload.php');
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
        $name = $_POST['name'];
        $surname = $_POST['surname'];
        $email = $_POST['email'];
        $pass1 = $_POST['pass1'];

        //prepare hashed password
        $vkey = md5(time() . $email);
        $password = password_hash($pass1, PASSWORD_DEFAULT);
    
        //check if user already exists using email
        $stmt = $conn->prepare("SELECT * FROM User WHERE email = ?");
        $stmt->bind_param('s', $email);
    
        $stmt->execute();
        $stmt->store_result();
    
        if ($stmt->num_rows > 0) {
            $stmt->close();
            $conn->close();
            exit ("Kjo adrese i perket nje perdoruesi tjeter.");
        }
    
        //if user doesnt exist, insert him
        $stmt = $conn->prepare("INSERT INTO User 
            SET email = ?, name = ?, surname = ?, password = ?, vkey = ?");
        $stmt->bind_param('sssss', $email, $name, $surname, $password, $vkey);
        
        $result = $stmt->execute();
    
        //send a verification email
        if ($result) {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'avecesarepizza@gmail.com';
            $mail->Password = 'hvawoxvhsbwfeoju';
            $mail->SMTPSecure = 'tls';
            $mail->Port = '587';
            $mail->setFrom('no-reply@avecesare.com', 'Ave Cesare');
            $mail->AddAddress($email);
            $mail->isHTML(true);
            $mail->Subject = 'Email verification';
            $mail->Body = "<a href='https://ave-cesare.herokuapp.com/php/verify.php?vkey=$vkey'>
                Klikoni ketu per te verifikuar llogarine</a>";

            try {
                $mail->Send();
                echo "Faleminderit per regjistrimin.
                    Kontrolloni e-maili tuaj per verifikimin e llogarise.";
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
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
}

?>