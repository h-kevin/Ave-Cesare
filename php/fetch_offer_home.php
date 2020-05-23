<?php
 // bejm lidhjen me db 
 require_once('db_connect.php');
 
//  startojm sesion nqs nk kemi
 if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if ( $_SERVER['REQUEST_METHOD'] == 'POST'){
    $query="SELECT name, description, image FROM Offer";
    // pergatitet query. ekzekutimi.rezultatet qe kthen db
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 0) {
        $query="SELECT name, description, image FROM Product";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
    }

    // deklarojme array
    $oferta=array();

    // tn do e mbushim
    foreach($result as $i) {
        // krijojme objektin ku do ruajm te dhenat per nje ofert te marre nga query
        $objekti=new stdClass();
        // merr kolonen name,description dhe image dhe e ruan si nje variabel
        $objekti->emri=$i["name"];
        $objekti->pershkrimi=$i["description"];
        $objekti->foto=$i["image"];
        array_push($oferta,$objekti);
    }
    // kthen ne json te dhenat qe duam te kalojme ne js
    echo json_encode($oferta);
}

else {
    header('HTTP/1.1 400 Bad Request');
    exit("Kerkesa u refuzua!");
}





?>