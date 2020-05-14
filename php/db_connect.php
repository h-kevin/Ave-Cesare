<?php

/**
 * PHP file to set up connection with the database
 */

    $dbServername = 'remotemysql.com';
    $dbUsername = 'OxBKxErBYb';
    $dbPassword = 'VxUmHNePFp';
    $dbName = 'OxBKxErBYb';

    $conn = mysqli_connect($dbServername, $dbUsername, $dbPassword, $dbName);

    if (mysqli_connect_errno()) {
        header('HTTP/1.1 500 Internal Server Error');
        exit('Lidhja me databazen deshtoi!');
    }

?>