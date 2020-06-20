<?php

/**
 * PHP file to set up connection with the database
 */

$dbServername = db_server_example;
$dbUsername = db_username_example;
$dbPassword = db_password_example;
$dbName = db_name_example;

$conn = mysqli_connect($dbServername, $dbUsername, $dbPassword, $dbName);

if (mysqli_connect_errno()) {
  header('HTTP/1.1 500 Internal Server Error');
  exit('Lidhja me databazen deshtoi!');
}

?>