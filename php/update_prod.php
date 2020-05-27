<?php

    require_once('db_connect.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["prod_id"])){

    $prod_id = $_POST["prod_id"];
    $name = $_POST["name"];
    $price = $_POST["price"];
    $category = $_POST["category"];

    $stmt = $conn->prepare("SELECT * FROM Product WHERE id = ?");
    $stmt->bind_param('s', $prod_id);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {

        if($name != ""){

            $stmt = $conn->prepare("UPDATE Product SET name = ? where id = ?");
            $stmt->bind_param('ss', $name, $prod_id);
            $result = $stmt->execute();
            if(!$result){
                header('HTTP/1.1 500 Internal Server Error');
                exit("Problem ne modifikimin e produktit! Modifikimi i emrit deshtoi!");
            }
        }
        if($price != ""){
            
            $stmt = $conn->prepare("UPDATE Product SET price = ? where id = ?");
            $stmt->bind_param('ss', $price, $prod_id);
            $result = $stmt->execute();
            if(!$result){
                header('HTTP/1.1 500 Internal Server Error');
                exit("Problem ne modifikimin e produktit! Modifikimi i cmimit deshtoi!");
            }
        }

        if($category != ""){

            $stmt = $conn->prepare("UPDATE Product SET cat_id = ? where id = ?");
            $stmt->bind_param('ss', $category, $prod_id);
            $result = $stmt->execute();
            if(!$result){
                header('HTTP/1.1 500 Internal Server Error');
                exit("Problem ne modifikimin e produktit! Modifikimi i kategorise deshtoi!");
            }
        }

        if(isset($_POST["ingredients"])){

            $stmt = $conn->prepare("DELETE FROM `Prod_Ingredient` WHERE prod_id = " . $_POST["prod_id"]);
            $result = $stmt->execute();
            if(!$result){
                header('HTTP/1.1 500 Internal Server Error');
                exit("Problem ne modifikimin e produktit! Modifikimi i ingredienteve deshtoi!");
            }
            sleep(3);

            $ingredients = $_POST["ingredients"];

            foreach($ingredients as $i){
                
                $stmt = $conn->prepare("INSERT INTO `Prod_Ingredient` (`prod_id`, `ing_id`) VALUES (?, ?)");
                $stmt->bind_param('dd', $prod_id, $i);
                if (!$stmt->execute()) {
                    header('HTTP/1.1 500 Internal Server Error');
                    exit("Problem ne server! Ingredienti " . $i . " nuk u modifikua");
                }
                sleep(1);
            }
        }

        echo 'Produkti u modifikua me sukses!';

    } else {
        header('HTTP/1.1 404 Not Found');
        echo 'Ky perdorues nuk ekziston. Mund te jete fshire!';
    }
    }
    else{
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
    }
?>