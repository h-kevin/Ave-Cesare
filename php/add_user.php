<?php

    require_once('db_connect.php');

    $name = $_POST["name"];
    $surname = $_POST["surname"];
    $email = $_POST["email"];
    $pass = $_POST["pass"];

    $stmt = $conn->prepare("SELECT * FROM User WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        echo "Kjo adrese i perket nje perdoruesi tjeter.";
    }
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
?>