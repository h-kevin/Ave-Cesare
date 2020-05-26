<?php
 
// check if session is active
 if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// check request method
if ( $_SERVER['REQUEST_METHOD'] == 'POST'){
    if($_SESSION) {

        $obj=new stdClass();
        $obj->id=$_SESSION['id'];
        $obj=json_encode($obj);
    
        echo $obj;
    }
}

else {
    header('HTTP/1.1 400 Bad Request');
    exit("Kerkesa u refuzua!");
}

?>