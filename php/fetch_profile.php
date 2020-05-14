<?php

/**
 * PHP file to fetch user info from the database
 */

    // check if session is active
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    // create json object with session data
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $infoObj->id = $_SESSION['id'];
        $infoObj->email = $_SESSION['email'];
        $infoObj->name = $_SESSION['name'];
        $infoObj->surname = $_SESSION['surname'];
        $infoObj->password = $_SESSION['password'];
        $infoObj->verified = $_SESSION['verified'];
        $infoObj->prof_img = $_SESSION['prof_img'];
        $infoObj->admin = $_SESSION['admin'];

        if ($_SESSION['mobile'] != null)
            $infoObj->mobile = $_SESSION['mobile'];
        else
            $infoObj->mobile = '';

        $infoObj = json_encode($infoObj);

        echo $infoObj;
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u rrefuzua!");
    }

?>