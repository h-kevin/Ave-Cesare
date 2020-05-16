<?php

/**
 * PHP file to handle request for account removal
 */

require_once('db_connect.php');

// check if session is active
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  // remove entry in the database
  $stmt = $conn->prepare("DELETE from `User` WHERE id = ?");
  $stmt->bind_param("d", $_SESSION['id']);

  try {
    // try to execute statement
    $stmt->execute();
    $stmt->close();
    $conn->close();

    // destroy session
    session_destroy();

    echo 'removedAccount';
  } catch (PDOException $e) {
    // on failure
    header('HTTP/1.1 500 Internal Server Error');
    exit("Kerkesa nuk u ekzekutua me sukses, problem ne server!");
  }
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}

?>