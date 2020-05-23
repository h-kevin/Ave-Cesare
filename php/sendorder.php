<?php

/**
 * handle send order request
 */

require_once('db_connect.php');

// check if session is active
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

// check request method
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // set up variables with data from request
  $dataObj = json_decode($_POST['dataObj']);
  $tel = $dataObj->tel;
  $datetime = $dataObj->datetime;
  $sum = $dataObj->sum;
  $location = '';

  if ($dataObj->location) {
    $location = $dataObj->location;
  }

  // set up query to update order
  $stmt = $conn->prepare("UPDATE `Order`
    SET sum = ?, location = ?, time = ?, status = 'open'
    WHERE usr_id = ? AND status = 'new'");
  $stmt->bind_param("dssd", $sum, $location, $datetime, $_SESSION['id']);

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
    exit("Dergimi i porosise deshtoi!");
  }

  echo 'success';
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}

?>