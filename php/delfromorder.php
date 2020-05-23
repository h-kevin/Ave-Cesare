<?php

/**
 * delete item from cart and delete entry from order
 */

require_once('db_connect.php');

// check if session is active
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

// check request method
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // set up variables with data from request
  $rowd = json_decode($_POST['rowd']);
  $rnum = $rowd->trnum;
  $name = $rowd->pname;

  // prepare query to delete item
  $stmt = $conn->prepare("DELETE FROM `Prod_Order`
    WHERE prod_id IN (
    SELECT p.id FROM `Product` p
    WHERE p.name = ? )
    AND order_num IN (
    SELECT o.number FROM `Order` o
    WHERE o.usr_id = ? AND o.status = 'new' )");
  $stmt->bind_param("sd", $name, $_SESSION['id']);

  try {
    // try to execute query
    if (!$stmt->execute() || $stmt->affected_rows == 0) {
      throw new PDOException();
    } else {
      $stmt->close();
      $conn->close();
    }
  } catch (PDOException $e) {
    // on failure
    header('HTTP/1.1 500 Internal Server Error');
    exit("Problem ne heqjen e produktit nga shporta!");
  }

  // create json object
  $rdata = new stdClass();
  $rdata->rownum = $rnum;

  $rdata = json_encode($rdata);
  echo $rdata;
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}

?>