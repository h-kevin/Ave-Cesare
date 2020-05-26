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
    $query="SELECT id, name, description, image FROM Offer";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($id,$name,$description,$image);

     // array to save info
    $oferta=array();

    while($stmt->fetch()) {
        // merr kolonen id,name,description dhe image dhe e ruan si nje variabel
        $tmp=array();
        $tmp[]=$id;
        $tmp[]=$name;
        $tmp[]=$description;
        $tmp[]=$image;

        $oferta[]=$tmp;     
    }

    $obj=new stdClass();
    $obj->oferta=$oferta;
    $obj=json_encode($obj);

    echo $obj;
}

else {
    header('HTTP/1.1 400 Bad Request');
    exit("Kerkesa u refuzua!");
}

?>