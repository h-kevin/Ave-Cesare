<?php

/**
 * PHP file to handle logout request
 */

    // check if session is active
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        // destroy session
        session_destroy();
        
        echo 'loggedOut';
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u rrefuzua!");
    }

?>