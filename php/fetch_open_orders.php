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
  // check if user is logged in
  if ($_SESSION) {
    // check if user is authorized
    if ($_SESSION['admin'] == 1) {
      // set up query to select all open orders
      $stmt = $conn->prepare("SELECT u.name, u.surname, o.number, o.location, o.time, o.sum
        FROM `User` u INNER JOIN `Order` o
        ON u.id = o.usr_id
        WHERE o.status = 'open'");
    
      // array to store orders
      $order_info_arr = array();
      
      try {
        // try to execute query
        if (!$stmt->execute()) {
          throw new PDOException();
        } else {
          $stmt->store_result();
          $stmt->bind_result($name, $surname, $onum, $oloc, $time, $total);
      
          // store data on array
          while($stmt->fetch()) {
            $tmp = array();
            $tmp['name'] = $name . ' ' . $surname;
            $tmp['o_id'] = $onum;
            $tmp['o_loc'] = $oloc;
            $tmp['time'] = $time;
            $tmp['total'] = $total;
    
            $order_info_arr[] = $tmp;
          }
          
          // close stmt
          $stmt->close();
        }
      } catch (PDOException $e) {
        // on failure
        header('HTTP/1.1 500 Internal Server Error');
        exit("Terheqja e porosive nga databaza deshtoi!");
      }
    
      // array to store all product sets
      $prod_arr_set = array();
    
      foreach ($order_info_arr as $order) {
        // set up query to select products for each order
        $stmt = $conn->prepare("SELECT p.name, po.quantity
          FROM `Product` p INNER JOIN `Prod_Order` po
          ON p.id = po.prod_id WHERE po.order_num = ?");
        $stmt->bind_param("d", $order['o_id']);
    
        // array to store products
        $prod_arr = array();
    
        try {
          // try to execute query
          if (!$stmt->execute()) {
            throw new PDOException();
          } else {
            $stmt->store_result();
            $stmt->bind_result($pname, $pquantity);
    
            // store data on products array
            while ($stmt->fetch()) {
              $tmp = array();
              $tmp['pname'] = $pname;
              $tmp['pquantity'] = $pquantity;
    
              $prod_arr[] = $tmp;
            }
    
            $prod_arr_set[] = $prod_arr;
    
            // close stmt
            $stmt->close();
          }
        } catch (PDOException $e) {
          // on failure
          header('HTTP/1.1 500 Internal Server Error');
          exit("Terheqja e produkteve per porosite deshtoi!");
        }
      }
    
      // close connection
      $conn->close();
    
      // set up json object
      $data = new stdClass();
      $data->orders = $order_info_arr;
      $data->products = $prod_arr_set;
    
      $data = json_encode($data);
      echo $data;
    } else {
      header('HTTP/1.1 401 Unauthorized');
      exit("Ju nuk jeni i autorizuar per te aksesuar kete panel!");
    }
  } else {
    header('HTTP/1.1 401 Unauthorized');
    exit("Ju nuk jeni i autorizuar per te aksesuar kete panel!");
  }
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}
