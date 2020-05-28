<?php

/**
 * Upload image with API and save url in db
 */

require_once('db_connect.php');
require_once('uploadimg.php');

// check if session is active
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

// receive data
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $url = uploadImage('offerimg');

  if ($url != '') {
    // store in db
    $stmt = $conn->prepare("UPDATE `Offer` SET image = ? WHERE id = ?");
    $stmt->bind_param('sd', $url, $_POST['offer_id']);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    echo $url;
  } else {
    header('HTTP/1.1 500 Internal Server Error');
    exit("Problem ne ngarkimin e fotos..");
  }
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u refuzua!");
}

?>