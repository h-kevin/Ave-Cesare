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

  $url = uploadImage('profimg');

  if ($url != '') {
    // store in db
    $stmt = $conn->prepare("UPDATE `User` SET prof_img = ? WHERE id = ?");
    $stmt->bind_param('sd', $url, $_SESSION['id']);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    $_SESSION['prof_img'] = $url;
    echo $url;
  } else {
    header('HTTP/1.1 500 Internal Server Error');
    exit("Problem ne ngarkimin e fotos..");
  }
} else {
  header('HTTP/1.1 400 Bad Request');
  exit("Kerkesa u rrefuzua!");
}

?>