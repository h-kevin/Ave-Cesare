<?php
 // bejm lidhjen me db 
 require_once('db_connect.php');
 

// check if session is active
 if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// check request method
if ( $_SERVER['REQUEST_METHOD'] == 'POST'){
    // set up query to collect information on cart products
    $query="SELECT image FROM Product";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    
     // array to save info
    $produkt=array();

    foreach($result as $i) {
        // krijojme objektin ku do ruajm te dhenat per nje ofert te marre nga query
        $objekti=new stdClass();
        // merr image dhe e ruan si nje variabel
        $objekti->foto=$i["image"];
        array_push($produkt,$objekti);
    }
    // kthen ne json te dhenat qe duam te kalojme ne js
    echo json_encode($produkt);
}

else {
    header('HTTP/1.1 400 Bad Request');
    exit("Kerkesa u refuzua!");
}

?>