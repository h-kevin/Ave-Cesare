<?php

/**
 * fetch open orders from database
 */

require_once('db_connect.php');

// check if session is active
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

// check request method
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // set up query to select all open orders
  $stmt = $conn->prepare("SELECT number FROM `Order` WHERE status = 'open'");
  
  try {
    // try to execute query
    if (!$stmt->execute()) {
      throw new PDOException();
    } else {
      $stmt->store_result();
      $stmt->bind_result($order_number);

      $order_num_arr = array();
  
      // store data on array
      while($stmt->fetch()) {
        $order_num_arr[] = $order_number;
      }
      
      // close stmt and conn
      $stmt->close();
      $conn->close();
    }
  } catch (PDOException $e) {
    // on failure
    header('HTTP/1.1 500 Internal Server Error');
    exit("Terheqja e porosive nga databaza deshtoi!");
  }

  // 
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}

?>