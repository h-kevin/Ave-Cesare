<?php

/**
 * PHP file to handle logout request
 */

    // check if session is active
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    // destroy session
    session_destroy();
    
    echo 'loggedOut';

?>