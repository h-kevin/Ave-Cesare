<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["name"]) && isset($_POST["category"]) && isset($_POST["price"])) {

        $name = $_POST["name"];
        $category = $_POST["category"];
        $price = $_POST["price"];


        $stmt = $conn->prepare("INSERT INTO `Product` (`adm_id`, `cat_id`, `name`, `price`) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('ssss', $_SESSION['id'], $category, $name, $price);
        $result = $stmt->execute();
        $prod_id = $stmt->insert_id;
        
        if ($result) {
            echo 'Produkti u shtua me sukses!';

            if(isset($_POST["ingredients"])){
                $ingredients = $_POST["ingredients"];
                foreach($ingredients as $i){
                    
                    $stmt = $conn->prepare("INSERT INTO `Prod_Ingredient` (`prod_id`, `ing_id`) VALUES (?, ?)");
                    $stmt->bind_param('dd', $prod_id, $i);
                    if (!$stmt->execute()) {
                        header('HTTP/1.1 500 Internal Server Error');
                        exit("Problem ne server! Ingredienti " . $i . " nuk u shtua dot ne databaze! Mund ta modifikoni produktin");
                    }
                    sleep(2);
                }
            }
    
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            exit("Problem ne server! Produkti nuk u shtua ne databaze!");
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
}
?>