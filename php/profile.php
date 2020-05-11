<?php

/**
 * PHP file to handle profile page requests
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

        $infoObj = json_encode($infoObj);

        echo $infoObj;
    } else {
        exit(1);
    }

?>