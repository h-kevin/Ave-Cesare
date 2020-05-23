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
  $stmt = $conn->prepare("SELECT p.id, p.name, p.image, p.price, po.quantity
    FROM `Product` p INNER JOIN `Prod_Order` po
    ON p.id = po.prod_id WHERE po.order_num IN (
    SELECT number FROM `Order` WHERE usr_id = ? AND status = 'new')");
  $stmt->bind_param('d', $_SESSION['id']);

  // array to save info
  $order = array();

  try {
    // attempt to execute query
    if (!$stmt->execute()) {
      throw new PDOException();
    } else {
      $stmt->store_result();
      $stmt->bind_result($pid, $pname, $pimage, $pprice, $pquantity);
      
      // save each row of data in an array
      while ($stmt->fetch()) {
        $tmp = array();
        $tmp['id'] = $pid;
        $tmp['name'] = $pname;
        $tmp['image'] = $pimage;
        $tmp['price'] = $pprice;
        $tmp['quantity'] = $pquantity;
  
        $order[] = $tmp;
      }

      // close stmt
      $stmt->close();
    }
  } catch (PDOException $e) {
    // on failure
    header('HTTP/1.1 500 Internal Server Error');
    exit("Problem ne server! Shporta nuk u perditesua me sukses!");
  }

  // set up query to get all from `Prod_Offer` table
  $stmt = $conn->prepare("SELECT po.offer_id, po.prod_id, o.discount
    FROM `Prod_Offer` po INNER JOIN `Offer` o ON po.offer_id = o.id");

  // array to save offers and discounts
  $prod_offer = array();
  $discount_arr = array();

  // array for hit offers
  $ohit = array();

  try {
    // try to execute query
    if (!$stmt->execute()) {
      throw new PDOException();
    } else {
      $stmt->store_result();
      $stmt->bind_result($offer, $product, $discount);
  
      // save each row of data in the array without key duplicates
      while($stmt->fetch()) {
        if ($prod_offer[$offer]) {
          array_push($prod_offer[$offer], $product);
        } else {
          $tmp = array();
          $tmp[] = $product;
          $prod_offer[$offer] = $tmp;
        }
        if (!$discount_arr[$offer]) {
          $discount_arr[$offer] = $discount;
        }
      }
  
      // create counter
      $c = 0;
  
      // check if any of the offers has a combination of the products in our order
      foreach ($prod_offer as $offer => $prod_array) {
        for ($i = 0; $i < count($order); $i++) {
          if (in_array($order[$i]['id'], $prod_array)) {
            $c++;
          }
        }
        
        if ($c == count($prod_array)) {
          $ohit[] = $offer;
        }
  
        $c = 0;
      }
  
      // close stmt and conn
      $stmt->close();
      $conn->close();
    }
  } catch (PDOException $e) {
    // on failure
    header('HTTP/1.1 500 Internal Server Error');
    exit("Problem ne server! Shporta nuk u perditesua me sukses!");
  }

  // choose the most profitable offer
  $choice = reset($ohit);

  if (count($ohit) != 0) {
    foreach ($ohit as $i) {
      if ($discount_arr[$i] > $discount_arr[$choice]) {
        $choice = $i;
      }
    }
  }

  // get mobile number from session
  if ($_SESSION['mobile'])
    $mobile = $_SESSION['mobile'];
  else
    $mobile = '';

  // create json object
  $order_obj = new stdClass();
  $order_obj->pinfo = $order;
  $order_obj->mobile = $mobile;

  if ($choice != null) {
    $order_obj->discount = $discount_arr[$choice];
  }

  $order_obj = json_encode($order_obj);

  echo $order_obj;
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}

?>