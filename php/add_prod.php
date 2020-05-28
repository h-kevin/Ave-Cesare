<?php

/**
 * PHP file to add product from product panel
 */
    require_once('db_connect.php');
    require_once('uploadimg.php');

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
        
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST["name"]) && isset($_SESSION["id"]) && isset($_POST["category"]) && isset($_POST["price"])) {
        //data visible only to admins
        if ($_SESSION['admin'] == 1) {

            $name = $_POST["name"];
            $category = $_POST["category"];
            $price = $_POST["price"];
            $url = uploadImage('prodimg');

            if ($url != '') {

                $stmt = $conn->prepare("INSERT INTO `Product` (`adm_id`, `cat_id`, `name`, `price`, `image`) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param('sssss', $_SESSION['id'], $category, $name, $price, $url);
                $result = $stmt->execute();
                $prod_id = $stmt->insert_id;
                
                if ($result) {
                    echo 'Produkti u shtua me sukses!';

                    //insert each selected ingredient into prod_ingredient table in db
                    if(isset($_POST["ingredients"])){
                        $ingredients = json_decode($_POST["ingredients"]);
                        foreach($ingredients as $i){
                            $stmt = $conn->prepare("INSERT INTO `Prod_Ingredient` (`prod_id`, `ing_id`) VALUES (?, ?)");
                            $stmt->bind_param('dd', $prod_id, $i);
                            if (!$stmt->execute()) {
                                header('HTTP/1.1 500 Internal Server Error');
                                exit("Problem ne server! Ingredienti " . $i . " nuk u shtua dot ne databaze! Mund ta modifikoni produktin");
                            }
                        }
                    }
            
                } else {
                    header('HTTP/1.1 500 Internal Server Error');
                    exit("Problem ne server! Produkti nuk u shtua ne databaze!");
                }
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                exit("Problem ne ngarkimin e fotos..");
        }
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u refuzua!");
}
?>