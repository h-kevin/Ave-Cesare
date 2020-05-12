<?php

    require_once('db_connect.php');

    $user_id = $_POST["user_id"];
    $name = $_POST["name"];
    $surname = $_POST["surname"];

    $stmt = $conn->prepare("SELECT * FROM User WHERE id = ?");
    $stmt->bind_param('s', $user_id);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $query = "UPDATE User SET";

        if($name != ""){
            $query .= " name = '" . $name . "'";
            if($surname != "")$query .= ",";
        }
        if($surname != ""){
            $query .= " surname = '" . $surname . "'";
            if(isset($_POST["type_user"]))$query .= ",";
        }
        if(isset($_POST["type_user"])){
            if($_POST["type_user"] == 'user'){
                $query .= " admin = 0";
            }

            elseif($_POST["type_user"] == 'admin'){
                $query .= " admin = 1";
            }
        }

        $query .= " WHERE id = " . $user_id;
        
        $stmt_up = $conn->prepare($query);
        $result_up = $stmt_up->execute();

        if($result_up){
            echo 'Modifikimi u krye!';
        }
    }
    else{
        echo 'Ky perdorues nuk ekziston. Mund te jete fshire!';
    }
?>