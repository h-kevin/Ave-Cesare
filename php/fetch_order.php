<?php

/**
 * fetch order info for user with ip in the active session
 */

require_once('db_connect.php');

// check if session is active
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

// check request method
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // set up query to collect information on cart products
  $stmt = $conn->prepare("SELECT p.name, p.image, p.price, po.quantity
  FROM `Product` p INNER JOIN `Prod_Order` po
  ON p.id = po.prod_id WHERE po.order_num IN (
  SELECT number FROM `Order` WHERE usr_id = ? AND status = 'new')");
  $stmt->bind_param('d', $_SESSION['id']);

  // array to save info
  $order = array();

  try {
    // attempt to execute query
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($pname, $pimage, $pprice, $pquantity);

    // save each row of data in an array
    while ($stmt->fetch()) {
      $tmp = array();
      $tmp['name'] = $pname;
      $tmp['image'] = $pimage;
      $tmp['price'] = $pprice;
      $tmp['quantity'] = $pquantity;
      
      $order[] = $tmp;
    }

    // close stmt and conn
    $stmt->close();
    $conn->close();
  } catch (PDOException $e) {
    // on failure
    header('HTTP/1.1 500 Internal Server Error');
    exit("Problem ne server! Shporta nuk u perditesua me sukses!");
  }

  // get mobile number from session
  $mobile = $_SESSION['mobile'];

  // create json object
  $order_obj = new stdClass();
  $order_obj->pinfo = $order;
  $order_obj->mobile = $mobile;

  $order_obj = json_encode($order_obj);

  echo $order_obj;
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}
