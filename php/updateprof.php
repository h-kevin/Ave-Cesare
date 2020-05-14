<?php

/**
 * PHP file to update profile info
 */

    require_once('db_connect.php');

    // check if session is active
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // decode JSON object
        $newprof = json_decode($_POST['profinf']);

        // update profile information in database and in current session
        if ($newprof->name != '') {
            $stmt = $conn->prepare("UPDATE `User` SET name = ?, surname = ? WHERE id = ?");
            $stmt->bind_param("ssd", $newprof->name, $newprof->surname, $_SESSION['id']);
            
            try {
                // try to execute statement
                $stmt->execute();
                $_SESSION['name'] = $newprof->name;
                $_SESSION['surname'] = $newprof->surname;
            } catch (PDOException $e) {
                // if error happens
                header('HTTP/1.1 500 Internal Server Error');
                exit("Kerkesa nuk u ekzekutua me sukses, problem ne server!");
            }
        }

        if ($newprof->mobile != '') {
            $stmt = $conn->prepare("UPDATE `User` SET mobile = ? WHERE id = ?");
            $stmt->bind_param("sd", $newprof->mobile, $_SESSION['id']);
            
            try {
                // try to execute statement
                $stmt->execute();
                $_SESSION['mobile'] = $newprof->mobile;
            } catch (PDOException $e) {
                // if error happens
                header('HTTP/1.1 500 Internal Server Error');
                exit("Kerkesa nuk u ekzekutua me sukses, problem ne server!");
            }
        }

        if ($newprof->password != '') {
            $stmt = $conn->prepare("UPDATE `User` SET password = ? WHERE id = ?");
            $stmt->bind_param("sd", password_hash($newprof->password, PASSWORD_DEFAULT), $_SESSION['id']);
            
            try {
                // try to execute statement
                $stmt->execute();
                $_SESSION['password'] = $newprof->password;
            } catch (PDOException $e) {
                // if error happens
                header('HTTP/1.1 500 Internal Server Error');
                exit("Kerkesa nuk u ekzekutua me sukses, problem ne server!");
            }
        }

        // close statement and connection
        $stmt->close();
        $conn->close();

        // fetch from session if empty (not changed)
        $newprof->email = $_SESSION['email'];
        $newprof->prof_img = $_SESSION['prof_img'];

        if ($newprof->name == '') {
            $newprof->name = $_SESSION['name'];
            $newprof->surname = $_SESSION['surname'];
        }
        
        if ($newprof->mobile == '') {
            $newprof->mobile = $_SESSION['mobile'];
        }

        if ($newprof->password == '') {
            $newprof->password = $_SESSION['password'];
        }

        // prepare json object and send response
        $newprof = json_encode($newprof);
        echo $newprof;
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit("Kerkesa u rrefuzua!");
    }

?>