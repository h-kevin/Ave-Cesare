<?php

/**
 * increment or decrement product quantity for current order
 */

require_once('db_connect.php');

// check if session is active
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

// check request method
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // set up variables with data from request
  $qt = json_decode($_POST['qt']);
  $rnum = $qt->trnum;
  $prod_name = $qt->pname;
  $quant = $qt->quantity;

  // set up query to update quantity for product with
  // given name in current order
  $stmt = $conn->prepare("UPDATE `Prod_Order` po SET po.quantity = ?
    WHERE po.order_num IN (
    SELECT o.number FROM `Order` o
    WHERE o.usr_id = ? AND o.status = 'new' )
    AND po.prod_id IN (
    SELECT p.id FROM `Product` p
    WHERE p.name = ? )");
  $stmt->bind_param("dds", $quant, $_SESSION['id'], $prod_name);

  try {
    // try to execute query
    if (!$stmt->execute() || $stmt->affected_rows == 0) {
      throw new PDOException();
    } else {
      $stmt->close();
    }
  } catch (PDOException $e) {
    // on failure
    header('HTTP/1.1 500 Internal Server Error');
    exit("Problem ne ndryshimin e sasise se produktit!");
  }

  // select price of the product
  $stmt = $conn->prepare("SELECT p.price FROM `Product` p
    WHERE p.name = ?");
  $stmt->bind_param("s", $prod_name);

  try {
    // try to execute query
    if (!$stmt->execute() || $stmt->affected_rows == 0) {
      throw new PDOException();
    } else {
      $stmt->store_result();
      $stmt->bind_result($price);
      $stmt->fetch();
  
      // close stmt and conn
      $stmt->close();
      $conn->close();
    }
  } catch (PDOException $e) {
    // on failure
    header('HTTP/1.1 404 Not Found');
    exit("Produkti i ndryshuar nuk u gjet ne databaze!");
  }

  // create json object
  $upinfo = new stdClass();
  $upinfo->trnum = $rnum;
  $upinfo->quantity = $quant;
  $upinfo->price = $price;
  
  $upinfo = json_encode($upinfo);

  echo $upinfo;
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}
