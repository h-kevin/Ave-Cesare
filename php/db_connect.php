<!-- Set up connection with the database -->

<?php

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