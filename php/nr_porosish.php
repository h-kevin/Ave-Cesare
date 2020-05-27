<?php
 // bejm lidhjen me db 
 require_once('db_connect.php');
 

// check if session is active
 if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if ($_SESSION){
// check if user is authorized
if ($_SESSION['admin'] == 1) {
        $stmt = $conn->prepare(" SELECT COUNT(*) AS total FROM `Order` WHERE status='delivered'");
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_row();
 
    if(!$result){
        header('HTTP/1.1 500 Internal Server Error');
        exit("Problem ne fshirjen e produktit!");
    }
    echo '<p class="card-text">' . $row[0] . ' </p>';
  }
}
?>