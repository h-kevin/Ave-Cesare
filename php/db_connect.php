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
        echo "Lidhja me databazen deshtoi: " . mysqli_connect_error();
        exit(1);
    }

?>