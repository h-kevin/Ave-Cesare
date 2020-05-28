<?php

/**
 * update status of order
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
      // get json data
      $dataobj = json_decode($_POST['statusObj']);
      $newstatus = $dataobj->status;
      $order_id = $dataobj->oid;

      // set up query to update status in database
      $stmt = $conn->prepare("UPDATE `Order` SET status = ? WHERE number = ?");
      $stmt->bind_param("sd", $newstatus, $order_id);

      try {
        // try to execute query
        if (!$stmt->execute()) {
          throw new PDOException();
        } else {
          // close stmt and conn
          $stmt->close();
          $conn->close();
        }
      } catch (PDOException $e) {
        // on failure
        header('HTTP/1.1 500 Internal Server Error');
        exit("Deshtoi perditesimi i statusit!");
      }

      echo 'success';
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

?>